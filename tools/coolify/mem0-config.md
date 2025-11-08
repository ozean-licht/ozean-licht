# Mem0 Configuration for Coolify

## What is Mem0?

Mem0 provides a smart memory layer for AI applications, perfect for:
- Storing context across agent interactions
- Long-term memory for autonomous systems
- User personalization and preferences
- Cross-session context retention

## Deployment via Coolify

### Prerequisites
- ✅ Redis deployed (for caching)
- ✅ PostgreSQL deployed (for vector storage)
- ✅ OpenAI API key (for embeddings) or local model

### Docker Compose Configuration

**In Automation project, add new service:**

```yaml
version: '3.8'

services:
  mem0:
    image: mem0ai/mem0:latest
    container_name: mem0
    restart: always
    ports:
      - "8090:8090"
    environment:
      # Core Configuration
      MEM0_HOST: "0.0.0.0"
      MEM0_PORT: "8090"

      # Database Configuration
      POSTGRES_HOST: ozean-licht-db
      POSTGRES_PORT: 5432
      POSTGRES_DB: mem0
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

      # Redis Configuration
      REDIS_HOST: redis-cache
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}

      # Embeddings Configuration
      OPENAI_API_KEY: ${OPENAI_API_KEY}  # Or use local embeddings
      EMBEDDING_MODEL: "text-embedding-3-small"

      # Memory Configuration
      MEMORY_INDEX_NAME: "ozean_licht_memory"
      VECTOR_DIMENSION: 1536

      # API Security
      MEM0_API_KEY: ${MEM0_API_KEY}

    volumes:
      - mem0_data:/app/data
    networks:
      - coolify
    depends_on:
      - redis-cache
      - ozean-licht-db

volumes:
  mem0_data:

networks:
  coolify:
    external: true
```

### Alternative: Build Custom Mem0 Image

If official image doesn't exist, build it:

```dockerfile
# Dockerfile for Mem0
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir \
    mem0ai \
    fastapi \
    uvicorn \
    psycopg2-binary \
    redis \
    openai

# Create API server
COPY <<EOF server.py
from fastapi import FastAPI, HTTPException
from mem0 import Memory
import os
import json

app = FastAPI()

# Initialize Mem0
config = {
    "vector_store": {
        "provider": "pgvector",
        "config": {
            "host": os.getenv("POSTGRES_HOST", "localhost"),
            "port": int(os.getenv("POSTGRES_PORT", 5432)),
            "database": os.getenv("POSTGRES_DB", "mem0"),
            "user": os.getenv("POSTGRES_USER", "postgres"),
            "password": os.getenv("POSTGRES_PASSWORD"),
        }
    },
    "embedder": {
        "provider": "openai",
        "config": {
            "model": os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
            "api_key": os.getenv("OPENAI_API_KEY")
        }
    },
    "cache": {
        "provider": "redis",
        "config": {
            "host": os.getenv("REDIS_HOST", "localhost"),
            "port": int(os.getenv("REDIS_PORT", 6379)),
            "password": os.getenv("REDIS_PASSWORD"),
        }
    }
}

memory = Memory.from_config(config)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/memory/add")
async def add_memory(user_id: str, content: str, metadata: dict = {}):
    result = memory.add(content, user_id=user_id, metadata=metadata)
    return {"memory_id": result}

@app.get("/memory/search")
async def search_memory(query: str, user_id: str = None, limit: int = 10):
    results = memory.search(query, user_id=user_id, limit=limit)
    return {"results": results}

@app.get("/memory/get")
async def get_memories(user_id: str):
    memories = memory.get_all(user_id=user_id)
    return {"memories": memories}

@app.delete("/memory/delete")
async def delete_memory(memory_id: str):
    memory.delete(memory_id=memory_id)
    return {"status": "deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)
EOF

EXPOSE 8090

CMD ["python", "server.py"]
```

### Build and Deploy Steps

```bash
# SSH to server
ssh -i ~/.ssh/id_ed25519_ozean root@138.201.139.25

# Create Mem0 directory
mkdir -p /root/mem0
cd /root/mem0

# Create the Dockerfile (paste content above)
nano Dockerfile

# Create server.py
nano server.py

# Build the image
docker build -t mem0:latest .

# Now deploy via Coolify using local image
```

