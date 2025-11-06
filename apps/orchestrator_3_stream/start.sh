#!/bin/bash
set -e

echo "🚀 Starting Orchestrator 3 Stream..."
echo "=================================="

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down Orchestrator..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
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
cd /app
export PYTHONPATH="/app:$PYTHONPATH"
uv run python /app/orchestrator_db/run_migrations.py

if [ $? -ne 0 ]; then
    echo "❌ Database migrations failed"
    exit 1
fi

echo "✅ Migrations completed"

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

# Start frontend (serve static files)
echo "🎨 Starting frontend on port 5175..."
cd /app/frontend/dist

# Use Python's http.server to serve static files
python3 -m http.server 5175 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait a bit for frontend to start
sleep 2
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "✅ Orchestrator started successfully!"
echo "=================================="
echo "   🔧 Backend:  http://localhost:9403"
echo "   🎨 Frontend: http://localhost:5175"
echo "   💬 WebSocket: ws://localhost:9403/ws"
echo "   💚 Health:    http://localhost:9403/health"
echo "=================================="

# Keep container running and monitor processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend process died"
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi

    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend process died"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi

    sleep 10
done
