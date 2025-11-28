-- Migration: 015_create_marketing_tables.sql
-- Description: Create marketing tables (campaigns, email templates, analytics)
-- Part of: Airtable MCP Migration
-- Created: 2025-11-28

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    campaign_type TEXT CHECK (campaign_type IN (
        'email', 'email_sequence', 'social', 'ads', 'event',
        'referral', 'affiliate', 'content', 'webinar', 'launch', 'other'
    )),
    channel TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled', 'archived'
    )),
    objective TEXT,
    start_date DATE,
    end_date DATE,
    scheduled_at TIMESTAMPTZ,
    launched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    budget_cents INTEGER,
    spent_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    target_audience JSONB DEFAULT '{}',
    audience_size INTEGER,
    goals JSONB DEFAULT '{}',
    kpis JSONB DEFAULT '{}',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    landing_page_url TEXT,
    conversion_page_url TEXT,
    a_b_test_config JSONB,
    is_automated BOOLEAN DEFAULT FALSE,
    automation_trigger TEXT,
    tags JSONB DEFAULT '[]',
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    product_id UUID REFERENCES products(id),
    course_id UUID REFERENCES courses(id),
    event_id UUID REFERENCES events(id),
    contact_list_id UUID REFERENCES contact_lists(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Campaign statistics
CREATE TABLE IF NOT EXISTS campaign_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    opens INTEGER DEFAULT 0,
    unique_opens INTEGER DEFAULT 0,
    sends INTEGER DEFAULT 0,
    deliveries INTEGER DEFAULT 0,
    bounces INTEGER DEFAULT 0,
    unsubscribes INTEGER DEFAULT 0,
    spam_reports INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_cents INTEGER DEFAULT 0,
    cost_cents INTEGER DEFAULT 0,
    new_leads INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    preview_text TEXT,
    body_html TEXT,
    body_text TEXT,
    body_mjml TEXT,
    template_type TEXT CHECK (template_type IN (
        'transactional', 'marketing', 'notification', 'newsletter',
        'welcome', 'onboarding', 'reminder', 'confirmation', 'other'
    )),
    category TEXT,
    variables JSONB DEFAULT '[]',
    default_values JSONB DEFAULT '{}',
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    parent_template_id UUID REFERENCES email_templates(id),
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- Email sends tracking
CREATE TABLE IF NOT EXISTS email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES email_templates(id),
    campaign_id UUID REFERENCES campaigns(id),
    contact_id UUID REFERENCES contacts(id),
    user_id UUID REFERENCES users(id),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'queued', 'sending', 'sent', 'delivered',
        'opened', 'clicked', 'bounced', 'failed', 'complained', 'unsubscribed'
    )),
    provider TEXT,
    provider_message_id TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    first_click_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    bounce_type TEXT,
    bounce_reason TEXT,
    complained_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    click_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    variables_used JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Email click tracking
