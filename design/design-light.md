---
name: quran-guessr-light
colors:
  surface: '#f6fafa'
  surface-dim: '#d6dbdb'
  surface-bright: '#f6fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f4'
  surface-container: '#eaefef'
  surface-container-high: '#e4e9e9'
  surface-container-highest: '#dfe3e3'
  on-surface: '#171d1d'
  on-surface-variant: '#3d494a'
  inverse-surface: '#2c3132'
  inverse-on-surface: '#edf2f1'
  outline: '#6d797a'
  outline-variant: '#bcc9c9'
  surface-tint: '#00696e'
  primary: '#00696e'
  on-primary: '#ffffff'
  primary-container: '#2ca4ab'
  on-primary-container: '#003436'
  inverse-primary: '#6ad7de'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#924b1d'
  on-tertiary: '#ffffff'
  tertiary-container: '#d4804d'
  on-tertiary-container: '#4f2000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#88f3fa'
  primary-fixed-dim: '#6ad7de'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68d'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#743505'
  background: '#f6fafa'
  on-background: '#171d1d'
  surface-variant: '#dfe3e3'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The ethos of this design system is "Serene Clarity." Designed for a Quran quiz application, it
prioritizes a meditative user experience that fosters focus and spiritual reflection. The brand
personality is scholarly yet accessible, avoiding visual clutter to allow the sacred text and
educational content to remain the center of attention.

The chosen style is **Minimalism with Tonal Layering**. It utilizes generous whitespace, precise
typography, and a restrained color palette to create an atmosphere of reverence. Interactions are
subtle and intentional, ensuring the interface feels like a quiet digital companion rather than a
high-octane gaming app.

## Colors

The palette is anchored by a soft white surface to reduce eye strain during long reading or quiz
sessions. The primary teal accent (#2CA4AB) is used sparingly for key actions and progress
indicators, symbolizing growth and tranquility.

Slate grays provide a sophisticated hierarchy for information: Darker slate (#1E293B) for primary
readability and lighter slate (#64748B) for secondary UI elements. Success states use a desaturated
emerald, while error states use a soft terracotta to maintain the calm aesthetic.

## Typography

This design system utilizes 'Inter' exclusively to maintain a functional, systematic, and
utilitarian feel. The typography relies on weight and subtle scale shifts rather than multiple
typefaces to create hierarchy.

Headlines use a medium-to-semibold weight with slight negative letter-spacing for a modern look.
Body text is set with generous line heights to ensure maximum legibility for Quranic verses and quiz
questions. Labels use a slightly increased letter-spacing to distinguish them from prose.

## Layout & Spacing

The layout follows a **Fixed-Width Column** model for mobile-first experiences, centered on a 4px
baseline grid. On larger screens, the content remains contained within a 640px maximum width to
preserve focus and prevent eye fatigue.

Spacing is used to group related concepts. For example, a quiz question and its options are
separated by `md` (16px) spacing, while the transition between different quiz sections uses `xxl`
(48px) to provide a clear mental break.

## Elevation & Depth

Elevation in this design system is achieved through **Tonal Layers** and **Low-Contrast Outlines**.
Deep shadows are avoided to maintain the minimal aesthetic.

- **Level 0 (Base):** The surface color (#F8F9FA).
- **Level 1 (Cards):** Pure white (#FFFFFF) with a 1px border of #E2E8F0.
- **Level 2 (Active States):** Pure white with a soft, diffused shadow (0px 4px 12px rgba(0, 0, 0,
  0.03)).
- **Overlays:** A 40% opacity slate-gray backdrop is used for modals to keep the focus entirely on
  the dialogue.

## Shapes

The shape language is "Softly Geometric." A standard radius of 0.5rem (8px) is applied to primary UI
elements like buttons and input fields. This provides a approachable feel that is neither too sharp
(clinical) nor too round (playful). Cards and containers utilize a larger 1rem (16px) radius to
create a distinct containerized feel for content modules.

## Components

- **Buttons:** Primary buttons use the teal fill with white text. Secondary buttons use a white
  background with a slate-gray border. All buttons use 16px vertical padding for a tactile,
  easy-to-tap target.
- **Quiz Option Cards:** Use Level 1 elevation (white background, subtle border). Upon selection,
  the border thickens to 2px and changes to the primary teal color.
- **Progress Bar:** A thin (4px) track in light slate with a teal fill. It should be positioned at
  the very top of the screen to provide a constant sense of progression without being a distraction.
- **Chips:** Small, rounded-pill shapes used for tags like "Juz," "Surah," or "Difficulty." They use
  a very light teal background with dark teal text.
- **Input Fields:** Minimalist design with a bottom-only border that transitions to a full 1px teal
  outline on focus.
- **Feedback Indicators:** Use icons sparingly. A simple checkmark or "X" in desaturated tones
  should appear only after an answer is submitted to maintain the respectful, calm tone.
- **Verse Displays:** Quranic text should be housed in a distinct card with increased horizontal
  margins to signify its importance and provide a focused reading area.
