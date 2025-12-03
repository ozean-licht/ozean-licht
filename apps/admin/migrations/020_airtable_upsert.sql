-- Migration 020: Add unique constraint on airtable_id for upsert operations
-- This allows INSERT ... ON CONFLICT to work properly for Airtable course reimports
--
-- Purpose:
-- - Enable idempotent course imports from Airtable
-- - Allow updating existing courses when reimporting
-- - Improve query performance for airtable_id lookups
--
-- Dependency: 010_create_content_tables.sql (courses table must exist)

-- Add unique constraint on airtable_id (idempotent check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'courses_airtable_id_unique'
  ) THEN
    ALTER TABLE courses ADD CONSTRAINT courses_airtable_id_unique UNIQUE (airtable_id);
    RAISE NOTICE 'Added unique constraint: courses_airtable_id_unique';
  ELSE
    RAISE NOTICE 'Unique constraint already exists: courses_airtable_id_unique';
  END IF;
END $$;

-- Add index for faster airtable_id lookups (idempotent)
CREATE INDEX IF NOT EXISTS idx_courses_airtable_id ON courses(airtable_id)
WHERE airtable_id IS NOT NULL;

-- Verify the constraint was added
DO $$
DECLARE
  constraint_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO constraint_count
  FROM pg_constraint
  WHERE conname = 'courses_airtable_id_unique';

  IF constraint_count = 0 THEN
    RAISE EXCEPTION 'Failed to create unique constraint on airtable_id';
  END IF;

  RAISE NOTICE 'Migration 020 completed successfully';
END $$;
