# LiteRAG Configuration for Coolify

## Deployment via Coolify

### 1. Create New Service in Coolify

**Service Type**: Docker Compose

### 2. Docker Compose Configuration

```yaml
version: '3.8'

services:
  literag:
    image: ghcr.io/ozean-licht/literag:latest  # We'll build this
    container_name: literag
    restart: always
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PORT=8080
      - API_HOST=0.0.0.0
      - CORS_ORIGIN=https://ka.ozean-licht.at,https://ozean-licht.at,http://localhost:3000
      - LOG_LEVEL=info
      # Database
      - DATABASE_URL=postgresql://literag_user:${LITERAG_DB_PASSWORD}@postgres_literag:5432/literag
      # API Keys
      - API_KEY=${LITERAG_API_KEY}
      - ADMIN_API_KEY=${LITERAG_ADMIN_KEY}
      # Vector DB settings
      - VECTOR_DIMENSIONS=1536
      - MAX_TOKENS=8000
      - CHUNK_SIZE=1000
      - CHUNK_OVERLAP=200
      # OpenAI for embeddings (optional)
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - literag_data:/app/data
      - literag_knowledge:/app/knowledge
      - literag_uploads:/app/uploads
    networks:
      - coolify
      - literag_network
    depends_on:
      - postgres_literag
      - redis_literag
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres_literag:
    image: pgvector/pgvector:pg15
    container_name: literag_postgres
    restart: always
    environment:
      - POSTGRES_USER=literag_user
      - POSTGRES_PASSWORD=${LITERAG_DB_PASSWORD}
      - POSTGRES_DB=literag
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - postgres_literag_data:/var/lib/postgresql/data
    networks:
      - literag_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U literag_user -d literag"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis_literag:
    image: redis:7-alpine
    container_name: literag_redis
    restart: always
    command: redis-server --requirepass ${LITERAG_REDIS_PASSWORD}
    volumes:
      - redis_literag_data:/data
    networks:
      - literag_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  literag_data:
  literag_knowledge:
  literag_uploads:
  postgres_literag_data:
  redis_literag_data:

networks:
  literag_network:
  coolify:
    external: true
```

### 3. Environment Variables (Set in Coolify)

```env
# Database
LITERAG_DB_PASSWORD=<generate-strong-password>
LITERAG_REDIS_PASSWORD=<generate-strong-password>

# API Keys
LITERAG_API_KEY=<generate-api-key>
LITERAG_ADMIN_KEY=<generate-admin-key>

# OpenAI (optional, for embeddings)
OPENAI_API_KEY=<your-openai-key>
```

## LiteRAG Knowledge Structure

### Namespace Organization

```
knowledge/
├── kids-ascension/
│   ├── architecture/
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   └── database-schema.md
│   ├── features/
│   │   ├── video-upload.md
│   │   ├── user-roles.md
│   │   └── payment-flow.md
│   ├── stakeholders/
│   │   ├── students.md
│   │   ├── parents.md
│   │   ├── teachers.md
│   │   ├── creators.md
│   │   ├── reviewers.md
│   │   └── angels.md
│   └── business/
│       ├── prd.md
│       ├── roadmap.md
│       └── metrics.md
├── ozean-licht/
│   ├── architecture/
│   ├── features/
│   └── content/
├── shared/
│   ├── infrastructure/
│   │   ├── docker.md
│   │   ├── coolify.md
│   │   ├── deployment.md
│   │   └── monitoring.md
│   ├── patterns/
│   │   ├── auth-pattern.md
│   │   ├── api-design.md
│   │   └── testing.md
│   └── taskmaster/
│       ├── orchestration.md
│       ├── agent-patterns.md
│       └── worktree-setup.md
└── meta/
    ├── learnings/
    └── decisions/
```

### Initial Knowledge Upload Script

```bash
#!/bin/bash

LITERAG_URL="http://localhost:8080"
API_KEY="your-api-key"

# Function to upload knowledge
upload_knowledge() {
  local namespace=$1
  local file=$2
  local title=$3

  curl -X POST "$LITERAG_URL/api/knowledge" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d @- << EOF
{
  "namespace": "$namespace",
  "title": "$title",
  "content": "$(cat $file | jq -sRr @json)",
  "metadata": {
    "source": "initial-import",
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  }
}
EOF
}

# Upload initial knowledge
upload_knowledge "kids-ascension/business" "docs/kids-ascension-deep-dive.md" "Kids Ascension Deep Dive"
upload_knowledge "shared/infrastructure" "docs/architecture.md" "Infrastructure Architecture"
upload_knowledge "shared/meta" "CLAUDE.md" "Project Overview"

echo "Initial knowledge uploaded successfully"
```

## API Endpoints

### Knowledge Management

