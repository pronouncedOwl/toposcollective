alter table if exists public.units
  add column if not exists short_description text,
  add column if not exists long_description text;

update public.units
set short_description = coalesce(short_description, description)
where short_description is null;
