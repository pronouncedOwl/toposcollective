-- Add gallery photos table for the public portfolio gallery
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_text text,
  caption text,
  size text not null default 'normal' check (size in ('normal', 'tall', 'wide')),
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists gallery_photos_sort_idx on public.gallery_photos (sort_order);

alter table public.gallery_photos enable row level security;

do $$ begin
  create policy gallery_photos_service_role_full
  on public.gallery_photos
  as permissive
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy gallery_photos_public_read
  on public.gallery_photos
  for select
  using (true);
exception when duplicate_object then null; end $$;
