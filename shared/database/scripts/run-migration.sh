#!/bin/bash

###############################################################################
# Shared Users Database - Migration Execution Script
# Phase 0: Kids Ascension Integration
###############################################################################
#
# This script creates and sets up the shared_users_db database with all
# required tables, indexes, triggers, and seed data.
#
# Prerequisites:
#   - PostgreSQL 15+ installed and running
#   - Superuser or database creation privileges
#   - .env file with database credentials
#
# Usage:
#   ./shared/database/scripts/run-migration.sh
#
# Related Files:
#   - migrations/000_create_shared_users_db.sql (migration SQL)
#   - scripts/test-connection.ts (validation script)
#   - prisma/schema.prisma (Prisma schema)
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MIGRATIONS_DIR="$PROJECT_ROOT/shared/database/migrations"

# Print header
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Phase 0: Shared Users Database Setup                        ║${NC}"
echo -e "${BLUE}║  Kids Ascension Integration - Foundation                     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Load environment variables
if [ -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${GREEN}✓${NC} Loading environment variables from .env"
    source "$PROJECT_ROOT/.env"
else
    echo -e "${YELLOW}⚠${NC}  .env file not found. Using example.env as reference."
    echo -e "   Copy example.env to .env and configure your database credentials."
    exit 1
fi

# Check if SHARED_USERS_DB_URL is set
if [ -z "$SHARED_USERS_DB_URL" ]; then
    echo -e "${RED}✗${NC} SHARED_USERS_DB_URL not set in .env"
    echo ""
    echo "Please add the following to your .env file:"
    echo ""
    echo "  SHARED_USERS_DB_URL=postgresql://postgres:password@localhost:5430/shared_users_db"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment variables loaded"
echo ""

# Parse connection details from SHARED_USERS_DB_URL
# Format: postgresql://user:password@host:port/database
DB_URL_REGEX="postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+)"

if [[ $SHARED_USERS_DB_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASSWORD="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo -e "${RED}✗${NC} Invalid SHARED_USERS_DB_URL format"
    echo "   Expected: postgresql://user:password@host:port/database"
    exit 1
fi

echo -e "${BLUE}Database Configuration:${NC}"
echo "  Host:     $DB_HOST"
echo "  Port:     $DB_PORT"
echo "  User:     $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# Test PostgreSQL connection
echo -e "${BLUE}[1/5]${NC} Testing PostgreSQL connection..."
export PGPASSWORD="$DB_PASSWORD"

if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Connected to PostgreSQL server"
else
    echo -e "${RED}✗${NC} Cannot connect to PostgreSQL server"
    echo "   Please verify PostgreSQL is running and credentials are correct."
    exit 1
fi
echo ""

# Check if database already exists
echo -e "${BLUE}[2/5]${NC} Checking if database exists..."
DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${YELLOW}⚠${NC}  Database '$DB_NAME' already exists"
    echo ""
    read -p "   Do you want to continue with migration? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Migration aborted by user."
        exit 0
    fi
else
    echo -e "${GREEN}✓${NC} Database does not exist yet"
    echo ""
    echo -e "${BLUE}[3/5]${NC} Creating database '$DB_NAME'..."

    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"; then
        echo -e "${GREEN}✓${NC} Database created successfully"
    else
        echo -e "${RED}✗${NC} Failed to create database"
        exit 1
    fi
fi
echo ""

# Run migration SQL
echo -e "${BLUE}[4/5]${NC} Running migration 000_create_shared_users_db.sql..."
MIGRATION_FILE="$MIGRATIONS_DIR/000_create_shared_users_db.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}✗${NC} Migration file not found: $MIGRATION_FILE"
    exit 1
fi

if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_FILE"; then
    echo -e "${GREEN}✓${NC} Migration executed successfully"
else
    echo -e "${RED}✗${NC} Migration failed"
    exit 1
fi
echo ""

# Verify migration
echo -e "${BLUE}[5/5]${NC} Verifying database setup..."

TABLE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';")

echo "  Tables created: $TABLE_COUNT"

if [ "$TABLE_COUNT" -ge 6 ]; then
    echo -e "${GREEN}✓${NC} Database structure verified"
else
    echo -e "${YELLOW}⚠${NC}  Expected at least 6 tables, found $TABLE_COUNT"
fi
echo ""

# Success message
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ Phase 0 Migration Complete                                ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Database ready:${NC} shared_users_db"
echo -e "${GREEN}Tables created:${NC} users, user_entities, sessions, oauth_accounts, password_reset_tokens, email_verification_tokens"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Test connection: ts-node shared/database/scripts/test-connection.ts"
echo "  2. Generate Prisma client: cd shared/database && npx prisma generate"
echo "  3. Create test admin user: cd apps/admin && npm run seed:test-admin"
echo "  4. Proceed to Phase 1: Foundation Setup"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  - Phase 0 README: shared/database/README.md"
echo "  - Integration Plan: specs/kids-ascension-integration-plan.md"
echo "  - Analysis Report: specs/kids_ascension_integration_analysis_2025.md"
echo ""

# Cleanup
unset PGPASSWORD
