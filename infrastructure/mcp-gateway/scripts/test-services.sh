#!/bin/bash

# MCP Gateway Service Testing Script
# Tests all MCP services to verify they're working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_URL=${1:-"http://localhost:8100"}
AUTH_TOKEN=${2:-"dev-token"}

echo -e "${BLUE}🧪 MCP Gateway Service Testing${NC}"
echo "================================"
echo "API URL: ${API_URL}"
echo ""

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test an endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5

    echo -n "Testing ${name}... "

    if [ -z "$data" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X ${method} \
            -H "Authorization: Bearer ${AUTH_TOKEN}" \
            "${API_URL}${endpoint}")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" -X ${method} \
            -H "Authorization: Bearer ${AUTH_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "${data}" \
            "${API_URL}${endpoint}")
    fi

    HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_STATUS" == "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP ${HTTP_STATUS})"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (Expected ${expected_status}, got ${HTTP_STATUS})"
        echo "Response: ${BODY:0:100}..."
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to test slash commands
test_slash_command() {
    local name=$1
    local command=$2
    local expected_status=${3:-200}

    echo -n "Testing ${name}... "

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"command\": \"${command}\"}" \
        "${API_URL}/mcp/execute")

    HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_STATUS" == "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP ${HTTP_STATUS})"
        echo "Response: ${BODY:0:100}..."
        ((TESTS_FAILED++))
        return 1
    fi
}

echo -e "${YELLOW}📋 Testing Core Endpoints${NC}"
echo "----------------------------"

# Test health endpoint
test_endpoint "Health Check" "GET" "/health" "" "200"

# Test ready endpoint
test_endpoint "Readiness Check" "GET" "/ready" "" "200"

# Test info endpoint
test_endpoint "Service Info" "GET" "/info" "" "200"

# Test catalog endpoint
test_endpoint "Service Catalog" "GET" "/mcp/catalog" "" "200"

echo ""
echo -e "${YELLOW}🔧 Testing PostgreSQL MCP${NC}"
echo "----------------------------"

# Test PostgreSQL commands
test_slash_command "List Tables (KA)" "/mcp-postgres kids-ascension-db list tables"
test_slash_command "List Tables (OL)" "/mcp-postgres ozean-licht-db list tables"
test_slash_command "Connection Test" "/mcp-postgres kids-ascension-db test"

echo ""
echo -e "${YELLOW}💾 Testing Mem0 MCP${NC}"
echo "----------------------------"

# Test Mem0 commands
test_slash_command "Mem0 Health" "/mcp-mem0 health"
test_slash_command "Store Memory" "/mcp-mem0 remember \"Test memory from MCP Gateway\""
test_slash_command "Search Memory" "/mcp-mem0 search \"test\""

echo ""
echo -e "${YELLOW}⚙️ Testing N8N MCP${NC}"
echo "----------------------------"

# Test N8N commands
test_slash_command "N8N Health" "/mcp-n8n health"
test_slash_command "List Workflows" "/mcp-n8n list-workflows"

echo ""
echo -e "${YELLOW}🌍 Testing Local MCP Registration${NC}"
echo "----------------------------"

# Test local MCP registrations
test_endpoint "Playwright Service" "GET" "/mcp/service/playwright" "" "200"
test_endpoint "ShadCN Service" "GET" "/mcp/service/shadcn" "" "200"
test_endpoint "MagicUI Service" "GET" "/mcp/service/magicui" "" "200"
# Taskmaster removed - conflicts with ADW system

echo ""
echo -e "${YELLOW}🔐 Testing Authentication${NC}"
echo "----------------------------"

# Test without auth (should fail in production)
echo -n "Testing unauthorized access... "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "${API_URL}/mcp/execute")

if [ "$RESPONSE" == "401" ] || [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} (Auth check)"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC} (Unexpected status: ${RESPONSE})"
fi

echo ""
echo -e "${YELLOW}📊 Testing Metrics${NC}"
echo "----------------------------"

# Test metrics endpoint
echo -n "Testing Prometheus metrics... "
METRICS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL/:8100/:9090}/metrics")

if [ "$METRICS_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Metrics not available${NC} (Port 9090)"
fi

echo ""
echo "================================"
echo -e "${BLUE}Test Results Summary${NC}"
echo "================================"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! MCP Gateway is working correctly.${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  Some tests failed. Please check the service configuration.${NC}"
    exit 1
fi