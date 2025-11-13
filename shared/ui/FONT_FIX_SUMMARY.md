# Font System Fix - Ozean Licht Typography

**Date:** 2025-11-13
**Status:** ✅ Complete
**Issue:** Context rot in typography system - incorrect font usage

---

## Problem Identified

The user correctly identified that:
1. **Cinzel Decorative should be used SPARINGLY** (not everywhere)
2. Only **3 fonts** should be used: Cinzel Decorative, Montserrat, Montserrat Alternates
3. Only **Regular weight (400)** should be used for Cinzel Decorative
4. "Cinzel" (plain serif) was incorrectly being used instead of Cinzel Decorative
5. Various components were using wrong fonts and weights

---

## Correct Typography System

### Font Families (3 Total)

1. **Cinzel Decorative** - Display font (SPARINGLY)
   - Weight: 400 (Regular) ONLY
   - Usage: H1, H2, Course card titles
   - Never use bold, semibold, or black weights

2. **Montserrat** - Main sans-serif
   - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
   - Usage: H3, H4, body text, UI elements, paragraphs, card titles

3. **Montserrat Alternates** - Alternative sans-serif
   - Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
   - Usage: H5, H6, labels, captions

### Typography Hierarchy

```
H1: Cinzel Decorative Regular (400) - Hero/Page titles
H2: Cinzel Decorative Regular (400) - Section headings
H3: Montserrat Regular (400) - Subsections
H4: Montserrat Regular (400) - Card titles
H5: Montserrat Alternates Regular (400) - Labels
H6: Montserrat Alternates Regular (400) - Small labels

Body Large: Montserrat Regular (400)
Body Medium: Montserrat Regular (400)
Body Small: Montserrat Regular (400)
Paragraphs: Montserrat Light (300)

Special Cases:
- Course Card Titles: Cinzel Decorative Regular (400)
- Dialog Titles: Montserrat Regular (400)
- Regular Card Titles: Montserrat Regular (400)
```

---

## Files Changed

### 1. ❌ Deleted: `/design-system.md`
**Reason:** Corrupted with context rot, had incorrect font information
**Status:** Removed completely

### 2. ✅ Fixed: `/shared/ui/src/styles/globals.css`

**Changes:**
- Removed `--font-serif: 'Cinzel'` from CSS variables
- Updated H1-H2 to use Cinzel Decorative Regular (400)
- Updated H3-H4 to use Montserrat Regular (400)
- Updated H5-H6 to use Montserrat Alternates Regular (400)
- Added clear comments about "SPARINGLY" usage

**Before:**
```css
--font-decorative: 'Cinzel Decorative', Georgia, serif;
--font-serif: 'Cinzel', Georgia, serif;  /* REMOVED */
--font-sans: 'Montserrat', ...;
```

**After:**
```css
--font-decorative: 'Cinzel Decorative', Georgia, serif;
--font-sans: 'Montserrat', ...;
--font-alt: 'Montserrat Alternates', ...;
```

**Heading Styles Before:**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-decorative);
  font-weight: 400;
}
```

**Heading Styles After:**
```css
/* Cinzel Decorative used SPARINGLY - only H1, H2 */
h1, h2 {
  font-family: var(--font-decorative);
  font-weight: 400;
}

/* H3-H6 use Montserrat */
h3, h4 {
  font-family: var(--font-sans);
  font-weight: 400;
}

