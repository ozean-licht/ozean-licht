/**
 * Support Channel Configuration Database Queries
 *
 * Database queries for managing support channel configurations
 * (WhatsApp, Telegram, Email, Web Widget) and widget settings.
 */

import { query } from './index';
import type {
  ChannelConfig,
  WidgetSettings,
  UpdateChannelConfigInput,
  UpdateWidgetSettingsInput,
  Channel,
  Platform,
  Team,
  ChannelSpecificConfig,
  BusinessHours,
  PreChatFormField,
  ReplyTime,
} from '../../types/support';

// ============================================================================
// Database Row Types (snake_case)
// ============================================================================

interface DBChannelConfig {
  id: string;
  channel: Channel;
  display_name: string;
  is_enabled: boolean;
  chatwoot_inbox_id: number | null;
  config: Record<string, unknown>;
  default_team: Team | null;
  auto_response_enabled: boolean;
  auto_response_message: string | null;
  business_hours: Record<string, unknown>;
  platform: Platform;
  created_at: string;
  updated_at: string;
}

interface DBWidgetSettings {
  id: string;
  platform: Platform;
  primary_color: string;
  position: 'left' | 'right';
  welcome_title: string;
  welcome_subtitle: string;
  reply_time: string;
  show_branding: boolean;
  logo_url: string | null;
  pre_chat_form_enabled: boolean;
  pre_chat_form_fields: unknown[];
  hide_message_bubble: boolean;
  show_popup_onload: boolean;
  popup_delay_seconds: number;
  language: string;
  custom_css: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for BusinessHours
 */
function isBusinessHours(value: unknown): value is BusinessHours {
  if (typeof value !== 'object' || value === null) return false;
  const bh = value as Record<string, unknown>;
  return (
    (bh.enabled === undefined || typeof bh.enabled === 'boolean') &&
    (bh.timezone === undefined || typeof bh.timezone === 'string') &&
    (bh.schedule === undefined || typeof bh.schedule === 'object')
  );
}

/**
 * Type guard for PreChatFormField array
 */
function isPreChatFormFieldArray(value: unknown): value is PreChatFormField[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const field = item as Record<string, unknown>;
    return (
      typeof field.name === 'string' &&
      typeof field.label === 'string' &&
      typeof field.required === 'boolean'
    );
  });
}

/**
 * Type guard for ReplyTime
 */
function isReplyTime(value: unknown): value is ReplyTime {
  return (
    value === 'in_a_few_minutes' ||
    value === 'in_a_few_hours' ||
    value === 'in_a_day'
  );
}

/**
 * Type guard for WebWidgetConfig
 */
function isWebWidgetConfig(value: unknown): value is { websiteToken: string; allowedDomains?: string[] } {
  if (typeof value !== 'object' || value === null) return false;
  const config = value as Record<string, unknown>;
  return typeof config.websiteToken === 'string';
}

/**
 * Safely cast unknown config to ChannelSpecificConfig
 * Falls back to empty object if invalid
 */
function parseChannelConfig(config: unknown): ChannelSpecificConfig {
  // Basic validation - ensure it's an object
  if (typeof config !== 'object' || config === null) {
    return { websiteToken: '', allowedDomains: [] };
  }
  // Trust the database to have correct structure
  // In production, consider using Zod for runtime validation
  return config as ChannelSpecificConfig;
}

// ============================================================================
// Security Utilities
// ============================================================================

/**
 * Escape string for safe use in JavaScript string literals
 *
 * Prevents XSS by escaping quotes, backslashes, and control characters.
 *
 * @param str - String to escape
 * @returns Escaped string safe for JavaScript
 */
