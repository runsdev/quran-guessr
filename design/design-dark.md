---
name: quran-guessr-dark
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#bcc9c9'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#879394'
  outline-variant: '#3d494a'
  surface-tint: '#6ad7de'
  primary: '#6ad7de'
  on-primary: '#003739'
  primary-container: '#2ca4ab'
  on-primary-container: '#003436'
  inverse-primary: '#00696e'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#bcc7de'
  on-tertiary: '#263143'
  tertiary-container: '#8a95ab'
  on-tertiary-container: '#232e40'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#88f3fa'
  primary-fixed-dim: '#6ad7de'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  arabic-display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 60px
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
  gutter: 16px
  margin: 20px
---

## Brand & Style

This design system is built for a focused, meditative learning experience. The personality is
scholarly yet modern, prioritizing deep immersion and spiritual clarity. It avoids the harshness of
pure black in favor of a sophisticated deep navy that feels like a night sky, reducing ocular
fatigue during long study sessions.

The aesthetic leans into **Minimalism** with a touch of **Glassmorphism**. By using subtle
translucent layers, the UI creates a sense of depth and hierarchy without relying on high-contrast
borders that might distract the user. The goal is to make the interface feel like a premium, quiet
tool that recedes into the background, allowing the sacred text and the learning process to remain
the singular focus.

## Colors

The palette is engineered for low-light environments. The primary surface is a deep slate (#0F172A),
providing a stable, non-vibrating foundation. The primary accent is a vibrant teal (#2CA4AB), used
sparingly for interactive elements and progress indicators to draw the eye without overwhelming it.

- **Surface:** Deep Slate (#0F172A) for the main background.
- **Primary:** Vibrant Teal (#2CA4AB) for CTAs and active states.
- **Secondary:** Muted Teal/Slate (#64748B) for icons and de-emphasized actions.
- **Tertiary:** Navy Slate (#1E293B) for container backgrounds and input fields.
- **Text (High):** Light Gray (#F8FAFC) for primary headers.
- **Text (Low):** Slate Gray (#94A3B8) for secondary body text and metadata.

## Typography

Inter is utilized for its exceptional legibility in dark mode. Tight tracking is applied to
headlines to maintain a modern, "sleek" appearance, while body text uses generous line heights to
prevent "cluttering" on the dark background.

For Arabic script (Ayahs), the system defaults to a larger scale relative to the Latin text to
ensure the intricate diacritics are clearly visible. The weight for body text should stay at 400;
anything lighter risks becoming unreadable against the deep navy background.

## Layout & Spacing

This design system uses a **fluid grid** centered around an 8px rhythm. For mobile-first quiz
interactions, horizontal margins are kept at 20px to provide a breathable "frame" for the content.

The layout philosophy emphasizes vertical breathing room. Quiz questions should be centered
vertically on the screen when possible, using generous padding between the question stem and the
answer options to reduce cognitive load.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and **Backdrop Blurs**. Rather than using traditional
drop shadows which can appear "muddy" on navy backgrounds, we use color-shifting for elevation:

1.  **Level 0 (Base):** #0F172A.
2.  **Level 1 (Cards/Inputs):** #1E293B.
3.  **Level 2 (Modals/Overlays):** #1E293B with a 1px border of #2CA4AB at 20% opacity.

For immersive elements like a "Current Progress" drawer, use a semi-transparent background (70%
opacity of #1E293B) with a 10px background blur to create a frosted-glass effect that maintains the
sense of context.

## Shapes

The shape language is **Rounded**, conveying a sense of approachability and comfort. Main quiz cards
and action buttons utilize a 0.5rem (8px) corner radius. This strikes a balance between the
precision of the Inter font and the human-centric nature of the app. Progress bars and status chips
should use the `rounded-xl` (1.5rem) token to appear softer and distinct from the structural card
elements.

## Components

- **Buttons:** Primary buttons use a solid Teal (#2CA4AB) fill with high-contrast Slate (#0F172A)
  text. Secondary buttons are ghost-styled with a Teal border and Teal text.
- **Quiz Options:** These are large, clickable cards using the Level 1 elevation (#1E293B). On
  selection, the border should transition to a 2px solid Teal stroke.
- **Progress Ring:** A thin, high-glow teal ring used for "Current Streaks" or "Quiz Completion."
  Use a 10% opacity teal track behind the active ring segment.
- **Chips:** Small tags for "Surah" or "Difficulty" levels. Use a #1E293B background with #94A3B8
  text and 24px rounded corners.
- **Input Fields:** Minimalist design with a bottom-only border of #334155. On focus, the border
  animates to #2CA4AB.
- **Feedback States:** Correct answers should glow with a soft green inner-shadow; incorrect answers
  should use a muted rose border rather than a vibrant red to stay within the "low-strain"
  philosophy.
