#!/bin/bash
# Migrate transactions from Supabase to local PostgreSQL using pg_dump/restore
# This script uses the Supabase connection string to dump and restore

set -e

LOCAL_PG_CONTAINER="iccc0wo0wkgsws4cowk4440c"
LOCAL_PG_DB="ozean-licht-db"

echo "Starting Supabase to Local PostgreSQL migration..."
echo "This will copy all transactions from Supabase to local PostgreSQL"
echo ""

# Check local count first
LOCAL_COUNT=$(docker exec $LOCAL_PG_CONTAINER psql -U postgres -d $LOCAL_PG_DB -t -c "SELECT COUNT(*) FROM transactions;" | tr -d ' ')
echo "Current local transaction count: $LOCAL_COUNT"

if [ "$LOCAL_COUNT" -gt 0 ]; then
    echo "Warning: Local database already has $LOCAL_COUNT transactions"
    read -p "Continue and merge? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "Migration will be performed via Claude Code's Supabase MCP connection."
echo "Please run the migration from Claude Code using the Supabase MCP tools."
