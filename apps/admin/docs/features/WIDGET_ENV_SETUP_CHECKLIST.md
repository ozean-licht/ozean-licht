# Widget Environment Setup Checklist

Quick checklist for setting up widget environment variables. Complete these steps in order.

## Prerequisites

- [ ] Access to server/deployment environment
- [ ] Admin access to environment variables
- [ ] OpenSSL installed (`openssl version` to check)

## Setup Steps

### 1. Generate Security Keys

Run these commands and save the output securely:

```bash
# Platform key for Ozean Licht
echo "WIDGET_PLATFORM_KEY_OZEAN_LICHT=$(openssl rand -hex 32)"

# Platform key for Kids Ascension
echo "WIDGET_PLATFORM_KEY_KIDS_ASCENSION=$(openssl rand -hex 32)"

# HMAC secret for user verification
echo "WIDGET_HMAC_SECRET=$(openssl rand -hex 32)"
```

**Security Notes**:
- Generate different keys for development and production
- Never commit these keys to version control
- Store production keys in secure vault

### 2. Configure Environment File

**Development**: Update `.env.local`

```bash
# Copy example file if starting fresh
cp .env.example .env.local

# Add widget variables (paste generated keys)
cat >> .env.local << 'EOF'

# Widget Configuration
WIDGET_PLATFORM_KEY_OZEAN_LICHT=<paste_key_1>
WIDGET_PLATFORM_KEY_KIDS_ASCENSION=<paste_key_2>
WIDGET_HMAC_SECRET=<paste_key_3>
WIDGET_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
EOF
```

**Production**: Add via deployment platform (Coolify, Docker, etc.)

### 3. Configure CORS Origins

Update `WIDGET_ALLOWED_ORIGINS` with your domains:

**Development**:
```bash
WIDGET_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Production**:
```bash
WIDGET_ALLOWED_ORIGINS=https://ozean-licht.at,https://www.ozean-licht.at,https://kids-ascension.com,https://www.kids-ascension.com
```

**Important**:
- Include all domain variations (www, subdomains)
- No trailing slashes
- Comma-separated, no spaces
- Use full URLs with protocol

### 4. Validate Configuration

Run the validation script:

```bash
cd apps/admin
node scripts/validate-widget-env.js
```

Expected output:
```
============================================================
Widget Environment Validation
============================================================

Required Variables
✓ WIDGET_PLATFORM_KEY_OZEAN_LICHT format is valid
✓ WIDGET_PLATFORM_KEY_KIDS_ASCENSION format is valid
✓ WIDGET_HMAC_SECRET format is valid

CORS Configuration
✓ WIDGET_ALLOWED_ORIGINS format is valid (2 origins)
  - https://ozean-licht.at
  - https://kids-ascension.com

============================================================
✓ Validation PASSED - All checks successful!
============================================================
```

### 5. Restart Application

**Development**:
```bash
npm run dev
# or
yarn dev
```

**Production**:
- Restart via deployment platform
- Verify environment variables loaded
- Check application logs for errors

### 6. Test Widget Functionality

1. Generate embed code:
   - Navigate to: Dashboard → Settings → Widget Configuration
   - Select platform
   - Generate embed code

2. Test on development site:
   - Add embed code to test page
   - Verify widget loads
   - Check browser console for errors

3. Test user identification:
   - Call `identify()` with test user
   - Verify no HMAC errors
   - Check user appears in admin dashboard

## Verification Checklist

After setup, verify:

- [ ] All environment variables are set
- [ ] Validation script passes
- [ ] Application starts without errors
- [ ] Widget embed code generates successfully
- [ ] Widget loads on test page
- [ ] CORS allows your domain
- [ ] User identification works
- [ ] No security warnings in logs

## Common Issues

### Validation Fails

**Issue**: "Missing required variable"

**Fix**:
1. Check variable name spelling
2. Verify `.env.local` exists
3. Ensure no typos in variable names
4. Restart application after changes

### Widget Not Loading

**Issue**: CORS error in browser console

**Fix**:
1. Add domain to `WIDGET_ALLOWED_ORIGINS`
2. Remove trailing slashes
3. Include protocol (http/https)
4. Restart application

### Invalid Platform Key

**Issue**: "Invalid platform key" error

**Fix**:
1. Verify key in embed code matches environment
2. Check key is 64 hex characters
3. Ensure correct platform key used
4. Regenerate if necessary

### HMAC Verification Failed

**Issue**: User identification fails with HMAC error

**Fix**:
1. Verify `WIDGET_HMAC_SECRET` is set
2. Check hash generation uses same secret
3. Ensure hash algorithm is SHA-256
4. Verify userId + email order matches

## Security Checklist

Before going to production:

- [ ] Generated new keys (not reused from development)
- [ ] Stored production keys in secure vault
- [ ] Removed localhost from `WIDGET_ALLOWED_ORIGINS`
- [ ] Verified HTTPS for all origins
- [ ] Tested HMAC verification
- [ ] Reviewed CORS policy
- [ ] Documented key rotation procedure
- [ ] Set up monitoring for widget errors

## Key Rotation Procedure

When rotating keys:

1. Generate new keys (don't delete old ones yet)
2. Update environment variables with new keys
3. Update embed codes on all sites
4. Monitor for errors (24-48 hours)
5. Verify all sites using new keys
6. Delete old keys from environment

**Recommended Rotation Schedule**:
- Platform keys: Every 6-12 months
- HMAC secret: Every 12 months or if compromised

## Support Resources

- **Full Documentation**: `/docs/WIDGET_CONFIGURATION.md`
- **Quick Start**: `/docs/features/widget-system-quickstart.md`
- **Validation Script**: `/scripts/validate-widget-env.js`
- **Environment Example**: `/.env.example`

## Next Steps

After successful setup:

1. Generate production embed codes
2. Deploy to production sites
3. Set up monitoring/alerts
4. Document for team
5. Schedule key rotation

---

**Last Updated**: 2025-12-05
**Version**: 1.0.0
