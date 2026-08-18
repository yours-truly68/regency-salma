# Design System & Visual Direction

This document defines the core visual and interaction language for the Regency Salma platform, derived from our reference designs. It serves as the source of truth for all frontend UI development.

## Decision Hierarchy
The reference images define the intended visual direction, composition, hierarchy, and interaction feel.

The implemented design system is the final source of truth for:
- Color tokens
- Typography tokens
- Spacing
- Radii
- Shadows
- Components
- Interaction states
- Accessibility
- Responsive behavior

When a reference image and an implementation detail conflict, preserve the reference image’s intent through the existing design-system tokens and components. Do not introduce arbitrary one-off values or a second styling system. Design tokens must eventually be stored and managed in code, not only described in Markdown.

## Visual Direction & Brand Identity
The application should evoke a premium, "Prestige Elysian-style" living experience. It must feel secure, elegant, and effortlessly intuitive. The reference images guide the experiences separately:
1. **Login/Onboarding Experience:** Clean, welcoming, structured, heavily relying on illustrations and clear call-to-action flows.
2. **Resident App Experience:** Dense but highly legible dashboard, focusing on quick actions, real-time status, and distinct distinct functional spaces.

**Core Characteristics:**
- **Tone:** Premium, trustworthy, warm, and structured.
- **Density:** Breathable and uncluttered. High whitespace usage to separate concerns rather than heavy lines.
- **Originality:** Inspired by provided reference images for composition and hierarchy but distinctly Regency Salma. Do not copy proprietary branding.

## Color Palette
The color system relies on earthy, elegant tones to create a calming and premium atmosphere:
- **Primary / Brand:** Deep Hunter Green (e.g., `#143D2A`). Used for primary buttons, active states, and branding.
- **Backgrounds:** Warm Off-White / Cream (e.g., `#F9F7F2`). Avoid stark `#FFFFFF` for primary app backgrounds to reduce eye strain.
- **Accents:** Muted Gold / Copper. Used for secondary emphasis or premium badges.
- **Text:** 
  - **Primary:** Dark Charcoal / Near Black for maximum legibility on headings.
  - **Secondary:** Slate gray for descriptions, timestamps, and secondary labels.
- **Semantic Colors:**
  - **Success:** Soft green.
  - **Warning:** Soft amber/orange.
  - **Danger/Error:** Soft red.

## Typography
- **Typeface:** Plus Jakarta Sans. This is the single primary font family for the application, ensuring a modern, clean, architectural, and premium feel. No serif fonts are permitted.
- **Hierarchy:**
  - **Headings:** Bold, clear, and slightly tighter letter-spacing.
  - **Body:** Regular weight, generous line height.
  - **Labels/Caps:** Small, uppercase, wider letter-spacing.

## Spacing and Radius Principles
- **Spacing:** Based on an 8pt grid (8, 16, 24, 32, etc.).
- **Border Radius:** 
  - Cards: `16px` to `24px` radius.
  - Buttons: Pill-shaped or heavily rounded (`12px` to `100px` depending on button size/type).

## Interaction & Navigation Patterns
- **Login / Onboarding:** No bottom navigation. Focus on linear progression, back buttons, and clear primary actions.
- **Authenticated Resident Area:** Fixed bottom tab bar for core areas (Home, Community, Services, Profile) with a distinct, centralized "Quick Action" floating button.
- **Transitions:** Smooth, standard mobile transitions (slide over, modal pop-ups).

## Component States
To ensure a robust UX, all components and screens must define:
- **Loading:** Smooth skeleton loaders or subtle spinners. Never freeze the UI.
- **Empty:** Helpful empty states with illustrations and clear call-to-action buttons (e.g., "No visitors yet. Add a visitor.").
- **Error:** Non-intrusive error toasts or inline messages with retry actions.
- **Disabled:** Visually distinct (lower opacity, grayed out) to indicate inactive actions without looking broken.
- **Unauthorized / Permission Denied:** Clear messaging explaining why access is restricted, with a path to request access if applicable.
- **Offline:** Banner indicating no network connection, gracefully degrading features that require sync.

## Accessibility
- Contrast ratios must meet WCAG AA standards.
- Support dynamic type scaling.
- Ensure all interactive elements have sufficient hit areas (`44x44pt` minimum) and clear states.
