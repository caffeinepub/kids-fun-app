# Specification

## Summary
**Goal:** Make the Avatar Creator preview look more 3D and expand the available customization options without changing any backend schema or impacting other app areas.

**Planned changes:**
- Improve perceived 3D depth in `frontend/src/components/avatar3d/AvatarPreview3D.tsx` via presentational tweaks (layering, shading/lighting, silhouette) while keeping the existing avatarConfig-driven rendering and interactions.
- Adjust existing avatar-related CSS in `frontend/src/index.css` to strengthen highlights/shadows and depth effects for the preview.
- Add more selectable variants within existing Avatar Creator categories (head, hair, body, pants, headwear, shoes) in `frontend/src/pages/AvatarCreatorPage.tsx` without introducing any new AvatarConfig fields.
- Extend `frontend/src/components/avatar3d/avatarVariants.ts` with mappings for all newly added option IDs so every new selection renders in the preview and works with Randomize.

**User-visible outcome:** The Avatar Creator preview looks noticeably more 3D (with better depth and lighting), and users can choose from more options in the existing customization tabs; randomize, save, and reload continue to work as before.
