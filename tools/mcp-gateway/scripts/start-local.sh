#!/bin/bash

# MCP Gateway Local Development Script
# Quick start for local development and testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 MCP Gateway - Local Development${NC}"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from template${NC}"
    echo -e "${YELLOW}📝 Please edit .env with your configuration before continuing${NC}"
    echo ""
    echo "Required configurations:"
    echo "  - POSTGRES_KA_PASSWORD (Kids Ascension DB)"
    echo "  - POSTGRES_OL_PASSWORD (Ozean Licht DB)"
    echo "  - JWT_SECRET (minimum 32 characters)"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version 20 or higher is required${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Build TypeScript if dist doesn't exist
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}🔨 Building TypeScript...${NC}"
    npm run build
    echo -e "${GREEN}✅ Build completed${NC}"
fi

# Start services
echo ""
echo -e "${GREEN}🎯 Starting MCP Gateway...${NC}"
echo "================================"
echo "Main API:     http://localhost:8100"
echo "Health:       http://localhost:8100/health"
echo "Metrics:      http://localhost:9090/metrics"
echo "Catalog:      http://localhost:8100/mcp/catalog"
echo ""
echo "Press Ctrl+C to stop"
echo "================================"
echo ""

# Run in development mode with hot reload
npm run dev