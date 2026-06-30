# 🌿 Reflections of Light — Mobile Design System

## Overview

This guide defines the **spacing, typography, and motion** that creates the "breathable," "cinematic," and "emotionally warm" feeling described in your mobile mockup.

The goal: **every element has its own space to exist. Nothing snaps, jumps, or crowds.**

---

## Part 1: Typography System

### Base Typography Stack

```css
/* Clean, readable, warm */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  letter-spacing: 0.3px;
}
```

### Typography Scale

| Name | Size | Line-Height | Weight | Use Case |
|------|------|-------------|--------|----------|
| **Hero Title** | 2.8rem (44px) | 1.1 | 300-400 | "Explore" title |
| **Section Title** | 1.8rem (28px) | 1.15 | 400 | "Weather + Location Block" |
| **Atmospheric Text** | 1.2rem (19px) | 1.5 | 300-400 | "We are stardust..." reflection |
| **Body Large** | 1.1rem (18px) | 1.6 | 400 | Weather desc, location |
| **Body Medium** | 1rem (16px) | 1.6 | 400 | Primary button text, cards |
| **Body Small** | 0.9rem (14px) | 1.5 | 400 | Category names, timestamps |
| **Caption** | 0.85rem (13px) | 1.5 | 400 | Footer, subtle text |
| **Micro** | 0.75rem (12px) | 1.4 | 400 | Badge, time display (07:07) |

### Font Weights

- **300 (Light):** Atmospheric text, headers, breath
- **400 (Regular):** Body text, buttons, primary content
- **500 (Medium):** Emphasis, active states, labels
- **600 (Semibold):** Category names, accents (use sparingly)

### Color & Opacity

| Name | Value | Use Case |
|------|-------|----------|
| **Text Primary** | `rgba(255, 255, 255, 0.95)` | Main content |
| **Text Secondary** | `rgba(255, 255, 255, 0.75)` | Supporting text |
| **Text Soft** | `rgba(255, 255, 255, 0.55)` | Subtle, faded |
| **Text Glow** | `rgba(255, 255, 255, 0.18)` | Whispers |

---

## Part 2: Spacing System (Mobile-First)

### Base Unit: 8px Grid

All spacing is built on **8px increments** for consistency and alignment.

### Mobile Viewport Spacing

```css
/* Root spacing variables */
:root {
  /* Layout */
  --mobile-edge: 16px;        /* Left/right page margin */
  --mobile-edge-lg: 24px;     /* Large margin (sections) */
  --mobile-edge-xl: 32px;     /* Extra large margin (full sections) */

  /* Vertical rhythm */
  --space-xs: 4px;            /* Micro spacing */
  --space-sm: 8px;            /* Small gaps */
  --space-md: 16px;           /* Default spacing */
  --space-lg: 24px;           /* Large spacing */
  --space-xl: 32px;           /* Extra large spacing */
  --space-xxl: 48px;          /* Section breaks */
  --space-xxxl: 64px;         /* Major breaks */

  /* Breathing room */
  --breathing-room-mobile: 20px;  /* Generous vertical padding */
  --breathing-room-tablet: 32px;
  --breathing-room-desktop: 48px;
}
```

### Mobile Spacing Rules

| Element | Top | Bottom | Left | Right | Notes |
|---------|-----|--------|------|-------|-------|
| Page wrapper | 24px | 24px | 16px | 16px | Breathing margin |
| Section | 0 | 40px | 0 | 0 | Large vertical break |
| Card | 0 | 24px | 0 | 0 | Medium vertical break |
| Button | 16px | 16px | 16px | 16px | Internal padding |
| Text line | 0 | 12px | 0 | 0 | Between related text |
| Icon + text | 0 | 0 | 8px | 0 | Tight pairing |

---

## Part 3: Component Spacing

### 1. Opening Screen (Explore)

```css
.explore-container {
  padding: var(--mobile-edge-lg) var(--mobile-edge);
  display: flex;
  flex-direction: column;
  gap: var(--space-xxl);  /* 48px between sections */
}

.explore-title {
  font-size: 2.8rem;          /* Hero size */
  font-weight: 300;
  text-align: center;
  padding: var(--space-lg) 0;  /* 24px top/bottom */
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
}

.explore-metadata {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);  /* 16px */
  font-size: 0.75rem;    /* Micro */
  color: rgba(255, 255, 255, 0.55);
}

.explore-reflection {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.75);
  padding: var(--space-xl) var(--space-md);  /* 32px top/bottom, 16px sides */
  animation: fadeIn 1.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 2. Weather + Location Block (Card)

```css
.weather-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: var(--space-lg) var(--space-md);  /* 24px top/bottom, 16px sides */
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);  /* 24px between elements */
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.4s ease;
}

.weather-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.weather-temperature {
  font-size: 2rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.95);
}

.weather-description {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
}

.weather-glow {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.5px;
}

