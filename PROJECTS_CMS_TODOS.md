# Projects CMS — Remaining Work

This list consolidates gaps and follow-up tasks identified in the assessment.

## Security & Access
- Replace shared admin token with real auth (NextAuth, Supabase Auth, or middleware + session).
- Remove `NEXT_PUBLIC_ADMIN_API_TOKEN` usage once real auth exists.
- Add server-side authorization for admin routes beyond token checks (e.g., middleware guard).

## Admin UI Enhancements
- Add unit photo upload + management UI (uses `/api/projects/units/:unitId/photos`).
- Add hero image selection (either role-based or select `hero_image_url`).
- Add photo reordering (project and unit photos).
- Add project and unit reordering UI (sort order).
- Add basic field validation feedback in the UI (slug format, numeric bounds).

## Data & Content Workflow
- Provide a publish workflow (draft vs public) with clear UI affordances.
- Add bulk actions for status changes (coming soon ↔ completed).
- Create a seed script or sample data flow for initial setup.

## Public Pages
- Confirm hero image logic aligns with admin inputs (URL vs hero role).
- Optional: show unit photo galleries on completed projects if desired.

## Observability & Reliability
- Add error reporting for admin upload failures (toast + error detail).
- Add logging or analytics for admin actions (optional).

## Documentation / Runbook
- Add a quickstart “Admin CMS setup” section with:
  - Supabase SQL run steps
  - Env var checklist
  - Admin URL + test flow
