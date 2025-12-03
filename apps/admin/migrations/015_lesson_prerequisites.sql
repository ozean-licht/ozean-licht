-- Migration: 015_lesson_prerequisites.sql
-- Description: Add lesson prerequisites and module unlock rules for learning sequences
-- Part of Phase 9: Learning Sequences

-- =====================================================
-- 1. LESSON PREREQUISITES TABLE
-- =====================================================
-- Defines which lessons must be completed before accessing another lesson

CREATE TABLE IF NOT EXISTS lesson_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  required_lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  -- Type of prerequisite requirement
  type TEXT NOT NULL DEFAULT 'completion' CHECK (type IN ('completion', 'passing_score', 'viewed')),
  -- For passing_score type: minimum score required (0-100)
  min_score INTEGER CHECK (min_score IS NULL OR (min_score >= 0 AND min_score <= 100)),
  -- Order of prerequisites (for display)
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate prerequisite relationships
  UNIQUE(lesson_id, required_lesson_id),
  -- Prevent self-references
  CHECK (lesson_id != required_lesson_id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_prerequisites_lesson ON lesson_prerequisites(lesson_id);
CREATE INDEX IF NOT EXISTS idx_prerequisites_required ON lesson_prerequisites(required_lesson_id);
CREATE INDEX IF NOT EXISTS idx_prerequisites_type ON lesson_prerequisites(type);

-- =====================================================
-- 2. MODULE UNLOCK RULES TABLE
-- =====================================================
-- Defines conditions for unlocking entire modules

CREATE TABLE IF NOT EXISTS module_unlock_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  -- Type of unlock rule
  rule_type TEXT NOT NULL CHECK (rule_type IN (
    'always_unlocked',       -- Module is always accessible
    'sequential',            -- Previous module must be completed
    'specific_module',       -- Specific module must be completed
    'lesson_count',          -- Complete N lessons from previous modules
    'percentage_complete',   -- Complete N% of previous content
    'date_based'             -- Unlock on specific date (uses drip_schedules)
  )),
  -- For specific_module type: which module must be completed
  required_module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  -- For lesson_count type: minimum lessons required
  required_lesson_count INTEGER CHECK (required_lesson_count IS NULL OR required_lesson_count >= 0),
  -- For percentage_complete type: minimum percentage required (0-100)
  required_percentage INTEGER CHECK (required_percentage IS NULL OR (required_percentage >= 0 AND required_percentage <= 100)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- One rule per module
  UNIQUE(module_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_unlock_rules_module ON module_unlock_rules(module_id);
CREATE INDEX IF NOT EXISTS idx_unlock_rules_type ON module_unlock_rules(rule_type);

-- =====================================================
-- 3. COURSE COMPLETION RULES TABLE
-- =====================================================
-- Defines what constitutes course completion

CREATE TABLE IF NOT EXISTS course_completion_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  -- Type of completion rule
  rule_type TEXT NOT NULL CHECK (rule_type IN (
    'all_lessons',           -- Complete all lessons
    'required_lessons',      -- Complete all required lessons only
    'percentage',            -- Complete N% of lessons
    'specific_lessons',      -- Complete specific marked lessons
    'quiz_average'           -- Achieve minimum quiz average
  )),
  -- For percentage type: minimum percentage required (0-100)
  required_percentage INTEGER CHECK (required_percentage IS NULL OR (required_percentage >= 0 AND required_percentage <= 100)),
  -- For quiz_average type: minimum average score (0-100)
  min_quiz_score INTEGER CHECK (min_quiz_score IS NULL OR (min_quiz_score >= 0 AND min_quiz_score <= 100)),
  -- Whether certificate is issued on completion
  issue_certificate BOOLEAN DEFAULT false,
  -- Custom completion message
  completion_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- One rule set per course
  UNIQUE(course_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_completion_rules_course ON course_completion_rules(course_id);

-- =====================================================
-- 4. UPDATE TRIGGERS
-- =====================================================

-- Update timestamp trigger for lesson_prerequisites
CREATE OR REPLACE FUNCTION update_lesson_prerequisites_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_lesson_prerequisites_timestamp ON lesson_prerequisites;
CREATE TRIGGER trigger_update_lesson_prerequisites_timestamp
  BEFORE UPDATE ON lesson_prerequisites
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_prerequisites_timestamp();

-- Update timestamp trigger for module_unlock_rules
CREATE OR REPLACE FUNCTION update_module_unlock_rules_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_module_unlock_rules_timestamp ON module_unlock_rules;
CREATE TRIGGER trigger_update_module_unlock_rules_timestamp
  BEFORE UPDATE ON module_unlock_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_module_unlock_rules_timestamp();

-- Update timestamp trigger for course_completion_rules
CREATE OR REPLACE FUNCTION update_course_completion_rules_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_course_completion_rules_timestamp ON course_completion_rules;
CREATE TRIGGER trigger_update_course_completion_rules_timestamp
  BEFORE UPDATE ON course_completion_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_course_completion_rules_timestamp();

-- =====================================================
-- 5. HELPER FUNCTION: Check for circular dependencies
-- =====================================================

CREATE OR REPLACE FUNCTION check_prerequisite_cycle(
  p_lesson_id UUID,
  p_required_lesson_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  has_cycle BOOLEAN;
BEGIN
  -- Check if adding this prerequisite would create a cycle
  -- Explicit UUID casting for defense in depth
  WITH RECURSIVE prereq_chain AS (
    -- Start with the required lesson
    SELECT required_lesson_id as lesson_id, 1 as depth
    FROM lesson_prerequisites
    WHERE lesson_id = p_required_lesson_id::UUID

    UNION ALL

    -- Follow the chain
    SELECT lp.required_lesson_id, pc.depth + 1
    FROM prereq_chain pc
    JOIN lesson_prerequisites lp ON lp.lesson_id = pc.lesson_id::UUID
    WHERE pc.depth < 50  -- Prevent infinite loops
  )
  SELECT EXISTS (
    SELECT 1 FROM prereq_chain WHERE lesson_id = p_lesson_id::UUID
  ) INTO has_cycle;

  RETURN has_cycle;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. VALIDATION TRIGGER: Prevent circular prerequisites
-- =====================================================

CREATE OR REPLACE FUNCTION validate_prerequisite_no_cycle()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this would create a circular dependency
  IF check_prerequisite_cycle(NEW.lesson_id, NEW.required_lesson_id) THEN
    RAISE EXCEPTION 'Adding this prerequisite would create a circular dependency';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validate_prerequisite_no_cycle ON lesson_prerequisites;
CREATE TRIGGER trigger_validate_prerequisite_no_cycle
  BEFORE INSERT OR UPDATE ON lesson_prerequisites
  FOR EACH ROW
  EXECUTE FUNCTION validate_prerequisite_no_cycle();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE lesson_prerequisites IS 'Defines which lessons must be completed before accessing another lesson';
COMMENT ON TABLE module_unlock_rules IS 'Defines conditions for unlocking entire modules';
COMMENT ON TABLE course_completion_rules IS 'Defines what constitutes course completion';

COMMENT ON COLUMN lesson_prerequisites.type IS 'completion=lesson completed, passing_score=quiz passed, viewed=lesson viewed';
COMMENT ON COLUMN module_unlock_rules.rule_type IS 'Type of unlock condition';
COMMENT ON COLUMN course_completion_rules.rule_type IS 'Type of completion requirement';
