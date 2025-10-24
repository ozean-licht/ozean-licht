#!/usr/bin/env python3
"""
Mem0 Memory Manager
Utility for managing and querying memories in the Ozean Licht Ecosystem
"""

import argparse
import json
import sys
from datetime import datetime
from typing import List, Dict, Optional
from qdrant_client import QdrantClient

class Mem0Manager:
    """Manager for Mem0 memory operations via Qdrant."""

    def __init__(self, qdrant_host: str = "localhost", qdrant_port: int = 6333):
        """Initialize connection to Qdrant."""
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = "ozean_memories"
        self.migrations_collection = "mem0migrations"

    def get_all_memories(self, user_id: Optional[str] = None, limit: int = 1000) -> List[Dict]:
        """Retrieve all memories, optionally filtered by user_id."""
        points = self.client.scroll(
            collection_name=self.collection_name,
            limit=limit,
            with_payload=True,
            with_vectors=False
        )

        memories = []
        for point in points[0]:
            memory = {
                'id': str(point.id),
                'user_id': point.payload.get('user_id', 'unknown'),
                'content': point.payload.get('data', ''),
                'created_at': point.payload.get('created_at', ''),
                'timestamp': point.payload.get('timestamp', ''),
                'source': point.payload.get('source', ''),
                'metadata': {k: v for k, v in point.payload.items()
                           if k not in ['id', 'user_id', 'data', 'created_at', 'timestamp', 'source', 'hash']}
            }

            # Filter by user_id if specified
            if user_id is None or memory['user_id'] == user_id:
                memories.append(memory)

        return memories

    def get_users(self) -> List[str]:
        """Get list of all unique user IDs."""
        points = self.client.scroll(
            collection_name=self.collection_name,
            limit=10000,
            with_payload=True,
            with_vectors=False
        )

        users = set()
        for point in points[0]:
            user_id = point.payload.get('user_id', 'unknown')
            users.add(user_id)

        return sorted(list(users))

    def search_memories(self, query: str, limit: int = 10) -> List[Dict]:
        """Search memories by text (note: requires vector search setup)."""
        # This is a simple text filter search
        # For semantic search, we'd need to use Mem0's search endpoint
        all_memories = self.get_all_memories(limit=10000)

        results = []
        query_lower = query.lower()
        for memory in all_memories:
            if query_lower in memory['content'].lower():
                results.append(memory)
                if len(results) >= limit:
                    break

        return results

    def get_stats(self) -> Dict:
        """Get memory statistics."""
        collection = self.client.get_collection(self.collection_name)
        memories = self.get_all_memories()
        users = self.get_users()

        # Group by source
        by_source = {}
        for mem in memories:
            source = mem['source'] or 'unknown'
            by_source[source] = by_source.get(source, 0) + 1

        # Group by user
        by_user = {}
        for mem in memories:
            user = mem['user_id']
            by_user[user] = by_user.get(user, 0) + 1

        return {
            'total_memories': collection.points_count,
            'unique_users': len(users),
            'users': users,
            'by_source': by_source,
            'by_user': by_user,
            'collection_name': self.collection_name,
            'vector_size': collection.config.params.vectors.size if hasattr(collection.config.params, 'vectors') else 'N/A'
        }

    def display_memories(self, memories: List[Dict], format: str = 'text'):
        """Display memories in various formats."""
        if format == 'json':
            print(json.dumps(memories, indent=2))
        elif format == 'compact':
            for i, mem in enumerate(memories, 1):
                print(f"{i}. [{mem['user_id']}] {mem['content'][:100]}{'...' if len(mem['content']) > 100 else ''}")
        else:  # text
            print("=" * 80)
            print(f"MEMORIES ({len(memories)} found)")
            print("=" * 80)
            print()

            for i, mem in enumerate(memories, 1):
                print(f"Memory #{i}")
                print(f"{'─' * 80}")
                print(f"User ID:    {mem['user_id']}")
                print(f"Content:    {mem['content']}")
                print(f"Created:    {mem['created_at']}")
                print(f"Source:     {mem['source']}")

                if mem['metadata'] and any(mem['metadata'].values()):
                    print(f"Metadata:   {json.dumps(mem['metadata'], indent=12)}")

                print()

    def display_stats(self, stats: Dict):
        """Display statistics in a readable format."""
        print("=" * 80)
        print("MEM0 MEMORY STATISTICS")
        print("=" * 80)
        print()
        print(f"Collection:      {stats['collection_name']}")
        print(f"Total Memories:  {stats['total_memories']}")
        print(f"Unique Users:    {stats['unique_users']}")
        print(f"Vector Size:     {stats['vector_size']}")
        print()

        print("Memories by User:")
        for user, count in stats['by_user'].items():
            print(f"  • {user}: {count}")
        print()

        print("Memories by Source:")
        for source, count in stats['by_source'].items():
            print(f"  • {source}: {count}")
        print()

        print("Users:")
        for user in stats['users']:
            print(f"  • {user}")
        print()


def main():
    parser = argparse.ArgumentParser(
        description='Mem0 Memory Manager for Ozean Licht Ecosystem',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List all memories
  ./mem0_manager.py list

  # List memories for specific user
  ./mem0_manager.py list --user adw_system

  # Search memories
  ./mem0_manager.py search "implementation"

  # Show statistics
  ./mem0_manager.py stats

  # Export as JSON
  ./mem0_manager.py list --format json > memories.json
        """
    )

    parser.add_argument(
        'command',
        choices=['list', 'search', 'stats', 'users'],
        help='Command to execute'
    )

    parser.add_argument(
        'query',
        nargs='?',
        help='Search query (for search command)'
    )

    parser.add_argument(
        '--user', '-u',
        help='Filter by user ID'
    )

    parser.add_argument(
        '--limit', '-l',
        type=int,
        default=100,
        help='Maximum number of results (default: 100)'
    )

    parser.add_argument(
        '--format', '-f',
        choices=['text', 'json', 'compact'],
        default='text',
        help='Output format (default: text)'
    )

    parser.add_argument(
        '--host',
        default='localhost',
        help='Qdrant host (default: localhost)'
    )

    parser.add_argument(
        '--port',
        type=int,
        default=6333,
        help='Qdrant port (default: 6333)'
    )

    args = parser.parse_args()

    try:
        manager = Mem0Manager(qdrant_host=args.host, qdrant_port=args.port)

        if args.command == 'list':
            memories = manager.get_all_memories(user_id=args.user, limit=args.limit)
            manager.display_memories(memories, format=args.format)

        elif args.command == 'search':
            if not args.query:
                print("Error: Search query required", file=sys.stderr)
                sys.exit(1)

            memories = manager.search_memories(args.query, limit=args.limit)
            manager.display_memories(memories, format=args.format)

        elif args.command == 'stats':
            stats = manager.get_stats()
            if args.format == 'json':
                print(json.dumps(stats, indent=2))
            else:
                manager.display_stats(stats)

        elif args.command == 'users':
            users = manager.get_users()
            if args.format == 'json':
                print(json.dumps(users, indent=2))
            else:
                print("Users with memories:")
                for user in users:
                    count = len(manager.get_all_memories(user_id=user))
                    print(f"  • {user} ({count} memories)")

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
