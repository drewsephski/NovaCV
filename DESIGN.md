# Self.so Design System

## Aesthetic Direction: Vercel-Inspired Technical Precision

A modern, dark interface aesthetic inspired by Vercel's design language—clean geometric typography, near-black backgrounds with subtle glows, and technical precision that feels cutting-edge yet approachable.

### Purpose

Transform LinkedIn profiles into professional websites with a tool that feels premium, fast, and technically sophisticated.

### Tone

- **Technical**: Clean, geometric, precise
- **Premium**: Near-black backgrounds with subtle depth
- **Confident**: Sharp typography, intentional spacing
- **Fast**: Minimal visual noise, purposeful motion

### Differentiation

Near-black (#0a0a0a) backgrounds instead of pure black. Geist font family for modern geometric precision. Subtle white glow effects and refined border treatments that create depth without visual noise.

---

## Typography

### Primary Font: Geist Sans

- Modern geometric sans-serif
- Clean, technical, highly legible
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Monospace Font: Geist Mono

- Technical monospace for code and data
- Used for: Usernames, technical data, timestamps
- Weights: 400, 500

### Type Scale (Fluid)

```
--text-hero: clamp(2.5rem, 5vw, 4rem)       /* 40-64px */
--text-display: clamp(1.75rem, 3vw, 2.5rem)  /* 28-40px */
--text-title: clamp(1.25rem, 2vw, 1.5rem)    /* 20-24px */
--text-body: clamp(1rem, 1.2vw, 1.125rem)   /* 16-18px */
--text-small: clamp(0.875rem, 1vw, 0.9375rem)/* 14-15px */
```

---

## Color Palette

### Background Colors

```
--color-bg-primary: #0a0a0a     /* Near-black - main background */
--color-bg-secondary: #111111   /* Card backgrounds */
--color-bg-tertiary: #171717    /* Elevated surfaces */
```

### Foreground Colors

```
--color-text-primary: #ffffff   /* White - primary text */
--color-text-secondary: #a1a1aa /* Muted gray - secondary text */
--color-text-tertiary: #52525b  /* Subdued - tertiary text */
```

### Border Colors

```
--color-border-subtle: rgba(255, 255, 255, 0.06)
--color-border-default: rgba(255, 255, 255, 0.10)
--color-border-hover: rgba(255, 255, 255, 0.15)
```

### Accent Colors

```
--color-accent: #ffffff         /* White accents */
--color-accent-muted: rgba(255, 255, 255, 0.5)
```

---

## Spacing System

### Fluid Spacing Scale

```
--space-xs: clamp(0.5rem, 1vw, 0.75rem)     /* 8-12px */
--space-sm: clamp(0.75rem, 1.5vw, 1rem)     /* 12-16px */
--space-md: clamp(1rem, 2vw, 1.5rem)       /* 16-24px */
--space-lg: clamp(1.5rem, 3vw, 2.5rem)      /* 24-40px */
--space-xl: clamp(2rem, 5vw, 4rem)         /* 32-64px */
--space-2xl: clamp(3rem, 8vw, 6rem)        /* 48-96px */
```

### Section Padding

- Desktop: `padding: 6rem 2rem`
- Tablet: `padding: 4rem 1.5rem`
- Mobile: `padding: 3rem 1rem`

---

## Components

### Buttons

**Primary Button**

- Background: white (#ffffff)
- Text: black (#000000)
- Padding: `0.875rem 1.75rem`
- Border-radius: `0.5rem`
- Font-weight: 500
- Hover: `bg-white/90`, slight scale(1.02)

**Secondary/Ghost Button**

- Background: transparent
- Text: `muted-foreground`
- Hover: `bg-white/5`, text white

**Outline Button**

- Background: transparent
- Border: 1px solid `white/10`
- Text: white
- Hover: `bg-white/5`, border `white/20`

### Cards

- Background: `#111111` (bg-secondary)
- Border: 1px solid `white/[0.06]`
- Border-radius: `0.75rem`
- Hover: border `white/10`, subtle glow

### Form Elements

**Input/Dropzone**

- Border: 1px solid `white/[0.10]`
- Border-radius: `0.625rem`
- Background: transparent
- Hover: border `white/20`
- Focus: border `white/40`, ring `white/20`

---

## Layout Principles

### Container

- Max-width: `1200px`
- Padding: responsive (see spacing)

### Grid

- 12-column grid system
- Gap: `--space-lg`

### Visual Rhythm

- Asymmetric layouts preferred
- Generous whitespace in hero sections
- Tight groupings for related content
- Break the grid for emphasis

---

## Visual Effects

### Glows

```css
.glow-subtle {
  box-shadow: 0 0 80px -20px rgba(255, 255, 255, 0.08);
}

.glow-accent {
  box-shadow: 0 0 60px -10px rgba(255, 255, 255, 0.15),
              0 0 30px -5px rgba(255, 255, 255, 0.05);
}
```

### Background Glows

- Large soft orbs positioned at edges
- Very low opacity (0.02 - 0.03)
- Heavy blur (100px+)
- Creates subtle depth without distraction

---

## Motion & Animation

### Page Load Sequence

- Staggered fade-in with subtle Y translation
- Duration: 500-600ms per element
- Stagger: 100ms between elements
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)

### Hover States

- Buttons: scale(1.02), background transition
- Cards: border color shift, subtle glow increase
- Links: color transition to white
- Duration: 200ms
- Easing: `ease-out`

### Scroll Animations

- Fade-in on scroll with IntersectionObserver
- Threshold: 0.1
- Duration: 500ms

---

## Responsive Breakpoints

```
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: 1px solid `white/50`
- Reduced motion: Respect `prefers-reduced-motion`
- Semantic HTML throughout
- ARIA labels where needed

---

## Design Philosophy

### Less is More

- Remove visual noise
- Every element must earn its place
- Subtle depth over flat design
- White space is content

### Technical Without Being Cold

- Geometric precision
- Human-readable typography
- Purposeful motion
- Approachable interactions

### Premium Feel

- Near-black backgrounds
- Subtle glow effects
- Sharp edges with soft shadows
- Monochromatic with intention
