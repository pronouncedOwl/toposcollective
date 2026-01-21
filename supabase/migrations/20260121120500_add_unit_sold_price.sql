alter table if exists public.units
  add column if not exists sold_price numeric(12, 2);
