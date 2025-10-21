#!/bin/bash
# Autonomous Infrastructure Monitor
# This script can be run by agents without manual intervention

SSH_KEY="$HOME/.ssh/ozean-automation"
SERVER="root@138.201.139.25"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== 🤖 AUTONOMOUS INFRASTRUCTURE MONITOR ==="
echo "Time: $(date)"
echo ""

# Function to execute remote commands
remote_exec() {
    ssh -i "$SSH_KEY" "$SERVER" "$1"
}

# Check service health
check_service() {
    local service=$1
    local health_url=$2
    local expected=$3

    result=$(remote_exec "curl -s $health_url 2>/dev/null || echo 'failed'")

    if echo "$result" | grep -q "$expected"; then
        echo -e "${GREEN}✅ $service is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ $service is unhealthy${NC}"
        return 1
    fi
}

# Monitor services
echo "📊 Service Health Checks:"
check_service "Mem0" "localhost:8090/health" "healthy"
check_service "Qdrant" "localhost:6333/health" "true"
check_service "N8N" "localhost:5678/healthz" "ok"

echo ""
echo "🐳 Container Status:"
remote_exec "docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -E 'mem0|qdrant|n8n|postgres|redis' | head -10"

echo ""
echo "💾 Resource Usage:"
remote_exec "free -h | grep Mem"
remote_exec "df -h / | grep -E '^/'"
remote_exec "docker stats --no-stream --format 'table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}' | head -10"

echo ""
echo "📝 Recent Logs (Errors/Warnings):"
remote_exec "docker logs mem0-uo8gc0kc0gswcskk44gc8wks 2>&1 | tail -20 | grep -iE 'error|warning|fail' || echo 'No errors found'"

echo ""
echo "🔄 Auto-Healing Check:"
unhealthy=$(remote_exec "docker ps --filter 'health=unhealthy' --format '{{.Names}}'")
if [ -z "$unhealthy" ]; then
    echo -e "${GREEN}All services healthy - no healing needed${NC}"
else
    echo -e "${YELLOW}Unhealthy services found: $unhealthy${NC}"
    echo "Attempting auto-heal..."
    for container in $unhealthy; do
        remote_exec "docker restart $container"
        echo "Restarted: $container"
    done
fi

echo ""
echo "=== ✅ Monitoring Complete ==="