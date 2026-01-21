-- Remove project-level photos in favor of unit-only photos.
drop table if exists public.project_photos cascade;
