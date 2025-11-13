# Ozean Licht Ecosystem - Brand Guidelines

**Version:** 0.1.0
**Last Updated:** 2025-11-11
**Status:** Official Brand Guidelines

---

## Overview

This document defines the brand identity, positioning, and visual guidelines for the **Ozean Licht ecosystem**. It clarifies which applications use which branding and where brand assets are located.

**Two Distinct Brands:**
1. **Ozean Licht** - Spiritual content platform and admin dashboard
2. **Kids Ascension** - Educational video platform for children (separate branding)

---

## Brand Architecture

### Ozean Licht (Primary Brand)

**Applications:**
- Ozean Licht Platform (`apps/ozean-licht/`)
- Admin Dashboard (`apps/admin/`)
- Shared UI Components (`shared/ui-components/`)

**Brand Essence:**
- **Mission:** Facilitate spiritual awakening and personal transformation
- **Vision:** Create a cosmic sanctuary for seekers and lightworkers
- **Values:** Clarity, Depth, Transformation, Community, Authenticity

**Target Audience:**
- Spiritual seekers and practitioners
- Lightworkers and energy healers
- Personal development enthusiasts
- Adults 25-55 seeking deeper meaning

### Kids Ascension (Separate Brand)

**Application:**
- Kids Ascension Platform (`apps/kids-ascension/`)

**Brand Essence:**
- **Mission:** Educational content for children's growth and learning
- **Vision:** Inspire young minds through engaging video content
- **Values:** Joy, Curiosity, Learning, Safety, Growth

**Target Audience:**
- Children ages 5-12
- Parents and educators
- Families seeking quality educational content

**Branding Note:** Kids Ascension has its own distinct color palette, typography, and visual identity separate from Ozean Licht. See `apps/kids-ascension/BRANDING.md` (when created) for details.

---

## Ozean Licht Brand Identity

### Brand Personality

**Adjectives:**
- Mystical
- Elegant
- Deep
- Transformative
- Cosmic
- Serene
- Authentic

**Brand Voice:**
- **Tone:** Thoughtful, inspiring, welcoming
- **Style:** Clear yet poetic, grounded yet spiritual
- **Language:** Avoid overly mystical jargon; be accessible

**Example Messaging:**
- ✅ "Discover your inner light and connect with like-minded souls"
- ✅ "Transform your journey with wisdom and community"
- ❌ "Ascend to the 5th dimension through quantum healing" (too esoteric)
- ❌ "Click here for content!" (too generic/commercial)

### Visual Identity

