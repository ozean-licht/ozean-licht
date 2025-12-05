# Widget System Configuration Guide

## Overview

The Ozean Licht widget system enables embedded chat and support functionality across multiple platforms. This document explains how to configure the widget system securely for production and development environments.

## Environment Variables

### Required Variables

#### 1. Platform API Keys

```bash
WIDGET_PLATFORM_KEY_OZEAN_LICHT=your_32_char_hex_key_here
WIDGET_PLATFORM_KEY_KIDS_ASCENSION=your_32_char_hex_key_here
```

**Purpose**: Authenticate widget embed codes per platform. Each platform has its own unique key for security isolation.

**Generate Keys**:
```bash
openssl rand -hex 32
```

**Security Notes**:
- Generate unique keys for each platform
- Never commit these keys to version control
- Rotate keys if compromised
- Use different keys for development and production

#### 2. HMAC Secret

```bash
WIDGET_HMAC_SECRET=your_32_char_hex_hmac_secret
```

**Purpose**: Verify user identity when calling `identify()` from the widget. This ensures that user data cannot be forged by malicious clients.

**Generate Secret**:
```bash
openssl rand -hex 32
```

**Security Notes**:
- This is the MOST CRITICAL secret for security
- User identity verification relies on this secret
- If compromised, ALL user identity verifications are vulnerable
- Rotate immediately if exposed

#### 3. Allowed Origins (CORS)

```bash
WIDGET_ALLOWED_ORIGINS=https://ozean-licht.at,https://kids-ascension.com
```

**Purpose**: Comma-separated list of domains that can embed the widget.

**Format Rules**:
- Full URLs with protocol (https:// or http://)
- No trailing slashes
- Comma-separated, no spaces
- Include all domain variations (www, subdomains)

**Examples**:

Development:
```bash
WIDGET_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

Production:
```bash
WIDGET_ALLOWED_ORIGINS=https://ozean-licht.at,https://www.ozean-licht.at,https://kids-ascension.com,https://www.kids-ascension.com
```

## Setup Instructions

### 1. Development Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cd /opt/ozean-licht-ecosystem/apps/admin
   cp .env.example .env.local
   ```

2. Generate development keys:
   ```bash
   # Platform key for Ozean Licht
   echo "WIDGET_PLATFORM_KEY_OZEAN_LICHT=$(openssl rand -hex 32)"

   # Platform key for Kids Ascension
   echo "WIDGET_PLATFORM_KEY_KIDS_ASCENSION=$(openssl rand -hex 32)"

   # HMAC secret
   echo "WIDGET_HMAC_SECRET=$(openssl rand -hex 32)"
   ```

3. Update `.env.local` with generated keys and development origins:
   ```bash
   WIDGET_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

### 2. Production Environment

1. Generate production keys (use different keys than development):
   ```bash
   openssl rand -hex 32  # For OZEAN_LICHT
   openssl rand -hex 32  # For KIDS_ASCENSION
   openssl rand -hex 32  # For HMAC_SECRET
   ```

2. Add to production environment (Coolify, Docker, etc.):
   - Do NOT commit to `.env.local`
   - Use secure environment variable management
   - Set variables through Coolify UI or deployment platform

3. Configure production origins:
   ```bash
   WIDGET_ALLOWED_ORIGINS=https://ozean-licht.at,https://www.ozean-licht.at,https://kids-ascension.com,https://www.kids-ascension.com
   ```

## Widget Embed Code Generation

### Admin Dashboard

1. Navigate to: **Dashboard → Settings → Widget Configuration**
2. Select platform (Ozean Licht or Kids Ascension)
3. Click "Generate Embed Code"
4. Copy the generated code snippet

### Example Embed Code

```html
<!-- Ozean Licht Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['OzeanLichtWidget']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','ozWidget','https://dashboard.ozean-licht.dev/widget/embed.js'));

  ozWidget('init', {
    platformKey: 'abc123...', // Unique per platform
    platform: 'ozean-licht'
  });
</script>
```

## User Identity Verification

### Server-Side HMAC Generation

When identifying users, generate an HMAC signature on your backend:

```javascript
// Node.js example
const crypto = require('crypto');

function generateUserHash(userId, userEmail) {
  const hmac = crypto.createHmac('sha256', process.env.WIDGET_HMAC_SECRET);
  hmac.update(userId + userEmail);
  return hmac.digest('hex');
}

// Usage
const userHash = generateUserHash('user123', 'user@example.com');
```

### Client-Side Identification

Pass the hash to the widget:

```javascript
ozWidget('identify', {
  userId: 'user123',
  email: 'user@example.com',
  name: 'John Doe',
  hash: userHash // Generated server-side
});
```

### Security Flow

1. User logs in to your platform
2. Server generates HMAC hash using `WIDGET_HMAC_SECRET`
3. Client receives hash and user data
4. Widget calls `identify()` with hash
5. Backend verifies hash matches user data
6. If valid, user is authenticated for widget

## Troubleshooting

### CORS Errors

**Error**: `Access-Control-Allow-Origin header is missing`

**Solutions**:
- Verify domain is in `WIDGET_ALLOWED_ORIGINS`
- Check for trailing slashes (not allowed)
- Ensure protocol matches (http vs https)
- Restart server after changing environment variables

### Invalid Platform Key

**Error**: `Invalid platform key`

**Solutions**:
- Verify correct key for platform in embed code
- Check environment variables are loaded
- Ensure key is 64 characters (32 bytes hex)

### HMAC Verification Failed

**Error**: `Invalid user hash`

**Solutions**:
- Verify `WIDGET_HMAC_SECRET` matches between environments
- Check hash generation uses same algorithm (SHA-256)
- Ensure user ID and email match exactly (case-sensitive)
- Verify hash is hex-encoded string

## Security Best Practices

1. **Key Rotation**:
   - Rotate platform keys every 6-12 months
   - Rotate HMAC secret if compromised
   - Plan key rotation with zero downtime

2. **Access Control**:
   - Limit who can view/generate embed codes
   - Audit access to environment variables
   - Monitor widget usage patterns

3. **CORS Configuration**:
   - Only allow trusted domains
   - Use specific origins, not wildcards
   - Regularly audit allowed origins

4. **Environment Isolation**:
   - Use different keys for dev/staging/prod
   - Never share keys between environments
   - Keep production keys out of developer access

## API Reference

### Widget Initialization

```javascript
ozWidget('init', {
  platformKey: string,     // Required: Platform-specific key
  platform: string,        // Required: 'ozean-licht' | 'kids-ascension'
  position: string?,       // Optional: 'bottom-right' | 'bottom-left'
  primaryColor: string?,   // Optional: Brand color
  locale: string?          // Optional: 'de' | 'en'
});
```

### User Identification

```javascript
ozWidget('identify', {
  userId: string,          // Required: Unique user ID
  email: string,           // Required: User email
  name: string,            // Required: User display name
  hash: string,            // Required: HMAC signature
  customData: object?      // Optional: Additional user metadata
});
```

### Show/Hide Widget

```javascript
ozWidget('show');
ozWidget('hide');
ozWidget('toggle');
```

## Support

For questions or issues with widget configuration:

1. Check this documentation
2. Review API endpoint logs: `/api/widget/*`
3. Contact platform team
4. Create issue in project repository

---

**Last Updated**: 2025-12-05
**Version**: 1.0.0
