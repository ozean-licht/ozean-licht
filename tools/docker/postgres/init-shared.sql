-- ============================================
-- Shared Users Database Initialization
-- Docker Entry Point Script
-- ============================================
-- This script runs automatically when the Docker container
-- is first created. It initializes the shared_users_db database
-- with all required tables, indexes, and triggers.
--
-- Database: shared_users_db
-- Port: 5430
-- Container: ozean-postgres-shared
--
-- Note: This file is mounted at /docker-entrypoint-initdb.d/
-- ============================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '  Initializing shared_users_db (Phase 0: Foundation)'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

-- Database is already created by POSTGRES_DB environment variable
-- Connect to it (just for clarity, already connected)
-- \c shared_users_db

\echo '[1/6] Creating users table...'

-- ============================================
-- USERS TABLE
-- ============================================
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

\echo '[2/6] Creating user_entities table...'

-- ============================================
-- USER_ENTITIES TABLE
-- ============================================
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
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id, entity_type),
    CONSTRAINT valid_entity_type CHECK (entity_type IN ('KIDS_ASCENSION', 'OZEAN_LICHT')),
    CONSTRAINT valid_role CHECK (role IN ('USER', 'CREATOR', 'EDUCATOR', 'ADMIN', 'MODERATOR', 'SUPPORT'))
);

\echo '[3/6] Creating sessions and OAuth tables...'

-- ============================================
-- SESSIONS TABLE
-- ============================================
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
CREATE TABLE IF NOT EXISTS oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
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

    -- Constraints
    UNIQUE(user_id, provider),
    UNIQUE(provider, provider_account_id)
);

\echo '[4/6] Creating security token tables...'

-- ============================================
-- PASSWORD_RESET_TOKENS TABLE
-- ============================================
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
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

\echo '[5/6] Creating indexes and triggers...'

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
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_entities_updated_at ON user_entities;
CREATE TRIGGER update_user_entities_updated_at BEFORE UPDATE ON user_entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_oauth_accounts_updated_at ON oauth_accounts;
CREATE TRIGGER update_oauth_accounts_updated_at BEFORE UPDATE ON oauth_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\echo '[6/6] Inserting seed data...'

-- ============================================
-- SEED DATA
-- ============================================
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

\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '✓ shared_users_db initialization complete!'
\echo ''
\echo 'Tables created:'
\echo '  • users'
\echo '  • user_entities'
\echo '  • sessions'
\echo '  • oauth_accounts'
\echo '  • password_reset_tokens'
\echo '  • email_verification_tokens'
\echo ''
\echo 'Ready for Phase 1: Kids Ascension Integration'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
