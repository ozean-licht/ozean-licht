const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle, 
        WidthType, ShadingType, PageNumber } = require('docx');
const fs = require('fs');

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: "1a365d", font: "Arial" },
        paragraph: { spacing: { before: 0, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "1a365d", font: "Arial" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "2d4a6f", font: "Arial" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "3d5a80", font: "Arial" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-main",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-sub",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }] },
      { reference: "numbered-phases",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-tasks",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-features",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "OZEAN LICHT — CONFIDENTIAL", size: 18, color: "666666", italics: true })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", size: 18, color: "666666" }), 
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "666666" }), 
          new TextRun({ text: " of ", size: 18, color: "666666" }), 
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "666666" })
        ]
      })] })
    },
    children: [
      // Title Section
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Video Management System")] }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER, 
        spacing: { after: 400 },
        children: [new TextRun({ text: "Technical Briefing for Agentic Implementation", size: 24, color: "666666" })] 
      }),

      // Meta Info Table
      new Table({
        columnWidths: [2340, 7020],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f0f4f8", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Project", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 7020, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Ozean Licht Video Management System")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f0f4f8", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Owner", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 7020, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Trinity Studio (Sergej)")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f0f4f8", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Timeline", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 7020, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("2-3 months (Vimeo subscription active)")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "f0f4f8", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Priority", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 7020, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("HIGH — Cost reduction & infrastructure ownership")] })] })
          ]})
        ]
      }),

      new Paragraph({ spacing: { before: 400 }, children: [] }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("Build a centralized Video Management System (VMS) that consolidates Ozean Licht's video assets from multiple platforms (Google Drive, YouTube, Vimeo) into a single source of truth. The system will enable migration from expensive Vimeo hosting to self-hosted Hetzner Object Storage with a custom encoding pipeline, while providing robust content management, analytics aggregation, and project management integration.")
      ]}),

      // Current State
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Current State Analysis")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Video Asset Distribution")] }),
      
      new Table({
        columnWidths: [2500, 3000, 3860],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "1a365d", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Platform", bold: true, color: "FFFFFF" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "1a365d", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Content Type", bold: true, color: "FFFFFF" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA }, shading: { fill: "1a365d", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Ozean Cloud (Google Drive)")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Master source files")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Nested in hard-to-find subfolders")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("YouTube")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Free public content")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Active, needs sync integration")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Vimeo")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Paid course content")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Primary delivery (HIGH COST)")] })] })
          ]})
        ]
      }),

      new Paragraph({ spacing: { before: 200 }, children: [] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Key Problems")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Video assets fragmented across three platforms with no unified view")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Vimeo subscription cost is prohibitively expensive for a startup")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Master files buried in nested Google Drive folder structures")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("No connection between video assets and production pipeline/PM system")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Analytics scattered across platforms with no unified insights")] }),

      // Architecture
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("System Architecture")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Core Principle")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The database is the single source of truth. ", bold: true }),
        new TextRun("External services (Vimeo, YouTube, Hetzner Storage) are treated as storage/delivery endpoints. Every video record in the VMS database links to its external manifestations and tracks their status independently.")
      ]}),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Architecture Diagram")] }),
      new Paragraph({ spacing: { after: 100 }, shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "┌─────────────────────────────────────────────────────┐", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│              Video Management System                │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│                (PostgreSQL Database)                │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "├─────────────────────────────────────────────────────┤", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  Video Record                                       │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  ├── Metadata (title, description, tags)           │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  ├── Source Files (Ozean Cloud master links)       │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  ├── Distribution Endpoints                        │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  │   ├── Vimeo ID + Status                         │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  │   ├── YouTube ID + Status                       │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  │   └── Hetzner HLS URL (self-hosted)             │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  ├── Content Pipeline Status                       │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "│  └── Project Management Link                       │", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "└─────────────────────────────────────────────────────┘", font: "Courier New", size: 18 })
      ]}),

      // Database Schema
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Database Schema")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Core Tables")] }),

      // videos table
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("videos")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Primary table storing all video metadata and organizational structure.")] }),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "CREATE TABLE videos (", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  title VARCHAR(255) NOT NULL,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  description TEXT,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  tags TEXT[],", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  duration_seconds INTEGER,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  master_file_url TEXT,           -- Google Drive link", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  thumbnail_url TEXT,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  status VARCHAR(50) DEFAULT 'draft',  -- draft|processing|published|archived", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  visibility VARCHAR(50) DEFAULT 'private', -- public|unlisted|private|paid", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  course_id UUID REFERENCES courses(id),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  module_id UUID REFERENCES modules(id),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  sort_order INTEGER DEFAULT 0,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  created_at TIMESTAMPTZ DEFAULT NOW(),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  updated_at TIMESTAMPTZ DEFAULT NOW(),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  published_at TIMESTAMPTZ", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: ");", font: "Courier New", size: 18 })
      ]}),

      // video_platforms table
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("video_platforms")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Tracks each video's presence and status on external platforms.")] }),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "CREATE TABLE video_platforms (", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  platform VARCHAR(50) NOT NULL,  -- vimeo|youtube|hetzner", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  external_id VARCHAR(255),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  external_url TEXT,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  status VARCHAR(50) DEFAULT 'pending', -- pending|processing|ready|failed", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  privacy_level VARCHAR(50),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  synced_at TIMESTAMPTZ,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  UNIQUE(video_id, platform)", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: ");", font: "Courier New", size: 18 })
      ]}),

      // video_analytics table
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("video_analytics")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Daily snapshots of analytics from each platform for unified reporting.")] }),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "CREATE TABLE video_analytics (", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  platform VARCHAR(50) NOT NULL,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  date DATE NOT NULL,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  views INTEGER DEFAULT 0,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  watch_time_minutes INTEGER DEFAULT 0,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  likes INTEGER DEFAULT 0,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  comments INTEGER DEFAULT 0,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  UNIQUE(video_id, platform, date)", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: ");", font: "Courier New", size: 18 })
      ]}),

      // video_pipeline_links table
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("video_pipeline_links")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Connects videos to project management tasks for production tracking.")] }),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "CREATE TABLE video_pipeline_links (", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  pm_system VARCHAR(100),         -- internal|notion|linear|etc", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  project_id VARCHAR(255),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  task_id VARCHAR(255),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  pipeline_stage VARCHAR(100)     -- recording|editing|review|approved|processing|published", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: ");", font: "Courier New", size: 18 })
      ]}),

      // encoding_jobs table
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("encoding_jobs")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Tracks FFmpeg encoding jobs for the self-hosted pipeline.")] }),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "CREATE TABLE encoding_jobs (", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  status VARCHAR(50) DEFAULT 'queued', -- queued|processing|completed|failed", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  progress INTEGER DEFAULT 0,     -- 0-100", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  input_file_url TEXT,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  output_manifest_url TEXT,       -- HLS master playlist", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  error_message TEXT,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  started_at TIMESTAMPTZ,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  completed_at TIMESTAMPTZ,", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "  created_at TIMESTAMPTZ DEFAULT NOW()", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: ");", font: "Courier New", size: 18 })
      ]}),

      // Features Section
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Feature Requirements")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. Unified Video Library")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Single dashboard view of ALL videos regardless of hosting platform")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Filter by: status (draft/processing/published/archived), course, category, platform")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Full-text search across titles, descriptions, tags")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Card view and table view toggle")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Bulk selection and bulk actions")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. Ingestion & Sync Workflows")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Vimeo API sync: Import existing library with full metadata")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("YouTube API sync: Map public videos to internal records")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Google Drive scanner: Crawl Ozean Cloud to identify untracked master files")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Manual upload: Direct file upload with drag-and-drop")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Resumable uploads: tus.io protocol for large files")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3. Content Pipeline Integration")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun("Video lifecycle states with PM system linkage:")] }),
      new Paragraph({ shading: { fill: "f5f5f5", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "Raw Recording → Editing → Review → Approved → Processing → Published → Archived", font: "Courier New", size: 18 })
      ]}),
      new Paragraph({ spacing: { before: 100 }, numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Each video can link to project/task in PM system")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Kanban view of videos by production stage")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Status change triggers (webhooks/notifications)")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4. Metadata Management")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Bulk tagging and categorization")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Course/module assignment with drag-drop curriculum builder")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Thumbnail management: auto-generated options + custom upload")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Multi-language support for titles/descriptions (DE/EN minimum)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Spiritual content tags: meditation type, energy theme, difficulty level")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5. Distribution Control Panel")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Platform status overview: \"This video is on Vimeo (private), not on YouTube\"")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("One-click distribution actions per platform")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Privacy/access level management per platform")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Migration controls: \"Move from Vimeo to Hetzner\"")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6. Self-Hosted Encoding Pipeline")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("FFmpeg-based transcoding to HLS format")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Multiple quality renditions: 360p, 480p, 720p, 1080p")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("BullMQ job queue with Redis (existing infrastructure)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Progress tracking with webhook notifications")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Output to Hetzner Object Storage")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Thumbnail sprite generation for seek preview")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7. Analytics Aggregation")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Pull metrics from Vimeo/YouTube APIs via scheduled jobs")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Unified dashboard: views, watch time, engagement by video")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Content performance insights: \"Which content performs best?\"")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Identify underperforming content for optimization")] }),

      // Technical Stack
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Technical Stack")] }),
      
      new Table({
        columnWidths: [3120, 6240],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "1a365d", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Component", bold: true, color: "FFFFFF" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: "1a365d", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Technology", bold: true, color: "FFFFFF" })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Database")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("PostgreSQL (existing infrastructure)")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Job Queue")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("BullMQ + Redis (existing infrastructure)")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Video Storage")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Hetzner Object Storage + MinIO (existing)")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Encoding")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("FFmpeg (containerized)")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Admin Dashboard")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Next.js + ShadCN (existing pattern)")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Video Player")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("hls.js or Video.js")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("CDN (optional)")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Bunny.net or Cloudflare for global delivery")] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 3120, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Deployment")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6240, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun("Coolify on Hetzner (existing)")] })] })
          ]})
        ]
      }),

      // Implementation Phases
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Implementation Phases")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 1: Foundation (Week 1-2)")] }),
      new Paragraph({ numbering: { reference: "numbered-phases", level: 0 }, children: [new TextRun("Database schema creation and migrations")] }),
      new Paragraph({ numbering: { reference: "numbered-phases", level: 0 }, children: [new TextRun("Basic admin dashboard scaffold with video list view")] }),
      new Paragraph({ numbering: { reference: "numbered-phases", level: 0 }, children: [new TextRun("Vimeo API integration: Import existing library")] }),
      new Paragraph({ numbering: { reference: "numbered-phases", level: 0 }, children: [new TextRun("Video detail view with metadata editing")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 2: Encoding Pipeline (Week 3-4)")] }),
      new Paragraph({ numbering: { reference: "numbered-tasks", level: 0 }, children: [new TextRun("FFmpeg encoding worker setup (Docker container)")] }),
      new Paragraph({ numbering: { reference: "numbered-tasks", level: 0 }, children: [new TextRun("BullMQ job queue integration")] }),
      new Paragraph({ numbering: { reference: "numbered-tasks", level: 0 }, children: [new TextRun("HLS output to Hetzner Object Storage")] }),
      new Paragraph({ numbering: { reference: "numbered-tasks", level: 0 }, children: [new TextRun("Encoding progress tracking in dashboard")] }),
      new Paragraph({ numbering: { reference: "numbered-tasks", level: 0 }, children: [new TextRun("Video player integration with HLS playback")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 3: Migration & Sync (Week 5-6)")] }),
      new Paragraph({ numbering: { reference: "numbered-features", level: 0 }, children: [new TextRun("YouTube API sync implementation")] }),
      new Paragraph({ numbering: { reference: "numbered-features", level: 0 }, children: [new TextRun("Google Drive crawler for master file discovery")] }),
      new Paragraph({ numbering: { reference: "numbered-features", level: 0 }, children: [new TextRun("Batch migration tool: Vimeo → Hetzner")] }),
      new Paragraph({ numbering: { reference: "numbered-features", level: 0 }, children: [new TextRun("Analytics aggregation setup")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 4: Polish & PM Integration (Week 7-8)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Course/module organization interface")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Content pipeline Kanban view")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("PM system integration (link videos to tasks)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Analytics dashboard")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Final Vimeo migration completion")] }),

      // Success Criteria
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Success Criteria")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("All Vimeo videos migrated to self-hosted Hetzner storage")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Vimeo subscription cancelled (cost savings achieved)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Unified dashboard operational with all video sources visible")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Encoding pipeline processing new uploads automatically")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Lia can manage video content without technical assistance")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("PM integration enabling clear production workflow visibility")] }),

      // Future Considerations
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Future Considerations (Post-MVP)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Livestream feature for Lia's live courses (RTMP ingest server)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Automatic transcript generation")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("AI-powered content tagging")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("Viewer engagement tracking (watch progress, completion rates)")] }),
      new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun("DRM/content protection for premium courses")] }),

      // End
      new Paragraph({ spacing: { before: 400 }, children: [] }),
      new Paragraph({ 
        alignment: AlignmentType.CENTER, 
        shading: { fill: "f0f4f8", type: ShadingType.CLEAR },
        children: [new TextRun({ text: "— End of Briefing —", italics: true, color: "666666" })] 
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/Ozean-Licht-VMS-Briefing.docx", buffer);
  console.log("Document created successfully!");
});