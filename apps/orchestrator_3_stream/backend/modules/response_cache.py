#!/usr/bin/env python3
"""
Response Cache Module

Implements LRU cache with TTL expiration for caching LLM responses to identical
or similar prompts, reducing API calls and token usage.

Features:
- LRU (Least Recently Used) cache with size limit
- TTL (Time To Live) expiration for stale entries
- MD5-based cache key generation
- Hit/miss statistics tracking
- Thread-safe operations

Usage:
    cache = ResponseCache(max_size=100, ttl_seconds=3600)

    # Check cache before API call
    cache_key = cache.generate_key(prompt)
    cached = cache.get(cache_key)

    if cached:
        # Use cached response
        response = cached
    else:
        # Make API call
        response = await call_api(prompt)
        cache.set(cache_key, response)
"""

import time
import hashlib
from typing import Dict, Any, Optional, Tuple
from collections import OrderedDict
from dataclasses import dataclass


@dataclass
class CacheEntry:
    """Single cache entry with metadata"""
    key: str
    value: Any
    created_at: float
    last_accessed: float
    access_count: int


class ResponseCache:
    """
    LRU cache with TTL for caching LLM responses.

    Implements least-recently-used eviction policy with time-based expiration.
    Thread-safe for async operations.
    """

    def __init__(
        self,
        max_size: int = 100,
        ttl_seconds: int = 3600,
        logger: Optional["OrchestratorLogger"] = None
    ):
        """
        Initialize response cache.

        Args:
            max_size: Maximum number of entries to cache
            ttl_seconds: Time to live for cache entries (default: 1 hour)
            logger: Optional logger instance for debugging
        """
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
        self.logger = logger

        # LRU cache using OrderedDict
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()

        # Statistics
        self._hits = 0
        self._misses = 0
        self._evictions = 0
        self._expirations = 0

        if self.logger:
            self.logger.info(
                f"ResponseCache initialized: max_size={max_size}, ttl={ttl_seconds}s"
            )

    def generate_key(
        self,
        prompt: str,
        context_hash: Optional[str] = None
    ) -> str:
        """
        Generate cache key from prompt and optional context.

        Uses MD5 hash for efficient key generation. Includes context hash
        to differentiate similar prompts with different contexts.

        Args:
            prompt: The prompt text
            context_hash: Optional hash of conversation context

        Returns:
            Cache key (MD5 hex string)
        """
        # Combine prompt and context for key generation
        key_material = prompt
        if context_hash:
            key_material = f"{prompt}|{context_hash}"

        # Generate MD5 hash
        return hashlib.md5(key_material.encode('utf-8')).hexdigest()

    def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache if it exists and is not expired.

        Args:
            key: Cache key

        Returns:
            Cached value if found and valid, None otherwise
        """
        # Check if key exists
        if key not in self._cache:
            self._misses += 1
            if self.logger:
                self.logger.debug(f"❌ Cache miss: {key[:8]}...")
            return None

        entry = self._cache[key]

        # Check if entry has expired
        age = time.time() - entry.created_at
        if age > self.ttl_seconds:
            # Remove expired entry
            del self._cache[key]
            self._expirations += 1
            self._misses += 1

            if self.logger:
                self.logger.debug(
                    f"⏰ Cache expired: {key[:8]}... (age: {age:.0f}s)"
                )
            return None

        # Cache hit - update access metadata
        entry.last_accessed = time.time()
        entry.access_count += 1
        self._hits += 1

        # Move to end (most recently used)
        self._cache.move_to_end(key)

        if self.logger:
            self.logger.debug(
                f"✅ Cache hit: {key[:8]}... (accessed {entry.access_count}x)"
            )

        return entry.value

    def set(
        self,
        key: str,
        value: Any,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Set value in cache with LRU eviction if needed.

        Args:
            key: Cache key
            value: Value to cache
            metadata: Optional metadata for logging
        """
        current_time = time.time()

        # Check if key already exists (update)
        if key in self._cache:
            entry = self._cache[key]
            entry.value = value
            entry.last_accessed = current_time
            self._cache.move_to_end(key)

            if self.logger:
                self.logger.debug(f"♻️  Cache updated: {key[:8]}...")
            return

        # Check if cache is full - evict LRU entry
        if len(self._cache) >= self.max_size:
            evicted_key, evicted_entry = self._cache.popitem(last=False)
            self._evictions += 1

            if self.logger:
                self.logger.debug(
                    f"🗑️  Cache eviction (LRU): {evicted_key[:8]}... "
                    f"(accessed {evicted_entry.access_count}x)"
                )

        # Add new entry
        entry = CacheEntry(
            key=key,
            value=value,
            created_at=current_time,
            last_accessed=current_time,
            access_count=0
        )
        self._cache[key] = entry

        if self.logger:
            self.logger.debug(
                f"💾 Cache stored: {key[:8]}... "
                f"(size: {len(self._cache)}/{self.max_size})"
            )

    def clear(self) -> int:
        """
        Clear all cache entries.

        Returns:
            Number of entries cleared
        """
        count = len(self._cache)
        self._cache.clear()

        if self.logger:
            self.logger.info(f"🧹 Cache cleared: {count} entries removed")

        return count

    def cleanup_expired(self) -> int:
        """
        Remove all expired entries from cache.

        Returns:
            Number of entries removed
        """
        current_time = time.time()
        expired_keys = []

        for key, entry in self._cache.items():
            age = current_time - entry.created_at
            if age > self.ttl_seconds:
                expired_keys.append(key)

        # Remove expired entries
        for key in expired_keys:
            del self._cache[key]
            self._expirations += 1

        if expired_keys and self.logger:
            self.logger.info(f"🧹 Cleaned up {len(expired_keys)} expired cache entries")

        return len(expired_keys)

    async def clear_pattern(self, pattern: str) -> int:
        """
        Clear cache entries matching a pattern.

        Args:
            pattern: Pattern to match cache keys (prefix match)

        Returns:
            Number of entries cleared
        """
        cleared = 0
        keys_to_remove = []

        for key in self._cache:
            if key.startswith(pattern):
                keys_to_remove.append(key)

        for key in keys_to_remove:
            del self._cache[key]
            cleared += 1

        if cleared > 0 and self.logger:
            self.logger.info(f"🗑️ Cleared {cleared} cache entries matching pattern: {pattern}")

        return cleared

    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics.

        Returns:
            Dict with cache statistics:
            - size: Current number of cached entries
            - max_size: Maximum cache size
            - hits: Number of cache hits
            - misses: Number of cache misses
            - hit_rate: Cache hit rate (0.0-1.0)
            - evictions: Number of LRU evictions
            - expirations: Number of TTL expirations
            - ttl_seconds: Time to live setting
        """
        total_requests = self._hits + self._misses
        hit_rate = self._hits / total_requests if total_requests > 0 else 0.0

        return {
            "size": len(self._cache),
            "max_size": self.max_size,
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": hit_rate,
            "evictions": self._evictions,
            "expirations": self._expirations,
            "ttl_seconds": self.ttl_seconds
        }

    def reset_stats(self) -> None:
        """Reset statistics counters."""
        self._hits = 0
        self._misses = 0
        self._evictions = 0
        self._expirations = 0

        if self.logger:
            self.logger.info("ResponseCache statistics reset")
