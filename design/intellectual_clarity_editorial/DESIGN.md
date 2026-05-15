---
name: Intellectual Clarity — Editorial
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#474651'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#777682'
  outline-variant: '#c8c5d3'
  surface-tint: '#5654a8'
  primary: '#1a146b'
  on-primary: '#ffffff'
  primary-container: '#312e81'
  on-primary-container: '#9c9af4'
  inverse-primary: '#c3c0ff'
  secondary: '#575e72'
  on-secondary: '#ffffff'
  secondary-container: '#dbe2fa'
  on-secondary-container: '#5d6478'
  tertiary: '#3e1a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f2b00'
  on-tertiary-container: '#de915e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100563'
  on-primary-fixed-variant: '#3e3c8f'
  secondary-fixed: '#dbe2fa'
  secondary-fixed-dim: '#bfc6dd'
  on-secondary-fixed: '#141b2c'
  on-secondary-fixed-variant: '#3f4759'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb688'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#70380b'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-lg:
    fontFamily: Newsreader
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.8'
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-margin: 4vw
  gutter: 24px
  card-padding: 32px
---

## Brand & Style

This variation adopts an **Editorial / Magazine** aesthetic. It is designed for deep dives, opinion pieces, and rich storytelling. The brand personality is authoritative, established, and cultured.

The design style leans into **Modern Corporate** with a literary twist. It uses a blend of sophisticated serif headers and functional sans-serif UI components. It feels like a high-end physical journal translated to the screen, evoking trust and prestige.

## Colors

The color palette is warmer and richer than the minimalist variation.

- **Primary (Deep Indigo):** Used for headlines and key branding moments to provide weight.
- **Secondary (Pale Indigo):** Used for subtle backgrounds, highlights, and tag chips.
- **Background:** A "paper" white (#FDFCFB) reduces eye strain and reinforces the literary theme.

## Typography

The typographic hierarchy is the cornerstone of this variation. **Newsreader** provides an authoritative, literary feel for headlines. **Inter** is used for the body to ensure that while the headers feel "classic," the reading experience is modern and legible. **Hanken Grotesk** is reserved for metadata and labels, providing a clean, functional counterpoint to the serif display faces.

## Layout & Spacing

A **Fluid Grid** with fixed maximum widths is used to allow for "magazine-style" layouts where images can break the grid or span multiple columns.

- **Asymmetry:** Content is often offset to one side to allow for large-scale "Hero" imagery or pull-quotes.
- **Rhythm:** Vertical rhythm is strictly enforced to ensure that even with large headlines, the page feels balanced.
- **Adaptation:** On mobile, imagery moves from the side of the text to a full-bleed top position to maintain visual impact.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Ambient Shadows**.

- **Surfaces:** Cards use a very slight elevation (low-opacity Indigo-tinted shadow) to lift them off the paper-white background.
- **Borders:** Subtle, 1px borders in the secondary Indigo color help define content blocks without the aggression of black lines.
- **Imagery:** Large, high-quality images act as the "deepest" layer, often used as backgrounds for article headers.

## Shapes

The shape language is **Soft**. A 0.25rem (4px) radius is applied to buttons, cards, and images. This subtle rounding suggests refinement and polish, moving away from the "industrial" feel of sharp corners towards a more humanistic, accessible editorial style.

## Components

- **Buttons:** Slightly rounded corners. Primary buttons use the deep Indigo. Secondary buttons use the Pale Indigo background with Deep Indigo text.
- **Cards:** Feature "Editorial" styling—large typography, integrated imagery, and metadata labels at the top.
- **Chips:** Used for categories. These are pill-shaped, using the secondary pale Indigo color to remain unobtrusive.
- **Article Header:** A complex component combining a massive serif headline, a sub-headline in Inter, and a metadata row in Hanken Grotesk.
