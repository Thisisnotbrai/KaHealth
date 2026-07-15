create table if not exists public.admin_login_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users (id) on delete cascade,
  admin_name text not null,
  admin_email text not null,
  logged_in_at timestamptz not null default now()
);

create index if not exists admin_login_logs_logged_in_at_idx
  on public.admin_login_logs (logged_in_at desc);

create index if not exists admin_login_logs_admin_id_idx
  on public.admin_login_logs (admin_id);

alter table public.admin_login_logs enable row level security;

create policy "Authenticated users can read admin login logs"
  on public.admin_login_logs
  for select
  to authenticated
  using (true);

create policy "Authenticated users can write admin login logs"
  on public.admin_login_logs
  for insert
  to authenticated
  with check (true);
