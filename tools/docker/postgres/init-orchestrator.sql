-- ============================================
-- Orchestrator Database Initialization
-- Docker Entry Point Script
-- ============================================
-- This script runs automatically when the Docker container
-- is first created. It initializes the orchestrator-db database.
--
-- Database: orchestrator-db
-- Port: 5433
-- Container: ozean-postgres-orchestrator
--
-- Note: Actual schema will be created via migrations
-- This file creates the database and enables required extensions
-- ============================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '  Initializing orchestrator-db'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

\echo ''
\echo '✓ orchestrator-db initialized'
\echo '  Extensions enabled: uuid-ossp, pg_trgm'
\echo '  Ready for migrations'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
