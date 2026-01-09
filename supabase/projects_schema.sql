-- Projects CMS schema for Topos Collective
-- Run this script inside the Supabase SQL editor (or psql) connected to the project.
-- It provisions tables, enums, RLS policies, and storage assets shared by the CMS and public site.

-- 0. Extensions ----------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Enumerations --------------------------------------------------------------
do $$ begin
  create type project_status as enum ('coming_soon', 'completed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type photo_role as enum ('hero', 'gallery', 'progress', 'floorplan', 'misc');
exception
  when duplicate_object then null;
end $$;

-- 2. Utility trigger for updated_at -------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- 3. Projects table ------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status project_status not null default 'coming_soon',
  is_public boolean not null default false,
  address_line1 text not null,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text default 'USA',
  estimated_completion date,
  actual_completion date,
  total_units integer check (total_units >= 0),
  short_description text,
  long_description text,
  hero_image_url text,
  featured boolean not null default false,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_featured_idx on public.projects (featured) where featured is true;

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function set_updated_at();

-- 4. Units table ---------------------------------------------------------------
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  unit_code text,
  bedrooms numeric(4,2) check (bedrooms >= 0),
  bathrooms numeric(4,2) check (bathrooms >= 0),
  square_feet integer check (square_feet >= 0),
  description text,
  floorplan_url text,
  availability_status text,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists units_project_idx on public.units (project_id);
create index if not exists units_sort_idx on public.units (project_id, sort_order);

create trigger set_units_updated_at
before update on public.units
for each row
execute function set_updated_at();

-- 5. Project photos table ------------------------------------------------------
create table if not exists public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  role photo_role not null default 'gallery',
  storage_path text not null,
  alt_text text,
  caption text,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists project_photos_project_idx on public.project_photos (project_id);
create index if not exists project_photos_role_idx on public.project_photos (role);

-- 6. Unit photos table ---------------------------------------------------------
create table if not exists public.unit_photos (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  caption text,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists unit_photos_unit_idx on public.unit_photos (unit_id);

-- 7. Views (optional helpers) --------------------------------------------------
create or replace view public.project_with_units as
select
  p.*,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'unit_code', u.unit_code,
        'bedrooms', u.bedrooms,
        'bathrooms', u.bathrooms,
        'square_feet', u.square_feet,
        'description', u.description,
        'floorplan_url', u.floorplan_url,
        'availability_status', u.availability_status,
        'sort_order', u.sort_order
      )
      order by u.sort_order asc, u.created_at asc
    ) filter (where u.id is not null),
    '[]'::jsonb
  ) as units
from public.projects p
left join public.units u on u.project_id = p.id
group by p.id;

-- 8. Row Level Security --------------------------------------------------------
alter table public.projects enable row level security;
alter table public.units enable row level security;
alter table public.project_photos enable row level security;
alter table public.unit_photos enable row level security;

-- Service role full access
do $$ begin
  create policy projects_service_role_full
  on public.projects
  as permissive
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy units_service_role_full
  on public.units
  as permissive
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy project_photos_service_role_full
  on public.project_photos
  as permissive
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy unit_photos_service_role_full
  on public.unit_photos
  as permissive
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

-- Public read policies (anon key)
do $$ begin
  create policy projects_public_read
  on public.projects
  for select
  using (is_public);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy units_public_read
  on public.units
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = units.project_id
        and p.is_public
    )
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy project_photos_public_read
  on public.project_photos
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_photos.project_id
        and p.is_public
    )
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy unit_photos_public_read
  on public.unit_photos
  for select
  using (
    exists (
      select 1
      from public.units u
      join public.projects p on p.id = u.project_id
      where u.id = unit_photos.unit_id
        and p.is_public
    )
  );
exception when duplicate_object then null; end $$;

-- 9. Storage bucket ------------------------------------------------------------
-- Creates a dedicated bucket for project/unit media, public read-only
select storage.create_bucket(
  'project-assets',
  jsonb_build_object(
    'public', true,
    'file_size_limit', 52428800,         -- 50 MB cap
    'allowed_mime_types', array['image/jpeg','image/png','image/webp']
  )
) where not exists (
  select 1 from storage.buckets where id = 'project-assets'
);

-- Storage policies
do $$ begin
  create policy "Public read project assets"
  on storage.objects
  for select
  using (bucket_id = 'project-assets');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Service role full access project assets"
  on storage.objects
  for all
  using (bucket_id = 'project-assets' and auth.role() = 'service_role')
  with check (bucket_id = 'project-assets' and auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

-- 10. Helpful seed (optional) --------------------------------------------------
-- insert into public.projects (slug, name, status, is_public, address_line1, city, state, short_description)
-- values ('seed-sample', 'Sample Project', 'coming_soon', true, '123 Demo St', 'Austin', 'TX', 'Example description');


