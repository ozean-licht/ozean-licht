# Shared Email Templates

Reusable React Email templates for the Ozean Licht Ecosystem.

## Overview

This package provides email templates using [React Email](https://react.email) for:
- **Kids Ascension** - Waitlist confirmation and welcome emails
- **Ozean Licht** - Future newsletter and transactional emails

## Structure

```
shared/email-templates/
├── emails/
│   ├── components/
│   │   └── layout.tsx           # Shared email layout wrapper
│   ├── ka-waitlist-confirm.tsx  # Kids Ascension confirmation email
│   └── ka-waitlist-welcome.tsx  # Kids Ascension welcome email
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### In Next.js API Routes

```typescript
import { render } from '@react-email/components'
import KAWaitlistConfirm from '@shared/email-templates/emails/ka-waitlist-confirm'

// Render email to HTML
const html = await render(
  KAWaitlistConfirm({
    confirmUrl: 'https://kids-ascension.dev/waitlist/confirm/TOKEN'
  })
)

// Send via Resend
await resend.emails.send({
  from: 'Kids Ascension <noreply@kids-ascension.dev>',
  to: 'user@example.com',
  subject: 'Bestätige deine E-Mail-Adresse',
  html
})
```

## Development

### Preview Templates

Start the React Email development server to preview templates:

```bash
pnpm --filter @shared/email-templates dev
```

Then open http://localhost:3000 to see all email templates.

### Add New Template

1. Create new file in `emails/` directory
2. Use the shared `EmailLayout` component
3. Export as default function with typed props
4. Test in dev server before deploying

## Customization

### Kids Ascension Branding
- Primary color: Cyan (#0ea5e9)
- Secondary color: Blue (#3b82f6)
- Font: System fonts (Arial, Helvetica, sans-serif)
- Logo: Kids Ascension logo (hosted on CDN)

### Ozean Licht Branding
- Primary color: Turquoise (#0ec2bc)
- Font: Montserrat, sans-serif
- Logo: Ozean Licht logo (hosted on CDN)

## Migration to MCP Gateway

When Ozean Licht needs email functionality, extract email sending logic to MCP Gateway:

1. Create `tools/mcp-gateway/src/services/resend/handler.ts`
2. Move email sending from app code to MCP handler
3. Both apps use MCP client for email sending
4. Templates remain in this shared package (no changes needed)

## Best Practices

- **Inline CSS**: Use inline styles for maximum email client compatibility
- **Table Layouts**: Use table-based layouts for better rendering
- **Alt Text**: Always include alt text for images
- **Plain Text**: Provide plain text version for accessibility
- **Test Everywhere**: Test on Gmail, Outlook, Apple Mail, etc.

## Resources

- [React Email Documentation](https://react.email)
- [React Email Components](https://react.email/docs/components/button)
- [Email Client Compatibility](https://www.caniemail.com/)
