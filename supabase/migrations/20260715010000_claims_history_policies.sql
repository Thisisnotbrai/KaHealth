alter table public.claims_history enable row level security;

create policy "Authenticated users can read claims history"
  on public.claims_history
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert claims history"
  on public.claims_history
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update claims history"
  on public.claims_history
  for update
  to authenticated
  using (true)
  with check (true);