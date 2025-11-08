-- ============================================
-- Kids Ascension Database Initialization
-- Docker Entry Point Script
-- ============================================
-- This script runs automatically when the Docker container
-- is first created. It initializes the kids-ascension-db database.
--
-- Database: kids-ascension-db
-- Port: 5432
-- Container: ozean-postgres-ka
--
-- Note: Actual schema will be created via Prisma migrations
-- This file creates the database and enables required extensions
-- ============================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '  Initializing kids-ascension-db'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS if needed for location features
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable pg_trgm for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

\echo ''
\echo '✓ kids-ascension-db initialized'
\echo '  Extensions enabled: uuid-ossp, pg_trgm'
\echo '  Ready for Prisma migrations'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
