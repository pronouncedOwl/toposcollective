-- Ensure photo_role enum exists (no-op if already present)
do $$ begin
  create type public.photo_role as enum ('hero', 'gallery', 'progress', 'floorplan', 'misc');
exception
  when duplicate_object then null;
end $$;

-- Add role column for unit photos if missing
alter table if exists public.unit_photos
  add column if not exists role public.photo_role not null default 'gallery';
