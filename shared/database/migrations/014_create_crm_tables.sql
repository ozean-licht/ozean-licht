-- Migration: 014_create_crm_tables.sql
-- Description: Create CRM tables (contacts, communications, tags)
-- Part of: Airtable MCP Migration
-- Created: 2025-11-28

-- Contacts table (non-user contacts, leads, prospects)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT GENERATED ALWAYS AS (
        CASE
            WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
            WHEN first_name IS NOT NULL THEN first_name
            WHEN last_name IS NOT NULL THEN last_name
            ELSE email
        END
    ) STORED,
    phone TEXT,
    phone_secondary TEXT,
    company TEXT,
    job_title TEXT,
    department TEXT,
    website TEXT,
    linkedin_url TEXT,
    address JSONB,
    contact_type TEXT DEFAULT 'lead' CHECK (contact_type IN (
        'lead', 'prospect', 'customer', 'partner', 'vendor',
        'affiliate', 'influencer', 'press', 'other'
    )),
    lead_status TEXT CHECK (lead_status IN (
        'new', 'contacted', 'qualified', 'unqualified', 'nurturing',
        'proposal', 'negotiation', 'won', 'lost', 'inactive'
    )),
    lead_score INTEGER DEFAULT 0,
    source TEXT,
    source_detail TEXT,
    referred_by UUID REFERENCES contacts(id),
    user_id UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    last_contacted_at TIMESTAMPTZ,
    next_followup_at TIMESTAMPTZ,
    lifecycle_stage TEXT DEFAULT 'subscriber' CHECK (lifecycle_stage IN (
        'subscriber', 'lead', 'marketing_qualified', 'sales_qualified',
        'opportunity', 'customer', 'evangelist', 'other'
    )),
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    is_subscribed_email BOOLEAN DEFAULT TRUE,
    is_subscribed_sms BOOLEAN DEFAULT FALSE,
    email_bounced BOOLEAN DEFAULT FALSE,
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Communications log
CREATE TABLE IF NOT EXISTS communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    communication_type TEXT CHECK (communication_type IN (
        'email', 'phone', 'sms', 'meeting', 'video_call',
        'chat', 'social', 'note', 'task', 'other'
    )),
    direction TEXT CHECK (direction IN ('inbound', 'outbound', 'internal')),
    channel TEXT,
    subject TEXT,
    content TEXT,
    summary TEXT,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    duration_minutes INTEGER,
    outcome TEXT,
    next_steps TEXT,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    bounced BOOLEAN DEFAULT FALSE,
    is_automated BOOLEAN DEFAULT FALSE,
    campaign_id UUID,
    template_id UUID,
    attachments JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Tags table (for flexible categorization)
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7280',
    icon TEXT,
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'contact', 'video', 'course', 'event', 'product',
        'project', 'task', 'order', 'campaign', 'all'
    )),
    tag_group TEXT,
    sort_order INTEGER DEFAULT 0,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension', 'shared')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slug, entity_type, entity_scope)
);

-- Entity tags junction table
CREATE TABLE IF NOT EXISTS entity_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tag_id, entity_type, entity_id)
);

-- Contact lists (for segmentation)
CREATE TABLE IF NOT EXISTS contact_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    list_type TEXT DEFAULT 'static' CHECK (list_type IN ('static', 'dynamic')),
    filter_criteria JSONB,
    member_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact list members
CREATE TABLE IF NOT EXISTS contact_list_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES contact_lists(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    added_by UUID REFERENCES users(id),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(list_id, contact_id)
);

-- Contact notes
CREATE TABLE IF NOT EXISTS contact_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    note_type TEXT DEFAULT 'general' CHECK (note_type IN (
        'general', 'meeting', 'call', 'followup', 'important', 'internal'
    )),
    is_pinned BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact activity tracking
