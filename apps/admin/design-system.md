# Ozean Licht Admin Dashboard Design System

**Version:** 1.0
**Status:** Foundation Phase
**Based On:** shadcn/ui + Tailwind CSS

---

## Overview

This design system defines the visual language and component patterns for the Ozean Licht Ecosystem Admin Dashboard. It builds on top of shadcn/ui with custom Ozean Licht branding.

---

## 🎨 Brand Colors (Ozean Licht)

### Primary (Turquoise - Ocean/Light)
```css
--primary: 178 85% 40%;           /* #0ec2bc - Turquoise/Teal */
--primary-foreground: 0 0% 100%;  /* White text on primary */

/* Primary scale (from Ozean Licht) */
--primary-50: #E6F8F7;
--primary-100: #CCF1F0;
--primary-200: #99E3E1;
--primary-300: #66D5D2;
--primary-400: #33C7C3;
--primary-500: #0ec2bc;            /* DEFAULT */
--primary-600: #0BA09A;
--primary-700: #087E78;
--primary-800: #065C56;
--primary-900: #033A34;
```

### Cosmic Background (Dark Theme)
```css
--background: 210 36% 8%;         /* #0A0F1A - Deep cosmic blue */
--foreground: 0 0% 100%;          /* #FFFFFF - Pure white */
```

### Muted (Gray Tones)
```css
--muted: 215 16% 47%;             /* #64748B - Slate gray */
--muted-foreground: 214 15% 66%;  /* #94A3B8 - Light slate */
```

### Neutral Palette
```css
--background: 0 0% 100%;          /* White */
--foreground: 222.2 84% 4.9%;     /* Near Black */
--card: 0 0% 100%;                /* Card background */
--card-foreground: 222.2 84% 4.9%; /* Card text */
--popover: 0 0% 100%;             /* Popover background */
--popover-foreground: 222.2 84% 4.9%; /* Popover text */
--muted: 210 40% 96.1%;           /* Muted background */
--muted-foreground: 215.4 16.3% 46.9%; /* Muted text */
```

### Semantic Colors
```css
--destructive: 0 84.2% 60.2%;     /* Red - Errors/Delete */
--destructive-foreground: 0 0% 100%; /* White */
--success: 142 76% 36%;           /* Green - Success */
--warning: 38 92% 50%;            /* Orange - Warnings */
--info: 210 100% 50%;             /* Blue - Info */
```

### Dark Mode (Cosmic Theme)
```css
/* Ozean Licht uses dark cosmic theme by default */
.dark {
  --background: 210 36% 8%;      /* #0A0F1A - Deep cosmic blue */
  --foreground: 0 0% 100%;       /* White */
  --primary: 178 85% 40%;        /* #0ec2bc - Turquoise */
  --card: 215 30% 12%;           /* Slightly lighter than background */
  --card-foreground: 0 0% 100%;
}

/* Light mode (optional - admin may prefer light) */
:root {
  --background: 0 0% 100%;       /* White */
  --foreground: 222.2 84% 4.9%;  /* Near black */
  --primary: 178 85% 40%;        /* Keep turquoise in light mode */
}
```

### Special Effects (Ozean Licht)
```css
/* Glow effect for primary elements */
@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(14, 194, 188, 0.3); }
  100% { box-shadow: 0 0 30px rgba(14, 194, 188, 0.6); }
}

/* Float animation for cards/elements */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Shine effect for highlights */
@keyframes shine {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}

/* Cosmic gradient background */
.cosmic-gradient {
  background: linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%);
}
```

---

## 📐 Typography (Ozean Licht)

### Font Families
```css
font-family:
  /* Body text - Modern, clean sans-serif */
  'Montserrat', system-ui, -apple-system, sans-serif;

  /* Headings - Elegant serif for spiritual/mystical aesthetic */
  'Cinzel', Georgia, serif;

  /* Alternative headings - Decorative variant */
  'Cinzel Decorative', Georgia, serif;

  /* Alternative sans-serif - More playful variant */
  'Montserrat Alternates', 'Montserrat', sans-serif;

  /* Monospace (code) */
  'Fira Code', 'Courier New', monospace;
```