h5, h6 {
  font-family: var(--font-alt);
  font-weight: 400;
}
```

### 3. ✅ Fixed: `/apps/ozean-licht/tailwind.config.js`

**Changes:**
- Removed `serif: ['Cinzel', ...]` from fontFamily

**Before:**
```js
fontFamily: {
  sans: ['Montserrat', ...],
  serif: ['Cinzel', ...],  // REMOVED
  decorative: ['Cinzel Decorative', ...],
}
```

**After:**
```js
fontFamily: {
  sans: ['Montserrat', ...],
  decorative: ['Cinzel Decorative', ...],
  alt: ['Montserrat Alternates', ...],
  mono: ['Fira Code', ...],
}
```

### 4. ✅ Fixed: `/storybook/tailwind.config.js`

**Changes:** Same as above - removed `serif: ['Cinzel', ...]`

### 5. ✅ Fixed: `/shared/ui/src/components/Card.tsx`

**Changes:**
- CardTitle: Changed from `font-serif font-semibold` to `font-sans font-normal`

**Before:**
```tsx
className="font-serif text-xl md:text-2xl font-semibold ..."
```

**After:**
```tsx
className="font-sans text-xl md:text-2xl font-normal ..."
```

### 6. ✅ Fixed: `/shared/ui/src/compositions/cards/CourseCard.tsx`

**Changes:**
- Course card title h3: Changed from `font-serif` to `font-decorative`
- Matches the Ozean Licht app pattern (special case - course cards use Cinzel Decorative)

**Before:**
```tsx
<h3 className="font-serif text-xl md:text-2xl ...">
```

**After:**
```tsx
<h3 className="font-decorative text-xl md:text-2xl ...">
```

### 7. ✅ Fixed: `/shared/ui/src/components/Dialog.tsx`

**Changes:**
- DialogTitle: Changed from `font-serif font-semibold` to `font-sans font-normal`

**Before:**
```tsx
className="font-serif text-xl md:text-2xl font-semibold ..."
```

**After:**
```tsx
className="font-sans text-xl md:text-2xl font-normal ..."
```

### 8. ✅ Updated: `/BRANDING.md`

**Changes:**
- Removed "Cinzel" (plain serif) as a font family
- Updated typography hierarchy to show SPARINGLY usage
- Clarified only 3 fonts used: Cinzel Decorative, Montserrat, Montserrat Alternates
- Added clear notes about Regular weight (400) only for Cinzel Decorative
- Added special cases section (course cards, dialog titles)
- Updated best practices with CRITICAL warnings

---

## Verification Checklist

### ✅ Font Variables
- [x] Removed `--font-serif` from globals.css
- [x] Removed `serif` from both Tailwind configs
- [x] Only 3 fonts remain: decorative, sans, alt

### ✅ Component Fixes
- [x] Card.tsx uses Montserrat (font-sans)
- [x] CourseCard.tsx uses Cinzel Decorative (font-decorative) - special case
- [x] Dialog.tsx uses Montserrat (font-sans)
- [x] No components use `font-serif` anymore
- [x] No components use `font-semibold` or `font-bold` with Cinzel Decorative

### ✅ Global Styles
- [x] H1, H2 use Cinzel Decorative Regular (400)
- [x] H3, H4 use Montserrat Regular (400)
- [x] H5, H6 use Montserrat Alternates Regular (400)
- [x] All weights explicitly set to 400 (Regular)

### ✅ Documentation
- [x] BRANDING.md updated with correct hierarchy
- [x] Removed corrupted design-system.md
- [x] Typography best practices documented

---

## Reference: Correct Font Usage Patterns

### When to Use Each Font

**Cinzel Decorative (SPARINGLY):**
```tsx
// ✅ Hero headings
<h1 className="font-decorative">Page Title</h1>

// ✅ Section headings
<h2 className="font-decorative">Section Title</h2>

// ✅ Course card titles (special case)
<h3 className="font-decorative">Course Title</h3>

// ❌ Regular card titles
<h4 className="font-decorative">Card Title</h4>  // NO! Use font-sans

// ❌ Labels
<h5 className="font-decorative">Label</h5>  // NO! Use font-alt

// ❌ Body text
<p className="font-decorative">Text</p>  // NO! Use font-sans
```

**Montserrat (Main font):**
```tsx
// ✅ Subsection headings
<h3 className="font-sans">Subsection</h3>

// ✅ Card titles
<h4 className="font-sans">Card Title</h4>

// ✅ Body text
<p className="font-sans">Paragraph text</p>

// ✅ UI elements
<button className="font-sans">Button</button>
```

**Montserrat Alternates (Labels):**
```tsx
// ✅ Labels
<h5 className="font-alt">Label</h5>

// ✅ Small labels
<h6 className="font-alt">Small Label</h6>

// ✅ Captions
<span className="font-alt text-sm">Caption</span>
```

---

## Tailwind Class Reference

```css
/* Font families */
.font-decorative → Cinzel Decorative
.font-sans → Montserrat
.font-alt → Montserrat Alternates
.font-mono → Fira Code

/* Font weights for Cinzel Decorative (ONLY use 400) */
.font-normal → 400 (Regular) ✅
.font-semibold → 600 ❌ Never use with Cinzel Decorative
.font-bold → 700 ❌ Never use with Cinzel Decorative

/* Font weights for Montserrat (can use multiple) */
.font-light → 300 ✅ (for paragraphs)
.font-normal → 400 ✅ (default)
.font-medium → 500 ✅
.font-semibold → 600 ✅
.font-bold → 700 ✅
```

---

## Testing Checklist

To verify all fonts are correct:

```bash
# 1. Search for any remaining font-serif usage
grep -r "font-serif" shared/ui/src/

# 2. Search for Cinzel Decorative with wrong weights
grep -r "font-decorative.*font-\(semibold\|bold\|black\)" shared/ui/src/

# 3. Check all components render correctly
cd storybook
npm run storybook

# 4. Verify Card titles use Montserrat
# 5. Verify CourseCard titles use Cinzel Decorative
# 6. Verify Dialog titles use Montserrat
# 7. Verify no bold Cinzel Decorative anywhere
```

---

## Summary

✅ **Deleted 1 file** (corrupted design-system.md)
✅ **Fixed 7 files** (globals.css, 2 tailwind configs, Card, CourseCard, Dialog, BRANDING.md)
✅ **Removed font-serif** completely from codebase
✅ **Established 3-font system** (Cinzel Decorative, Montserrat, Montserrat Alternates)
✅ **Enforced Regular weight (400)** for Cinzel Decorative
✅ **Documented SPARINGLY usage** in BRANDING.md

The typography system now correctly implements the Ozean Licht brand with:
- Cinzel Decorative used sparingly (H1, H2, course cards only)
- Montserrat as the main font (H3, H4, body, UI)
- Montserrat Alternates for labels (H5, H6)
- No bold/semibold Cinzel Decorative
- No "Cinzel" plain serif font

**Status:** Ready for Storybook testing
