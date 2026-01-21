create table if not exists public.roles (
  email text primary key,
  role text not null check (role in ('admin', 'employee')),
  created_at timestamptz not null default now(),
  created_by text
);

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  note text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create unique index if not exists access_requests_email_idx on public.access_requests (email);

alter table public.roles enable row level security;
alter table public.access_requests enable row level security;

create policy roles_service_role_full
  on public.roles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy access_requests_service_role_select
  on public.access_requests
  for select
  using (auth.role() = 'service_role');

create policy access_requests_service_role_update
  on public.access_requests
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy access_requests_service_role_delete
  on public.access_requests
  for delete
  using (auth.role() = 'service_role');

create policy access_requests_public_insert
  on public.access_requests
  for insert
  with check (true);

insert into public.roles (email, role, created_by)
values
  ('andrew.showell@gmail.com', 'admin', 'seed'),
  ('katieshowellatx@gmail.com', 'admin', 'seed')
on conflict (email) do update set role = excluded.role;
