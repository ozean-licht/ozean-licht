#!/bin/bash
set -e

echo "🚀 Starting Orchestrator 3 Stream..."
echo "=================================="

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down Orchestrator..."
    kill $BACKEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# Wait for database to be ready
echo "📊 Waiting for database..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if pg_isready -d "$DATABASE_URL" > /dev/null 2>&1; then
        echo "✅ Database is ready"
        break
    fi
    attempt=$((attempt + 1))
    echo "⏳ Waiting for database... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Database not ready after $max_attempts attempts"
    exit 1
fi

# Run database migrations
echo "📊 Running database migrations..."

# Create .env file for migration script (it looks for /.env)
echo "DATABASE_URL=$DATABASE_URL" > /.env 2>/dev/null || {
    # If we can't write to /, try /app
    echo "DATABASE_URL=$DATABASE_URL" > /app/.env
    export ENV_FILE=/app/.env
}

cd /app/backend
export PYTHONPATH="/app:$PYTHONPATH"
# Run migration with uv from the backend directory where dependencies are installed
uv run python /app/orchestrator_db/run_migrations.py

if [ $? -ne 0 ]; then
    echo "❌ Database migrations failed"
    exit 1
fi

echo "✅ Migrations completed"

# Setup orchestrator directories in global workspace
echo "🔧 Setting up orchestrator context in global workspace..."

# Idempotent setup: Remove existing orchestrator context if present
if [ -d "/opt/ozean-licht-ecosystem/.claude" ]; then
    echo "   Removing existing orchestrator .claude"
    rm -rf /opt/ozean-licht-ecosystem/.claude
fi

# Backup root .claude if it exists (first run only)
if [ -d "/opt/ozean-licht-ecosystem/.claude-root" ]; then
    echo "   Root .claude already backed up (skipping)"
else
    echo "   No root .claude found to backup"
fi

# Install orchestrator .claude (18 orchestrator-specific commands)
echo "   Installing orchestrator .claude commands (18 commands)"
cp -r /app/.claude /opt/ozean-licht-ecosystem/.claude

# Install orchestrator ai_docs (SDK documentation cache)
echo "   Installing orchestrator ai_docs (SDK documentation)"
rm -rf /opt/ozean-licht-ecosystem/ai_docs  # Remove if exists
cp -r /app/ai_docs /opt/ozean-licht-ecosystem/ai_docs

echo "✅ Orchestrator context installed"
echo "   - Commands: /opt/ozean-licht-ecosystem/.claude (18 orchestrator commands)"
echo "   - AI Docs:  /opt/ozean-licht-ecosystem/ai_docs (SDK cache)"

# Start backend
echo "🔧 Starting backend on port 9403..."
cd /app/backend
uv run python main.py &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to be ready
sleep 5
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start"
    exit 1
fi

echo ""
echo "✅ Orchestrator started successfully!"
echo "=================================="
echo "   🌐 Application: http://localhost:9403"
echo "   💬 WebSocket:    ws://localhost:9403/ws"
echo "   💚 Health:       http://localhost:9403/health"
echo "   📊 API Docs:     http://localhost:9403/docs"
echo "=================================="
echo ""
echo "   Frontend static files served by FastAPI at /"
echo "   API endpoints available at /health, /send_chat, /ws, etc."
echo ""

# Keep container running and monitor backend process
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend process died"
        exit 1
    fi

    sleep 10
done
