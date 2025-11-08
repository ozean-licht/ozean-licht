#!/bin/bash

# Orchestrator Reboot Script
# Clears context and restarts orchestrator (supports both Docker and local development)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ORCHESTRATOR_DIR="$PROJECT_ROOT/apps/orchestrator_3_stream"
BACKEND_URL="http://127.0.0.1:9403"

echo "🔄 Orchestrator Reboot Initiated..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Detect if running in Docker
IS_DOCKER=false
if [ -f /.dockerenv ] || grep -q docker /proc/1/cgroup 2>/dev/null; then
    IS_DOCKER=true
    echo "ℹ️  Detected Docker environment"
fi

# Clear orchestrator context before shutdown
echo "🧹 Clearing orchestrator context..."
if curl -s -X POST "$BACKEND_URL/api/orchestrator/reset?clear_session=true" > /dev/null 2>&1; then
    echo "✅ Context cleared successfully"
else
    echo "⚠️  Failed to clear context (backend may not be running)"
fi
echo ""

# Stop services based on environment
if [ "$IS_DOCKER" = true ]; then
    echo "🐳 Stopping Docker containers..."

    # Find orchestrator containers
    CONTAINERS=$(docker ps -a --filter "name=orchestrator" --format "{{.Names}}" 2>/dev/null || true)

    if [ -z "$CONTAINERS" ]; then
        echo "ℹ️  No orchestrator containers found"
    else
        for container in $CONTAINERS; do
            echo "   Stopping container: $container"
            docker stop -t 5 "$container" 2>/dev/null || true
            docker rm -f "$container" 2>/dev/null || true
            echo "   ✅ Container $container stopped and removed"
        done
    fi

    echo "✅ Docker containers stopped"
else
    echo "🛑 Stopping orchestrator services (local mode)..."

    # Kill backend - find all Python processes running main.py in orchestrator_3_stream
    echo "   Stopping backend processes..."
    ps aux | grep "orchestrator_3_stream.*main.py" | grep -v grep | awk '{print $2}' | xargs -r kill -9 2>/dev/null || true

    # Also try pkill as fallback
    pkill -9 -f "uvicorn.*orchestrator_3_stream" 2>/dev/null || true

    # Kill frontend (npm/vite)
    echo "   Stopping frontend processes..."
    pkill -9 -f "vite.*orchestrator_3_stream" 2>/dev/null || true

    echo "✅ Services stopped"
fi
echo ""

# Wait for ports to be released
echo "⏳ Waiting for ports to be released..."
MAX_WAIT=15
WAITED=0
while (netstat -tuln 2>/dev/null | grep -q ":9403 " || ss -tuln 2>/dev/null | grep -q ":9403 ") && [ $WAITED -lt $MAX_WAIT ]; do
    sleep 1
    WAITED=$((WAITED + 1))
    echo "   Port 9403 still in use... ($WAITED/$MAX_WAIT)"
done

if netstat -tuln 2>/dev/null | grep -q ":9403 " || ss -tuln 2>/dev/null | grep -q ":9403 "; then
    echo "⚠️  Port 9403 still in use after ${MAX_WAIT}s, forcefully clearing..."

    # Try multiple methods to free the port
    fuser -k 9403/tcp 2>/dev/null || true
    lsof -ti:9403 | xargs -r kill -9 2>/dev/null || true

    sleep 2
fi

echo "✅ Ports clear"
echo ""

# 5-second countdown
echo "⏳ Restarting in 5 seconds..."
for i in {5..1}; do
    echo "   $i..."
    sleep 1
done
echo ""

# Restart based on environment
if [ "$IS_DOCKER" = true ]; then
    echo "🐳 Restarting via Docker Compose..."

    cd "$ORCHESTRATOR_DIR"

    # Start containers
    docker-compose up -d 2>&1 | grep -v "WARNING: " || true

    # Wait for container to be healthy
    echo "⏳ Waiting for container health check..."
    MAX_HEALTH_WAIT=30
    HEALTH_WAITED=0
    while [ $HEALTH_WAITED -lt $MAX_HEALTH_WAIT ]; do
        if docker ps --filter "name=orchestrator" --filter "health=healthy" | grep -q orchestrator; then
            echo "✅ Container is healthy"
            break
        fi
        sleep 2
        HEALTH_WAITED=$((HEALTH_WAITED + 2))
        echo "   Waiting for health check... ($HEALTH_WAITED/$MAX_HEALTH_WAIT)"
    done

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Orchestrator Reboot Complete (Docker)!"
    echo ""
    echo "📊 Status:"
    docker ps --filter "name=orchestrator" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "📝 View logs:"
    echo "   docker logs orchestrator_3_stream -f"
    echo ""
else
    echo "🚀 Restarting services (local mode)..."

    # Create log directories if they don't exist
    mkdir -p "$ORCHESTRATOR_DIR/backend/logs"
    mkdir -p "$ORCHESTRATOR_DIR/logs"

    # Load environment variables from backend .env
    if [ -f "$ORCHESTRATOR_DIR/backend/.env" ]; then
        export $(cat "$ORCHESTRATOR_DIR/backend/.env" | grep -v '^#' | xargs)
        echo "✅ Loaded backend environment variables"
    fi

    # Get working directory from .env or use default
    WORKING_DIR="${ORCHESTRATOR_WORKING_DIR:-/opt/ozean-licht-ecosystem}"

    # Define log file paths
    BACKEND_LOG="$ORCHESTRATOR_DIR/logs/reboot_backend_$(date +%Y%m%d_%H%M%S).log"
    FRONTEND_LOG="$ORCHESTRATOR_DIR/logs/reboot_frontend_$(date +%Y%m%d_%H%M%S).log"

    # Start backend
    echo "🚀 Starting backend..."
    cd "$ORCHESTRATOR_DIR/backend"
    nohup uv run python main.py --cwd "$WORKING_DIR" > "$BACKEND_LOG" 2>&1 &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"

    # Wait 2 seconds for backend to initialize
    sleep 2

    # Start frontend
    echo "🎨 Starting frontend..."
    cd "$ORCHESTRATOR_DIR/frontend"
    nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PID=$!
    echo "   Frontend PID: $FRONTEND_PID"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Orchestrator Reboot Complete!"
    echo ""
    echo "📊 Status:"
    echo "   Backend:  http://localhost:9403 (PID: $BACKEND_PID)"
    echo "   Frontend: http://localhost:5175 (PID: $FRONTEND_PID)"
    echo ""
    echo "📝 Logs:"
    echo "   Backend:  tail -f $BACKEND_LOG"
    echo "   Frontend: tail -f $FRONTEND_LOG"
    echo ""
    echo "💡 Tip: Backend logs are also in backend/logs/ with hourly rotation"
fi
echo ""
