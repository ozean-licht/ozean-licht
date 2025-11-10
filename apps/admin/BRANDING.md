# Ozean Licht Admin Dashboard - Branding Reference

**Quick reference for Ozean Licht visual identity in admin dashboard**

---

## 🎨 Color Palette

### Primary Color: Turquoise (#0ec2bc)
```css
/* Main brand color - Use for: */
- Primary buttons
- Links
- Active states
- Highlights
- Important badges

/* Tailwind classes */
bg-primary-500
text-primary-500
border-primary-500
ring-primary-500
```

### Color Scale
| Shade | Hex | Use Case |
|-------|-----|----------|
| 50 | `#E6F8F7` | Lightest - Backgrounds, hover states |
| 100 | `#CCF1F0` | Very light - Subtle backgrounds |
| 200 | `#99E3E1` | Light - Disabled states |
| 300 | `#66D5D2` | Light-medium - Borders |
| 400 | `#33C7C3` | Medium-light - Secondary elements |
| **500** | **`#0ec2bc`** | **DEFAULT - Primary actions** |
| 600 | `#0BA09A` | Medium-dark - Hover states |
| 700 | `#087E78` | Dark - Active states |
| 800 | `#065C56` | Very dark - Pressed states |
| 900 | `#033A34` | Darkest - Shadows, depths |

---

## 🌌 Cosmic Theme

### Background Colors
```css
/* Dark cosmic theme (default) */
background: #0A0F1A    /* Deep space blue-black */
card: #1A1F2E          /* Slightly lighter cards */
border: #2A2F3E        /* Subtle borders */

/* Light mode (optional) */
background: #FFFFFF    /* Pure white */
```

### Cosmic Gradient
```css
background: linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0A0F1A 100%);

/* Tailwind class */
bg-cosmic-gradient
```

---

## 🔤 Typography

### Font Stack
```css
/* Body Text */
font-family: 'Montserrat', system-ui, sans-serif;
/* Tailwind: font-sans */

/* Headings */
font-family: 'Cinzel', Georgia, serif;
/* Tailwind: font-serif */

/* Decorative Headers */
font-family: 'Cinzel Decorative', Georgia, serif;
/* Tailwind: font-decorative */

/* Alternative Sans */
font-family: 'Montserrat Alternates', 'Montserrat', sans-serif;
/* Tailwind: font-alt */

/* Code/Monospace */
font-family: 'Fira Code', 'Courier New', monospace;
/* Tailwind: font-mono */
```

### Font Pairing Examples
```tsx
// Page title
<h1 className="font-serif text-4xl font-bold">Dashboard</h1>

// Section heading
<h2 className="font-serif text-2xl">User Management</h2>

// Body text
<p className="font-sans text-base">Regular content goes here</p>

// Decorative accent
<span className="font-decorative text-lg">Ozean Licht</span>
```

---

## ✨ Special Effects

### Glow Effect
```tsx
// Glowing primary button
<Button className="glow">
  Save Changes
</Button>

// CSS
className="animate-glow"
```

### Float Animation
```tsx
// Floating card
<Card className="float">
  <CardContent>Content</CardContent>
</Card>

// CSS
className="animate-float"
```

### Shine Effect
```tsx
// Shimmering element
<div className="relative overflow-hidden">
  <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  <p>Content with shine</p>
</div>
```

---

## 🧩 Component Examples

### Primary Button
```tsx
<Button className="bg-primary-500 hover:bg-primary-600 text-white glow">
  Primary Action
</Button>
```

### Card with Cosmic Background
```tsx
<Card className="bg-cosmic-gradient border-primary-500/20">
  <CardHeader>
    <CardTitle className="font-serif text-primary-500">
      Featured Section
    </CardTitle>
  </CardHeader>
  <CardContent className="font-sans">
    Card content here
  </CardContent>
</Card>
```

### Badge with Turquoise
```tsx
<Badge className="bg-primary-500 text-white">
  Active
</Badge>
```

