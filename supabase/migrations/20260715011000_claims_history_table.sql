create table if not exists public.claims_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.medicine_requests (id) on delete cascade,
  medicine_id uuid references public.medicines (id) on delete set null,
  admin_id uuid references auth.users (id) on delete set null,
  delivered_by uuid references auth.users (id) on delete set null,
  notes text,
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists claims_history_request_id_idx
  on public.claims_history (request_id);

create index if not exists claims_history_admin_id_idx
  on public.claims_history (admin_id);

create index if not exists claims_history_delivered_by_idx
  on public.claims_history (delivered_by);
