#!/bin/bash
# Test Context7 MCP integration through API

echo "Testing Context7 MCP through MCP Gateway API..."
echo

# Test 1: Resolve library
echo "Test 1: Resolving Storybook library ID..."
curl -s -X POST http://mcp-gateway.ozean-licht.dev:8100/api/mcp/context7 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "resolve",
    "args": ["storybook"]
  }' | jq '.data'
echo
echo "---"
echo

# Test 2: Get documentation
echo "Test 2: Getting Storybook authentication docs..."
curl -s -X POST http://mcp-gateway.ozean-licht.dev:8100/api/mcp/context7 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "get-docs",
    "args": ["/storybookjs/storybook/v9.0.15"],
    "options": {
      "topic": "authentication",
      "tokens": 3000,
      "page": 1
    }
  }' | jq -r '.data.documentation' | head -c 1000
echo
echo
echo "---"
echo

# Test 3: Health check
echo "Test 3: Checking Context7 health..."
curl -s -X POST http://mcp-gateway.ozean-licht.dev:8100/api/mcp/context7 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "health"
  }' | jq '.data'

echo
echo "Tests complete!"
