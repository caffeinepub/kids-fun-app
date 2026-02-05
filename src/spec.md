# Specification

## Summary
**Goal:** Update the global light theme to use a solid light-blue background, white cards, dark headings, and yellow primary buttons with dark text.

**Planned changes:**
- Update app-wide CSS variables and base styles in `frontend/src/index.css` to set: background `#D6F0FF`, cards/sections `#FFFFFF`, headings `#2B2B2B`, and primary button colors `#FFE066` with dark text; remove/replace existing neon/gradient token values and any gradient body background.
- Remove/replace the hardcoded gradient background wrapper classes in `frontend/src/App.tsx` so the app uses the global theme background consistently across routes.
- Adjust primary button styling via theme tokens (including hover/focus) so buttons remain yellow with dark text and avoid neon glow/text-shadow effects that change perceived colors.

**User-visible outcome:** All pages display a consistent solid light-blue background with white cards, dark headings, and yellow primary buttons with readable dark text, without gradient or neon-glow styling.