CREATE TABLE IF NOT EXISTS email_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_send_id UUID REFERENCES email_sends(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    event_category TEXT,
    event_action TEXT,
    event_label TEXT,
    event_value DECIMAL(12,2),
    user_id UUID REFERENCES users(id),
    contact_id UUID REFERENCES contacts(id),
    session_id TEXT,
    anonymous_id TEXT,
    page_url TEXT,
    page_title TEXT,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    properties JSONB DEFAULT '{}',
    context JSONB DEFAULT '{}',
    device_type TEXT,
    browser TEXT,
    browser_version TEXT,
    os TEXT,
    os_version TEXT,
    screen_resolution TEXT,
    ip_address INET,
    country TEXT,
    region TEXT,
    city TEXT,
    timezone TEXT,
    language TEXT,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page views
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    contact_id UUID REFERENCES contacts(id),
    session_id TEXT,
    anonymous_id TEXT,
    page_url TEXT NOT NULL,
    page_path TEXT,
    page_title TEXT,
    referrer_url TEXT,
    time_on_page_seconds INTEGER,
    scroll_depth_percent INTEGER,
    is_bounce BOOLEAN,
    is_exit BOOLEAN,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    ip_address INET,
    country TEXT,
    city TEXT,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversion goals
CREATE TABLE IF NOT EXISTS conversion_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    goal_type TEXT CHECK (goal_type IN (
        'page_view', 'event', 'form_submit', 'purchase',
        'signup', 'download', 'video_view', 'custom'
    )),
    trigger_config JSONB NOT NULL,
    value_cents INTEGER,
    currency TEXT DEFAULT 'EUR',
    is_active BOOLEAN DEFAULT TRUE,
    entity_scope TEXT CHECK (entity_scope IN ('ozean_licht', 'kids_ascension')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES conversion_goals(id),
    campaign_id UUID REFERENCES campaigns(id),
    user_id UUID REFERENCES users(id),
    contact_id UUID REFERENCES contacts(id),
    session_id TEXT,
    value_cents INTEGER,
    currency TEXT DEFAULT 'EUR',
    attribution_source TEXT,
    attribution_medium TEXT,
    attribution_campaign TEXT,
    conversion_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for marketing tables
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_entity_scope ON campaigns(entity_scope);
CREATE INDEX IF NOT EXISTS idx_campaigns_start ON campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_end ON campaigns(end_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_airtable_id ON campaigns(airtable_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaigns_product ON campaigns(product_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_course ON campaigns(course_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_event ON campaigns(event_id);

CREATE INDEX IF NOT EXISTS idx_campaign_stats_campaign ON campaign_stats(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_stats_date ON campaign_stats(date);

CREATE INDEX IF NOT EXISTS idx_templates_type ON email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_entity_scope ON email_templates(entity_scope);
CREATE INDEX IF NOT EXISTS idx_templates_airtable_id ON email_templates(airtable_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON email_templates(category);

CREATE INDEX IF NOT EXISTS idx_email_sends_template ON email_sends(template_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_contact ON email_sends(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_sent ON email_sends(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_sends_provider ON email_sends(provider_message_id);

CREATE INDEX IF NOT EXISTS idx_email_clicks_send ON email_clicks(email_send_id);
CREATE INDEX IF NOT EXISTS idx_email_clicks_url ON email_clicks(url);

CREATE INDEX IF NOT EXISTS idx_analytics_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_contact ON analytics_events(contact_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_entity_scope ON analytics_events(entity_scope);
CREATE INDEX IF NOT EXISTS idx_analytics_utm ON analytics_events(utm_source, utm_medium, utm_campaign);
CREATE INDEX IF NOT EXISTS idx_analytics_properties ON analytics_events USING gin(properties);

CREATE INDEX IF NOT EXISTS idx_pageviews_user ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_pageviews_created ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_entity_scope ON page_views(entity_scope);

CREATE INDEX IF NOT EXISTS idx_goals_type ON conversion_goals(goal_type);
CREATE INDEX IF NOT EXISTS idx_goals_active ON conversion_goals(is_active);
CREATE INDEX IF NOT EXISTS idx_goals_entity_scope ON conversion_goals(entity_scope);

CREATE INDEX IF NOT EXISTS idx_conversions_goal ON conversions(goal_id);
CREATE INDEX IF NOT EXISTS idx_conversions_campaign ON conversions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_conversions_user ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created ON conversions(created_at DESC);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS campaigns_updated_at ON campaigns;
CREATE TRIGGER campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS templates_marketing_updated_at ON email_templates;
CREATE TRIGGER templates_marketing_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

DROP TRIGGER IF EXISTS goals_updated_at ON conversion_goals;
CREATE TRIGGER goals_updated_at
    BEFORE UPDATE ON conversion_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();

-- Function to update template usage
CREATE OR REPLACE FUNCTION update_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE email_templates
    SET usage_count = usage_count + 1,
        last_used_at = NOW()
    WHERE id = NEW.template_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_template_usage ON email_sends;
CREATE TRIGGER track_template_usage
    AFTER INSERT ON email_sends
    FOR EACH ROW
    WHEN (NEW.template_id IS NOT NULL)
    EXECUTE FUNCTION update_template_usage();

-- Function to update email send stats
CREATE OR REPLACE FUNCTION update_email_send_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update campaign stats when email is sent/opened/clicked
    IF NEW.campaign_id IS NOT NULL THEN
        IF OLD.status != 'sent' AND NEW.status = 'sent' THEN
            INSERT INTO campaign_stats (campaign_id, date, sends)
            VALUES (NEW.campaign_id, CURRENT_DATE, 1)
            ON CONFLICT (campaign_id, date)
            DO UPDATE SET sends = campaign_stats.sends + 1;
        END IF;

        IF OLD.status != 'delivered' AND NEW.status = 'delivered' THEN
            INSERT INTO campaign_stats (campaign_id, date, deliveries)
            VALUES (NEW.campaign_id, CURRENT_DATE, 1)
            ON CONFLICT (campaign_id, date)
            DO UPDATE SET deliveries = campaign_stats.deliveries + 1;
        END IF;

        IF OLD.opened_at IS NULL AND NEW.opened_at IS NOT NULL THEN
            INSERT INTO campaign_stats (campaign_id, date, opens, unique_opens)
            VALUES (NEW.campaign_id, CURRENT_DATE, 1, 1)
            ON CONFLICT (campaign_id, date)
            DO UPDATE SET
                opens = campaign_stats.opens + 1,
                unique_opens = campaign_stats.unique_opens + CASE WHEN OLD.opened_at IS NULL THEN 1 ELSE 0 END;
        END IF;

        IF OLD.status = 'bounced' OR NEW.status = 'bounced' THEN
            INSERT INTO campaign_stats (campaign_id, date, bounces)
            VALUES (NEW.campaign_id, CURRENT_DATE, 1)
            ON CONFLICT (campaign_id, date)
            DO UPDATE SET bounces = campaign_stats.bounces + 1;
        END IF;

        IF NEW.status = 'unsubscribed' AND OLD.status != 'unsubscribed' THEN
            INSERT INTO campaign_stats (campaign_id, date, unsubscribes)
            VALUES (NEW.campaign_id, CURRENT_DATE, 1)
            ON CONFLICT (campaign_id, date)
            DO UPDATE SET unsubscribes = campaign_stats.unsubscribes + 1;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_email_stats ON email_sends;
CREATE TRIGGER track_email_stats
    AFTER UPDATE ON email_sends
    FOR EACH ROW
    EXECUTE FUNCTION update_email_send_stats();

-- Add comments for documentation
COMMENT ON TABLE campaigns IS 'Marketing campaigns across channels';
COMMENT ON TABLE campaign_stats IS 'Daily aggregated statistics per campaign';
COMMENT ON TABLE email_templates IS 'Reusable email templates';
COMMENT ON TABLE email_sends IS 'Individual email send tracking';
COMMENT ON TABLE email_clicks IS 'Email link click tracking';
COMMENT ON TABLE analytics_events IS 'Custom analytics events';
COMMENT ON TABLE page_views IS 'Website page view tracking';
COMMENT ON TABLE conversion_goals IS 'Conversion goal definitions';
COMMENT ON TABLE conversions IS 'Conversion tracking with attribution';
COMMENT ON COLUMN campaigns.airtable_id IS 'Original Airtable record ID for migration tracking';
COMMENT ON COLUMN email_templates.airtable_id IS 'Original Airtable record ID for migration tracking';
