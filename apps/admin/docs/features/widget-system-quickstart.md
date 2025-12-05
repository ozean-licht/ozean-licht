# Widget System Quick Start Guide

## 5-Minute Setup

### 1. Generate Keys

```bash
# Run these commands and save the output
openssl rand -hex 32  # Copy for WIDGET_PLATFORM_KEY_OZEAN_LICHT
openssl rand -hex 32  # Copy for WIDGET_PLATFORM_KEY_KIDS_ASCENSION
openssl rand -hex 32  # Copy for WIDGET_HMAC_SECRET
```

### 2. Configure Environment

Add to `.env.local`:

```bash
# Widget Configuration
WIDGET_PLATFORM_KEY_OZEAN_LICHT=<paste first key>
WIDGET_PLATFORM_KEY_KIDS_ASCENSION=<paste second key>
WIDGET_HMAC_SECRET=<paste third key>
WIDGET_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Restart Server

```bash
# Restart your Next.js dev server
npm run dev
# or
yarn dev
```

### 4. Generate Embed Code

1. Open admin dashboard
2. Navigate to: Settings → Widget Configuration
3. Select platform
4. Click "Generate Embed Code"
5. Copy and paste into your website

## Common Use Cases

### Embed on Website

```html
<!-- Add before </body> tag -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['OzeanLichtWidget']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','ozWidget','https://dashboard.ozean-licht.dev/widget/embed.js'));

  ozWidget('init', {
    platformKey: 'YOUR_PLATFORM_KEY',
    platform: 'ozean-licht'
  });
</script>
```

### Identify Logged-In Users

**Backend (Node.js)**:
```javascript
const crypto = require('crypto');

app.get('/api/user/widget-auth', requireAuth, (req, res) => {
  const user = req.user;
  const hmac = crypto.createHmac('sha256', process.env.WIDGET_HMAC_SECRET);
  hmac.update(user.id + user.email);
  const hash = hmac.digest('hex');

  res.json({
    userId: user.id,
    email: user.email,
    name: user.name,
    hash: hash
  });
});
```

**Frontend**:
```javascript
// After user logs in, fetch widget auth
fetch('/api/user/widget-auth')
  .then(res => res.json())
  .then(data => {
    ozWidget('identify', {
      userId: data.userId,
      email: data.email,
      name: data.name,
      hash: data.hash
    });
  });
```

### Programmatic Control

```javascript
// Show widget
ozWidget('show');

// Hide widget
ozWidget('hide');

// Toggle visibility
ozWidget('toggle');

// Open specific conversation
ozWidget('show', { conversationId: '123' });

// Pre-fill message
ozWidget('show', { message: 'Hello, I need help with...' });
```

## Troubleshooting

### Widget Not Loading

1. Check browser console for errors
2. Verify CORS origins include your domain
3. Confirm platform key is correct
4. Check network tab for failed requests

### CORS Error

```
Access-Control-Allow-Origin header is missing
```

**Fix**: Add your domain to `WIDGET_ALLOWED_ORIGINS`:
```bash
WIDGET_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Invalid Platform Key

```
Error: Invalid platform key
```

**Fix**:
1. Check key in embed code matches environment variable
2. Verify key is 64 characters (hex-encoded 32 bytes)
3. Restart server after changing environment variables

### User Identification Failed

```
Error: Invalid user hash
```

**Fix**:
1. Verify `WIDGET_HMAC_SECRET` is set
2. Check hash generation uses SHA-256
3. Ensure userId + email order matches: `userId + email`
4. Verify hash is hex-encoded string

## Production Checklist

- [ ] Generated unique keys for production (different from dev)
- [ ] Set `WIDGET_ALLOWED_ORIGINS` to production domains only
- [ ] Removed localhost from `WIDGET_ALLOWED_ORIGINS`
- [ ] Verified HMAC secret is strong (32+ bytes)
- [ ] Tested widget on staging environment
- [ ] Documented platform keys in secure vault
- [ ] Set up key rotation schedule
- [ ] Configured monitoring for widget errors
- [ ] Tested user identification flow
- [ ] Verified CORS policy matches requirements

## Security Reminders

1. **Never commit secrets to Git**
   - Use `.env.local` for development
   - Use secure environment management for production

2. **Rotate keys periodically**
   - Platform keys: Every 6-12 months
   - HMAC secret: If compromised

3. **Restrict CORS origins**
   - Only allow trusted domains
   - No wildcards in production

4. **Verify user identity**
   - Always use HMAC for user identification
   - Never trust client-provided user data without hash

## Next Steps

- **Full Documentation**: `/docs/WIDGET_CONFIGURATION.md`
- **API Reference**: `/docs/api/widget-endpoints.md`
- **Security Guide**: `/docs/SECURITY-FIXES-PHASE6.md`

## Need Help?

1. Check full documentation: `docs/WIDGET_CONFIGURATION.md`
2. Review API logs: Admin Dashboard → Logs → Widget
3. Contact platform team
4. Create issue in repository

---

**Last Updated**: 2025-12-05
