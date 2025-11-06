-- Migration: Create Storage Metadata Table
-- Description: Create table to track file metadata for MinIO storage
-- Database: shared_users_db
-- Date: 2025-11-02
-- Issue: #13 - MinIO S3 Storage Integration

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage metadata table
CREATE TABLE IF NOT EXISTS admin_storage_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- File identification
    file_key VARCHAR(500) NOT NULL UNIQUE,
    bucket_name VARCHAR(100) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,

    -- File properties
    content_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    checksum_md5 VARCHAR(32),

    -- Entity scoping
    entity_scope VARCHAR(50) NOT NULL CHECK (entity_scope IN ('kids_ascension', 'ozean_licht', 'shared')),

    -- Ownership & audit
    uploaded_by UUID NOT NULL REFERENCES admin_users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- File lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted', 'processing')),
    archived_to_r2 BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Metadata & tags
    metadata JSONB DEFAULT '{}',
    tags TEXT[],

    -- Constraints
    CONSTRAINT valid_file_key CHECK (file_key ~ '^[a-zA-Z0-9\-_/\.]+$'),
    CONSTRAINT valid_file_size CHECK (file_size_bytes > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_storage_bucket ON admin_storage_metadata(bucket_name);
CREATE INDEX IF NOT EXISTS idx_storage_entity ON admin_storage_metadata(entity_scope);
CREATE INDEX IF NOT EXISTS idx_storage_uploader ON admin_storage_metadata(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_storage_status ON admin_storage_metadata(status);
CREATE INDEX IF NOT EXISTS idx_storage_uploaded_at ON admin_storage_metadata(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_storage_metadata_gin ON admin_storage_metadata USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_storage_tags_gin ON admin_storage_metadata USING GIN (tags);

-- Add comments for documentation
COMMENT ON TABLE admin_storage_metadata IS 'Metadata tracking for files stored in MinIO, enabling audit trail and lifecycle management';
COMMENT ON COLUMN admin_storage_metadata.file_key IS 'Unique identifier for file in MinIO (bucket + path)';
COMMENT ON COLUMN admin_storage_metadata.bucket_name IS 'MinIO bucket name where file is stored';
COMMENT ON COLUMN admin_storage_metadata.original_filename IS 'Original filename when uploaded';
COMMENT ON COLUMN admin_storage_metadata.content_type IS 'MIME type of the file';
COMMENT ON COLUMN admin_storage_metadata.file_size_bytes IS 'File size in bytes';
COMMENT ON COLUMN admin_storage_metadata.checksum_md5 IS 'MD5 checksum for file integrity verification';
COMMENT ON COLUMN admin_storage_metadata.entity_scope IS 'Entity this file belongs to (kids_ascension, ozean_licht, or shared)';
COMMENT ON COLUMN admin_storage_metadata.uploaded_by IS 'Admin user who uploaded the file';
COMMENT ON COLUMN admin_storage_metadata.uploaded_at IS 'Timestamp when file was uploaded';
COMMENT ON COLUMN admin_storage_metadata.status IS 'File lifecycle status';
COMMENT ON COLUMN admin_storage_metadata.archived_to_r2 IS 'Whether file has been archived to Cloudflare R2';
COMMENT ON COLUMN admin_storage_metadata.archived_at IS 'Timestamp when file was archived to R2';
COMMENT ON COLUMN admin_storage_metadata.deleted_at IS 'Timestamp when file was soft deleted';
COMMENT ON COLUMN admin_storage_metadata.metadata IS 'Custom metadata (e.g., video duration, image dimensions)';
COMMENT ON COLUMN admin_storage_metadata.tags IS 'Searchable tags for categorization';

-- Grant permissions to admin role
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_storage_metadata TO admin_role;
GRANT USAGE ON SEQUENCE admin_storage_metadata_id_seq TO admin_role;

-- Insert initial data (if needed)
-- None for this migration

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration 002_create_storage_metadata.sql completed successfully';
END $$;

-- Rollback instructions:
-- To rollback this migration, run the following SQL:
-- DROP TABLE IF EXISTS admin_storage_metadata CASCADE;
-- DROP EXTENSION IF EXISTS "uuid-ossp";
