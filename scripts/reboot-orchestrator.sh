#!/bin/bash

# Orchestrator Reboot Script
# Restarts both frontend and backend with 5-second timer

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ORCHESTRATOR_DIR="$PROJECT_ROOT/apps/orchestrator_3_stream"

echo "🔄 Orchestrator Reboot Initiated..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Find and kill orchestrator processes
echo "🛑 Stopping orchestrator services..."

# Kill backend (Python/FastAPI)
pkill -f "uvicorn.*orchestrator_3_stream" || echo "   Backend not running"

# Kill frontend (npm/vite)
pkill -f "vite.*orchestrator_3_stream" || echo "   Frontend not running"

echo "✅ Services stopped"
echo ""

# 5-second countdown
echo "⏳ Restarting in 5 seconds..."
for i in {5..1}; do
    echo "   $i..."
    sleep 1
done
echo ""

# Start backend
echo "🚀 Starting backend..."
cd "$ORCHESTRATOR_DIR/backend"
nohup uv run python main.py > /tmp/orchestrator_backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait 2 seconds for backend to initialize
sleep 2

# Start frontend
echo "🎨 Starting frontend..."
cd "$ORCHESTRATOR_DIR/frontend"
nohup npm run dev > /tmp/orchestrator_frontend.log 2>&1 &
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
echo "   Backend:  tail -f /tmp/orchestrator_backend.log"
echo "   Frontend: tail -f /tmp/orchestrator_frontend.log"
echo ""
