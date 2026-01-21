alter table if exists public.units
  add column if not exists time_on_market_days integer check (time_on_market_days >= 0);