### Dashboard Header
```tsx
<header className="border-b border-border bg-card/50 backdrop-blur">
  <div className="flex items-center gap-3 px-6 py-4">
    <Image src="/logo.svg" alt="Ozean Licht" width={32} height={32} />
    <h1 className="font-serif text-xl font-bold text-foreground">
      Ozean Licht
      <span className="font-sans text-sm text-muted-foreground ml-2">
        Admin
      </span>
    </h1>
  </div>
</header>
```

### Stat Card with Glow
```tsx
<Card className="float glow border-primary-500/30">
  <CardHeader>
    <CardTitle className="font-sans text-sm text-muted-foreground">
      Total Users
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="font-serif text-3xl font-bold text-primary-500">
      1,234
    </p>
  </CardContent>
</Card>
```

---

## 🎨 Color Usage Guidelines

### Do ✅
- Use turquoise (`#0ec2bc`) for primary actions and important elements
- Use cosmic dark backgrounds for mystical aesthetic
- Apply glow effects to key interactive elements
- Use Cinzel for headings to reinforce spiritual theme
- Maintain consistent turquoise across all touchpoints

### Don't ❌
- Don't use bright colors that clash with cosmic theme
- Don't overuse glow effects (only on key elements)
- Don't mix too many font families in one section
- Don't use pure black backgrounds (use cosmic blue instead)
- Don't ignore color scales (use appropriate shades)

---

## 📱 Responsive Considerations

```tsx
// Mobile: Simplify effects
<Card className="float lg:glow">
  {/* Glow only on desktop */}
</Card>

// Mobile: Adjust font sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl font-serif">
  Title
</h1>

// Mobile: Hide cosmic gradients for performance
<div className="bg-card lg:bg-cosmic-gradient">
  Content
</div>
```

---

## 🌓 Dark Mode Support

The Ozean Licht theme is **dark by default** (cosmic theme), but supports light mode:

```tsx
// Theme toggle button
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-primary-500"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
```

---

## 🔗 Brand Assets Checklist

### Required Assets
- [ ] Logo (SVG) - Main turquoise logo
- [ ] Logo (Light mode) - Dark variant for light backgrounds
- [ ] Logo (Dark mode) - Light variant for dark backgrounds
- [ ] Favicon (ICO/PNG) - 32x32, 64x64, 256x256
- [ ] Open Graph image (PNG) - 1200x630

### Font Files
- [ ] Montserrat (Google Fonts)
- [ ] Montserrat Alternates (Google Fonts)
- [ ] Cinzel (Google Fonts)
- [ ] Cinzel Decorative (Google Fonts)
- [ ] Fira Code (Google Fonts)

### Load Fonts
```tsx
// app/layout.tsx
import { Montserrat, Cinzel } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-serif',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🎯 Quick Tailwind Classes Reference

### Colors
```
bg-primary-500        # Turquoise background
text-primary-500      # Turquoise text
border-primary-500    # Turquoise border
ring-primary-500      # Turquoise focus ring

bg-cosmic-gradient    # Cosmic gradient background
bg-card               # Card background (#1A1F2E)
bg-background         # Page background (#0A0F1A)
```

### Typography
```
font-sans             # Montserrat (body)
font-serif            # Cinzel (headings)
font-decorative       # Cinzel Decorative
font-alt              # Montserrat Alternates
font-mono             # Fira Code
```

### Effects
```
glow                  # Turquoise glow animation
animate-float         # Gentle floating motion
animate-shine         # Shimmer effect
```

---

## 📖 Related Documentation

- **[Full Design System](./design-system.md)** - Complete design guidelines
- **[Tailwind Config](./tailwind.config.js)** - Actual configuration
- **[Development Guide](./CLAUDE.md)** - Admin-specific patterns

---

**Brand Identity:** Cosmic, mystical, spiritual, elegant
**Primary Color:** Turquoise (#0ec2bc) - Representing ocean (Ozean) and light (Licht)
**Theme:** Dark cosmic with glowing accents
**Typography:** Cinzel (spiritual elegance) + Montserrat (modern clarity)