### Font Loading (Google Fonts)
```html
<!-- Add to app/layout.tsx head -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Montserrat:wght@300;400;500;600;700&family=Montserrat+Alternates:wght@400;600&display=swap" rel="stylesheet" />
```

### Font Scales
```typescript
// Tailwind config
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
}
```

### Font Weights
```css
font-weight: 300; /* Light */
font-weight: 400; /* Regular */
font-weight: 500; /* Medium */
font-weight: 600; /* Semibold */
font-weight: 700; /* Bold */
font-weight: 800; /* Extrabold */
```

---

## 📏 Spacing

### Spacing Scale (Tailwind)
```
0   - 0px
0.5 - 2px
1   - 4px
2   - 8px
3   - 12px
4   - 16px
5   - 20px
6   - 24px
8   - 32px
10  - 40px
12  - 48px
16  - 64px
20  - 80px
24  - 96px
```

### Common Patterns
```typescript
// Component padding
className="p-4"      // 16px padding (cards, buttons)
className="p-6"      // 24px padding (sections)
className="p-8"      // 32px padding (pages)

// Component gaps
className="gap-2"    // 8px gap (button groups)
className="gap-4"    // 16px gap (form fields)
className="gap-6"    // 24px gap (sections)
```

---

## 🧩 Component Patterns

### Dashboard Layout

```typescript
// Standard dashboard page structure
<div className="flex min-h-screen">
  <Sidebar /> {/* Fixed sidebar */}
  <div className="flex-1 flex flex-col">
    <Header /> {/* Top navigation */}
    <main className="flex-1 overflow-y-auto p-8">
      {/* Page content */}
    </main>
  </div>
</div>
```

### Page Header

```typescript
<div className="mb-8">
  <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
  <p className="text-muted-foreground">
    Brief description of what this page does
  </p>
</div>
```

### Cards

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### Data Tables

```typescript
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Forms

```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      placeholder="user@example.com"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="role">Role</Label>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <Button type="submit">Submit</Button>
</form>
```

### Badges & Status

```typescript
import { Badge } from '@/components/ui/badge';

// Role badges
<Badge variant="default">Super Admin</Badge>
<Badge variant="secondary">KA Admin</Badge>
<Badge variant="outline">Support</Badge>

// Status badges
<Badge className="bg-green-500">Active</Badge>
<Badge className="bg-red-500">Inactive</Badge>
<Badge className="bg-yellow-500">Pending</Badge>
```

### Buttons

```typescript
import { Button } from '@/components/ui/button';

// Primary action
<Button>Save Changes</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Ghost (minimal)
<Button variant="ghost">View Details</Button>

// Outline
<Button variant="outline">Export</Button>

// Icon button
<Button size="icon">
  <IconTrash className="h-4 w-4" />
