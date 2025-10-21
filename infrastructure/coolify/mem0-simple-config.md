# Mem0 Simplified Configuration (Without pgvector)

## Build Mem0 with SQLite/ChromaDB Backend

Since pgvector isn't available in postgres:17-alpine, we'll use an alternative approach.

### Option A: Mem0 with ChromaDB (Recommended)

```dockerfile
# Dockerfile for Mem0 with ChromaDB
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    mem0ai \
    fastapi \
    uvicorn \
    chromadb \
    redis \
    openai

# Create data directory
RUN mkdir -p /app/data /app/chroma

# Create API server
COPY <<'EOF' server.py
from fastapi import FastAPI, HTTPException
from mem0 import Memory
import os
import json

app = FastAPI()

# Initialize Mem0 with ChromaDB (local vector store)
config = {
    "vector_store": {
        "provider": "chroma",
        "config": {
            "collection_name": "ozean_memories",
            "path": "/app/chroma",  # Persist to volume
            "host": None  # Use local file storage
        }
    },
    "llm": {
        "provider": "openai",
        "config": {
            "model": "gpt-4",
            "api_key": os.getenv("OPENAI_API_KEY")
        }
    },
    "embedder": {
        "provider": "openai",
        "config": {
            "model": os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
            "api_key": os.getenv("OPENAI_API_KEY")
        }
    },
    "version": "v1.1"
}

# Only add Redis if configured
redis_host = os.getenv("REDIS_HOST")
if redis_host:
    config["cache"] = {
        "provider": "redis",
        "config": {
            "host": redis_host,
            "port": int(os.getenv("REDIS_PORT", 6379)),
            "password": os.getenv("REDIS_PASSWORD"),
        }
    }

memory = Memory.from_config(config)

@app.get("/")
def root():
    return {"service": "Mem0 Memory Layer", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "backend": "chromadb"}

@app.post("/memory/add")
async def add_memory(data: dict):
    """Add a memory for a user/agent"""
    user_id = data.get("user_id", "default")
    content = data.get("content")
    metadata = data.get("metadata", {})

    if not content:
        raise HTTPException(status_code=400, detail="Content is required")

    result = memory.add(content, user_id=user_id, metadata=metadata)
    return {"memory_id": result, "status": "added"}

@app.post("/memory/search")
async def search_memory(data: dict):
    """Search memories"""
    query = data.get("query")
    user_id = data.get("user_id")
    limit = data.get("limit", 10)

    if not query:
        raise HTTPException(status_code=400, detail="Query is required")

    results = memory.search(query, user_id=user_id, limit=limit)
    return {"results": results, "count": len(results)}

@app.get("/memory/get/{user_id}")
async def get_memories(user_id: str):
    """Get all memories for a user"""
    memories = memory.get_all(user_id=user_id)
    return {"memories": memories, "user_id": user_id}

@app.delete("/memory/delete/{memory_id}")
async def delete_memory(memory_id: str):
    """Delete a specific memory"""
    memory.delete(memory_id=memory_id)
    return {"status": "deleted", "memory_id": memory_id}

@app.get("/memory/stats")
async def get_stats():
    """Get memory statistics"""
    # This would need custom implementation
    return {
        "total_memories": "N/A",
        "backend": "chromadb",
        "status": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)
EOF

EXPOSE 8090

CMD ["python", "server.py"]
```

### Build Steps

```bash
# Create directory for Mem0
mkdir -p /root/mem0
cd /root/mem0

# Create Dockerfile
cat > Dockerfile << 'DOCKEREOF'
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    mem0ai \
    fastapi \
    uvicorn \
    chromadb \
    redis \
    openai

# Create data directories
RUN mkdir -p /app/data /app/chroma

# Copy server file
COPY server.py .

EXPOSE 8090

CMD ["python", "server.py"]
DOCKEREOF

# Create server.py
cat > server.py << 'PYEOF'
from fastapi import FastAPI, HTTPException
from mem0 import Memory
import os
import json

app = FastAPI()

# Initialize Mem0 with ChromaDB
config = {
    "vector_store": {
        "provider": "chroma",
        "config": {
            "collection_name": "ozean_memories",
            "path": "/app/chroma"
        }
    },
    "embedder": {
        "provider": "openai",
        "config": {
            "model": "text-embedding-3-small",
            "api_key": os.getenv("OPENAI_API_KEY")
        }
    },
    "version": "v1.1"
}

# Add Redis cache if available
if os.getenv("REDIS_HOST"):
    config["cache"] = {
        "provider": "redis",
        "config": {
            "host": os.getenv("REDIS_HOST"),
            "port": int(os.getenv("REDIS_PORT", 6379)),
            "password": os.getenv("REDIS_PASSWORD")
        }
    }

memory = Memory.from_config(config)

@app.get("/")
def root():
    return {"service": "Mem0", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/memory/add")
async def add_memory(data: dict):
    user_id = data.get("user_id", "default")
    content = data.get("content")
    metadata = data.get("metadata", {})

    if not content:
        raise HTTPException(status_code=400, detail="Content required")

    result = memory.add(content, user_id=user_id, metadata=metadata)
    return {"memory_id": result}

@app.post("/memory/search")
async def search_memory(data: dict):
    query = data.get("query")
    user_id = data.get("user_id")
    limit = data.get("limit", 10)

    if not query:
        raise HTTPException(status_code=400, detail="Query required")

    results = memory.search(query, user_id=user_id, limit=limit)
    return {"results": results}

@app.get("/memory/get/{user_id}")
async def get_memories(user_id: str):
    memories = memory.get_all(user_id=user_id)
    return {"memories": memories}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)
PYEOF

# Build the Docker image
docker build -t mem0:latest .

# Verify image was created
docker images | grep mem0
```

### Deploy in Coolify

After building the image, deploy in Coolify:

1. Go to Automation project
2. Add New Service → Docker Compose
3. Use this configuration:

```yaml
version: '3.8'

services:
  mem0:
    image: mem0:latest
    container_name: mem0
    restart: always
    ports:
      - "8090:8090"
    environment:
      # OpenAI for embeddings
      OPENAI_API_KEY: ${OPENAI_API_KEY}

      # Redis connection (optional but recommended)
      REDIS_HOST: redis-cache
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}

      # API Security
      MEM0_API_KEY: ${MEM0_API_KEY}
    volumes:
      - mem0_data:/app/data
      - mem0_chroma:/app/chroma
    networks:
      - coolify

volumes:
  mem0_data:
  mem0_chroma:

networks:
  coolify:
    external: true
```

### Environment Variables in Coolify

Add these:
```
OPENAI_API_KEY=sk-...your-key...
REDIS_PASSWORD=your-redis-password
MEM0_API_KEY=generate-secure-api-key
```

## Alternative: Qdrant (Production-Ready Vector DB)

If you prefer a more robust vector database without needing pgvector:

```yaml
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant
    container_name: qdrant
    restart: always
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage
    networks:
      - coolify

volumes:
  qdrant_storage:

networks:
  coolify:
    external: true
```

Then configure Mem0 to use Qdrant instead of ChromaDB.

## Testing After Deployment

```bash
# Test health endpoint
curl http://localhost:8090/health

# Add a test memory
curl -X POST http://localhost:8090/memory/add \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "content": "This is a test memory for the Ozean Licht system",
    "metadata": {"type": "test"}
  }'

# Search for it
curl -X POST http://localhost:8090/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Ozean Licht",
    "user_id": "test_user"
  }'
```

---

**Note**: This approach uses ChromaDB (embedded vector database) instead of pgvector, which is actually simpler and doesn't require special PostgreSQL extensions!