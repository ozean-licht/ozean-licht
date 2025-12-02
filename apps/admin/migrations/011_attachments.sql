-- Phase 11: Task Attachments
-- Migration for file attachments on tasks
-- Supports images, PDFs, documents, and other file types

-- Create task_attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_key VARCHAR(500), -- S3/MinIO object key for deletion
  bucket VARCHAR(100) DEFAULT 'task-attachments',
  file_type VARCHAR(100), -- MIME type
  file_size_bytes BIGINT,
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  uploaded_by_name VARCHAR(255), -- Denormalized for display
  uploaded_by_email VARCHAR(255), -- Denormalized for display
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_uploaded_by ON task_attachments(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_task_attachments_created_at ON task_attachments(created_at DESC);

-- Comments for documentation
COMMENT ON TABLE task_attachments IS 'File attachments for tasks (Phase 11)';
COMMENT ON COLUMN task_attachments.file_key IS 'S3/MinIO object key for file operations';
COMMENT ON COLUMN task_attachments.bucket IS 'Storage bucket name';
COMMENT ON COLUMN task_attachments.file_type IS 'MIME type of the uploaded file';
