#!/usr/bin/env python3
"""
Test Mem0 Integration and Add Sample ADW Memories
Demonstrates the full memory workflow for the ADW system
"""

import json
import urllib.request
import urllib.error
from datetime import datetime
from typing import Dict, List, Optional

class Mem0Client:
    """Simple client for Mem0 API."""

    def __init__(self, base_url: str = "http://localhost:8090"):
        self.base_url = base_url

    def add_memory(self, content: str, user_id: str = "adw_system", metadata: Optional[Dict] = None) -> Dict:
        """Add a memory to Mem0."""
        payload = {
            "content": content,
            "user_id": user_id,
            "metadata": metadata or {}
        }

        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            f"{self.base_url}/memory/add",
            data=data,
            headers={'Content-Type': 'application/json'}
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode('utf-8'))
                print(f"✅ Memory added: {content[:50]}...")
                return result
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"❌ Error adding memory: {e.code} - {error_body}")
            raise

    def search_memories(self, query: str, user_id: Optional[str] = None, limit: int = 10) -> Dict:
        """Search memories."""
        payload = {
            "query": query,
            "user_id": user_id,
            "limit": limit
        }

        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            f"{self.base_url}/memory/search",
            data=data,
            headers={'Content-Type': 'application/json'}
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"❌ Error searching: {e.code} - {error_body}")
            raise

    def health_check(self) -> Dict:
        """Check Mem0 health."""
        req = urllib.request.Request(f"{self.base_url}/health")
        with urllib.request.urlopen(req, timeout=5) as response:
            return json.loads(response.read().decode('utf-8'))


def create_sample_adw_memories(client: Mem0Client):
    """Create sample ADW memories to demonstrate the system."""

    print("\n" + "=" * 80)
    print("CREATING SAMPLE ADW MEMORIES")
    print("=" * 80 + "\n")

    # Sample memories representing ADW learning
    memories = [
        {
            "content": "Successfully implemented sidebar navigation using shadcn/ui components. The Sidebar component provides collapsible navigation with entity switching.",
            "user_id": "adw_5e37338e",
            "metadata": {
                "type": "implementation",
                "issue_number": 5,
                "component": "admin-dashboard",
                "phase": "build",
                "technologies": ["React", "TypeScript", "shadcn/ui"],
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "Pattern learned: When implementing navigation, always include keyboard shortcuts (Cmd+K for search) and accessibility features (ARIA labels, focus management).",
            "user_id": "adw_system",
            "metadata": {
                "type": "pattern",
                "category": "ui/ux",
                "importance": "high",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "Admin dashboard requires multi-entity context switching. Implemented EntitySwitcher component that toggles between Kids Ascension and Ozean Licht databases.",
            "user_id": "adw_5e37338e",
            "metadata": {
                "type": "architecture",
                "issue_number": 5,
                "complexity": "medium",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "Git worktree isolation works well for concurrent ADW workflows. Allocated ports (9100-9114 backend, 9200-9214 frontend) prevent conflicts.",
            "user_id": "adw_system",
            "metadata": {
                "type": "system_learning",
                "category": "devops",
                "importance": "critical",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "Common error: Postgres connection string must include proper SSL mode for production. Development uses sslmode=disable, production requires sslmode=require.",
            "user_id": "adw_system",
            "metadata": {
                "type": "error_resolution",
                "category": "database",
                "severity": "medium",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "MCP Gateway integration tested successfully. All server-side MCPs (PostgreSQL, Mem0, Cloudflare, GitHub, N8N) operational.",
            "user_id": "adw_system",
            "metadata": {
                "type": "integration_test",
                "date": "2025-10-23",
                "status": "success",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "React component best practice: Use React.memo for expensive components, implement proper cleanup in useEffect hooks, and leverage Suspense boundaries for code splitting.",
            "user_id": "adw_system",
            "metadata": {
                "type": "best_practice",
                "category": "react",
                "importance": "high",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "Database migration strategy: Always use transactions, include rollback scripts, and test migrations on staging before production.",
            "user_id": "adw_system",
            "metadata": {
                "type": "best_practice",
                "category": "database",
                "importance": "critical",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "TypeScript types for multi-tenant architecture: Create EntityContext type with entityId, role, and permissions. Use discriminated unions for entity-specific data.",
            "user_id": "adw_system",
            "metadata": {
                "type": "pattern",
                "category": "typescript",
                "importance": "high",
                "timestamp": datetime.utcnow().isoformat()
            }
        },
        {
            "content": "Performance optimization: Implemented connection pooling for PostgreSQL (min: 2, max: 10 connections). Reduced query time by 40% for admin dashboard.",
            "user_id": "adw_system",
            "metadata": {
                "type": "optimization",
                "category": "database",
                "impact": "high",
                "metrics": {"improvement": "40%"},
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    ]

    results = []
    for i, memory in enumerate(memories, 1):
        print(f"Adding memory {i}/{len(memories)}...")
        try:
            result = client.add_memory(
                content=memory["content"],
                user_id=memory["user_id"],
                metadata=memory["metadata"]
            )
            results.append(result)
        except Exception as e:
            print(f"   Failed: {e}")

    print(f"\n✅ Successfully added {len(results)} memories")
    return results


def test_memory_search(client: Mem0Client):
    """Test memory search functionality."""

    print("\n" + "=" * 80)
    print("TESTING MEMORY SEARCH")
    print("=" * 80 + "\n")

    test_queries = [
        "navigation implementation",
        "database optimization",
        "TypeScript patterns",
        "error resolution"
    ]

    for query in test_queries:
        print(f"🔍 Searching: '{query}'")
        try:
            results = client.search_memories(query, limit=3)
            print(f"   Found {results.get('resultCount', 0)} results")

            if 'results' in results:
                for i, result in enumerate(results['results'][:2], 1):
                    content = result.get('content', '')[:80]
                    score = result.get('relevance', 0)
                    print(f"   {i}. [{score:.2f}] {content}...")
        except Exception as e:
            print(f"   Search failed: {e}")
        print()


def main():
    print("=" * 80)
    print("MEM0 INTEGRATION TEST")
    print("=" * 80)

    client = Mem0Client()

    # Health check
    print("\n🏥 Health Check...")
    try:
        health = client.health_check()
        print(f"✅ Mem0 Status: {health}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        print("   Make sure Mem0 is running on http://localhost:8090")
        return

    # Create sample memories
    try:
        create_sample_adw_memories(client)
    except Exception as e:
        print(f"\n❌ Failed to create memories: {e}")
        import traceback
        traceback.print_exc()
        return

    # Test search
    try:
        test_memory_search(client)
    except Exception as e:
        print(f"\n❌ Search test failed: {e}")
        import traceback
        traceback.print_exc()

    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)
    print("\nNext steps:")
    print("  • Use docker exec to query Qdrant directly for verification")
    print("  • Integrate memory storage into ADW workflows")
    print("  • Set up automatic learning capture in each phase")
    print()


if __name__ == '__main__':
    main()