**Primary Color:** Turquoise (#0ec2bc)
- **Symbolism:** Clarity, transformation, spiritual awakening, ocean depths
- **Psychology:** Calming, healing, inspiring, trustworthy
- **Usage:** Primary actions, links, accents, highlights

**Secondary Colors:**
- **Cosmic Dark:** #0A0F1A (deep space background)
- **Card Layer:** #1A1F2E (elevated surfaces)
- **Muted Text:** #64748B (secondary information)

**Visual Style:**
- **Theme:** Dark cosmic with glass morphism
- **Aesthetic:** Elegant, layered, ethereal
- **Effects:** Glowing, floating, translucent cards
- **Mood:** Mystery, depth, serenity

---

## Logo System

### Ozean Licht Logo

**Primary Logo:**
- **Location:** `shared/assets/logos/ozean-licht-primary.svg`
- **Usage:** Main brand representation, headers, marketing
- **Minimum Size:** 120px width
- **Clear Space:** Equal to height of logo on all sides

**Logo Mark (Icon):**
- **Location:** `shared/assets/logos/ozean-licht-icon.svg`
- **Usage:** Favicons, app icons, small spaces
- **Minimum Size:** 32px × 32px

**Wordmark:**
- **Location:** `shared/assets/logos/ozean-licht-wordmark.svg`
- **Usage:** Horizontal layouts, footer, navigation
- **Minimum Size:** 100px width

**Logo Variations:**
- Full color on dark background (primary)
- White on dark background (secondary)
- Monochrome turquoise (accent)

**Logo Usage Guidelines:**
- ✅ Always use on dark backgrounds (#0A0F1A or darker)
- ✅ Maintain clear space around logo
- ✅ Scale proportionally (never stretch)
- ❌ Don't change logo colors
- ❌ Don't add effects (shadows, outlines, glows)
- ❌ Don't rotate or distort logo
- ❌ Don't place on light backgrounds

### Admin Dashboard Logo

The admin dashboard uses the Ozean Licht brand identity:
- **Header:** Full Ozean Licht wordmark or primary logo
- **Sidebar:** Icon logo for collapsed state
- **Favicon:** Icon logo

### Kids Ascension Logo

**Location:** `shared/assets/logos/kids-ascension-*`
**Usage:** Kids Ascension platform only
**Note:** Separate brand identity with different colors and style

---

## Typography Guidelines

### Font Families

**Ozean Licht uses three font families:**

1. **Cinzel Decorative** (Display)
   - **Usage:** ALL headings (H1-H6), hero text, brand statements, card titles
   - **Weight:** 400 (Regular) ONLY - never use bold
   - **Character:** Elegant, sophisticated, mystical
   - **Source:** Google Fonts
   - **Important:** Only Regular weight (400) is used for brand consistency

2. **Montserrat** (Sans-Serif)
   - **Usage:** Body text, paragraphs, UI elements, buttons
   - **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
   - **Character:** Clean, modern, highly readable
   - **Source:** Google Fonts

3. **Montserrat Alternates** (Sans-Serif Alt)
   - **Usage:** Labels, captions, alternative body text
   - **Weights:** 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
   - **Character:** Distinctive, friendly, modern
   - **Source:** Google Fonts

4. **Fira Code** (Monospace)
   - **Usage:** Code blocks, technical content
   - **Character:** Developer-friendly monospace
   - **Source:** Google Fonts

### Typography Hierarchy

```
H1: Cinzel Decorative, 3rem-4rem, Regular (400) ← Hero/Page Titles
H2: Cinzel Decorative, 2.25rem-3rem, Regular (400) ← Section Headings
H3: Montserrat, 1.875rem-2.25rem, Regular (400) ← Subsections
H4: Montserrat, 1.5rem-1.875rem, Regular (400) ← Card Titles
H5: Montserrat Alternates, 1.25rem-1.5rem, Regular (400) ← Labels
H6: Montserrat Alternates, 1rem-1.25rem, Regular (400) ← Small Labels
Body Large: Montserrat, 1.125rem, Regular (400)
Body Medium: Montserrat, 1rem, Regular (400)
Body Small: Montserrat, 0.875rem, Regular (400)
Paragraphs: Montserrat, Light (300)

Special Cases:
Course Card Titles: Cinzel Decorative, 1.25rem-1.5rem, Regular (400)
Dialog Titles: Montserrat, 1.5rem-1.875rem, Regular (400)
```

**Best Practices:**
- **CRITICAL:** Cinzel Decorative is ALWAYS Regular weight (400) - never bold, semibold, or black
- **CRITICAL:** Use Cinzel Decorative SPARINGLY - only H1, H2, and special course cards
- All other headings (H3-H6) use Montserrat or Montserrat Alternates
- Size differentiation creates hierarchy, not font weight
- Montserrat for all body text ensures readability
- Maintain proper hierarchy (don't skip heading levels)
- Add subtle text-shadow to H1/H2 for ethereal effect

---

## Color Psychology & Usage

### Primary - Turquoise (#0ec2bc)

**Symbolism:**
- Ocean depths and cosmic clarity
- Spiritual awakening and transformation
- Healing energy and communication

**When to Use:**
- Primary CTAs (buttons, links)
- Active states and selections
- Progress indicators
- Brand accents and highlights
- Borders on glass cards

**When NOT to Use:**
- Large background areas (overwhelming)
- Body text (readability)
- Error or warning messages

### Background - Cosmic Dark (#0A0F1A)

**Symbolism:**
- Deep space and infinite possibility
- Mystery and introspection
- Focus and calm

**When to Use:**
- Page backgrounds
- App background layers
- Sections requiring depth

### Card - Elevated Layer (#1A1F2E)

**Symbolism:**
- Elevated surfaces and content containers
- Organized information

**When to Use:**
- Card backgrounds (with glass effect)
- Modal backgrounds
- Dropdown menus
- Popovers

### Semantic Colors

**Success** (#10B981 - Green)
- Completed actions
- Positive feedback
- Active status

**Warning** (#F59E0B - Amber)
- Caution messages
- Pending status
- Important notices

**Destructive** (#EF4444 - Red)
- Delete actions
- Error messages
- Critical alerts

**Info** (#3B82F6 - Blue)
- Informational messages
- Helpful tips
- Neutral status

---

## Brand Assets Location

### File Structure

```
shared/assets/
├── logos/
│   ├── ozean-licht-primary.svg          # Full color logo
│   ├── ozean-licht-icon.svg             # Icon only
│   ├── ozean-licht-wordmark.svg         # Text only
│   ├── ozean-licht-white.svg            # White version
│   ├── kids-ascension-primary.svg       # KA logo
│   └── kids-ascension-icon.svg          # KA icon
├── images/
│   ├── og-image-ozean-licht.png         # Social sharing (1200×630)
│   ├── og-image-admin.png               # Admin social sharing
│   └── og-image-kids-ascension.png      # KA social sharing
└── fonts/
    └── README.md                         # Font loading instructions
```

### Downloading Logos

**For Development:**
- Clone repository: Logos in `shared/assets/logos/`
- Import in code: `import Logo from '@/shared/assets/logos/ozean-licht-primary.svg'`

**For Marketing:**
- Full brand package available at: `shared/assets/brand-package.zip`
- Includes: SVG, PNG (multiple sizes), PDF versions

---

## Application-Specific Branding

### Admin Dashboard (`apps/admin/`)

**Branding:** Uses **Ozean Licht** identity
- Primary color: Turquoise (#0ec2bc)
- Dark cosmic theme
- Glass card effects
- Cinzel Decorative for headings

**Rationale:** Admin dashboard is part of Ozean Licht infrastructure and serves both platforms, but uses Ozean Licht brand for consistency.

**Visual Elements:**
- Header: Ozean Licht logo
- Theme: Dark cosmic with glass effects
- Colors: Ozean Licht palette
- Fonts: Cinzel Decorative + Montserrat

### Ozean Licht Platform (`apps/ozean-licht/`)

**Branding:** Full **Ozean Licht** identity
- Primary color: Turquoise (#0ec2bc)
- Cosmic dark backgrounds
- Glass morphism throughout
- Elegant typography

**Visual Elements:**
- Hero: Large Cinzel Decorative headings with glow
- Cards: Glass effect with backdrop blur
- Navigation: Subtle, elegant
- Footer: Full branding with links

### Kids Ascension Platform (`apps/kids-ascension/`)

**Branding:** Separate **Kids Ascension** identity
- Colors: Bright, playful (separate palette)
- Theme: Light and colorful (NOT cosmic dark)
- Fonts: Child-friendly, rounded (NOT Cinzel)
- Style: Fun, safe, educational

**Separation Rationale:**
- Different target audience (children vs. adults)
- Different tone (playful vs. spiritual)
- Different legal entity (separate Austrian association)
- Distinct market positioning

**Shared Elements:**
- Can use base component architecture from `shared/ui-components/`
- Must override colors, fonts, and theme
- Maintains separate brand assets and guidelines

---

## Brand Usage Rules

### DO

- ✅ Use Ozean Licht branding in admin dashboard
- ✅ Use turquoise (#0ec2bc) as primary color
- ✅ Apply glass card effects consistently
- ✅ Use Cinzel Decorative for major headings
- ✅ Maintain dark cosmic background theme
- ✅ Include brand logo in headers/footers
- ✅ Follow typography hierarchy
- ✅ Respect logo clear space

### DON'T

- ❌ Mix Ozean Licht and Kids Ascension branding
- ❌ Use Kids Ascension colors in Ozean Licht apps
- ❌ Use light/bright themes in Ozean Licht
- ❌ Change logo colors or proportions
- ❌ Use Ozean Licht branding in KA platform
- ❌ Skip heading hierarchy
- ❌ Use generic blue as primary color
- ❌ Add unbranded white backgrounds

---

## Accessibility & Compliance

### Color Contrast

All Ozean Licht color combinations meet **WCAG AA** standards:
- Turquoise (#0ec2bc) on Dark (#0A0F1A): **4.7:1** (Pass)
- White (#FFFFFF) on Dark (#0A0F1A): **18.5:1** (AAA)
- Muted (#94A3B8) on Dark (#0A0F1A): **7.2:1** (AAA)

### Legal & Licensing

**Brand Ownership:**
- Ozean Licht brand: Owned by **Verein Ozean Licht** (Austrian association)
- Kids Ascension brand: Owned by **Verein Kids Ascension** (Austrian association)

**Font Licenses:**
- All Google Fonts: Open Font License (OFL)
- Free for personal and commercial use
- Can be embedded in applications

**Logo Usage:**
- Internal use: Unrestricted
- External use: Requires approval from respective association
- No modification without permission

---

## Brand Evolution

### Current Version (v0.1.0)

**Established Elements:**
- Turquoise primary color (#0ec2bc)
- Cosmic dark theme
- Glass morphism design language
- Cinzel Decorative + Montserrat typography
- Logo system (primary, icon, wordmark)

**Open for Evolution:**
- Additional logo variations (animated, etc.)
- Extended color palette for specific use cases
- Iconography system
- Illustration style guidelines
- Photography guidelines

### Requesting Brand Changes

**Process:**
1. Document proposed change with rationale
2. Create visual mockups/examples
3. Submit to platform team for review
4. Update brand guidelines after approval
5. Communicate changes to all developers

**Contact:** Platform team or create issue in repository

---

## Quick Reference for Developers

### Import Ozean Licht Branding

```typescript
// In your app layout or component
import { Cinzel_Decorative, Cinzel, Montserrat, Montserrat_Alternates } from 'next/font/google'

// Colors
const PRIMARY = '#0ec2bc'
const BACKGROUND = '#0A0F1A'
const CARD = '#1A1F2E'

// Classes
className="glass-card glass-hover rounded-lg p-6"
className="font-decorative text-4xl text-foreground"
className="bg-primary hover:bg-primary-400 text-white"
```

### Use Shared Components

```typescript
// Import from shared library
import { Button, Card, Badge } from '@ozean-licht/shared-ui'

// Components automatically use Ozean Licht tokens
<Button variant="primary">Action</Button>
<Card className="glass-card">Content</Card>
```

### Check Which Brand to Use

```
Building feature for:
├─ Admin Dashboard? → Use Ozean Licht branding
├─ Ozean Licht Platform? → Use Ozean Licht branding
├─ Kids Ascension Platform? → Use Kids Ascension branding
└─ Shared Component? → Use Ozean Licht as base, allow KA to override
```

---

## Resources

- **Design System:** See `/design-system.md` for complete design tokens and patterns
- **Component Library:** See `/shared/ui-components/README.md` for implementation
- **Admin Docs:** See `/apps/admin/README.md` for admin-specific guidelines
- **Google Fonts:** [fonts.google.com](https://fonts.google.com/)

---

## Version History

**v0.1.0** (2025-11-11)
- Initial brand guidelines document
- Defined brand architecture (Ozean Licht vs Kids Ascension)
- Documented logo system and usage rules
- Established color psychology and typography guidelines
- Clarified application-specific branding

---

**Maintained by:** Ozean Licht Platform Team
**Status:** Official - All applications must follow these guidelines
**Questions:** Create issue in repository or contact platform team