## Environment Variables

Add these in Coolify:

```env
# Database (use your ozean-licht-db password)
POSTGRES_PASSWORD=your_postgres_password

# Redis (use your redis-cache password)
REDIS_PASSWORD=your_redis_password

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-...your_key...

# Mem0 API Security
MEM0_API_KEY=generate_secure_api_key_here
```

## Post-Deployment Setup

### 1. Create Mem0 Database

```bash
# Connect to PostgreSQL
docker exec -it ozean-licht-db psql -U postgres

# Create database
CREATE DATABASE mem0;

# Enable pgvector extension
\c mem0
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Test Mem0 API

```bash
# Health check
curl http://localhost:8090/health

# Add a memory
curl -X POST http://localhost:8090/memory/add \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "user_id": "system",
    "content": "The Ozean Licht ecosystem was initialized on October 20, 2025",
    "metadata": {"type": "system_event"}
  }'

# Search memories
curl "http://localhost:8090/memory/search?query=ozean+licht&user_id=system"
```

## Integration with Your Ecosystem

### N8N Integration

Create N8N workflows that:
1. Store important events in Mem0
2. Query context before actions
3. Build user profiles over time

### Agent Integration

```javascript
// Example: Store agent learning
async function storeAgentMemory(agentId, learning, context) {
  const response = await fetch('http://mem0:8090/memory/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.MEM0_API_KEY
    },
    body: JSON.stringify({
      user_id: `agent_${agentId}`,
      content: learning,
      metadata: { context, timestamp: new Date().toISOString() }
    })
  });
  return response.json();
}

// Query before decision
async function getAgentContext(agentId, query) {
  const response = await fetch(`http://mem0:8090/memory/search?query=${query}&user_id=agent_${agentId}`);
  return response.json();
}
```

## Memory Schema Examples

### For Kids Ascension

```json
{
  "user_id": "ka_student_123",
  "content": "Student prefers video content over text",
  "metadata": {
    "type": "preference",
    "platform": "kids-ascension",
    "confidence": 0.9
  }
}
```

### For Development Context

```json
{
  "user_id": "dev_context",
  "content": "PostgreSQL optimization: shared_buffers set to 256MB improved query performance by 30%",
  "metadata": {
    "type": "optimization",
    "service": "postgres",
    "date": "2025-10-20"
  }
}
```

## Use Cases for Your Ecosystem

1. **Agent Memory**
   - Store what worked/didn't work
   - Remember user preferences
   - Track system optimizations

2. **User Personalization**
   - Learning preferences for Kids Ascension
   - Creator patterns for content
   - Parent notification preferences

3. **System Intelligence**
   - Performance patterns
   - Error patterns and solutions
   - Deployment successes/failures

4. **Cross-Session Context**
   - Continue conversations across sessions
   - Remember project context
   - Track long-term goals

## Monitoring

### Prometheus Metrics

```yaml
scrape_configs:
  - job_name: 'mem0'
    static_configs:
      - targets: ['mem0:8090']
    metrics_path: '/metrics'
```

### Key Metrics
- Memory count per user
- Query response time
- Embedding generation time
- Cache hit rate

## Backup Strategy

```bash
#!/bin/bash
# Backup Mem0 data

# Backup PostgreSQL vector data
docker exec ozean-licht-db pg_dump -U postgres mem0 > /backups/mem0_$(date +%Y%m%d).sql

# Backup Mem0 volume
docker run --rm -v mem0_data:/data -v /backups:/backup \
  alpine tar czf /backup/mem0_data_$(date +%Y%m%d).tar.gz -C /data .
```

## Security Considerations

1. **API Key Required** - Always use authentication
2. **User Isolation** - Memories are user-scoped
3. **PII Handling** - Be careful with personal data
4. **Regular Cleanup** - Implement memory expiration

## Alternatives to Consider

If Mem0 doesn't meet needs:
- **Qdrant** - Pure vector database
- **Weaviate** - Vector DB with modules
- **ChromaDB** - Simpler embedding database
- **Custom solution** - PostgreSQL + pgvector

---

**Created**: 2025-10-20
**Status**: Ready for deployment
**Prerequisites**: Redis and PostgreSQL must be running first