-- ============================================
-- LEGACY: PostgreSQL Initialization Script
-- ============================================
-- This file is kept for backward compatibility.
-- New installations should use docker-compose.yml with individual init files:
--   - init-shared.sql (shared_users_db, port 5430)
--   - init-ka.sql (kids-ascension-db, port 5432)
--   - init-ol.sql (ozean-licht-db, port 5431)
--   - init-orchestrator.sql (orchestrator-db, port 5433)
--
-- Usage:
--   docker-compose up -d
--
-- See: tools/docker/docker-compose.yml
-- ============================================

\echo 'LEGACY: This init.sql is deprecated. Use docker-compose.yml instead.'
