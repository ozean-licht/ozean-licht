# Plan: Ozean Licht Team Calendar

## Task Description

Build an internal team calendar for the Ozean Licht admin dashboard by adapting the [lramos33/big-calendar](https://github.com/lramos33/big-calendar) open-source calendar. The calendar will:
- Display events from Airtable (`events` and `connected_calendar` tables)
- Support 5 views: day, week, month, year, agenda
- Follow the Ozean Licht design system (turquoise primary, glass morphism, Montserrat fonts)
- Integrate with the existing admin sidebar navigation

## Objective

Deliver a fully functional team calendar at `/dashboard/calendar` with:
- Airtable-synced events from Google Calendar integration
- Multi-view calendar (day/week/month/year/agenda)
- Event filtering by user/type
- Ozean Licht branded styling
- Read-only initially (view events only, no CRUD from UI)

## Migration Context

**IMPORTANT:** The `events` table in Airtable was used for prototyping. This implementation is the first step toward full server-side migration:

### Current State (Airtable Prototype)
- `events` table - Manual event entries (prototype data)
- `connected_calendar` table - Google Calendar sync (Ozean Licht calendar)
- Bidirectional sync with Google Calendar already configured in Airtable

### Target State (Future Migration)
1. **Phase 1 (This Spec):** Read from Airtable, display in admin calendar
2. **Phase 2 (Future):** Migrate `events` table to PostgreSQL (`calendar_events` table)
3. **Phase 3 (Future):** Direct Google Calendar API integration for bidirectional sync
4. **Phase 4 (Future):** Full CRUD from admin UI with real-time Google Calendar sync

### Migration SQL (Phase 2 Preview)
```sql
-- Future migration: apps/admin/migrations/0XX_calendar_events.sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airtable_id VARCHAR(255) UNIQUE,
  google_event_id VARCHAR(255) UNIQUE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location VARCHAR(500),
  color VARCHAR(20) DEFAULT 'blue',
  event_type VARCHAR(50),
  organizer_id UUID REFERENCES admin_users(id),
  attendees JSONB DEFAULT '[]',
  recurrence_rule VARCHAR(255),
  google_calendar_id VARCHAR(255),
  sync_status VARCHAR(20) DEFAULT 'synced',
  last_synced_at TIMESTAMPTZ,
  entity_scope VARCHAR(50) DEFAULT 'ozean_licht',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendar_events_dates ON calendar_events(start_time, end_time);
CREATE INDEX idx_calendar_events_google ON calendar_events(google_event_id);
```

## Problem Statement

The team currently manages events across Airtable and Google Calendar but lacks a unified view within the admin dashboard. The existing `/dashboard/calendar/events` page shows a table list, not a visual calendar. The big-calendar project provides a solid foundation with all required views and drag-drop capabilities.

## Solution Approach

1. **Copy core calendar components** from big-calendar repo into `apps/admin/components/calendar/`
2. **Adapt styling** to Ozean Licht design system (colors, fonts, glass effects)
3. **Create API routes** to fetch events from Airtable MCP gateway
4. **Build calendar page** at `/dashboard/calendar` with view switcher
5. **Keep existing events table** at `/dashboard/calendar/events` for detailed management

---

## Event Interface Mapping

### big-calendar Expected Interface
```typescript
// From lramos33/big-calendar - src/calendar/interfaces.ts
interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

interface IEvent {
  id: number;
  startDate: string;      // ISO string "2025-12-05T14:00:00Z"
  endDate: string;        // ISO string "2025-12-05T17:00:00Z"
  title: string;
  color: TEventColor;     // "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray"
  description: string;
  user: IUser;
}

type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "gray";
```

### Airtable to IEvent Transformation
```typescript
// apps/admin/components/calendar/types.ts

// Raw Airtable record from connected_calendar (Google Calendar sync)
interface AirtableConnectedCalendarRecord {
  id: string;                    // Airtable record ID (e.g., "recXXXXXXXX")
  fields: {
    title: string;
    start: string;               // ISO datetime "2025-02-15T19:00:00.000Z"
    end: string;                 // ISO datetime
    all_day?: boolean;
    recurring_event?: boolean;
    creator?: string;            // email
    status?: 'confirmed';
    location?: string;
    description?: string;
    attendees?: string;
    created?: string;
    updated?: string;
    event_id?: string;           // Google Calendar event ID
    event_link?: string;
    hangouts_link?: string;
    open_in_google_calendar?: { label: string; url: string };
  };
  createdTime: string;
}

// Raw Airtable record from events table (manual events/content calendar)
interface AirtableEventsRecord {
  id: string;
  fields: {
    id: number;                  // autoNumber
    title: string;
    start?: string;
    end?: string;
    duration?: number;           // seconds
    status?: 'Geplant' | 'Abgeschlossen' | 'Abgebrochen';
    lias_time?: 'Blockiert' | 'Frei';
    type?: TEventType;
    description?: string;
    location?: string;
    attendees?: string;
    google_event_id?: string;
    linked_project?: string[];
    created_by?: { id: string; email: string; name: string };
    updated_by?: { id: string; email: string; name: string };
  };
  createdTime: string;
}

type TEventType = 'Kurs' | 'Video' | 'Short' | 'Post' | 'Blog' | 'Love Letter' |
                  'Kongress' | 'Interview' | 'Live Event' | 'Youtube Live' | 'Sonstiges';

// Transform connected_calendar record to IEvent
function transformConnectedCalendarToEvent(record: AirtableConnectedCalendarRecord): IEvent {
  const fields = record.fields;
  return {
    id: record.id,
    startDate: fields.start || '',
    endDate: fields.end || '',
    title: fields.title || 'Untitled',
    color: 'blue',  // Default for Google Calendar events
    description: fields.description || '',
    user: {
      id: 'google',
      name: fields.creator || 'Ozean Licht',
      picturePath: null,
    },
  };
}

// Transform events record to IEvent
function transformEventsToEvent(record: AirtableEventsRecord): IEvent {
  const fields = record.fields;
  return {
    id: record.id,
    startDate: fields.start || '',
    endDate: fields.end || '',
    title: fields.title || 'Untitled',
    color: mapEventTypeToColor(fields.type),
    description: fields.description || '',
    user: {
      id: fields.created_by?.id || 'team',
      name: fields.created_by?.name || 'Ozean Licht Team',
      picturePath: null,
    },
  };
}

// Map event type to calendar color
function mapEventTypeToColor(type?: TEventType): TEventColor {
  const typeColorMap: Record<TEventType, TEventColor> = {
    'Kurs': 'purple',           // Courses - purple
    'Video': 'blue',            // Videos - blue
    'Short': 'blue',            // Shorts - blue
    'Post': 'green',            // Social posts - green
    'Blog': 'green',            // Blog posts - green
    'Love Letter': 'yellow',    // Newsletters - yellow
    'Kongress': 'red',          // Congresses - red (important)
    'Interview': 'orange',      // Interviews - orange
    'Live Event': 'red',        // Live events - red (important)
    'Youtube Live': 'red',      // YouTube live - red
    'Sonstiges': 'gray',        // Other - gray
  };
  return typeColorMap[type || 'Sonstiges'] || 'gray';
}
```

---

## Working Hours Configuration

big-calendar supports configurable working hours with distinct visual styling for work vs non-work hours.

### Configuration Interface
```typescript
// apps/admin/components/calendar/types.ts

interface WorkingHoursConfig {
  [dayOfWeek: number]: {
    from: number;  // Hour (0-23)
    to: number;    // Hour (0-23)
  };
}

interface VisibleHoursConfig {
  from: number;  // First hour shown (default: 6)
  to: number;    // Last hour shown (default: 22)
}

interface CalendarConfig {
  workingHours: WorkingHoursConfig;
  visibleHours: VisibleHoursConfig;
  defaultView: TCalendarView;
  weekStartsOn: 0 | 1;  // 0 = Sunday, 1 = Monday
}

// Default configuration for Ozean Licht team
const defaultCalendarConfig: CalendarConfig = {
  workingHours: {
    0: { from: 0, to: 0 },    // Sunday - not working
    1: { from: 9, to: 18 },   // Monday
    2: { from: 9, to: 18 },   // Tuesday
    3: { from: 9, to: 18 },   // Wednesday
    4: { from: 9, to: 18 },   // Thursday
    5: { from: 9, to: 18 },   // Friday
    6: { from: 10, to: 14 },  // Saturday - half day
  },
  visibleHours: {
    from: 6,   // Show from 6 AM
    to: 22,    // Show until 10 PM
  },
  defaultView: 'week',
  weekStartsOn: 1,  // Monday (European)
};
```

### Visual Styling for Working Hours
```typescript
// In WeekView/DayView components
function getHourSlotClassName(hour: number, dayOfWeek: number): string {
  const workHours = config.workingHours[dayOfWeek];
  const isWorkingHour = workHours && hour >= workHours.from && hour < workHours.to;

  return cn(
    'h-12 border-b border-primary/10',
    isWorkingHour
      ? 'bg-card/50'                    // Working hours: slightly visible
      : 'bg-background/30 opacity-60'   // Non-working: dimmed
  );
}
```

---

## Airtable Schema Discovery

### Prerequisites
The MCP gateway must be running to query Airtable. Follow these steps:

### Step 1: Start MCP Gateway
```bash
cd /opt/ozean-licht-ecosystem/tools/mcp-gateway

# Check if already running
curl -s http://localhost:8100/health | jq .

# If not running, start it
npm run dev

# Wait for startup (check logs for "Server listening on port 8100")
```

### Step 2: Verify Airtable Configuration
```bash
# Check environment variables are set
docker exec mcp-gateway-o000okc80okco8s0sgcwwcwo-190401066362 env | grep AIRTABLE

# Or check .env file
cat tools/mcp-gateway/.env | grep AIRTABLE
# Expected:
# AIRTABLE_API_KEY=pat...
# AIRTABLE_BASE_ID=app...
```

### Step 3: Query Tables via HTTP
```bash
# List all tables in the base
curl -s -X POST http://localhost:8100/execute \
  -H "Content-Type: application/json" \
  -d '{
    "service": "airtable",
    "operation": "list-tables",
    "args": {}
  }' | jq .

# Get schema for events table
curl -s -X POST http://localhost:8100/execute \
  -H "Content-Type: application/json" \
  -d '{
    "service": "airtable",
    "operation": "get-table-schema",
    "args": {"tableName": "events"}
  }' | jq .

# Get schema for connected_calendar table
curl -s -X POST http://localhost:8100/execute \
  -H "Content-Type: application/json" \
  -d '{
    "service": "airtable",
    "operation": "get-table-schema",
    "args": {"tableName": "connected_calendar"}
  }' | jq .

# Read sample records from connected_calendar
curl -s -X POST http://localhost:8100/execute \
  -H "Content-Type: application/json" \
  -d '{
    "service": "airtable",
    "operation": "read-records",
    "args": {
      "tableName": "connected_calendar",
      "maxRecords": 5
    }
  }' | jq .
```

### Step 4: Documented Schema Results

**SCHEMA CAPTURED: 2025-12-05**

#### `connected_calendar` Table (16 fields) - Google Calendar Sync
| Field | Type | Description |
|-------|------|-------------|
| `title` | singleLineText | Event title (primary field) |
| `start` | dateTime | Start datetime (Europe/Berlin, ISO format) |
| `end` | dateTime | End datetime (Europe/Berlin, ISO format) |
| `all_day` | checkbox | Whether it's an all-day event |
| `recurring_event` | checkbox | Whether the event recurs |
| `creator` | email | Creator's email address |
| `status` | singleSelect | Event status: "confirmed" |
| `location` | singleLineText | Event location |
| `description` | multilineText | Event description |
| `attendees` | singleLineText | Attendees (comma-separated) |
| `created` | dateTime | When created in Google Calendar |
| `updated` | dateTime | When last updated |
| `event_id` | singleLineText | Google Calendar event ID |
| `event_link` | url | Google Calendar event URL |
| `hangouts_link` | url | Google Meet/Hangouts link |
| `open_in_google_calendar` | button | Opens event in Google Calendar |

#### `events` Table (17 fields) - Manual Events/Content Calendar
| Field | Type | Description |
|-------|------|-------------|
| `id` | autoNumber | Auto-increment ID (primary field) |
| `google_event_id` | singleLineText | Linked Google Calendar event ID |
| `title` | singleLineText | Event title |
| `description` | multilineText | Event description |
| `start` | dateTime | Start datetime (Europe/Berlin) |
| `end` | dateTime | End datetime (Europe/Berlin) |
| `duration` | duration | Event duration (h:mm format) |
| `status` | singleSelect | "Geplant", "Abgeschlossen", "Abgebrochen" |
| `lias_time` | singleSelect | "Blockiert", "Frei" (Lia's availability) |
| `type` | singleSelect | Event type (see below) |
| `linked_project` | multipleRecordLinks | Links to projects table |
| `location` | singleLineText | Event location |
| `attendees` | email | Attendees |
| `updated_by` | lastModifiedBy | Who last updated |
| `updated_at` | lastModifiedTime | When last updated |
| `created_by` | createdBy | Who created |
| `created_at` | createdTime | When created |

**Event Types (events.type):**
- `Kurs` - Course session
- `Video` - Video release
- `Short` - Short video release
- `Post` - Social media post
- `Blog` - Blog post
- `Love Letter` - Newsletter
- `Kongress` - Congress/summit
- `Interview` - Interview
- `Live Event` - Live event
- `Youtube Live` - YouTube livestream
- `Sonstiges` - Other

```typescript
// ACTUAL SCHEMA FROM AIRTABLE (connected_calendar)
interface ConnectedCalendarFields {
  title: string;
  start: string;              // ISO datetime
  end: string;                // ISO datetime
  all_day?: boolean;
  recurring_event?: boolean;
  creator?: string;           // email
  status?: 'confirmed';
  location?: string;
  description?: string;
  attendees?: string;
  created?: string;           // ISO datetime
  updated?: string;           // ISO datetime
  event_id?: string;          // Google Calendar event ID
  event_link?: string;        // URL
  hangouts_link?: string;     // URL
  open_in_google_calendar?: { label: string; url: string };
}

// ACTUAL SCHEMA FROM AIRTABLE (events)
interface EventsTableFields {
  id: number;                 // autoNumber
  google_event_id?: string;
  title: string;
  description?: string;
  start?: string;             // ISO datetime
  end?: string;               // ISO datetime
  duration?: number;          // seconds
  status?: 'Geplant' | 'Abgeschlossen' | 'Abgebrochen';
  lias_time?: 'Blockiert' | 'Frei';
  type?: 'Kurs' | 'Video' | 'Short' | 'Post' | 'Blog' | 'Love Letter' | 'Kongress' | 'Interview' | 'Live Event' | 'Youtube Live' | 'Sonstiges';
  linked_project?: string[];  // Record IDs
  location?: string;
  attendees?: string;         // email
  updated_by?: { id: string; email: string; name: string };
  updated_at?: string;        // ISO datetime
  created_by?: { id: string; email: string; name: string };
  created_at?: string;        // ISO datetime
}
```

### Troubleshooting Airtable Queries

**Error: "Airtable API key not configured"**
```bash
# Set in .env file
echo "AIRTABLE_API_KEY=patXXXXX" >> tools/mcp-gateway/.env
echo "AIRTABLE_BASE_ID=appXXXXX" >> tools/mcp-gateway/.env
# Restart MCP gateway
```

**Error: "Connection refused" on port 8100**
```bash
# Check if gateway is running
lsof -i :8100

# Check Docker container
docker ps | grep mcp-gateway

# View logs
docker logs mcp-gateway-o000okc80okco8s0sgcwwcwo-190401066362 --tail 50
```

**Error: "Table not found"**
```bash
# First list all tables to get exact names
curl -s -X POST http://localhost:8100/execute \
  -H "Content-Type: application/json" \
  -d '{"service":"airtable","operation":"list-tables","args":{}}' | jq '.data.tables[].name'
```

---

## Relevant Files

### Existing Files to Modify
- `apps/admin/components/dashboard/Sidebar.tsx` - Update calendar section links
- `apps/admin/types/calendar.ts` - Extend with Airtable mapping types
- `apps/admin/app/dashboard/calendar/events/page.tsx` - Keep for table view

### New Files to Create

#### Core Calendar Components (from big-calendar adaptation)
- `apps/admin/components/calendar/CalendarContainer.tsx` - Main calendar wrapper
- `apps/admin/components/calendar/CalendarContext.tsx` - State management context
- `apps/admin/components/calendar/CalendarHeader.tsx` - Navigation and view switcher
- `apps/admin/components/calendar/views/MonthView.tsx` - Month grid view
- `apps/admin/components/calendar/views/WeekView.tsx` - Week view with time slots
- `apps/admin/components/calendar/views/DayView.tsx` - Single day view
- `apps/admin/components/calendar/views/YearView.tsx` - Year overview
- `apps/admin/components/calendar/views/AgendaView.tsx` - List view of events
- `apps/admin/components/calendar/EventCard.tsx` - Event display component
- `apps/admin/components/calendar/EventDialog.tsx` - Event details modal
- `apps/admin/components/calendar/helpers.ts` - Date utility functions
- `apps/admin/components/calendar/types.ts` - Calendar-specific types
- `apps/admin/components/calendar/config.ts` - Working hours and defaults
- `apps/admin/components/calendar/index.ts` - Barrel export

#### API Routes
- `apps/admin/app/api/calendar/events/route.ts` - GET events from Airtable
- `apps/admin/app/api/calendar/sync/route.ts` - Trigger Google Calendar sync

#### Database Module
- `apps/admin/lib/db/calendar-events.ts` - Airtable query functions via MCP

#### Pages
- `apps/admin/app/dashboard/calendar/page.tsx` - Main calendar page
- `apps/admin/app/dashboard/calendar/layout.tsx` - Calendar layout wrapper

## Implementation Phases

### Phase 1: Foundation (Day 1) - COMPLETED 2025-12-06
- ~~Query Airtable schema for `events` and `connected_calendar` tables~~
- ~~Define TypeScript types mapping Airtable fields to IEvent interface~~
- ~~Create API route to fetch events from Airtable via MCP gateway~~
- ~~Set up calendar context for state management with working hours config~~

**Phase 1 Deliverables:**
- `apps/admin/components/calendar/types.ts` - Type definitions and transforms
- `apps/admin/components/calendar/config.ts` - Default configuration
- `apps/admin/components/calendar/helpers.ts` - Date utilities
- `apps/admin/components/calendar/CalendarContext.tsx` - State management
- `apps/admin/components/calendar/index.ts` - Barrel export (45 exports)
- `apps/admin/app/api/calendar/events/route.ts` - API endpoint

### Phase 2: Core Calendar Components (Day 2-3)
- Port MonthView from big-calendar with Ozean Licht styling
- Port WeekView and DayView with time slots and working hours visualization
- Create CalendarHeader with view switcher and date navigation
- Implement EventCard with glass morphism styling
- Create EventDialog modal for event details

### Phase 3: Additional Views & Polish (Day 4)
- Add YearView (12-month overview)
- Add AgendaView (chronological list)
- Implement user filtering
- Add loading states and error handling
- Update sidebar navigation

### Phase 4: Testing & Integration (Day 5)
- Test with real Airtable data
- Verify Google Calendar sync displays correctly
- Performance optimization for large event counts
- Responsive design verification

## Step by Step Tasks

### 1. Query Airtable Schema (COMPLETED)
- ~~Start MCP gateway: `cd tools/mcp-gateway && npm run dev`~~
- ~~Verify health: `curl http://localhost:8100/health`~~
- ~~Execute schema queries (see "Airtable Schema Discovery" section above)~~
- ~~Document actual field names in this spec~~
- **SCHEMA DOCUMENTED: 2025-12-05** - See "Airtable Schema Discovery" section

### 2. Create Calendar Types (COMPLETED - 2025-12-06)
- ~~Create `apps/admin/components/calendar/types.ts`~~
- ~~Define `TCalendarView` type: `'day' | 'week' | 'month' | 'year' | 'agenda'`~~
- ~~Define `TEventColor` type matching big-calendar~~
- ~~Define `IUser` and `IEvent` interfaces matching big-calendar~~
- ~~Define `AirtableCalendarRecord` interface with actual field names~~
- ~~Add `transformAirtableToEvent()` function~~
- ~~Add `mapColorToEventColor()` function~~
- **COMPLETED: types.ts (264 lines) - Full type system for calendar**

### 3. Create Calendar Config (COMPLETED - 2025-12-06)
- ~~Create `apps/admin/components/calendar/config.ts`~~
- ~~Define `WorkingHoursConfig` and `VisibleHoursConfig` interfaces~~
- ~~Set default working hours for Ozean Licht team~~
- ~~Export `defaultCalendarConfig`~~
- **COMPLETED: config.ts - Working hours, colors, German localization**

### 4. Create Airtable API Route (COMPLETED - 2025-12-06)
- ~~Create `apps/admin/app/api/calendar/events/route.ts`~~
- ~~Implement GET handler with date range filtering (`?start=&end=`)~~
- ~~Query Airtable via HTTP POST to `http://localhost:8100/execute`~~
- ~~Transform Airtable records to IEvent format~~
- ~~Handle pagination with offset parameter~~
- ~~Add caching headers (1 minute cache)~~
- **COMPLETED: API route with auth, MCP gateway integration, caching**

### 5. Create Calendar Context (COMPLETED - 2025-12-06)
- ~~Create `apps/admin/components/calendar/CalendarContext.tsx`~~
- ~~State: `selectedDate`, `view`, `events`, `loading`, `error`, `config`~~
- ~~Actions: `setDate`, `setView`, `refreshEvents`, `updateConfig`~~
- ~~Include working hours and visible hours in context~~
- ~~Provide via React Context with `useCalendar()` hook~~
- **COMPLETED: CalendarContext.tsx - Full state management with auto-fetch**

### 6. Create Calendar Helpers (COMPLETED - 2025-12-06)
- ~~Create `apps/admin/components/calendar/helpers.ts`~~
- ~~Port date utilities from big-calendar (use date-fns)~~
- **COMPLETED: helpers.ts (356 lines) - Date utils with German locale**
- Functions: `getMonthDays`, `getWeekDays`, `getHourSlots`
- Functions: `isToday`, `isSameDay`, `formatTime`, `formatDateRange`
- Functions: `getEventsForDay`, `getEventPosition`, `isWorkingHour`

### 7. Create Month View Component
- Create `apps/admin/components/calendar/views/MonthView.tsx`
- 7-column grid for days of week
- 5-6 rows for weeks
- Show events as colored pills
- Handle multi-day events spanning columns
- Style with glass morphism cards

### 8. Create Week View Component
- Create `apps/admin/components/calendar/views/WeekView.tsx`
- Time slots from visible hours config
- 7 columns for each day
- Position events based on time
- Handle overlapping events
- Current time indicator line
- **Working hours styling** - dim non-working hours

### 9. Create Day View Component
- Create `apps/admin/components/calendar/views/DayView.tsx`
- Single column time grid
- All-day events section at top
- Detailed event cards
- Hour markers
- **Working hours styling** - dim non-working hours

### 10. Create Year View Component
- Create `apps/admin/components/calendar/views/YearView.tsx`
- 12-month mini calendar grid
- Click month to navigate to month view
- Highlight days with events (dot indicator)

### 11. Create Agenda View Component
- Create `apps/admin/components/calendar/views/AgendaView.tsx`
- Chronological list grouped by day
- Show upcoming 30 days by default
- Expandable event details
- Filter by event type

### 12. Create Event Card Component
- Create `apps/admin/components/calendar/EventCard.tsx`
- Compact display for month/week views
- Show title, time, color badge
- Truncate long titles
- Hover state with glow effect

### 13. Create Event Dialog Component
- Create `apps/admin/components/calendar/EventDialog.tsx`
- Full event details in modal
- Show: title, time, description, location, attendees
- Link to Google Calendar event
- Glass morphism styling

### 14. Create Calendar Header Component
- Create `apps/admin/components/calendar/CalendarHeader.tsx`
- Today button
- Previous/Next navigation
- Current date display (month/year)
- View switcher tabs (day/week/month/year/agenda)
- Optional user filter dropdown

### 15. Create Calendar Container
- Create `apps/admin/components/calendar/CalendarContainer.tsx`
- Wrap context provider
- Render header and active view
- Handle loading/error states
- Responsive container

### 16. Create Calendar Page
- Create `apps/admin/app/dashboard/calendar/page.tsx`
- Server component with auth check
- Import CalendarContainer
- Set page metadata

### 17. Create Calendar Layout
- Create `apps/admin/app/dashboard/calendar/layout.tsx`
- Shared layout for calendar routes
- Navigation tabs: Calendar, Events List

### 18. Update Sidebar Navigation
- Edit `apps/admin/components/dashboard/Sidebar.tsx`
- Update Calendar section:
  - "Calendar" → `/dashboard/calendar` (new main calendar)
  - "Events" → `/dashboard/calendar/events` (existing table)
- Add Calendar icon for main calendar link

### 19. Apply Ozean Licht Styling
- Use primary color `#0ec2bc` for accents
- Background `#00070F`, cards `#00111A`
- Glass morphism: `backdrop-blur-12` + border `primary/25`
- Font: Montserrat for all text
- Event colors: Map to turquoise palette variants
- Glow effects on hover
- No bold fonts (max medium 500-600)
- Working hours: Slightly brighter background
- Non-working hours: Dimmed with lower opacity

### 20. Add Barrel Export
- Create `apps/admin/components/calendar/index.ts`
- Export all components
- Export types
- Export context hook
- Export config

### 21. Validate Implementation
- Test all 5 calendar views
- Verify Airtable data displays correctly
- Check working hours visualization
- Check responsive behavior
- Verify auth protection
- Test error states
- Check accessibility (keyboard nav, ARIA labels)

## Testing Strategy

### Unit Tests
- Calendar helper functions (date calculations)
- Event positioning algorithms
- Type transformations (Airtable → IEvent)
- Working hours calculation

### Integration Tests
- API route returns transformed events
- Calendar context updates correctly
- View switching works
- Working hours config applied

### E2E Tests (Playwright)
- Navigate to calendar page
- Switch between views
- Click event to open dialog
- Navigate between dates
- Verify working hours styling

## Acceptance Criteria

- [ ] Calendar page loads at `/dashboard/calendar`
- [ ] Month view displays as default
- [ ] All 5 views (day/week/month/year/agenda) work
- [ ] Events from Airtable `connected_calendar` table display
- [ ] Events correctly transformed to IEvent interface
- [ ] Event details modal opens on click
- [ ] Navigation between dates works
- [ ] Working hours visually distinct from non-working hours
- [ ] Styling matches Ozean Licht design system
- [ ] Sidebar shows updated Calendar navigation
- [ ] Page is protected by RBAC
- [ ] Loading and error states display properly
- [ ] Responsive on mobile/tablet/desktop

## Validation Commands

```bash
# Type check
cd apps/admin && npm run typecheck

# Lint
cd apps/admin && npm run lint

# Start dev server
cd apps/admin && npm run dev

# Verify page loads
curl -I http://localhost:3000/dashboard/calendar

# Verify API route
curl http://localhost:3000/api/calendar/events?start=2025-12-01&end=2025-12-31

# Test MCP gateway (when running)
curl -s -X POST http://localhost:8100/execute \
  -H "Content-Type: application/json" \
  -d '{"service":"airtable","operation":"read-records","args":{"tableName":"connected_calendar"}}' | jq .
```

## Notes

### Dependencies (already in admin app)
- `date-fns` - Date manipulation (already available)
- `lucide-react` - Icons (already available)
- `@radix-ui/*` - UI primitives (already available)

### big-calendar Source Reference
Key files to reference from https://github.com/lramos33/big-calendar:
- `src/calendar/interfaces.ts` - IEvent, IUser interfaces
- `src/calendar/types.ts` - TEventColor, TCalendarView, TWorkingHours
- `src/calendar/components/month-view/` - Month grid implementation
- `src/calendar/components/week-and-day-view/` - Time grid implementation
- `src/calendar/helpers.ts` - Date calculation utilities
- `src/calendar/contexts/calendar-context.tsx` - State management pattern

### Event Color Mapping
Map Airtable event types to big-calendar colors:
```typescript
// Actual event types from Airtable events table
const eventTypeColors: Record<TEventType, TEventColor> = {
  'Kurs': 'purple',           // Course sessions - purple (learning)
  'Video': 'blue',            // Video releases - blue
  'Short': 'blue',            // Short videos - blue
  'Post': 'green',            // Social media posts - green
  'Blog': 'green',            // Blog posts - green
  'Love Letter': 'yellow',    // Newsletters - yellow (highlight)
  'Kongress': 'red',          // Congresses/summits - red (important)
  'Interview': 'orange',      // Interviews - orange
  'Live Event': 'red',        // Live events - red (important)
  'Youtube Live': 'red',      // YouTube livestreams - red
  'Sonstiges': 'gray',        // Other - gray
};

// For connected_calendar (Google Calendar sync), default to blue
// as Google Calendar colors are not synced to Airtable
```

### Airtable Rate Limits
- 5 requests/second per base
- Cache API responses for 1 minute
- Use pagination offset for large datasets

### Google Calendar Bidirectional Sync (Future)
Currently handled by Airtable automation. Future direct integration will require:
- Google Calendar API credentials
- OAuth2 flow for calendar access
- Webhook for real-time sync
- Conflict resolution strategy

---

*Plan created: 2025-12-05 | Schema captured: 2025-12-05 | Type: feature | Complexity: complex*
