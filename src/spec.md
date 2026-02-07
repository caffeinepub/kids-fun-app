# Specification

## Summary
**Goal:** Fix the Art Gallery “Upload Artwork” flow so unauthenticated users are clearly blocked from submitting, and real upload errors show useful messages instead of a generic failure toast.

**Planned changes:**
- Add an authentication check to the Art Gallery upload submission so unauthenticated users cannot submit.
- Update the UI to disable (or otherwise block) the Upload Artwork action when the user is not signed in, and show a clear English prompt to sign in.
- Improve upload error handling to display the thrown/known error message when available, with a generic fallback only for unknown errors.
- Keep existing success behavior: on successful upload, show the success toast and reset the form fields (title, category, public checkbox, preview).

**User-visible outcome:** Users who aren’t signed in are prompted to sign in before uploading and cannot submit; signed-in users can upload successfully, and any upload failures display clearer English error messages.
