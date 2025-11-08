#!/bin/bash

# Orchestrator Pre-Deployment Cleanup Script
# Stops all old orchestrator containers and frees port 9403
# Run this before triggering Coolify deployment

set -e

echo "🧹 Orchestrator Pre-Deployment Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if netstat -tuln 2>/dev/null | grep -q ":$port " || ss -tuln 2>/dev/null | grep -q ":$port "; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process using a port
kill_port() {
    local port=$1
    echo "🔍 Checking processes on port $port..."

    if check_port $port; then
        echo "⚠️  Port $port is in use, attempting to free it..."

        # Try lsof first
        if command -v lsof &> /dev/null; then
            lsof -ti:$port | xargs -r kill -9 2>/dev/null || true
        fi

        # Try fuser as fallback
        if command -v fuser &> /dev/null; then
            fuser -k $port/tcp 2>/dev/null || true
        fi

        # Wait for port to be freed
        local max_wait=10
        local waited=0
        while check_port $port && [ $waited -lt $max_wait ]; do
            sleep 1
            waited=$((waited + 1))
            echo "   Waiting for port to be freed... ($waited/$max_wait)"
        done

        if check_port $port; then
            echo "❌ Failed to free port $port after ${max_wait}s"
            return 1
        else
            echo "✅ Port $port freed"
            return 0
        fi
    else
        echo "✅ Port $port is already free"
        return 0
    fi
}

# Step 1: Stop all orchestrator containers
echo "🛑 Step 1: Stopping orchestrator containers..."
echo ""

# Find all containers with orchestrator in the name
ORCHESTRATOR_CONTAINERS=$(docker ps -a --filter "name=orchestrator" --format "{{.Names}}" 2>/dev/null || true)

if [ -z "$ORCHESTRATOR_CONTAINERS" ]; then
    echo "ℹ️  No orchestrator containers found"
else
    echo "Found orchestrator containers:"
    echo "$ORCHESTRATOR_CONTAINERS"
    echo ""

    for container in $ORCHESTRATOR_CONTAINERS; do
        echo "Stopping container: $container"

        # Try graceful stop first
        docker stop -t 5 "$container" 2>/dev/null || true

        # Force kill if still running
        if docker ps --filter "name=$container" --format "{{.Names}}" | grep -q "$container"; then
            echo "   Force killing $container..."
            docker kill "$container" 2>/dev/null || true
        fi

        # Remove container
        echo "   Removing $container..."
        docker rm -f "$container" 2>/dev/null || true

        echo "✅ Container $container stopped and removed"
    done
fi

echo ""

# Step 2: Kill any Python processes running orchestrator
echo "🐍 Step 2: Stopping Python orchestrator processes..."
echo ""

# Find Python processes with orchestrator in command line
PYTHON_PROCS=$(ps aux | grep -E "python.*orchestrator_3_stream|uvicorn.*orchestrator" | grep -v grep | awk '{print $2}' || true)

if [ -z "$PYTHON_PROCS" ]; then
    echo "ℹ️  No Python orchestrator processes found"
else
    echo "Found Python processes: $PYTHON_PROCS"
    echo "$PYTHON_PROCS" | xargs -r kill -9 2>/dev/null || true
    echo "✅ Python processes stopped"
fi

echo ""

# Step 3: Free port 9403
echo "🔓 Step 3: Freeing port 9403..."
echo ""

kill_port 9403

echo ""

# Step 4: Clean up orphaned networks
echo "🌐 Step 4: Cleaning up Docker networks..."
echo ""

# Prune networks (removes unused networks)
docker network prune -f 2>/dev/null || true

echo "✅ Networks cleaned"
echo ""

# Step 5: Verify cleanup
echo "✅ Step 5: Verifying cleanup..."
echo ""

# Check for remaining orchestrator containers
REMAINING=$(docker ps -a --filter "name=orchestrator" --format "{{.Names}}" 2>/dev/null || true)
if [ -z "$REMAINING" ]; then
    echo "✅ No orchestrator containers remaining"
else
    echo "⚠️  WARNING: Some containers still exist:"
    echo "$REMAINING"
fi

# Check port 9403
if check_port 9403; then
    echo "⚠️  WARNING: Port 9403 is still in use!"
    echo ""
    echo "Processes using port 9403:"
    lsof -i:9403 2>/dev/null || netstat -tulpn | grep 9403 || ss -tulpn | grep 9403 || true
    echo ""
    echo "❌ Cleanup incomplete - port still blocked"
    exit 1
else
    echo "✅ Port 9403 is free"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup Complete!"
echo ""
echo "📝 Summary:"
echo "   - All orchestrator containers stopped"
echo "   - Python processes terminated"
echo "   - Port 9403 freed"
echo "   - Docker networks cleaned"
echo ""
echo "🚀 Ready for Coolify redeployment"
echo ""
