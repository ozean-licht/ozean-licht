#!/bin/bash

# MCP Gateway Deployment Test Script
# This script verifies that the MCP Gateway and all services are properly configured

echo "================================================"
echo "MCP Gateway Deployment Test"
echo "================================================"
echo ""

# Configuration
MCP_GATEWAY_URL="http://localhost:8100"
METRICS_URL="http://localhost:9090"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check endpoint
check_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    echo -n "Checking $name... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$response" == "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗${NC} (HTTP $response, expected $expected_status)"
        return 1
    fi
}

# Function to test JSON-RPC endpoint
test_rpc() {
    local service=$1
    local operation=$2
    local params=$3

    echo -n "Testing $service.$operation... "

    response=$(curl -s -X POST "$MCP_GATEWAY_URL/mcp/rpc" \
        -H "Content-Type: application/json" \
        -d "{
            \"jsonrpc\": \"2.0\",
            \"method\": \"mcp.execute\",
            \"params\": {
                \"service\": \"$service\",
                \"operation\": \"$operation\"
                $params
            },
            \"id\": \"test-$service-$operation\"
        }")

    if echo "$response" | grep -q '"status":"success"' || echo "$response" | grep -q '"result"'; then
        echo -e "${GREEN}✓${NC}"
        return 0
    elif echo "$response" | grep -q '"error"'; then
        error=$(echo "$response" | grep -o '"message":"[^"]*"' | sed 's/"message":"//;s/"$//')
        echo -e "${YELLOW}⚠${NC} ($error)"
        return 1
    else
        echo -e "${RED}✗${NC}"
        echo "  Response: $response"
        return 1
    fi
}

echo "1. Basic Health Checks"
echo "----------------------"
check_endpoint "MCP Gateway Health" "$MCP_GATEWAY_URL/health"
check_endpoint "MCP Gateway Ready" "$MCP_GATEWAY_URL/ready"
check_endpoint "Metrics Endpoint" "$METRICS_URL/metrics"
echo ""

echo "2. Service Catalog"
echo "----------------------"
echo -n "Fetching service catalog... "
catalog=$(curl -s "$MCP_GATEWAY_URL/mcp/catalog")
service_count=$(echo "$catalog" | grep -o '"name"' | wc -l)

if [ "$service_count" -ge 9 ]; then
    echo -e "${GREEN}✓${NC} ($service_count services found)"

    # List services
    echo "  Available services:"
    echo "$catalog" | grep -o '"name":"[^"]*"' | sed 's/"name":"//;s/"$//' | while read -r service; do
        echo "    - $service"
    done
else
    echo -e "${RED}✗${NC} (Only $service_count services found, expected 9+)"
fi
echo ""

echo "3. Service Health Checks"
echo "----------------------"

# Test MinIO
test_rpc "minio" "health"

# Test Mem0 (might fail if not running, that's OK)
test_rpc "mem0" "health"

# Test PostgreSQL (list tables)
echo -n "Testing PostgreSQL... "
# Note: This might fail if database doesn't exist yet
curl -s -X POST "$MCP_GATEWAY_URL/mcp/rpc" \
    -H "Content-Type: application/json" \
    -d '{
        "jsonrpc": "2.0",
        "method": "mcp.execute",
        "params": {
            "service": "postgres",
            "operation": "list-tables",
            "database": "kids-ascension"
        },
        "id": "test-postgres"
    }' > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} (endpoint reachable)"
else
    echo -e "${YELLOW}⚠${NC} (database might not be configured)"
fi

echo ""

echo "4. Authentication Test"
echo "----------------------"
echo -n "Testing localhost bypass... "
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$MCP_GATEWAY_URL/mcp/rpc" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"mcp.listServices","id":"auth-test"}')

if [ "$response" == "200" ]; then
    echo -e "${GREEN}✓${NC} (No auth required from localhost)"
else
    echo -e "${RED}✗${NC} (Unexpected response: $response)"
fi
echo ""

echo "5. MinIO Specific Tests"
echo "----------------------"

# Check MinIO endpoint directly
echo -n "Testing MinIO connectivity... "
minio_response=$(curl -s -o /dev/null -w "%{http_code}" "http://138.201.139.25:9000/minio/health/live")
if [ "$minio_response" == "200" ]; then
    echo -e "${GREEN}✓${NC} (MinIO server is reachable)"
else
    echo -e "${YELLOW}⚠${NC} (MinIO might be on different network or port)"
fi

# Test MinIO through MCP Gateway
echo -n "Testing MinIO via MCP Gateway... "
minio_test=$(curl -s -X POST "$MCP_GATEWAY_URL/mcp/rpc" \
    -H "Content-Type: application/json" \
    -d '{
        "jsonrpc": "2.0",
        "method": "mcp.execute",
        "params": {
            "service": "minio",
            "operation": "health"
        },
        "id": "minio-health-test"
    }')

if echo "$minio_test" | grep -q '"healthy":true'; then
    echo -e "${GREEN}✓${NC}"
elif echo "$minio_test" | grep -q '"healthy":false'; then
    echo -e "${YELLOW}⚠${NC} (Service registered but unhealthy)"
    echo "  Consider checking MinIO credentials in .env"
else
    echo -e "${RED}✗${NC} (Service not responding properly)"
fi
echo ""

echo "6. Deployment Summary"
echo "----------------------"
echo "MCP Gateway Version: 1.0.2"
echo "Total Services: 9 (6 server-side, 3 local)"
echo ""

# Check if running in Docker
if [ -f /.dockerenv ]; then
    echo -e "${YELLOW}Note:${NC} Running inside Docker container"
else
    # Check if MCP Gateway container is running
    if docker ps | grep -q mcp-gateway; then
        echo -e "${GREEN}✓${NC} MCP Gateway container is running"

        # Show container logs (last 5 lines)
        echo ""
        echo "Recent logs:"
        docker logs mcp-gateway --tail 5 2>&1 | sed 's/^/  /'
    else
        echo -e "${RED}✗${NC} MCP Gateway container is not running"
        echo ""
        echo "To start the MCP Gateway:"
        echo "  cd /opt/ozean-licht-ecosystem/infrastructure/mcp-gateway"
        echo "  docker compose up -d"
    fi
fi

echo ""
echo "================================================"
echo "Test Complete"
echo "================================================"

# For Coolify deployment verification
if [ "$1" == "--coolify" ]; then
    echo ""
    echo "Coolify-specific checks:"
    echo "------------------------"

    # Check if running with Coolify network
    if docker network ls | grep -q coolify; then
        echo -e "${GREEN}✓${NC} Coolify network exists"
    else
        echo -e "${RED}✗${NC} Coolify network not found"
    fi

    # Check internal service resolution
    echo -n "Testing internal service name resolution... "
    if ping -c 1 mcp-gateway > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} (mcp-gateway resolves)"
    else
        echo -e "${YELLOW}⚠${NC} (might be external to Coolify network)"
    fi
fi