```bash
# Upload knowledge
curl -X POST http://literag.ozean-licht.at/api/knowledge \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "kids-ascension/features",
    "title": "Video Upload Flow",
    "content": "...",
    "metadata": {}
  }'

# Query knowledge
curl -X POST http://literag.ozean-licht.at/api/query \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "kids-ascension/*",
    "query": "How does video upload work?",
    "limit": 5
  }'

# List namespaces
curl -X GET http://literag.ozean-licht.at/api/namespaces \
  -H "Authorization: Bearer $API_KEY"

# Delete knowledge
curl -X DELETE http://literag.ozean-licht.at/api/knowledge/{id} \
  -H "Authorization: Bearer $ADMIN_KEY"
```

### Health & Metrics

```bash
# Health check
curl http://literag.ozean-licht.at/health

# Metrics
curl http://literag.ozean-licht.at/metrics
```

## Integration with Development Workflow

### 1. VS Code Extension (Future)

```json
{
  "literag.endpoint": "https://literag.ozean-licht.at",
  "literag.apiKey": "${env:LITERAG_API_KEY}",
  "literag.defaultNamespace": "kids-ascension",
  "literag.autoUpload": true
}
```

### 2. Git Hooks

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Upload changed documentation to LiteRAG
for file in $(git diff --cached --name-only | grep -E '\.(md|txt)$'); do
  if [[ -f "$file" ]]; then
    namespace=$(dirname "$file" | sed 's/\//\./g')
    curl -X POST http://literag.ozean-licht.at/api/knowledge \
      -H "Authorization: Bearer $LITERAG_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"namespace\": \"$namespace\",
        \"title\": \"$(basename $file)\",
        \"content\": \"$(cat $file | jq -sRr @json)\",
        \"metadata\": {
          \"git_commit\": \"$(git rev-parse HEAD)\",
          \"author\": \"$(git config user.name)\"
        }
      }"
  fi
done
```

### 3. Taskmaster Integration

```typescript
// taskmaster/src/literag-client.ts
export class LiteRAGClient {
  private endpoint = process.env.LITERAG_URL || 'http://localhost:8080';
  private apiKey = process.env.LITERAG_API_KEY;

  async query(namespace: string, query: string): Promise<any> {
    const response = await fetch(`${this.endpoint}/api/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ namespace, query }),
    });
    return response.json();
  }

  async upload(namespace: string, title: string, content: string): Promise<void> {
    await fetch(`${this.endpoint}/api/knowledge`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ namespace, title, content }),
    });
  }
}
```

## Backup Strategy

```bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/backups/literag"
DATE=$(date +%Y%m%d)

# Backup PostgreSQL with vectors
docker exec literag_postgres pg_dump -U literag_user literag > $BACKUP_DIR/literag_db_$DATE.sql

# Backup knowledge files
tar -czf $BACKUP_DIR/literag_knowledge_$DATE.tar.gz /var/lib/docker/volumes/literag_knowledge

# Backup to Hetzner Storage Box
rsync -avz $BACKUP_DIR/ u123456@u123456.your-storagebox.de:/literag-backups/

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

## Monitoring & Alerts

### Prometheus Metrics

```yaml
# prometheus.yml addition
scrape_configs:
  - job_name: 'literag'
    static_configs:
      - targets: ['literag:8080']
    metrics_path: '/metrics'
```

### Grafana Dashboard

Key metrics to track:
- Query response time
- Knowledge base size
- Namespace distribution
- API request rate
- Vector search performance
- Database connections

## Security Considerations

1. **API Key Rotation**
   - Monthly rotation schedule
   - Separate keys for read/write
   - IP whitelist for admin operations

2. **Data Encryption**
   - Encrypt knowledge at rest
   - TLS for all connections
   - Encrypted backups

3. **Access Control**
   - Read-only keys for agents
   - Admin keys for uploads
   - Rate limiting per key

## Troubleshooting

### Common Issues

1. **Vector search not working**
   ```bash
   # Check pgvector extension
   docker exec literag_postgres psql -U literag_user -d literag -c "SELECT * FROM pg_extension WHERE extname = 'vector';"

   # Reinstall if needed
   docker exec literag_postgres psql -U literag_user -d literag -c "CREATE EXTENSION IF NOT EXISTS vector;"
   ```

2. **High memory usage**
   ```bash
   # Check memory
   docker stats literag

   # Adjust chunk size
   docker exec literag sh -c "export CHUNK_SIZE=500"
   docker restart literag
   ```

3. **Slow queries**
   ```bash
   # Check index
   docker exec literag_postgres psql -U literag_user -d literag -c "\di"

   # Rebuild if needed
   docker exec literag_postgres psql -U literag_user -d literag -c "REINDEX DATABASE literag;"
   ```

---

**Last Updated**: 2025-10-20
**Deployment Status**: Pending
**Access URL**: https://literag.ozean-licht.at (after setup)