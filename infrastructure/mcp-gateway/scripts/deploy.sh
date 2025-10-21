#!/bin/bash

# MCP Gateway Deployment Script
# This script prepares and deploys the MCP Gateway to production

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_ENV=${1:-production}
SERVER_HOST="138.201.139.25"
DEPLOY_PATH="/opt/mcp-gateway"
SSH_KEY="~/.ssh/ozean-automation"

echo -e "${GREEN}🚀 MCP Gateway Deployment Script${NC}"
echo "================================="
echo "Environment: ${DEPLOYMENT_ENV}"
echo "Server: ${SERVER_HOST}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi

    # Check SSH key
    if [ ! -f "${SSH_KEY/#\~/$HOME}" ]; then
        echo -e "${RED}❌ SSH key not found: ${SSH_KEY}${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to build the project
build_project() {
    echo -e "${YELLOW}🔨 Building project...${NC}"

    # Install dependencies
    npm ci

    # Build TypeScript
    npm run build

    # Run tests (optional, can be commented out for faster deployment)
    # npm test

    echo -e "${GREEN}✅ Build completed${NC}"
}

# Function to create deployment package
create_package() {
    echo -e "${YELLOW}📦 Creating deployment package...${NC}"

    # Create temporary deployment directory
    rm -rf .deploy
    mkdir -p .deploy

    # Copy necessary files
    cp -r dist .deploy/
    cp -r config .deploy/
    cp package*.json .deploy/
    cp ecosystem.config.js .deploy/
    cp Dockerfile .deploy/
    cp docker-compose.yml .deploy/

    # Create tarball
    tar -czf mcp-gateway.tar.gz -C .deploy .

    # Clean up
    rm -rf .deploy

    echo -e "${GREEN}✅ Deployment package created${NC}"
}

# Function to deploy to server
deploy_to_server() {
    echo -e "${YELLOW}🚢 Deploying to server...${NC}"

    # Upload package
    echo "Uploading package to server..."
    scp -i ${SSH_KEY} mcp-gateway.tar.gz root@${SERVER_HOST}:${DEPLOY_PATH}/

    # Execute deployment commands on server
    echo "Executing deployment on server..."
    ssh -i ${SSH_KEY} root@${SERVER_HOST} << 'ENDSSH'
        set -e

        # Navigate to deployment directory
        cd /opt/mcp-gateway

        # Backup current deployment
        if [ -d "current" ]; then
            echo "Creating backup..."
            rm -rf backup
            mv current backup
        fi

        # Create new deployment directory
        mkdir -p current
        cd current

        # Extract package
        tar -xzf ../mcp-gateway.tar.gz
        rm ../mcp-gateway.tar.gz

        # Install production dependencies
        npm ci --only=production

        # Stop existing service (if running)
        pm2 stop mcp-gateway || true
        pm2 delete mcp-gateway || true

        # Start service
        pm2 start ecosystem.config.js --env production
        pm2 save

        echo "Deployment completed on server"
ENDSSH

    # Clean up local package
    rm mcp-gateway.tar.gz

    echo -e "${GREEN}✅ Deployment completed${NC}"
}

# Function to verify deployment
verify_deployment() {
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

    # Check service health
    sleep 5  # Wait for service to start

    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://${SERVER_HOST}:8100/health)

    if [ "$HEALTH_CHECK" == "200" ]; then
        echo -e "${GREEN}✅ Service is healthy${NC}"

        # Get service info
        curl -s http://${SERVER_HOST}:8100/info | jq '.'
    else
        echo -e "${RED}❌ Service health check failed (HTTP ${HEALTH_CHECK})${NC}"

        # Show logs
        echo "Recent logs:"
        ssh -i ${SSH_KEY} root@${SERVER_HOST} "pm2 logs mcp-gateway --lines 50"

        exit 1
    fi
}

# Function for Docker deployment (alternative)
docker_deploy() {
    echo -e "${YELLOW}🐳 Docker deployment...${NC}"

    # Build Docker image
    docker build -t mcp-gateway:latest .

    # Tag for registry
    docker tag mcp-gateway:latest ${DOCKER_REGISTRY}/mcp-gateway:latest

    # Push to registry
    docker push ${DOCKER_REGISTRY}/mcp-gateway:latest

    # Deploy via Docker Compose on server
    ssh -i ${SSH_KEY} root@${SERVER_HOST} << 'ENDSSH'
        cd /opt/mcp-gateway
        docker-compose pull
        docker-compose up -d
        docker-compose logs -f --tail 50
ENDSSH

    echo -e "${GREEN}✅ Docker deployment completed${NC}"
}

# Main deployment flow
main() {
    echo -e "${GREEN}Starting deployment process...${NC}"
    echo ""

    # Check prerequisites
    check_prerequisites

    # Build project
    build_project

    if [ "$DEPLOYMENT_ENV" == "docker" ]; then
        # Docker deployment
        docker_deploy
    else
        # Standard deployment
        create_package
        deploy_to_server
    fi

    # Verify deployment
    verify_deployment

    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo "MCP Gateway is now running at:"
    echo "  - API: http://${SERVER_HOST}:8100"
    echo "  - Metrics: http://${SERVER_HOST}:9090/metrics"
    echo ""
}

# Run main function
main "$@"