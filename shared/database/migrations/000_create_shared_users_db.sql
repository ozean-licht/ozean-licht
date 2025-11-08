-- Migration: 000_create_shared_users_db.sql
-- Description: Create shared authentication database and base user tables
-- Created: 2025-01-08
-- Phase: Phase 0 (Prerequisite for Kids Ascension Integration)
-- Related: specs/kids-ascension-integration-plan.md
-- Analysis: specs/kids_ascension_integration_analysis_2025.md (lines 390-442)

-- ============================================
-- DATABASE CREATION
-- ============================================
-- Note: This SQL assumes connection to PostgreSQL server
-- Run with superuser privileges: psql -U postgres -f 000_create_shared_users_db.sql

-- Create shared_users_db database if it doesn't exist
-- IMPORTANT: If running via run-migration.sh, the script creates the database.
-- If running manually, uncomment these lines:

-- SELECT 'CREATE DATABASE shared_users_db'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shared_users_db')\gexec

-- After creating database, connect to it:
-- \c shared_users_db

-- For Docker initialization, the database is created automatically by
-- the POSTGRES_DB environment variable in docker-compose.yml

-- ============================================
-- USERS TABLE
-- ============================================
-- Core user accounts table for unified authentication across platforms
-- Referenced by both Kids Ascension and Ozean Licht

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL for OAuth-only accounts
    name VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false, -- Alias for compatibility

    -- Profile information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(255),
    avatar_url TEXT,

    -- Account status
    is_active BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Soft delete constraint
    CONSTRAINT check_deleted CHECK (
        (is_deleted = false AND deleted_at IS NULL) OR
        (is_deleted = true AND deleted_at IS NOT NULL)
    )
);

-- ============================================
-- USER_ENTITIES TABLE
-- ============================================
-- Maps users to platforms (Kids Ascension, Ozean Licht)
-- Enables multi-tenant access control

CREATE TABLE IF NOT EXISTS user_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'KIDS_ASCENSION' or 'OZEAN_LICHT'
    role VARCHAR(50) NOT NULL,        -- 'USER', 'CREATOR', 'EDUCATOR', 'ADMIN', 'MODERATOR'

    -- Access control
    is_active BOOLEAN DEFAULT true,
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_revoked_at TIMESTAMP WITH TIME ZONE,

    -- Additional metadata
    metadata JSONB DEFAULT '{}'::jsonb, -- Platform-specific user data

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id, entity_type),
    CONSTRAINT valid_entity_type CHECK (entity_type IN ('KIDS_ASCENSION', 'OZEAN_LICHT')),
    CONSTRAINT valid_role CHECK (role IN ('USER', 'CREATOR', 'EDUCATOR', 'ADMIN', 'MODERATOR', 'SUPPORT'))
);

-- ============================================
-- SESSIONS TABLE
-- ============================================
-- JWT session storage for authentication
-- Used by NextAuth.js for session management

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) NOT NULL UNIQUE,

    -- Session metadata
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,

    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- OAUTH_ACCOUNTS TABLE
-- ============================================
-- OAuth provider accounts (Google, GitHub, etc.)
-- Optional: For future OAuth integration

CREATE TABLE IF NOT EXISTS oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'github', 'facebook'
    provider_account_id VARCHAR(255) NOT NULL,

    -- OAuth tokens
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    token_type VARCHAR(50),
    scope TEXT,
    id_token TEXT,

    -- Provider profile data
    profile_data JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one provider account per user per provider
    UNIQUE(user_id, provider),
    UNIQUE(provider, provider_account_id)
);

-- ============================================
-- PASSWORD_RESET_TOKENS TABLE
-- ============================================
-- Password reset tokens for security

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EMAIL_VERIFICATION_TOKENS TABLE
-- ============================================
-- Email verification tokens for account activation

CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL, -- Email to verify (allows email changes)
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_is_deleted ON users(is_deleted);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- User entities indexes
CREATE INDEX IF NOT EXISTS idx_user_entities_user_id ON user_entities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_entities_entity_type ON user_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_user_entities_role ON user_entities(role);
CREATE INDEX IF NOT EXISTS idx_user_entities_is_active ON user_entities(is_active);
CREATE INDEX IF NOT EXISTS idx_user_entities_composite ON user_entities(user_id, entity_type, is_active);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions(last_activity_at DESC);

-- OAuth accounts indexes
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider ON oauth_accounts(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider_account_id ON oauth_accounts(provider_account_id);

-- Password reset tokens indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Email verification tokens indexes
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_email ON email_verification_tokens(email);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
-- Automatically update updated_at timestamp on row changes

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_entities_updated_at BEFORE UPDATE ON user_entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_accounts_updated_at BEFORE UPDATE ON oauth_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (OPTIONAL)
-- ============================================
-- Add default system entries if needed

-- Example: Create system user for automated actions
INSERT INTO users (id, email, name, is_verified, is_active, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'system@ozean-licht.dev',
    'System',
    true,
    true,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify successful migration:

-- List all tables
-- \dt

-- Count tables created (should be 6)
-- SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';

-- Verify users table structure
-- \d users

-- Verify indexes
-- \di

-- ============================================
-- ROLLBACK SQL (DEVELOPMENT ONLY)
-- ============================================
-- WARNING: This will delete all authentication data!
-- Uncomment to rollback:

/*
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_user_entities_updated_at ON user_entities;
DROP TRIGGER IF EXISTS update_oauth_accounts_updated_at ON oauth_accounts;
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS email_verification_tokens CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS oauth_accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_entities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
*/
