alter table if exists public.units
  add column if not exists price numeric(12, 2);
