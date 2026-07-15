alter table public.claims_history
  alter column request_id drop not null;

alter table public.claims_history
  drop constraint if exists claims_history_request_id_fkey;

alter table public.claims_history
  add constraint claims_history_request_id_fkey
  foreign key (request_id)
  references public.medicine_requests (id)
  on delete set null;