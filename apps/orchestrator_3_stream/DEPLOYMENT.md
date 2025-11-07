# Orchestrator 3 Stream - Production Deployment Guide

**Target:** intel.ozean-licht.com
**Stack:** Docker + Coolify
**Auth:** Shared Users DB (unified authentication)

---

## 🎯 Deployment Architecture

```
intel.ozean-licht.com
    ↓ Cloudflare DNS
    ↓ Coolify Proxy
┌─────────────────────────────────────────────────────────────┐
│  Orchestrator Container (Docker)                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Frontend (Vue 3 + Vite)                              │  │
│  │  Port: 5175 → 80 (internal)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Backend (FastAPI + Claude SDK)                       │  │
│  │  Port: 9403                                            │  │
│  │  WebSocket: ws://intel.ozean-licht.com/ws             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓ Connects to
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL (Coolify)                                        │
│  Database: orchestrator_db                                   │
│  Tables: orchestrator_agents, agents, prompts, logs, chat   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

### 1. Database Setup

**Create orchestrator database:**
```sql
-- Connect to PostgreSQL
CREATE DATABASE orchestrator_db;

-- Create user (if needed)
CREATE USER orchestrator_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE orchestrator_db TO orchestrator_user;
```

**Run migrations:**
```bash
# From project root
export DATABASE_URL="postgresql://orchestrator_user:password@localhost:5432/orchestrator_db"
uv run apps/orchestrator_db/run_migrations.py
```

### 2. Environment Variables

Required environment variables for deployment:

```bash
# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/orchestrator_db

# API Keys
ANTHROPIC_API_KEY=sk-ant-...

# Backend Config
BACKEND_HOST=0.0.0.0
BACKEND_PORT=9403
ORCHESTRATOR_MODEL=claude-sonnet-4-20250514
ORCHESTRATOR_WORKING_DIR=/app

# Frontend Config
FRONTEND_PORT=5175
VITE_API_BASE_URL=https://intel.ozean-licht.com/api
VITE_WS_URL=wss://intel.ozean-licht.com/ws

# CORS
CORS_ORIGINS=https://intel.ozean-licht.com,https://admin.ozean-licht.dev

# Authentication (Optional - for auth gateway)
AUTH_ENABLED=true
JWT_SECRET=your-jwt-secret
SHARED_USERS_DB_URL=postgresql://user:pass@postgres:5432/shared_users_db
```

---

## 🐳 Docker Configuration

### Dockerfile

Create `apps/orchestrator_3_stream/Dockerfile`:

```dockerfile
# Multi-stage build for orchestrator

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend
FROM python:3.12-slim

# Create adw-user with UID/GID 1000 to match host user
RUN groupadd -g 1000 adw-user && \
    useradd -u 1000 -g 1000 -m -s /bin/bash adw-user && \
    usermod -aG sudo adw-user && \
    echo "adw-user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    sudo \
    lsof \
    && rm -rf /var/lib/apt/lists/*

# Install UV for adw-user
USER adw-user
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/home/adw-user/.local/bin:$PATH"

# Switch back to root for remaining setup
USER root

# Copy backend
COPY backend/ ./backend/
WORKDIR /app/backend

# Install Python dependencies
RUN uv sync

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Set ownership
RUN chown -R adw-user:adw-user /app

# Expose ports
EXPOSE 9403 5175

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:9403/health || exit 1

# Start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh && chown adw-user:adw-user /app/start.sh

# Configure git for adw-user
USER adw-user
RUN git config --global user.email "orchestrator@ozean-licht.dev" && \
    git config --global user.name "Orchestrator Agent"

USER adw-user
CMD ["/app/start.sh"]
```

### docker-compose.yml

Create `apps/orchestrator_3_stream/docker-compose.yml`:

```yaml
version: '3.8'

services:
  orchestrator:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: orchestrator_3_stream
    restart: unless-stopped
    ports:
      - "9403:9403"
      - "5175:5175"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - BACKEND_HOST=0.0.0.0
      - BACKEND_PORT=9403
      - FRONTEND_PORT=5175
      - ORCHESTRATOR_MODEL=${ORCHESTRATOR_MODEL:-claude-sonnet-4-20250514}
      - ORCHESTRATOR_WORKING_DIR=/app
      - CORS_ORIGINS=${CORS_ORIGINS}
    volumes:
      - ./data:/app/data
      - ./logs:/app/backend/logs
    networks:
      - orchestrator-network
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9403/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    container_name: orchestrator_postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=orchestrator_db
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - orchestrator-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  orchestrator-network:
    driver: bridge

volumes:
  postgres-data:
```

### Start Script

Create `apps/orchestrator_3_stream/start.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting Orchestrator 3 Stream..."

# Run database migrations
echo "📊 Running database migrations..."
cd /app
uv run apps/orchestrator_db/run_migrations.py

# Start backend in background
echo "🔧 Starting backend..."
cd /app/backend
uv run python main.py &
BACKEND_PID=$!

# Start frontend (serve static files via Python)
echo "🎨 Starting frontend..."
cd /app/frontend/dist
python3 -m http.server 5175 &
FRONTEND_PID=$!

