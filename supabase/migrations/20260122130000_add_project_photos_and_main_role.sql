-- Add project-level photos and switch unit main photos to role 'main'

alter type public.photo_role add value if not exists 'main';

create table if not exists public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  role public.photo_role not null default 'gallery',
  storage_path text not null,
  alt_text text,
  caption text,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists project_photos_project_idx on public.project_photos (project_id);
create index if not exists project_photos_role_idx on public.project_photos (role);

alter table public.project_photos enable row level security;

do $$ begin
  create policy project_photos_service_role_full
  on public.project_photos
  as permissive
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy project_photos_public_read
  on public.project_photos
  for select
  using (
    exists (
      select 1
      from public.projects p
      where p.id = project_photos.project_id
        and p.is_public
    )
  );
exception when duplicate_object then null; end $$;

