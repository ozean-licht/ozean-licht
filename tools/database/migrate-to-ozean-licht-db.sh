#!/bin/bash
# Database Consolidation Migration Script
# Migrates ozean-licht-db from kids-ascension-db container to ozean-licht-db container
#
# CURRENT STATE:
# - kids-ascension-db container (iccc0wo0wkgsws4cowk4440c):
#   - shared-users-db: admin tables (used by admin dashboard currently)
#   - ozean-licht-db: ALL project data (9114 tasks, admin tables) <- SOURCE
#   - kids-ascension-db: waitlist only
#   - orchestrator-db: orchestrator data
#
# - ozean-licht-db container (zo8g4ogg8g0gss0oswkcs84w):
#   - ozean-licht-db: EMPTY (0 tasks) <- TARGET
#   - mem0: mem0 data (keep)
#
# GOAL: Use ozean-licht-db container as primary, migrate all data there

set -e

# Container IDs
SOURCE_CONTAINER="iccc0wo0wkgsws4cowk4440c"  # kids-ascension-db
TARGET_CONTAINER="zo8g4ogg8g0gss0oswkcs84w"  # ozean-licht-db

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Database Consolidation Migration ===${NC}"
echo ""
echo "Source: kids-ascension-db container ($SOURCE_CONTAINER)"
echo "Target: ozean-licht-db container ($TARGET_CONTAINER)"
echo ""

# Step 1: Verify containers are running
echo -e "${YELLOW}Step 1: Verifying containers...${NC}"
if ! docker ps --format '{{.Names}}' | grep -q "$SOURCE_CONTAINER"; then
    echo -e "${RED}ERROR: Source container not running${NC}"
    exit 1
fi
if ! docker ps --format '{{.Names}}' | grep -q "$TARGET_CONTAINER"; then
    echo -e "${RED}ERROR: Target container not running${NC}"
    exit 1
fi
echo -e "${GREEN}Both containers running${NC}"

# Step 2: Create backup directory
BACKUP_DIR="/opt/ozean-licht-ecosystem/backups/db-migration-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo -e "${YELLOW}Step 2: Backup directory: $BACKUP_DIR${NC}"

# Step 3: Dump source ozean-licht-db
echo -e "${YELLOW}Step 3: Dumping source ozean-licht-db...${NC}"
docker exec "$SOURCE_CONTAINER" pg_dump -U postgres -d ozean-licht-db --clean --if-exists > "$BACKUP_DIR/ozean-licht-db.sql"
echo -e "${GREEN}Dump created: $BACKUP_DIR/ozean-licht-db.sql ($(du -h "$BACKUP_DIR/ozean-licht-db.sql" | cut -f1))${NC}"

# Step 4: Dump shared-users-db as backup
echo -e "${YELLOW}Step 4: Backing up shared-users-db...${NC}"
docker exec "$SOURCE_CONTAINER" pg_dump -U postgres -d shared-users-db --clean --if-exists > "$BACKUP_DIR/shared-users-db.sql"
echo -e "${GREEN}Backup created: $BACKUP_DIR/shared-users-db.sql${NC}"

# Step 5: Backup target ozean-licht-db (even though empty)
echo -e "${YELLOW}Step 5: Backing up target ozean-licht-db...${NC}"
docker exec "$TARGET_CONTAINER" pg_dump -U postgres -d ozean-licht-db --clean --if-exists > "$BACKUP_DIR/ozean-licht-db-target-backup.sql"
echo -e "${GREEN}Target backup created${NC}"

# Step 6: Count records before migration
echo -e "${YELLOW}Step 6: Pre-migration record counts (source):${NC}"
echo -n "  Tasks: "
docker exec "$SOURCE_CONTAINER" psql -U postgres -d ozean-licht-db -t -c "SELECT COUNT(*) FROM tasks;" 2>/dev/null || echo "N/A"
echo -n "  Projects: "
docker exec "$SOURCE_CONTAINER" psql -U postgres -d ozean-licht-db -t -c "SELECT COUNT(*) FROM projects;" 2>/dev/null || echo "N/A"
echo -n "  Admin Users: "
docker exec "$SOURCE_CONTAINER" psql -U postgres -d ozean-licht-db -t -c "SELECT COUNT(*) FROM admin_users;" 2>/dev/null || echo "N/A"

echo ""
echo -e "${YELLOW}=== READY TO MIGRATE ===${NC}"
echo ""
echo "This will:"
echo "  1. Drop existing ozean-licht-db on target container"
echo "  2. Restore full database from source"
echo "  3. Verify record counts match"
echo ""
read -p "Proceed with migration? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Migration cancelled"
    exit 0
fi

# Step 7: Restore to target
echo -e "${YELLOW}Step 7: Restoring to target container...${NC}"

# Drop and recreate database
docker exec "$TARGET_CONTAINER" psql -U postgres -c "DROP DATABASE IF EXISTS \"ozean-licht-db\";"
docker exec "$TARGET_CONTAINER" psql -U postgres -c "CREATE DATABASE \"ozean-licht-db\";"

# Restore dump
cat "$BACKUP_DIR/ozean-licht-db.sql" | docker exec -i "$TARGET_CONTAINER" psql -U postgres -d ozean-licht-db

echo -e "${GREEN}Restore completed${NC}"

# Step 8: Verify migration
echo -e "${YELLOW}Step 8: Verifying migration (target):${NC}"
echo -n "  Tasks: "
docker exec "$TARGET_CONTAINER" psql -U postgres -d ozean-licht-db -t -c "SELECT COUNT(*) FROM tasks;" 2>/dev/null || echo "N/A"
echo -n "  Projects: "
docker exec "$TARGET_CONTAINER" psql -U postgres -d ozean-licht-db -t -c "SELECT COUNT(*) FROM projects;" 2>/dev/null || echo "N/A"
echo -n "  Admin Users: "
docker exec "$TARGET_CONTAINER" psql -U postgres -d ozean-licht-db -t -c "SELECT COUNT(*) FROM admin_users;" 2>/dev/null || echo "N/A"

echo ""
echo -e "${GREEN}=== MIGRATION COMPLETED ===${NC}"
echo ""
echo "NEXT STEPS:"
echo "  1. Update Admin Dashboard DATABASE_URL in Coolify:"
echo "     FROM: postgresql://postgres:PASSWORD@10.0.1.7:5432/shared-users-db"
echo "     TO:   postgresql://postgres:PASSWORD@$TARGET_CONTAINER:5431/ozean-licht-db"
echo ""
echo "  2. Update MCP Gateway POSTGRES_OL_HOST if needed"
echo ""
echo "  3. Restart Admin Dashboard"
echo ""
echo "  4. Test admin login and project management"
echo ""
echo "  5. Once verified, you can drop shared-users-db:"
echo "     docker exec $SOURCE_CONTAINER psql -U postgres -c \"DROP DATABASE \\\"shared-users-db\\\";\""
echo ""
echo "Backups saved to: $BACKUP_DIR"
