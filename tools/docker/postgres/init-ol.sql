-- ============================================
-- Ozean Licht Database Initialization
-- Docker Entry Point Script
-- ============================================
-- This script runs automatically when the Docker container
-- is first created. It initializes the ozean-licht-db database.
--
-- Database: ozean-licht-db
-- Port: 5431
-- Container: ozean-postgres-ol
--
-- Note: Actual schema will be created via Prisma migrations
-- This file creates the database and enables required extensions
-- ============================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '  Initializing ozean-licht-db'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

\echo ''
\echo '✓ ozean-licht-db initialized'
\echo '  Extensions enabled: uuid-ossp, pg_trgm'
\echo '  Ready for Prisma migrations'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
