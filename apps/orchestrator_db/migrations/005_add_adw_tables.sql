-- Migration: Add ADW workflow tables
-- Created: 2025-11-09
-- Description: Add tables for ADW workflow state, events, and agent outputs
-- Author: Migration Script
-- References: specs/typescript-migration-phase1-plan.md

BEGIN;

-- =====================================================================
-- 1. ADW Workflows Table
-- =====================================================================
-- Core table for tracking ADW workflow state
-- Each workflow has a unique 8-character ID and tracks the entire
-- lifecycle from initialization through completion

CREATE TABLE IF NOT EXISTS adw_workflows (
    -- Identity
    adw_id VARCHAR(8) PRIMARY KEY,
    issue_number INTEGER NOT NULL,

    -- Workflow metadata
    workflow_type VARCHAR(50) NOT NULL,  -- 'plan', 'build', 'test', 'sdlc', etc.
    phase VARCHAR(50) NOT NULL DEFAULT 'initialized',  -- 'planned', 'built', 'tested', etc.
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- 'active', 'completed', 'failed', 'cancelled'

    -- GitHub integration
    branch_name VARCHAR(255),
    pr_number INTEGER,
    issue_title TEXT,
    issue_body TEXT,
    issue_class VARCHAR(50),  -- 'feature', 'bug', 'chore'

    -- Git worktree
    worktree_path TEXT,
    worktree_exists BOOLEAN DEFAULT true,

    -- Port allocation (9100-9114 backend, 9200-9214 frontend)
    backend_port INTEGER,
    frontend_port INTEGER,

    -- Model configuration
    model_set VARCHAR(10) DEFAULT 'base',  -- 'base' or 'heavy'

    -- Files and outputs
    plan_file TEXT,

    -- Tracking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_adw_workflows_issue_number ON adw_workflows(issue_number);
CREATE INDEX IF NOT EXISTS idx_adw_workflows_status ON adw_workflows(status);
CREATE INDEX IF NOT EXISTS idx_adw_workflows_workflow_type ON adw_workflows(workflow_type);
CREATE INDEX IF NOT EXISTS idx_adw_workflows_created_at ON adw_workflows(created_at);

-- =====================================================================
-- 2. ADW Workflow Events Table
-- =====================================================================
-- Event log for tracking workflow progress and debugging
-- Captures all significant events during workflow execution

CREATE TABLE IF NOT EXISTS adw_workflow_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adw_id VARCHAR(8) NOT NULL REFERENCES adw_workflows(adw_id) ON DELETE CASCADE,

    -- Event details
    event_type VARCHAR(50) NOT NULL,  -- 'phase_started', 'phase_completed', 'error', 'tool_use', etc.
    event_subtype VARCHAR(50),
    phase VARCHAR(50),  -- 'plan', 'build', 'test', 'review', 'document', 'ship'

    -- Event data
    message TEXT,
    data JSONB,

    -- Tracking
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_adw_workflow_events_adw_id ON adw_workflow_events(adw_id);
CREATE INDEX IF NOT EXISTS idx_adw_workflow_events_event_type ON adw_workflow_events(event_type);
CREATE INDEX IF NOT EXISTS idx_adw_workflow_events_created_at ON adw_workflow_events(created_at);

-- =====================================================================
-- 3. ADW Agent Outputs Table
-- =====================================================================
-- Stores agent execution outputs for each workflow phase
-- Replaces the previous JSONL file-based storage

CREATE TABLE IF NOT EXISTS adw_agent_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adw_id VARCHAR(8) NOT NULL REFERENCES adw_workflows(adw_id) ON DELETE CASCADE,

    -- Agent details
    agent_name VARCHAR(100) NOT NULL,  -- 'planner', 'implementor', 'tester', etc.
    phase VARCHAR(50) NOT NULL,

    -- Output data
    session_id TEXT,
    model VARCHAR(50),
    output_text TEXT,
    output_jsonl JSONB,  -- Structured output data from Agent SDK

    -- Metadata
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Tracking
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_adw_agent_outputs_adw_id ON adw_agent_outputs(adw_id);
CREATE INDEX IF NOT EXISTS idx_adw_agent_outputs_agent_name ON adw_agent_outputs(agent_name);
CREATE INDEX IF NOT EXISTS idx_adw_agent_outputs_phase ON adw_agent_outputs(phase);

-- =====================================================================
-- 4. Extend Orchestrator Agents Table
-- =====================================================================
-- Add metadata JSONB column for storing system information
-- Will store: system_message_info, slash_commands, agent_templates, adw_enabled

ALTER TABLE orchestrator_agents
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- =====================================================================
-- 5. Add Comments for Documentation
-- =====================================================================

COMMENT ON TABLE adw_workflows IS 'Core ADW workflow state tracking';
COMMENT ON COLUMN adw_workflows.adw_id IS 'Unique 8-character workflow identifier';
COMMENT ON COLUMN adw_workflows.workflow_type IS 'Type of workflow: plan, build, test, sdlc, etc.';
COMMENT ON COLUMN adw_workflows.phase IS 'Current workflow phase: planned, built, tested, etc.';
COMMENT ON COLUMN adw_workflows.status IS 'Workflow status: active, completed, failed, cancelled';

COMMENT ON TABLE adw_workflow_events IS 'Event log for workflow progress tracking';
COMMENT ON COLUMN adw_workflow_events.event_type IS 'Event type: phase_started, phase_completed, error, tool_use, etc.';
COMMENT ON COLUMN adw_workflow_events.data IS 'Flexible JSONB field for event-specific data';

COMMENT ON TABLE adw_agent_outputs IS 'Agent execution outputs for each workflow phase';
COMMENT ON COLUMN adw_agent_outputs.output_jsonl IS 'Structured Agent SDK output data';

-- =====================================================================
-- 6. Sample Data (for development only)
-- =====================================================================
-- Uncomment to insert sample workflow for testing

-- INSERT INTO adw_workflows (
--     adw_id,
--     issue_number,
--     workflow_type,
--     phase,
--     status,
--     issue_title,
--     issue_class,
--     model_set
-- ) VALUES (
--     'test1234',
--     999,
--     'sdlc',
--     'initialized',
--     'active',
--     'Sample workflow for testing',
--     'feature',
--     'base'
-- );

COMMIT;

-- Verification queries
-- SELECT COUNT(*) FROM adw_workflows;
-- SELECT COUNT(*) FROM adw_workflow_events;
-- SELECT COUNT(*) FROM adw_agent_outputs;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'adw_workflows';
