Current State Assessment
You have videos scattered across three sources:

Ozean Cloud (Google Drive) — master files, but nested and hard to navigate
YouTube — free content, public-facing
Vimeo — current paid content delivery

This fragmentation is common but creates operational friction. A centralized VMS becomes your single source of truth.
Core VMS Architecture
The fundamental principle: Your database is the authority, external services are just storage/delivery endpoints.
┌─────────────────────────────────────────────────────┐
│              Video Management System                 │
│                  (Your Database)                     │
├─────────────────────────────────────────────────────┤
│  Video Record                                        │
│  ├── Metadata (title, description, tags, etc.)      │
│  ├── Source Files (links to Ozean Cloud masters)    │
│  ├── Distribution Endpoints                         │
│  │   ├── Vimeo ID + Status                          │
│  │   ├── YouTube ID + Status (if public)            │
│  │   └── Hetzner HLS URL (future self-hosted)       │
│  ├── Content Pipeline Status                        │
│  └── Project Connection (PM system link)            │
└─────────────────────────────────────────────────────┘
Essential Features for Smooth Operations
1. Unified Video Library View

Single dashboard showing ALL videos regardless of where they're hosted
Filter by: status (draft/processing/published), course, category, platform
Search across titles, descriptions, tags, transcripts

2. Ingestion & Sync Workflow

Import existing Vimeo library (their API exposes full metadata)
Map YouTube videos to internal records
Google Drive folder scanner to identify untracked masters

3. Content Pipeline Integration
This is where it connects to your PM system:
Video Lifecycle States:
──────────────────────────────────────────
Raw Recording → Editing → Review → Approved → 
Processing → Published → Archived
──────────────────────────────────────────
         ↑
    PM System Task Links
Each video can link to a project/task in your PM system. When Lia finishes recording, someone creates the video record, it flows through editing, and the VMS tracks where it is.
4. Smart Metadata Management

Bulk tagging and categorization
Course/module assignment (drag-drop organization)
Thumbnail management (auto-generated options + custom upload)
Multi-language support for titles/descriptions (given your translation pipeline work)

5. Distribution Control Panel

See at a glance: "This video is on Vimeo (private), not on YouTube"
One-click actions: "Publish to YouTube as unlisted"
Privacy/access level management per platform

6. Analytics Aggregation

Pull view counts, watch time from Vimeo/YouTube APIs
Unified dashboard: "Which content performs best?"
Identify underperforming content for optimization

Database Schema (Core Tables)
sqlvideos
├── id, uuid
├── title, description, tags[]
├── duration_seconds
├── master_file_url (Google Drive link)
├── thumbnail_url
├── status (draft|processing|published|archived)
├── visibility (public|unlisted|private|paid)
├── course_id (FK)
├── module_id (FK)
├── sort_order
├── created_at, updated_at, published_at

video_platforms
├── video_id (FK)
├── platform (vimeo|youtube|hetzner|etc)
├── external_id
├── external_url
├── status (pending|processing|ready|failed)
├── privacy_level
├── synced_at

video_analytics (daily snapshots)
├── video_id, platform, date
├── views, watch_time_minutes, likes, comments

video_pipeline_links
├── video_id (FK)
├── pm_system (your PM tool)
├── project_id, task_id
├── pipeline_stage
Admin Dashboard Modules
Videos Overview — Card/table view with filters, search, bulk actions
Video Detail View — All metadata, platform status, analytics, pipeline status, edit capabilities
Courses & Organization — Drag-drop module builder, curriculum structure
Import Tools — Vimeo sync, YouTube sync, Drive scanner
Content Pipeline — Kanban view of videos by production stage, linked to PM