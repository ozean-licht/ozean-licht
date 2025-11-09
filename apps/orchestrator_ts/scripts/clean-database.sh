#!/bin/bash
# Clean and recreate orchestrator_db for fresh TypeScript orchestrator deployment
#
# Usage: ./scripts/clean-database.sh <postgres-container-name>
#
# This script will:
# 1. Drop existing orchestrator_db
# 2. Create fresh orchestrator_db
# 3. Run migrations
# 4. Verify setup

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: PostgreSQL container name required${NC}"
    echo "Usage: $0 <postgres-container-name>"
    echo ""
    echo "Example: $0 postgres-main-abc123"
    exit 1
fi

POSTGRES_CONTAINER=$1
DB_NAME="orchestrator_db"
DB_USER="postgres"
MIGRATION_FILE="../orchestrator_db/migrations/005_add_adw_tables.sql"

echo -e "${YELLOW}=== Orchestrator DB Cleanup Script ===${NC}"
echo ""
echo "Container: $POSTGRES_CONTAINER"
echo "Database: $DB_NAME"
echo ""

# Verify container exists
echo -e "${YELLOW}[1/6] Verifying PostgreSQL container...${NC}"
if ! docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
    echo -e "${RED}Error: Container '$POSTGRES_CONTAINER' not found${NC}"
    echo "Available containers:"
    docker ps --format '{{.Names}}' | grep postgres || echo "No postgres containers found"
    exit 1
fi
echo -e "${GREEN}✓ Container found${NC}"
echo ""

# Drop existing database
echo -e "${YELLOW}[2/6] Dropping existing database (if exists)...${NC}"
docker exec -i $POSTGRES_CONTAINER psql -U $DB_USER << EOF
DROP DATABASE IF EXISTS $DB_NAME;
EOF
echo -e "${GREEN}✓ Database dropped${NC}"
echo ""

# Create fresh database
echo -e "${YELLOW}[3/6] Creating fresh database...${NC}"
docker exec -i $POSTGRES_CONTAINER psql -U $DB_USER << EOF
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF
echo -e "${GREEN}✓ Database created${NC}"
echo ""

# Enable extensions
echo -e "${YELLOW}[4/6] Enabling PostgreSQL extensions...${NC}"
docker exec -i $POSTGRES_CONTAINER psql -U $DB_USER $DB_NAME << EOF
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EOF
echo -e "${GREEN}✓ Extensions enabled${NC}"
echo ""

# Run migration
echo -e "${YELLOW}[5/6] Running migration...${NC}"
if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}Error: Migration file not found: $MIGRATION_FILE${NC}"
    echo "Please run this script from: apps/orchestrator_ts/scripts/"
    exit 1
fi

docker exec -i $POSTGRES_CONTAINER psql -U $DB_USER $DB_NAME < $MIGRATION_FILE
echo -e "${GREEN}✓ Migration completed${NC}"
echo ""

# Verify tables
echo -e "${YELLOW}[6/6] Verifying tables...${NC}"
TABLES=$(docker exec -i $POSTGRES_CONTAINER psql -U $DB_USER $DB_NAME -t -c "\dt" | grep -c "public")

if [ "$TABLES" -ge 5 ]; then
    echo -e "${GREEN}✓ Found $TABLES tables (expected 5+)${NC}"
    echo ""
    echo "Tables created:"
    docker exec -i $POSTGRES_CONTAINER psql -U $DB_USER $DB_NAME -c "\dt"
else
    echo -e "${RED}✗ Only found $TABLES tables (expected 5+)${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Database cleanup completed successfully! ===${NC}"
echo ""
echo "Next steps:"
echo "1. Update docker-compose.coolify.yml with DATABASE_URL"
echo "2. Deploy TypeScript orchestrator: docker compose -f docker-compose.coolify.yml up -d"
echo "3. Check health: curl http://localhost:8003/health"
echo ""
