## Topos Collective – Projects CMS

This repo now powers a Supabase-backed CMS for tracking projects, units, and media across the public `coming-soon` and `completed` pages. It mirrors the KatieSite blog stack so both codebases share patterns (Supabase, storage buckets, Next.js App Router).

### Key directories

- `supabase/projects_schema.sql` – migration script to create tables, enums, RLS policies, and the `project-assets` storage bucket. Run it in the Supabase SQL editor before deploying the app.
- `src/app/api/projects/**` – REST endpoints for projects, units, and photo upload orchestration.
- `src/app/admin/**` – admin UI for managing projects, units, and photos.
- `src/app/coming-soon` & `src/app/completed` – public pages that read live data from Supabase.

---

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `env.example` to `.env.local` and fill in:

   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
   - `PROJECT_STORAGE_BUCKET` / `NEXT_PUBLIC_PROJECT_BUCKET` (defaults to `project-assets`)
   - `ADMIN_API_TOKEN` (optional hardening until NextAuth is wired)
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional for static maps)
   - Existing contact-form values (`SMTP2GO_*`, `CONTACT_EMAIL`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`, etc.)

   > ⚠️ The admin UI only includes the token if `NEXT_PUBLIC_ADMIN_API_TOKEN` is populated, so avoid using the shared-secret path in production until a true auth layer is added.

3. **Provision Supabase**

   - Open the Supabase SQL editor.
   - Paste `supabase/projects_schema.sql` and run it once per environment.
   - The script creates the tables (`projects`, `units`, `unit_photos`), enums, triggers, RLS policies, and the `project-assets` bucket with the right storage policies.

4. **Run locally**

   ```bash
   npm run dev
   ```

   - Admin dashboard: [http://localhost:3000/admin/projects](http://localhost:3000/admin/projects)
   - Coming soon page: `/coming-soon`
   - Completed page: `/completed`

---

## Admin CMS Highlights

- **Project CRUD** – status, address, completion dates, hero imagery, metadata, and sort order.
- **Unit management** – add/edit/remove units with bed/bath/sqft/description; list order is persisted.
- **Photos** – upload files directly to Supabase Storage via signed URLs with automatic metadata records.
- **Status tabs** – filter Coming Soon vs Completed to match the public pages.

Every mutating API checks `ADMIN_API_TOKEN` when it is defined. Leave it empty for local work or wire it into your auth solution (NextAuth, etc.) and proxy the token server-to-server.

---

## Public Pages

- `/coming-soon` pulls `status = coming_soon` projects and renders live map tiles per address.
- `/completed` hydrates hero images + galleries from Supabase (project-level and unit-level photos) with modal + pagination controls.

Row Level Security only exposes `is_public = true`, so admin drafts remain hidden until published.

---

## Scripts & Testing

- `npm run dev` – Turbopack dev server.
- `npm run build` – production build.
- `npm run lint` – ESLint (currently reports a few pre-existing copy warnings).

---

## Deployment Checklist

1. Run `supabase/projects_schema.sql` in the target Supabase project.
2. Confirm the `project-assets` bucket exists (the script will create it if missing).
3. Configure environment variables in the hosting platform (Vercel, etc.).
4. Deploy via your usual workflow (`vercel`, CI/CD, etc.).
5. Seed at least one project through `/admin/projects`.

With these steps complete, the public pages and admin CMS will stay in sync via Supabase.