CREATE TABLE IF NOT EXISTS contact_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'page_view', 'email_open', 'email_click', 'form_submit',
        'download', 'event_register', 'purchase', 'login',
        'course_enroll', 'course_complete', 'video_watch', 'other'
    )),
    activity_data JSONB DEFAULT '{}',
    source_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for CRM tables
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_lead_status ON contacts(lead_status);
CREATE INDEX IF NOT EXISTS idx_contacts_lifecycle ON contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned ON contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_entity_scope ON contacts(entity_scope);
CREATE INDEX IF NOT EXISTS idx_contacts_subscribed ON contacts(is_subscribed_email);
CREATE INDEX IF NOT EXISTS idx_contacts_airtable_id ON contacts(airtable_id);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_followup ON contacts(next_followup_at);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(full_name);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_communications_contact ON communications(contact_id);
CREATE INDEX IF NOT EXISTS idx_communications_user ON communications(user_id);
CREATE INDEX IF NOT EXISTS idx_communications_type ON communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_communications_direction ON communications(direction);
CREATE INDEX IF NOT EXISTS idx_communications_sent ON communications(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_communications_airtable_id ON communications(airtable_id);
CREATE INDEX IF NOT EXISTS idx_communications_campaign ON communications(campaign_id);

CREATE INDEX IF NOT EXISTS idx_tags_entity_type ON tags(entity_type);
CREATE INDEX IF NOT EXISTS idx_tags_entity_scope ON tags(entity_scope);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_group ON tags(tag_group);

CREATE INDEX IF NOT EXISTS idx_entity_tags_tag ON entity_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_entity_tags_entity ON entity_tags(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_lists_entity_scope ON contact_lists(entity_scope);
CREATE INDEX IF NOT EXISTS idx_lists_active ON contact_lists(is_active);

CREATE INDEX IF NOT EXISTS idx_list_members_list ON contact_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_list_members_contact ON contact_list_members(contact_id);

CREATE INDEX IF NOT EXISTS idx_notes_contact ON contact_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_notes_type ON contact_notes(note_type);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON contact_notes(is_pinned);

CREATE INDEX IF NOT EXISTS idx_activity_contact ON contact_activity(contact_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON contact_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON contact_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_session ON contact_activity(session_id);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS contacts_updated_at ON contacts;
CREATE TRIGGER contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS lists_updated_at ON contact_lists;
CREATE TRIGGER lists_updated_at
    BEFORE UPDATE ON contact_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS notes_updated_at ON contact_notes;
CREATE TRIGGER notes_updated_at
    BEFORE UPDATE ON contact_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- Function to update contact list member count
CREATE OR REPLACE FUNCTION update_list_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE contact_lists SET member_count = member_count + 1
        WHERE id = NEW.list_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE contact_lists SET member_count = GREATEST(member_count - 1, 0)
        WHERE id = OLD.list_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_list_count ON contact_list_members;
CREATE TRIGGER update_list_count
    AFTER INSERT OR DELETE ON contact_list_members
    FOR EACH ROW
    EXECUTE FUNCTION update_list_member_count();

-- Function to update contact last_contacted_at
CREATE OR REPLACE FUNCTION update_contact_last_contacted()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.direction IN ('inbound', 'outbound') AND NEW.sent_at IS NOT NULL THEN
        UPDATE contacts SET last_contacted_at = NEW.sent_at
        WHERE id = NEW.contact_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_last_contacted ON communications;
CREATE TRIGGER update_last_contacted
    AFTER INSERT ON communications
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_last_contacted();

-- Function to generate tag slug
CREATE OR REPLACE FUNCTION generate_tag_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tags_slug ON tags;
CREATE TRIGGER tags_slug
    BEFORE INSERT OR UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION generate_tag_slug();

-- Add comments for documentation
COMMENT ON TABLE contacts IS 'CRM contacts (leads, prospects, customers, partners)';
COMMENT ON TABLE communications IS 'Communication history with contacts';
COMMENT ON TABLE tags IS 'Flexible tagging system for all entity types';
COMMENT ON TABLE entity_tags IS 'Junction table linking tags to entities';
COMMENT ON TABLE contact_lists IS 'Contact segmentation lists';
COMMENT ON TABLE contact_list_members IS 'Contact list membership';
COMMENT ON TABLE contact_notes IS 'Notes attached to contacts';
COMMENT ON TABLE contact_activity IS 'Contact activity tracking';
COMMENT ON COLUMN contacts.airtable_id IS 'Original Airtable record ID for migration tracking';
COMMENT ON COLUMN communications.airtable_id IS 'Original Airtable record ID for migration tracking';
