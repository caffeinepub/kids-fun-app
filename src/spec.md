# Specification

## Summary
**Goal:** Update the Kids YouTube Videos Hub channel detail experience to embed videos on-site only for channels that allow embedding, while directing users to YouTube for embed-blocked channels.

**Planned changes:**
- Update `frontend/src/pages/VideoHubPage.tsx` so channels with `embedBlocked: true` do not render an embedded player and instead show the existing CTA to open the `channelUrl` on YouTube.
- Update `frontend/src/pages/VideoHubPage.tsx` so channels without `embedBlocked: true` render the on-site embedded player using the existing `embedUrl` (via an `<iframe>` in the existing `aspect-video` container) with appropriate playback attributes.
- Ensure a visible “Watch on YouTube” link/button remains available for all channels, opening `channelUrl` in a new tab.

**User-visible outcome:** When viewing a channel, users can watch videos directly on the site if embedding is allowed; otherwise they are prompted to watch on YouTube, with a “Watch on YouTube” option always available.