</Button>
```

---

## 🎭 Icons

### Icon Library: Lucide React

```typescript
import {
  Users,
  Settings,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';

// Usage
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add User
</Button>
```

### Icon Sizing
```typescript
className="h-4 w-4"   // Small (buttons, inline)
className="h-5 w-5"   // Medium (navigation)
className="h-6 w-6"   // Large (headers)
className="h-8 w-8"   // Extra large (feature cards)
```

---

## 📱 Responsive Design

### Breakpoints
```typescript
// Tailwind breakpoints
sm: '640px',   // Small tablets
md: '768px',   // Tablets
lg: '1024px',  // Laptops
xl: '1280px',  // Desktops
2xl: '1536px'  // Large desktops
```

### Responsive Patterns
```typescript
// Hide sidebar on mobile, show on desktop
<Sidebar className="hidden lg:block" />

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>

// Responsive padding
<main className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</main>
```

---

## ♿ Accessibility

### Focus States
```css
/* All interactive elements should have visible focus */
focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### Color Contrast
- Ensure WCAG AA compliance (4.5:1 for normal text)
- Use shadcn/ui semantic colors (automatic contrast)

### Keyboard Navigation
```typescript
// Ensure all actions are keyboard accessible
<Button onKeyDown={(e) => e.key === 'Enter' && handleAction()}>
  Action
</Button>
```

### ARIA Labels
```typescript
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

<input aria-describedby="email-help" />
<p id="email-help">Enter your email address</p>
```

---

## 🎨 Dark Mode Support

### Toggle Implementation
```typescript
'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  );
}
```

### Color Usage
```typescript
// Use semantic colors that adapt to theme
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-muted text-muted-foreground"
```

---

## 🚀 Implementation Steps

### 1. Clone Admin Template
```bash
# Recommended: shadcn-admin
git clone https://github.com/satnaing/shadcn-admin-dashboard.git temp-template

# Copy relevant components
cp -r temp-template/src/components/dashboard apps/admin/components/
cp -r temp-template/src/components/charts apps/admin/components/
cp -r temp-template/src/lib/utils.ts apps/admin/lib/

# Clean up
rm -rf temp-template
```

### 2. Apply Ozean Licht Branding
```typescript
// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0ec2bc",
          50: "#E6F8F7",
          100: "#CCF1F0",
          200: "#99E3E1",
          300: "#66D5D2",
          400: "#33C7C3",
          500: "#0ec2bc",
          600: "#0BA09A",
          700: "#087E78",
          800: "#065C56",
          900: "#033A34",
        },
        background: "#0A0F1A",
        foreground: "#FFFFFF",
        muted: {
          DEFAULT: "#64748B",
          foreground: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
        decorative: ['Cinzel Decorative', 'Georgia', 'serif'],
        alt: ['Montserrat Alternates', 'Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        "cosmic-gradient": "linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%)",
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 194, 188, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(14, 194, 188, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

### 3. Update CSS Variables
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Ozean Licht Turquoise/Teal */
    --primary: 178 85% 40%;
    --primary-foreground: 0 0% 100%;

    /* Light mode (optional for admin) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --muted: 215 16% 47%;
    --muted-foreground: 214 15% 66%;
  }

  .dark {
    /* Cosmic dark theme (Ozean Licht default) */
    --background: 210 36% 8%;      /* #0A0F1A */
    --foreground: 0 0% 100%;
    --card: 215 30% 12%;
    --card-foreground: 0 0% 100%;

    --primary: 178 85% 40%;        /* #0ec2bc */
    --primary-foreground: 0 0% 100%;

    --muted: 215 16% 47%;
    --muted-foreground: 214 15% 66%;
  }
}

/* Ozean Licht custom utilities */
@layer utilities {
  .glow {
    animation: glow 2s ease-in-out infinite alternate;
  }

  .float {
    animation: float 6s ease-in-out infinite;
  }

  .cosmic-bg {
    background: linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%);
  }
}
```

### 4. Add Logo & Branding Assets
```bash
# Add Ozean Licht logo
public/
├── logo.svg              # Main logo
├── logo-light.svg        # Light mode logo
├── logo-dark.svg         # Dark mode logo
├── favicon.ico           # Favicon
└── og-image.png          # Open Graph image
```

### 5. Customize Components
```typescript
// components/dashboard/Header.tsx
import Image from 'next/image';

export function Header() {
  return (
    <header className="border-b">
      <div className="flex items-center gap-2 px-6 py-4">
        <Image src="/logo.svg" alt="Ozean Licht" width={32} height={32} />
        <h1 className="text-xl font-heading font-bold">
          Ozean Licht <span className="text-muted-foreground">Admin</span>
        </h1>
      </div>
    </header>
  );
}
```

---

## 📚 Component Library

### Available shadcn/ui Components
Already installed:
- ✅ Alert
- ✅ Badge
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Label
- ✅ Select
- ✅ Tabs
- ✅ Toast
- ✅ Tooltip
- ✅ Avatar

To add:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add table
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
```

---

## 🔗 Resources

### Design Inspiration
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Linear**: https://linear.app

### Templates
- **shadcn-admin**: https://github.com/satnaing/shadcn-admin-dashboard
- **Taxonomy**: https://github.com/shadcn/taxonomy
- **shadcn/ui**: https://ui.shadcn.com

### Tools
- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Radix UI**: https://www.radix-ui.com

---

**Last Updated:** 2025-11-09
**Maintainer:** Platform Team
**License:** Internal Use Only
