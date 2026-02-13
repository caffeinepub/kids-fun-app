# Specification

## Summary
**Goal:** Keep this iteration strictly limited to the login flow, pre-login experience, and trial gameplay access gating, without affecting any existing CRUD behavior or other feature modules.

**Planned changes:**
- Restrict code changes to authentication/login flow, pre-login screens, and trial game allowlist gating/redirect behavior only.
- Ensure authenticated users continue to access all existing modules/pages with unchanged create/read/update/delete behavior.
- Ensure unauthenticated users are limited to the pre-login experience and the defined trial allowlist, with English messaging when blocked/redirected.
- Avoid introducing any new pages/modules/features as part of this change set.

**User-visible outcome:** Logged-in users can use the app as before with no CRUD/feature changes; logged-out users can only see the pre-login experience and access the allowed trial gameplay, and are blocked/redirected from all other areas with clear English messages.