# Wait for both processes
echo "✅ Orchestrator started successfully!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"

# Keep container running
wait -n
exit $?
```

---

## 🚀 Coolify Deployment Steps

### Step 1: Create Application in Coolify

1. Go to Coolify dashboard
2. Click "New Resource" → "Application"
3. Select "Docker Compose"
4. Name: `orchestrator-3-stream`
5. Domain: `intel.ozean-licht.com`

### Step 2: Configure Git Repository

- **Repository:** Your git repo URL
- **Branch:** `main`
- **Base Directory:** `apps/orchestrator_3_stream`
- **Docker Compose File:** `docker-compose.yml`

### Step 3: Add Environment Variables

In Coolify, add these environment variables:

```bash
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
POSTGRES_USER=orchestrator_user
POSTGRES_PASSWORD=<generate-secure-password>
ORCHESTRATOR_MODEL=claude-sonnet-4-20250514
CORS_ORIGINS=https://intel.ozean-licht.com,https://admin.ozean-licht.dev
```

### Step 4: Configure Domain

1. In Coolify, go to Domains tab
2. Add domain: `intel.ozean-licht.com`
3. Enable SSL (automatic via Let's Encrypt)
4. Configure DNS in Cloudflare:
   ```
   Type: A
   Name: intel
   Content: <server-ip>
   Proxy: ON
   ```

### Step 5: Deploy

1. Click "Deploy" button
2. Monitor logs for successful deployment
3. Verify health check: `https://intel.ozean-licht.com/health`

---

## 🔐 Authentication Gateway (Optional)

To integrate with shared authentication:

### Add Auth Middleware

Create `apps/orchestrator_3_stream/backend/modules/auth_middleware.py`:

```python
from fastapi import Request, HTTPException, status
from jose import JWTError, jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

async def verify_token(request: Request):
    """Verify JWT token from cookies or headers"""
    token = request.cookies.get("auth_token") or \
            request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        request.state.user = payload
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

### Update main.py

```python
from fastapi import Depends
from modules.auth_middleware import verify_token

# Protect routes
@app.post("/send_chat", dependencies=[Depends(verify_token)])
async def send_chat(request: ChatRequest):
    # ... existing code
```

---

## 🔗 Link from Admin Dashboard

### Add Orchestrator Link in Admin Dashboard

**File:** `apps/admin/components/dashboard/Sidebar.tsx`

Add menu item:

```tsx
{
  name: 'Orchestrator',
  href: 'https://intel.ozean-licht.com',
  icon: RobotIcon,
  external: true
}
```

**Or create dedicated page:**

**File:** `apps/admin/app/(dashboard)/orchestrator/page.tsx`

```tsx
export default function OrchestratorPage() {
  return (
    <div className="h-full">
      <iframe
        src="https://intel.ozean-licht.com"
        className="w-full h-full border-0"
        title="Orchestrator"
      />
    </div>
  )
}
```

---

## 🧪 Testing After Deployment

### 1. Health Check
```bash
curl https://intel.ozean-licht.com/health
```

### 2. WebSocket Connection
```javascript
const ws = new WebSocket('wss://intel.ozean-licht.com/ws');
ws.onopen = () => console.log('Connected!');
```

### 3. Test ADW Integration
```
Open: https://intel.ozean-licht.com
Chat: "List all active ADW workflows"
```

---

## 📊 Monitoring

### Logs
```bash
# Via Coolify
# Go to Application → Logs tab

# Or SSH to server
docker logs orchestrator_3_stream -f
```

### Metrics
```bash
# Health endpoint
curl https://intel.ozean-licht.com/health

# Database connections
# Check in Coolify PostgreSQL metrics
```

---

## 🔄 Updates & Maintenance

### Deploy Updates
```bash
# Push to main branch
git push origin main

# Coolify auto-deploys (if configured)
# Or manually trigger in Coolify dashboard
```

### Database Migrations
```bash
# SSH to server
docker exec -it orchestrator_3_stream bash

# Run migrations
cd /app
uv run apps/orchestrator_db/run_migrations.py
```

### Backup Database
```bash
docker exec orchestrator_postgres pg_dump -U orchestrator_user orchestrator_db > backup.sql
```

---

## 🚨 Troubleshooting

### Container Won't Start
```bash
docker logs orchestrator_3_stream
docker exec -it orchestrator_3_stream bash
```

### Database Connection Issues
```bash
# Check DATABASE_URL format
# Verify PostgreSQL is running
docker ps | grep postgres
```

### WebSocket Not Connecting
```bash
# Check CORS_ORIGINS includes your domain
# Verify SSL is enabled
# Check firewall allows WebSocket connections
```

---

## 📚 Related Documentation

- **Main Architecture:** `/docs/architecture.md`
- **ADW Integration:** `/app_docs/ADW_ORCHESTRATOR_INTEGRATION.md`
- **Database Schema:** `/apps/orchestrator_db/README.md`
- **Admin Dashboard:** `/apps/admin/README.md`

---

**Status:** Ready for deployment
**Domain:** intel.ozean-licht.com
**Deployment Method:** Coolify + Docker Compose
**Auth:** Optional (can integrate with shared_users_db)
