# Specification

## Summary
**Goal:** Apply a focused light-theme color update for background, cards/sections, headings, and primary buttons without changing any app behavior or CRUD flows.

**Planned changes:**
- Update global light theme color tokens/variables so the main background is #D6F0FF and card/section surfaces are #FFFFFF.
- Set primary heading text color defaults to #2B2B2B in light mode.
- Update primary button styling to use #FFE066 with a dark, readable text color.
- Make minimal, directly-related adjustments to any hardcoded color classes that prevent the new theme tokens from applying (styling-only changes).

**User-visible outcome:** In light mode, the app displays a light-blue page background, white cards/sections, dark primary headings, and yellow primary buttons with readable dark text, with all existing functionality unchanged.
