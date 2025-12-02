-- Migration: Seed Content Production Reference Data
-- Part of Project Management MVP v2.0 - Content Production Focus
-- Created: 2025-12-02

-- ============================================
-- PHASE 1.2: SEED WORKFLOW DEFINITIONS
-- ============================================

-- Video Production Workflow (default for video content type)
INSERT INTO workflow_definitions (id, name, description, project_type, is_default)
VALUES (
  'a1b2c3d4-e5f6-4789-abcd-000000000001',
  'Video Production',
  'Standard workflow for creating and publishing video content to YouTube and website',
  'video',
  true
) ON CONFLICT DO NOTHING;

-- Course Creation Workflow
INSERT INTO workflow_definitions (id, name, description, project_type, is_default)
VALUES (
  'a1b2c3d4-e5f6-4789-abcd-000000000002',
  'Course Creation',
  'Workflow for developing course modules with structured learning content',
  'course',
  true
) ON CONFLICT DO NOTHING;

-- Blog Publishing Workflow
INSERT INTO workflow_definitions (id, name, description, project_type, is_default)
VALUES (
  'a1b2c3d4-e5f6-4789-abcd-000000000003',
  'Blog Publishing',
  'Workflow for writing, editing, and publishing blog articles and newsletters',
  'blog',
  true
) ON CONFLICT DO NOTHING;

