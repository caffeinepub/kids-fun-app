# Specification

## Summary
**Goal:** Gate the full app behind Internet Identity login while providing a pre-login experience that previews features and allows a limited set of trial games.

**Planned changes:**
- Add an unauthenticated pre-login screen shown whenever the user is not authenticated, including a clear Internet Identity login call-to-action.
- Include a feature preview section in the pre-login screen by reusing the existing feature grid content.
- Allow unauthenticated users to access and play a limited set of trial games from the pre-login experience.
- Add frontend navigation/access gating so unauthenticated users cannot access restricted modules/pages (no restricted content rendered), and are redirected back to the pre-login screen with an English prompt to log in.
- Update Games Hub/game launching behavior for unauthenticated users: show trial vs locked games, block locked game launches, and display an English login prompt; keep authenticated behavior unchanged.
- Ensure logout returns the user to the pre-login experience and re-applies restrictions.

**User-visible outcome:** Logged-out users see a pre-login page where they can preview features and play a small trial set of games, but attempting to access anything else (including locked games) prompts them in English to log in; after logging in, the full app works as it does today.