.weather-location {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: var(--space-md);  /* Small gap before location */
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 3. Reflection Navigation (Previous / Next)

```css
.reflection-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) 0;  /* 24px top/bottom */
  gap: var(--space-md);
}

.nav-button {
  padding: 12px 24px;  /* Thumb-friendly size */
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-user-select: none;
  user-select: none;
}

.nav-button:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-spacer {
  flex: 1;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}
```

### 4. Carousel (1–30)

```css
.carousel-container {
  padding: var(--space-lg) 0;  /* 24px top/bottom */
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.carousel-ribbon {
  display: flex;
  gap: var(--space-md);  /* 16px between circles */
  padding: 0 var(--mobile-edge);  /* 16px sides */
  min-width: min-content;
}

.carousel-item {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.9rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-item.active {
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.95);
}

.carousel-item:hover {
  transform: scale(1.08);
  background: rgba(255, 255, 255, 0.12);
}
```

### 5. TODAY Button

```css
.today-button {
  padding: 14px 32px;  /* Generous padding */
  margin: var(--space-xl) auto;  /* 32px vertical, centered */
  display: block;
  border-radius: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s ease;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.today-button:active {
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
  transform: scale(0.99);
}
```

### 6. Category Buttons

```css
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 2 columns on mobile */
  gap: var(--space-md);  /* 16px between tiles */
  padding: var(--space-lg) 0;  /* 24px top/bottom */
  padding-left: var(--mobile-edge);
  padding-right: var(--mobile-edge);
}

.category-tile {
  padding: var(--space-lg);  /* 24px all sides */
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.category-tile:active {
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  transform: scale(0.98);
}

.category-tile:hover {
  background: rgba(255, 255, 255, 0.11);
  transform: translateY(-1px);
}
```

### 7. Quote of the Day

```css
.quote-card {
  padding: var(--space-xl) var(--space-lg);  /* 32px top/bottom, 24px sides */
  margin: var(--space-xxl) var(--mobile-edge);  /* 48px vertical margin */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  text-align: center;
  animation: fadeIn 1.4s ease;
  animation-delay: 0.2s;
}

.quote-text {
  font-size: 1.3rem;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.3px;
  font-style: italic;
  margin: 0;
  padding: 0;
}

.quote-attribution {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: var(--space-md);  /* 16px gap */
}
```

### 8. Footer

```css
.footer {
  padding: var(--space-xxl) var(--mobile-edge);  /* 48px top/bottom, 16px sides */
  margin-top: var(--space-xxxl);  /* 64px top margin */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 2;
}

.footer a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer a:hover {
  color: rgba(255, 255, 255, 0.8);
}

.footer-divider {
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: var(--space-lg) auto;  /* 24px vertical */
}
```

---

## Part 4: Motion & Easing

### Easing Curves

All transitions use these standard easing functions for consistency:

```css
/* Slow, graceful entrance */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Energetic, responsive exit */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Soft, natural motion */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* No jitter — these are used for all state changes */
```

### Transition Durations

| Duration | Use Case |
|----------|----------|
| **200ms** | Quick button responses, hover states |
| **300ms** | State changes, tab switches |
| **400ms** | Navigation, carousel slides |
| **600ms** | Fade-in animations, atmospheric text |
| **1200ms** | Large visual transitions, veil changes |

### Animation Examples

```css
/* Fade-in on load */
.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* Smooth slide-in */
.slide-up {
  animation: slideUp 0.4s ease-out forwards;
  transform: translateY(8px);
  opacity: 0;
}

@keyframes slideUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Gentle pulse (no jitter) */
.pulse-gentle {
  animation: pulseGentle 2s ease-in-out infinite;
}

@keyframes pulseGentle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
```

---

## Part 5: Responsive Breakpoints

### Mobile-First Approach

```css
/* Mobile: 320px - 767px (default) */
:root {
  --mobile-edge: 16px;
  --space-xxl: 48px;
}

/* Tablet: 768px - 1024px */
@media (min-width: 768px) {
  :root {
    --mobile-edge: 24px;
    --space-xxl: 64px;
  }
  
  .category-grid {
    grid-template-columns: repeat(4, 1fr);  /* 4 columns on tablet */
  }
}

/* Desktop: 1025px+ */
@media (min-width: 1025px) {
  :root {
    --mobile-edge: 32px;
    --space-xxl: 80px;
  }
  
  .category-grid {
    grid-template-columns: repeat(4, 1fr);  /* Stay at 4 on desktop */
  }
}
```

---

## Part 6: Guiding Principles

✨ **Breathe:** Every element needs space to exist.
✨ **Slow:** No sudden jumps. 200ms minimum for interactions.
✨ **Warm:** Soft colors, gentle shadows, generous padding.
✨ **Stable:** No jitter, no layout shift. Use transform & opacity for motion.
✨ **Intentional:** Every pixel of spacing is deliberate.

---

## Implementation Checklist

- [ ] Update `index.html` with mobile viewport meta tag (already present)
- [ ] Add spacing variables to CSS custom properties
- [ ] Apply spacing variables to all components
- [ ] Test on mobile devices (iOS Safari, Chrome Mobile)
- [ ] Verify no layout shift on navigation
- [ ] Test button responsiveness (tap zones >= 44px)
- [ ] Ensure footer renders properly on small screens
- [ ] Validate touch interactions (no hover-only states)

