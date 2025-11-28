-- Migration: 013_create_calendar_tables.sql
-- Description: Create event calendar tables (events, registrations, recurrence)
-- Part of: Airtable MCP Migration
-- Created: 2025-11-28

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    event_type TEXT CHECK (event_type IN (
        'workshop', 'webinar', 'course_session', 'meeting', 'deadline',
        'retreat', 'meditation', 'ceremony', 'conference', 'other'
    )),
    category TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    timezone TEXT DEFAULT 'Europe/Vienna',
    location TEXT,
    venue_name TEXT,
    venue_address JSONB,
    is_online BOOLEAN DEFAULT FALSE,
    meeting_url TEXT,
    meeting_provider TEXT,
    meeting_id TEXT,
    meeting_password TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    waitlist_enabled BOOLEAN DEFAULT FALSE,
    waitlist_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    requires_registration BOOLEAN DEFAULT TRUE,
    registration_deadline TIMESTAMPTZ,
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'live', 'completed', 'cancelled', 'postponed')),
    host_id UUID REFERENCES users(id),
    co_hosts JSONB DEFAULT '[]',
    thumbnail_url TEXT,
    cover_image_url TEXT,
    tags JSONB DEFAULT '[]',
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    course_id UUID REFERENCES courses(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    guest_email TEXT,
    guest_name TEXT,
    status TEXT DEFAULT 'registered' CHECK (status IN (
        'pending', 'registered', 'confirmed', 'attended', 'no_show',
        'cancelled', 'waitlisted', 'refunded'
    )),
    ticket_type TEXT DEFAULT 'standard',
    ticket_number TEXT UNIQUE,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'free')),
    amount_paid_cents INTEGER DEFAULT 0,
    order_id UUID REFERENCES orders(id),
    check_in_time TIMESTAMPTZ,
    check_in_method TEXT,
    notes TEXT,
    dietary_requirements TEXT,
    special_requests TEXT,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    reminder_sent BOOLEAN DEFAULT FALSE,
    feedback_requested BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    CONSTRAINT user_or_guest CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL)
);

-- Recurring event patterns
CREATE TABLE IF NOT EXISTS event_recurrence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    recurrence_rule TEXT NOT NULL,
    recurrence_type TEXT CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
    interval_value INTEGER DEFAULT 1,
    days_of_week JSONB DEFAULT '[]',
    day_of_month INTEGER,
    month_of_year INTEGER,
    occurrence_count INTEGER,
    until_date DATE,
    exceptions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event instances (for recurring events)
CREATE TABLE IF NOT EXISTS event_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    instance_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled', 'rescheduled')),
    is_exception BOOLEAN DEFAULT FALSE,
    override_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event reminders
CREATE TABLE IF NOT EXISTS event_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES event_registrations(id) ON DELETE CASCADE,
    reminder_type TEXT CHECK (reminder_type IN ('email', 'sms', 'push', 'webhook')),
    scheduled_time TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event feedback/ratings
CREATE TABLE IF NOT EXISTS event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES event_registrations(id),
    user_id UUID REFERENCES users(id),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
    presenter_rating INTEGER CHECK (presenter_rating >= 1 AND presenter_rating <= 5),
    venue_rating INTEGER CHECK (venue_rating >= 1 AND venue_rating <= 5),
    would_recommend BOOLEAN,
    feedback_text TEXT,
    improvement_suggestions TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for calendar tables
CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_end ON events(end_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_host ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_entity_scope ON events(entity_scope);
CREATE INDEX IF NOT EXISTS idx_events_public ON events(is_public);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_course ON events(course_id);
CREATE INDEX IF NOT EXISTS idx_events_airtable_id ON events(airtable_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket ON event_registrations(ticket_number);
CREATE INDEX IF NOT EXISTS idx_registrations_order ON event_registrations(order_id);
CREATE INDEX IF NOT EXISTS idx_registrations_guest_email ON event_registrations(guest_email);

CREATE INDEX IF NOT EXISTS idx_recurrence_event ON event_recurrence(event_id);

CREATE INDEX IF NOT EXISTS idx_instances_parent ON event_instances(parent_event_id);
CREATE INDEX IF NOT EXISTS idx_instances_date ON event_instances(instance_date);
CREATE INDEX IF NOT EXISTS idx_instances_start ON event_instances(start_time);
CREATE INDEX IF NOT EXISTS idx_instances_status ON event_instances(status);

CREATE INDEX IF NOT EXISTS idx_reminders_event ON event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_reminders_registration ON event_reminders(registration_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON event_reminders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON event_reminders(status);

CREATE INDEX IF NOT EXISTS idx_feedback_event ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON event_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_public ON event_feedback(is_public);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS events_updated_at ON events;
CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS recurrence_updated_at ON event_recurrence;
CREATE TRIGGER recurrence_updated_at
    BEFORE UPDATE ON event_recurrence
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    ticket TEXT;
BEGIN
    ticket := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    RETURN ticket;
END;
$$ LANGUAGE plpgsql;

-- Function to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status IN ('registered', 'confirmed') THEN
            UPDATE events SET current_attendees = current_attendees + 1
            WHERE id = NEW.event_id;
        ELSIF NEW.status = 'waitlisted' THEN
            UPDATE events SET waitlist_count = waitlist_count + 1
            WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status NOT IN ('registered', 'confirmed') AND NEW.status IN ('registered', 'confirmed') THEN
            UPDATE events SET current_attendees = current_attendees + 1
            WHERE id = NEW.event_id;
        ELSIF OLD.status IN ('registered', 'confirmed') AND NEW.status NOT IN ('registered', 'confirmed') THEN
            UPDATE events SET current_attendees = GREATEST(current_attendees - 1, 0)
            WHERE id = NEW.event_id;
        END IF;

        IF OLD.status != 'waitlisted' AND NEW.status = 'waitlisted' THEN
            UPDATE events SET waitlist_count = waitlist_count + 1
            WHERE id = NEW.event_id;
        ELSIF OLD.status = 'waitlisted' AND NEW.status != 'waitlisted' THEN
            UPDATE events SET waitlist_count = GREATEST(waitlist_count - 1, 0)
            WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.status IN ('registered', 'confirmed') THEN
            UPDATE events SET current_attendees = GREATEST(current_attendees - 1, 0)
            WHERE id = OLD.event_id;
        ELSIF OLD.status = 'waitlisted' THEN
            UPDATE events SET waitlist_count = GREATEST(waitlist_count - 1, 0)
            WHERE id = OLD.event_id;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_attendee_count ON event_registrations;
CREATE TRIGGER update_attendee_count
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendee_count();

-- Add comments for documentation
COMMENT ON TABLE events IS 'Calendar events (workshops, webinars, meetings, etc.)';
COMMENT ON TABLE event_registrations IS 'User registrations for events';
COMMENT ON TABLE event_recurrence IS 'Recurring event patterns (RRULE based)';
COMMENT ON TABLE event_instances IS 'Individual instances of recurring events';
COMMENT ON TABLE event_reminders IS 'Scheduled reminders for event participants';
COMMENT ON TABLE event_feedback IS 'Post-event feedback and ratings';
COMMENT ON COLUMN events.airtable_id IS 'Original Airtable record ID for migration tracking';
COMMENT ON COLUMN event_recurrence.recurrence_rule IS 'iCalendar RRULE format string';
