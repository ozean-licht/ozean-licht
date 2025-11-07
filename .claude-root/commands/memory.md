# Memory Management

Query, add, and manage institutional memories in Mem0. Optionally post memory highlights to GitHub issues.

## Variables

action: $1 (query|add|report|highlight)
query_or_content: $2 (for query/add actions)
issue_number: $3 (optional, for highlight action)

## Actions

### query - Search for relevant memories

Search institutional memory for relevant learnings:

```bash
docker exec mem0-uo8gc0kc0gswcskk44gc8wks python3 -c "
from qdrant_client import QdrantClient

client = QdrantClient(host='qdrant', port=6333)
points = client.scroll(collection_name='ozean_memories', limit=1000, with_payload=True, with_vectors=False)

query = '$2'.lower()
print(f'Searching for: {query}\n')
print('=' * 80)

found = 0
for point in points[0]:
    content = point.payload.get('data', '').lower()
    if query in content:
        found += 1
        user = point.payload.get('user_id', 'unknown')
        mem_type = point.payload.get('type', point.payload.get('metadata', {}).get('type', 'general'))

        print(f'\nMemory #{found}')
        print(f'Type: {mem_type}')
        print(f'User: {user}')
        print(f'Content: {point.payload.get(\"data\", \"\")}')
        print('-' * 80)

if found == 0:
    print('No memories found matching query.')
"
```

### add - Store a new memory

Add a learning to institutional memory:

```bash
python3 -c "
import json
import urllib.request
from datetime import datetime, timezone

content = '''$2'''
payload = {
    'content': content,
    'user_id': 'manual_entry',
    'metadata': {
        'type': 'manual',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(
    'http://localhost:8090/memory/add',
    data=data,
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req, timeout=10) as response:
        result = json.loads(response.read().decode('utf-8'))
        print('✅ Memory added successfully!')
        print(f'Content: {content}')
except Exception as e:
    print(f'❌ Error: {e}')
"
```

### report - Generate complete memory statistics

Display comprehensive institutional memory report:

```bash
docker exec mem0-uo8gc0kc0gswcskk44gc8wks python3 -c "
from qdrant_client import QdrantClient
import json

client = QdrantClient(host='qdrant', port=6333)
collection = client.get_collection('ozean_memories')
points = client.scroll(collection_name='ozean_memories', limit=1000, with_payload=True, with_vectors=False)

print('=' * 80)
print('INSTITUTIONAL MEMORY REPORT')
print('=' * 80)
print()
print(f'Total Memories: {collection.points_count}')
print()

# Group by user
by_user = {}
for point in points[0]:
    user = point.payload.get('user_id', 'unknown')
    by_user[user] = by_user.get(user, [])
    by_user[user].append(point)

# Group by type
by_type = {}
for point in points[0]:
    mem_type = point.payload.get('type', point.payload.get('metadata', {}).get('type', 'general'))
    by_type[mem_type] = by_type.get(mem_type, 0) + 1

print('Memories by User:')
for user, mems in sorted(by_user.items()):
    print(f'  • {user}: {len(mems)} memories')
print()

print('Memories by Type:')
for mem_type, count in sorted(by_type.items(), key=lambda x: x[1], reverse=True):
    print(f'  • {mem_type}: {count}')
print()

print('=' * 80)
print('RECENT MEMORIES (Last 10)')
print('=' * 80)
print()

recent = sorted(points[0], key=lambda p: p.payload.get('timestamp', p.payload.get('created_at', '')), reverse=True)[:10]
for i, point in enumerate(recent, 1):
    content = point.payload.get('data', '')
    user = point.payload.get('user_id', 'unknown')
    mem_type = point.payload.get('type', point.payload.get('metadata', {}).get('type', 'general'))

    print(f'{i}. [{mem_type}] ({user})')
    print(f'   {content[:150]}...' if len(content) > 150 else f'   {content}')
    print()

print('=' * 80)
"
```

### highlight - Post memory highlights to GitHub issue

Post key memories related to the current work to a GitHub issue as a comment:

**Prerequisites:** Issue number must be provided as $3

```bash
# First, gather relevant memories
MEMORIES=$(docker exec mem0-uo8gc0kc0gswcskk44gc8wks python3 -c "
from qdrant_client import QdrantClient

client = QdrantClient(host='qdrant', port=6333)
points = client.scroll(collection_name='ozean_memories', limit=100, with_payload=True, with_vectors=False)

# Get most recent or relevant memories
recent = sorted(points[0], key=lambda p: p.payload.get('timestamp', p.payload.get('created_at', '')), reverse=True)[:5]

print('## 🧠 Institutional Memory Highlights\n')
print('These learnings were referenced during implementation:\n')
for i, point in enumerate(recent, 1):
    content = point.payload.get('data', '')
    mem_type = point.payload.get('type', point.payload.get('metadata', {}).get('type', 'general'))
    print(f'{i}. **[{mem_type}]** {content}\n')

print('\n---')
print('*Powered by Mem0 institutional memory*')
")

# Post to GitHub using gh CLI
echo "$MEMORIES" | gh issue comment $3 --body-file -

echo "✅ Memory highlights posted to issue #$3"
```

## Examples

```bash
# Search for navigation-related memories
/memory query navigation

# Add a new learning
/memory add "Always validate user input on both client and server side for security"

# Generate full memory report
/memory report

# Post highlights to issue #5
/memory highlight "" 5
```

## Notes

- Memory search is case-insensitive simple text matching
- For semantic search, use the Mem0 API directly with vector embeddings
- GitHub highlight action requires gh CLI to be authenticated
- Memories are stored permanently in Qdrant vector database