-- General Task Workflow (default fallback)
INSERT INTO workflow_definitions (id, name, description, project_type, is_default)
VALUES (
  'a1b2c3d4-e5f6-4789-abcd-000000000004',
  'General Tasks',
  'Default workflow for general project tasks',
  'general',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- PHASE 1.2: SEED WORKFLOW STATUSES
-- ============================================

-- Video Production Workflow Statuses
INSERT INTO workflow_statuses (id, workflow_id, name, slug, color, icon, order_index, is_start_state, is_done_state) VALUES
  ('b1c2d3e4-f5a6-4789-abcd-100000000001', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Script Draft', 'script_draft', '#6b7280', 'file-text', 1, true, false),
  ('b1c2d3e4-f5a6-4789-abcd-100000000002', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Script Review', 'script_review', '#8b5cf6', 'eye', 2, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-100000000003', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Voice Recording', 'voice_recording', '#f97316', 'mic', 3, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-100000000004', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Video Editing', 'video_editing', '#eab308', 'video', 4, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-100000000005', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Thumbnail Creation', 'thumbnail', '#ec4899', 'image', 5, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-100000000006', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Final Review', 'final_review', '#3b82f6', 'check-circle', 6, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-100000000007', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Ready to Publish', 'ready_to_publish', '#0ec2bc', 'upload', 7, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-100000000008', 'a1b2c3d4-e5f6-4789-abcd-000000000001', 'Published', 'published', '#22c55e', 'check', 8, false, true)
ON CONFLICT (workflow_id, slug) DO NOTHING;

-- Course Creation Workflow Statuses
INSERT INTO workflow_statuses (id, workflow_id, name, slug, color, icon, order_index, is_start_state, is_done_state) VALUES
  ('b1c2d3e4-f5a6-4789-abcd-200000000001', 'a1b2c3d4-e5f6-4789-abcd-000000000002', 'Outline', 'outline', '#6b7280', 'list', 1, true, false),
  ('b1c2d3e4-f5a6-4789-abcd-200000000002', 'a1b2c3d4-e5f6-4789-abcd-000000000002', 'Content Writing', 'content_writing', '#8b5cf6', 'edit-3', 2, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-200000000003', 'a1b2c3d4-e5f6-4789-abcd-000000000002', 'Media Production', 'media_production', '#f97316', 'video', 3, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-200000000004', 'a1b2c3d4-e5f6-4789-abcd-000000000002', 'Review & Feedback', 'review_feedback', '#3b82f6', 'message-circle', 4, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-200000000005', 'a1b2c3d4-e5f6-4789-abcd-000000000002', 'Revisions', 'revisions', '#eab308', 'refresh-cw', 5, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-200000000006', 'a1b2c3d4-e5f6-4789-abcd-000000000002', 'Final Approval', 'final_approval', '#0ec2bc', 'shield-check', 6, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-200000000007', 'a1b2c3d4-e5f6-4789-abcd-000000000002', 'Published', 'published', '#22c55e', 'check', 7, false, true)
ON CONFLICT (workflow_id, slug) DO NOTHING;

-- Blog Publishing Workflow Statuses
INSERT INTO workflow_statuses (id, workflow_id, name, slug, color, icon, order_index, is_start_state, is_done_state) VALUES
  ('b1c2d3e4-f5a6-4789-abcd-300000000001', 'a1b2c3d4-e5f6-4789-abcd-000000000003', 'Draft', 'draft', '#6b7280', 'file', 1, true, false),
  ('b1c2d3e4-f5a6-4789-abcd-300000000002', 'a1b2c3d4-e5f6-4789-abcd-000000000003', 'Writing', 'writing', '#8b5cf6', 'pen-tool', 2, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-300000000003', 'a1b2c3d4-e5f6-4789-abcd-000000000003', 'Editorial Review', 'editorial_review', '#f97316', 'eye', 3, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-300000000004', 'a1b2c3d4-e5f6-4789-abcd-000000000003', 'SEO Optimization', 'seo', '#eab308', 'search', 4, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-300000000005', 'a1b2c3d4-e5f6-4789-abcd-000000000003', 'Scheduled', 'scheduled', '#3b82f6', 'calendar', 5, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-300000000006', 'a1b2c3d4-e5f6-4789-abcd-000000000003', 'Published', 'published', '#22c55e', 'check', 6, false, true)
ON CONFLICT (workflow_id, slug) DO NOTHING;

-- General Tasks Workflow Statuses
INSERT INTO workflow_statuses (id, workflow_id, name, slug, color, icon, order_index, is_start_state, is_done_state) VALUES
  ('b1c2d3e4-f5a6-4789-abcd-400000000001', 'a1b2c3d4-e5f6-4789-abcd-000000000004', 'Backlog', 'backlog', '#6b7280', 'inbox', 1, true, false),
  ('b1c2d3e4-f5a6-4789-abcd-400000000002', 'a1b2c3d4-e5f6-4789-abcd-000000000004', 'To Do', 'todo', '#3b82f6', 'circle', 2, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-400000000003', 'a1b2c3d4-e5f6-4789-abcd-000000000004', 'In Progress', 'in_progress', '#eab308', 'loader', 3, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-400000000004', 'a1b2c3d4-e5f6-4789-abcd-000000000004', 'Review', 'review', '#8b5cf6', 'eye', 4, false, false),
  ('b1c2d3e4-f5a6-4789-abcd-400000000005', 'a1b2c3d4-e5f6-4789-abcd-000000000004', 'Done', 'done', '#22c55e', 'check', 5, false, true),
  ('b1c2d3e4-f5a6-4789-abcd-400000000006', 'a1b2c3d4-e5f6-4789-abcd-000000000004', 'Blocked', 'blocked', '#ef4444', 'alert-circle', 6, false, false)
ON CONFLICT (workflow_id, slug) DO NOTHING;

-- ============================================
-- PHASE 1.2: SEED CONTENT TYPES
-- ============================================

INSERT INTO content_types (id, name, slug, description, icon, platforms, estimated_duration_days, default_workflow_id) VALUES
  ('c1d2e3f4-a5b6-4789-abcd-000000000001', 'Video', 'video', 'Video content for YouTube and website', 'video', ARRAY['youtube', 'website'], 14, 'a1b2c3d4-e5f6-4789-abcd-000000000001'),
  ('c1d2e3f4-a5b6-4789-abcd-000000000002', 'Blog Article', 'blog', 'Written articles for website and newsletter', 'file-text', ARRAY['website', 'newsletter'], 5, 'a1b2c3d4-e5f6-4789-abcd-000000000003'),
  ('c1d2e3f4-a5b6-4789-abcd-000000000003', 'Course Module', 'course_module', 'Educational course content with lessons', 'graduation-cap', ARRAY['website'], 30, 'a1b2c3d4-e5f6-4789-abcd-000000000002'),
  ('c1d2e3f4-a5b6-4789-abcd-000000000004', 'Guided Meditation', 'meditation', 'Guided meditation audio/video', 'heart', ARRAY['youtube', 'website', 'spotify'], 7, 'a1b2c3d4-e5f6-4789-abcd-000000000001'),
  ('c1d2e3f4-a5b6-4789-abcd-000000000005', 'Social Post', 'social', 'Short-form content for social media', 'share-2', ARRAY['instagram', 'facebook', 'youtube_shorts'], 1, NULL),
  ('c1d2e3f4-a5b6-4789-abcd-000000000006', 'Newsletter', 'newsletter', 'Email newsletter content', 'mail', ARRAY['email'], 3, 'a1b2c3d4-e5f6-4789-abcd-000000000003'),
  ('c1d2e3f4-a5b6-4789-abcd-000000000007', 'Podcast Episode', 'podcast', 'Podcast audio content', 'mic', ARRAY['spotify', 'apple_podcasts', 'website'], 7, 'a1b2c3d4-e5f6-4789-abcd-000000000001')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PHASE 1.2: SEED PROJECT ROLES
-- ============================================

INSERT INTO project_roles (id, name, slug, description, icon, color, permissions, sort_order) VALUES
  ('d1e2f3a4-b5c6-4789-abcd-000000000001', 'Content Creator', 'creator', 'Creates scripts, outlines, and drafts', 'pen-tool', '#8b5cf6', '{"tasks.create": true, "tasks.edit": true}', 1),
  ('d1e2f3a4-b5c6-4789-abcd-000000000002', 'Editor', 'editor', 'Edits and refines content', 'edit-3', '#3b82f6', '{"tasks.edit": true, "content.approve": true}', 2),
  ('d1e2f3a4-b5c6-4789-abcd-000000000003', 'Video Producer', 'video_producer', 'Produces and edits video content', 'video', '#f97316', '{"tasks.edit": true, "media.upload": true}', 3),
  ('d1e2f3a4-b5c6-4789-abcd-000000000004', 'Voice Artist', 'voice_artist', 'Records voiceovers and narration', 'mic', '#ec4899', '{"tasks.edit": true, "media.upload": true}', 4),
  ('d1e2f3a4-b5c6-4789-abcd-000000000005', 'Translator', 'translator', 'Translates content to other languages', 'languages', '#0ea5e9', '{"tasks.edit": true, "content.create": true}', 5),
  ('d1e2f3a4-b5c6-4789-abcd-000000000006', 'Reviewer', 'reviewer', 'Reviews and approves content', 'check-circle', '#22c55e', '{"content.approve": true, "tasks.edit": true}', 6),
  ('d1e2f3a4-b5c6-4789-abcd-000000000007', 'Publisher', 'publisher', 'Publishes content to platforms', 'upload', '#0ec2bc', '{"content.publish": true, "tasks.edit": true}', 7),
  ('d1e2f3a4-b5c6-4789-abcd-000000000008', 'Thumbnail Designer', 'thumbnail_designer', 'Creates thumbnails and graphics', 'image', '#f59e0b', '{"tasks.edit": true, "media.upload": true}', 8),
  ('d1e2f3a4-b5c6-4789-abcd-000000000009', 'Project Lead', 'project_lead', 'Manages project timeline and team', 'crown', '#fbbf24', '{"tasks.manage": true, "project.manage": true, "content.approve": true}', 0)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PHASE 1.2: SEED CHECKLIST TEMPLATES
-- ============================================

-- Video Production Checklist Template
INSERT INTO checklist_templates (id, name, description, task_type, content_type_id, items) VALUES
  ('e1f2a3b4-c5d6-4789-abcd-000000000001', 'Video Production Checklist', 'Standard checklist for video production workflow', 'task', 'c1d2e3f4-a5b6-4789-abcd-000000000001', '[
    {"id": "1", "title": "Script drafted and approved", "required": true, "order": 1},
    {"id": "2", "title": "Voice recording complete", "required": true, "order": 2},
    {"id": "3", "title": "Video edited with transitions", "required": true, "order": 3},
    {"id": "4", "title": "Background music added", "required": false, "order": 4},
    {"id": "5", "title": "Thumbnail created", "required": true, "order": 5},
    {"id": "6", "title": "SEO title and description ready", "required": true, "order": 6},
    {"id": "7", "title": "Tags and categories selected", "required": true, "order": 7},
    {"id": "8", "title": "Final review passed", "required": true, "order": 8}
  ]'::jsonb)
ON CONFLICT DO NOTHING;

-- Blog Article Checklist Template
INSERT INTO checklist_templates (id, name, description, task_type, content_type_id, items) VALUES
  ('e1f2a3b4-c5d6-4789-abcd-000000000002', 'Blog Article Checklist', 'Standard checklist for blog article publishing', 'task', 'c1d2e3f4-a5b6-4789-abcd-000000000002', '[
    {"id": "1", "title": "Outline approved", "required": true, "order": 1},
    {"id": "2", "title": "First draft complete", "required": true, "order": 2},
    {"id": "3", "title": "Editorial review passed", "required": true, "order": 3},
    {"id": "4", "title": "Images and media added", "required": false, "order": 4},
    {"id": "5", "title": "SEO meta tags configured", "required": true, "order": 5},
    {"id": "6", "title": "Internal links added", "required": false, "order": 6},
    {"id": "7", "title": "Final proofread complete", "required": true, "order": 7}
  ]'::jsonb)
ON CONFLICT DO NOTHING;

-- Course Module Checklist Template
INSERT INTO checklist_templates (id, name, description, task_type, content_type_id, items) VALUES
  ('e1f2a3b4-c5d6-4789-abcd-000000000003', 'Course Module Checklist', 'Standard checklist for course module creation', 'task', 'c1d2e3f4-a5b6-4789-abcd-000000000003', '[
    {"id": "1", "title": "Learning objectives defined", "required": true, "order": 1},
    {"id": "2", "title": "Lesson outline created", "required": true, "order": 2},
    {"id": "3", "title": "Content written/recorded", "required": true, "order": 3},
    {"id": "4", "title": "Quiz questions created", "required": false, "order": 4},
    {"id": "5", "title": "Supplementary materials ready", "required": false, "order": 5},
    {"id": "6", "title": "Module tested in preview", "required": true, "order": 6},
    {"id": "7", "title": "Accessibility review passed", "required": true, "order": 7}
  ]'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================
-- PHASE 1.2: SEED TASK GUIDES
-- ============================================

-- Guide for Content Creators
INSERT INTO task_guides (id, name, description, task_type, role_id, content_markdown, estimated_duration_minutes, difficulty_level) VALUES
  ('f1a2b3c4-d5e6-4789-abcd-000000000001', 'Content Creation Guide', 'Standard operating procedure for content creators', 'task', 'd1e2f3a4-b5c6-4789-abcd-000000000001', '# Content Creation Guide

## Overview
This guide outlines the standard process for creating content at Ozean Licht.

## Steps

### 1. Research Phase
- Review the content brief
- Research the topic thoroughly
- Identify key messages

### 2. Outline Creation
- Create a structured outline
- Include introduction, main points, and conclusion
- Get outline approved before proceeding

### 3. First Draft
- Write the first draft following the outline
- Focus on clarity and spiritual authenticity
- Include calls-to-action where appropriate

### 4. Review & Revision
- Self-review for grammar and flow
- Submit for editorial review
- Make requested revisions

## Quality Standards
- Ensure content aligns with Ozean Licht values
- Check for spiritual accuracy
- Verify all facts and references', 30, 'medium')
ON CONFLICT DO NOTHING;

-- Guide for Video Producers
INSERT INTO task_guides (id, name, description, task_type, role_id, content_markdown, estimated_duration_minutes, difficulty_level) VALUES
  ('f1a2b3c4-d5e6-4789-abcd-000000000002', 'Video Production Guide', 'Standard operating procedure for video producers', 'task', 'd1e2f3a4-b5c6-4789-abcd-000000000003', '# Video Production Guide

## Overview
This guide covers the video production process for Ozean Licht content.

## Pre-Production
1. Receive approved script
2. Plan visual elements
3. Prepare recording environment

## Production
1. Record voice-over with high-quality audio
2. Capture any necessary B-roll
3. Ensure proper lighting and framing

## Post-Production
1. Edit video following brand guidelines
2. Add transitions and effects
3. Include background music (royalty-free)
4. Create thumbnail
5. Export in proper format

## Technical Specs
- Resolution: 1920x1080 minimum
- Frame rate: 30fps
- Audio: -6dB to -3dB
- Format: MP4 (H.264)', 120, 'medium')
ON CONFLICT DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE workflow_definitions IS 'Seeded with 4 default workflows: Video, Course, Blog, General';
COMMENT ON TABLE workflow_statuses IS 'Seeded with statuses for each workflow type';
COMMENT ON TABLE content_types IS 'Seeded with 7 content types for Ozean Licht content production';
COMMENT ON TABLE project_roles IS 'Seeded with 9 content production roles';
COMMENT ON TABLE checklist_templates IS 'Seeded with 3 checklist templates for common content types';
COMMENT ON TABLE task_guides IS 'Seeded with 2 initial task guides for content creation';