function escapeJavaScript(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Backslash
    .replace(/'/g, "\\'")    // Single quote
    .replace(/"/g, '\\"')    // Double quote
    .replace(/\n/g, '\\n')   // Newline
    .replace(/\r/g, '\\r')   // Carriage return
    .replace(/\t/g, '\\t')   // Tab
    .replace(/\u2028/g, '\\u2028')  // Line separator
    .replace(/\u2029/g, '\\u2029'); // Paragraph separator
}

/**
 * Sanitize CSS to remove potentially dangerous content
 *
 * Removes script tags and javascript: URLs from CSS strings.
 * This is a basic sanitizer - for production, consider using a dedicated CSS parser.
 *
 * @param css - CSS string to sanitize
 * @returns Sanitized CSS
 */
function sanitizeCSS(css: string): string {
  // Remove script tags
  let sanitized = css.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: URLs (can contain scripts)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Transform database row to ChannelConfig type
 *
 * Converts snake_case database columns to camelCase application types.
 *
 * TODO: SECURITY - Add decryption for sensitive config fields here
 * When credential encryption is implemented, decrypt sensitive fields
 * (accessToken, botToken, password) after reading from database.
 *
 * @param row - Database row from support_channel_configs
 * @returns Transformed ChannelConfig object
 */
function transformChannelConfig(row: DBChannelConfig): ChannelConfig {
  // Use type guard for business hours validation
  const businessHours: BusinessHours = isBusinessHours(row.business_hours)
    ? row.business_hours
    : { enabled: false };

  return {
    id: row.id,
    channel: row.channel,
    displayName: row.display_name,
    isEnabled: row.is_enabled,
    chatwootInboxId: row.chatwoot_inbox_id || undefined,
    config: parseChannelConfig(row.config), // Safe type casting with validation
    defaultTeam: row.default_team || undefined,
    autoResponseEnabled: row.auto_response_enabled,
    autoResponseMessage: row.auto_response_message || undefined,
    businessHours,
    platform: row.platform,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function transformWidgetSettings(row: DBWidgetSettings): WidgetSettings {
  // Use type guards for validation
  const replyTime: ReplyTime = isReplyTime(row.reply_time)
    ? row.reply_time
    : 'in_a_few_minutes';

  const preChatFormFields: PreChatFormField[] = isPreChatFormFieldArray(row.pre_chat_form_fields)
    ? row.pre_chat_form_fields
    : [];

  return {
    id: row.id,
    platform: row.platform,
    primaryColor: row.primary_color,
    position: row.position,
    welcomeTitle: row.welcome_title,
    welcomeSubtitle: row.welcome_subtitle,
    replyTime,
    showBranding: row.show_branding,
    logoUrl: row.logo_url || undefined,
    preChatFormEnabled: row.pre_chat_form_enabled,
    preChatFormFields,
    hideMessageBubble: row.hide_message_bubble,
    showPopupOnload: row.show_popup_onload,
    popupDelaySeconds: row.popup_delay_seconds,
    language: row.language,
    customCss: row.custom_css || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================================
// Channel Config Functions
// ============================================================================

/**
 * Get all channel configurations
 *
 * @param platform - Optional platform filter
 * @returns List of channel configurations
 *
 * @example
 * const configs = await getAllChannelConfigs('ozean_licht');
 */
export async function getAllChannelConfigs(
  platform?: Platform
): Promise<ChannelConfig[]> {
  let sql = `
    SELECT * FROM support_channel_configs
  `;
  const params: unknown[] = [];

  if (platform) {
    sql += ` WHERE platform = $1`;
    params.push(platform);
  }

  sql += ` ORDER BY channel ASC`;

  const rows = await query<DBChannelConfig>(sql, params);
  return rows.map(transformChannelConfig);
}

/**
 * Get a single channel configuration by channel type
 *
 * @param channel - Channel type
 * @returns Channel configuration or null if not found
 *
 * @example
 * const config = await getChannelConfig('web_widget');
 */
export async function getChannelConfig(
  channel: Channel
): Promise<ChannelConfig | null> {
  const sql = `SELECT * FROM support_channel_configs WHERE channel = $1`;
  const rows = await query<DBChannelConfig>(sql, [channel]);
  return rows.length > 0 ? transformChannelConfig(rows[0]) : null;
}

/**
 * Get channel config by ID
 *
 * @param id - Channel config UUID
 * @returns Channel configuration or null if not found
 *
 * @example
 * const config = await getChannelConfigById('uuid-here');
 */
export async function getChannelConfigById(
  id: string
): Promise<ChannelConfig | null> {
  const sql = `SELECT * FROM support_channel_configs WHERE id = $1`;
  const rows = await query<DBChannelConfig>(sql, [id]);
  return rows.length > 0 ? transformChannelConfig(rows[0]) : null;
}

/**
 * Update channel configuration
 *
 * @param channel - Channel type
 * @param data - Fields to update
 * @returns Updated channel configuration or null if not found
 *
 * @example
 * const updated = await updateChannelConfig('whatsapp', {
 *   isEnabled: true,
 *   defaultTeam: 'sales',
 *   autoResponseEnabled: true
 * });
 */
export async function updateChannelConfig(
  channel: Channel,
  data: UpdateChannelConfigInput
): Promise<ChannelConfig | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (data.isEnabled !== undefined) {
    setClauses.push(`is_enabled = $${paramIndex++}`);
    params.push(data.isEnabled);
  }

  if (data.chatwootInboxId !== undefined) {
    setClauses.push(`chatwoot_inbox_id = $${paramIndex++}`);
    params.push(data.chatwootInboxId);
  }

  if (data.config !== undefined) {
    // TODO: SECURITY - Implement encryption for sensitive credentials before enabling WhatsApp/Telegram
    // Credentials (API tokens, passwords) are currently stored in plaintext JSONB.
    // Before enabling WhatsApp (accessToken) or Telegram (botToken) channels in production:
    // 1. Implement encryption at application layer (e.g., @aws-crypto/client-node)
    // 2. Encrypt sensitive fields before JSON.stringify()
    // 3. Decrypt after retrieval in transformChannelConfig()
    // 4. Store encryption key in environment variable (CHANNEL_CONFIG_ENCRYPTION_KEY)
    // See code review report issue #1 for detailed implementation options.

    // Merge with existing config rather than replace
    setClauses.push(`config = config || $${paramIndex++}::jsonb`);
    params.push(JSON.stringify(data.config));
  }

  if (data.defaultTeam !== undefined) {
    setClauses.push(`default_team = $${paramIndex++}`);
    params.push(data.defaultTeam);
  }

  if (data.autoResponseEnabled !== undefined) {
    setClauses.push(`auto_response_enabled = $${paramIndex++}`);
    params.push(data.autoResponseEnabled);
  }

  if (data.autoResponseMessage !== undefined) {
    setClauses.push(`auto_response_message = $${paramIndex++}`);
    params.push(data.autoResponseMessage);
  }

  if (data.businessHours !== undefined) {
    setClauses.push(`business_hours = $${paramIndex++}::jsonb`);
    params.push(JSON.stringify(data.businessHours));
  }

  if (setClauses.length === 0) {
    return getChannelConfig(channel);
  }

  params.push(channel);
  const sql = `
    UPDATE support_channel_configs
    SET ${setClauses.join(', ')}
    WHERE channel = $${paramIndex}
    RETURNING *
  `;

  const rows = await query<DBChannelConfig>(sql, params);
  return rows.length > 0 ? transformChannelConfig(rows[0]) : null;
}

/**
 * Get enabled channels
 *
 * @returns List of enabled channel configurations
 *
 * @example
 * const enabled = await getEnabledChannels();
 * console.log(`${enabled.length} channels are currently enabled`);
 */
export async function getEnabledChannels(): Promise<ChannelConfig[]> {
  const sql = `
    SELECT * FROM support_channel_configs
    WHERE is_enabled = true
    ORDER BY channel ASC
  `;
  const rows = await query<DBChannelConfig>(sql);
  return rows.map(transformChannelConfig);
}

// ============================================================================
// Widget Settings Functions
// ============================================================================

/**
 * Get widget settings for a platform
 *
 * @param platform - Platform identifier
 * @returns Widget settings or null if not found
 *
 * @example
 * const settings = await getWidgetSettings('ozean_licht');
 */
export async function getWidgetSettings(
  platform: Platform
): Promise<WidgetSettings | null> {
  const sql = `SELECT * FROM support_widget_settings WHERE platform = $1`;
  const rows = await query<DBWidgetSettings>(sql, [platform]);
  return rows.length > 0 ? transformWidgetSettings(rows[0]) : null;
}

/**
 * Get all widget settings
 *
 * @returns List of all widget settings
 *
 * @example
 * const allSettings = await getAllWidgetSettings();
 */
export async function getAllWidgetSettings(): Promise<WidgetSettings[]> {
  const sql = `SELECT * FROM support_widget_settings ORDER BY platform ASC`;
  const rows = await query<DBWidgetSettings>(sql);
  return rows.map(transformWidgetSettings);
}

/**
 * Update widget settings
 *
 * @param platform - Platform identifier
 * @param data - Fields to update
 * @returns Updated widget settings or null if not found
 *
 * @example
 * const updated = await updateWidgetSettings('ozean_licht', {
 *   primaryColor: '#6366f1',
 *   position: 'right',
 *   welcomeTitle: 'How can we help?'
 * });
 */
export async function updateWidgetSettings(
  platform: Platform,
  data: UpdateWidgetSettingsInput
): Promise<WidgetSettings | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof UpdateWidgetSettingsInput; column: string; jsonb?: boolean }> = [
    { key: 'primaryColor', column: 'primary_color' },
    { key: 'position', column: 'position' },
    { key: 'welcomeTitle', column: 'welcome_title' },
    { key: 'welcomeSubtitle', column: 'welcome_subtitle' },
    { key: 'replyTime', column: 'reply_time' },
    { key: 'showBranding', column: 'show_branding' },
    { key: 'logoUrl', column: 'logo_url' },
    { key: 'preChatFormEnabled', column: 'pre_chat_form_enabled' },
    { key: 'preChatFormFields', column: 'pre_chat_form_fields', jsonb: true },
    { key: 'hideMessageBubble', column: 'hide_message_bubble' },
    { key: 'showPopupOnload', column: 'show_popup_onload' },
    { key: 'popupDelaySeconds', column: 'popup_delay_seconds' },
    { key: 'language', column: 'language' },
    { key: 'customCss', column: 'custom_css' },
  ];

  for (const { key, column, jsonb } of fieldMappings) {
    if (data[key] !== undefined) {
      if (jsonb) {
        setClauses.push(`${column} = $${paramIndex++}::jsonb`);
        params.push(JSON.stringify(data[key]));
      } else {
        setClauses.push(`${column} = $${paramIndex++}`);
        params.push(data[key]);
      }
    }
  }

  if (setClauses.length === 0) {
    return getWidgetSettings(platform);
  }

  params.push(platform);
  const sql = `
    UPDATE support_widget_settings
    SET ${setClauses.join(', ')}
    WHERE platform = $${paramIndex}
    RETURNING *
  `;

  const rows = await query<DBWidgetSettings>(sql, params);
  return rows.length > 0 ? transformWidgetSettings(rows[0]) : null;
}

/**
 * Generate widget embed code for a platform
 *
 * @param platform - Platform identifier
 * @returns Widget embed code as HTML/JavaScript string
 *
 * @example
 * const embedCode = await generateWidgetEmbedCode('ozean_licht');
 * console.log('Add this code to your website:', embedCode);
 */
export async function generateWidgetEmbedCode(platform: Platform): Promise<string> {
  const settings = await getWidgetSettings(platform);
  const channelConfig = await getChannelConfig('web_widget');

  if (!settings || !channelConfig) {
    return '<!-- Widget not configured -->';
  }

  // Escape all user-provided values to prevent XSS
  // Use type guard to safely access websiteToken
  const websiteToken = isWebWidgetConfig(channelConfig.config)
    ? escapeJavaScript(channelConfig.config.websiteToken)
    : '';

  // Fallback URL for development/staging environments
  // In production, CHATWOOT_BASE_URL environment variable should always be set
  // The fallback ensures embed code generation doesn't fail during development
  const baseUrl = process.env.CHATWOOT_BASE_URL || 'https://chatwoot.ozean-licht.dev';
  const position = escapeJavaScript(settings.position);
  const language = escapeJavaScript(settings.language);
  const welcomeTitle = escapeJavaScript(settings.welcomeTitle);
  const primaryColor = escapeJavaScript(settings.primaryColor);

  // Sanitize custom CSS to remove dangerous content
  const customCss = settings.customCss ? sanitizeCSS(settings.customCss) : '';

  return `
<script>
  window.chatwootSettings = {
    hideMessageBubble: ${settings.hideMessageBubble},
    position: '${position}',
    locale: '${language}',
    type: 'standard',
    launcherTitle: '${welcomeTitle}',
  };
  (function(d,t) {
    var BASE_URL="${baseUrl}";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: '${websiteToken}',
        baseUrl: BASE_URL
      })
    }
  })(document,"script");
</script>
<style>
  .woot-widget-bubble {
    background-color: ${primaryColor} !important;
  }
  ${customCss}
</style>
`.trim();
}
