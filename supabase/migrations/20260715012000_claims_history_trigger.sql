create or replace function public.sync_claims_history_from_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' then
    insert into public.claims_history (
      request_id,
      medicine_id,
      admin_id,
      notes,
      claimed_at
    )
    values (
      new.id,
      new.medicine_id,
      auth.uid(),
      concat('Approved and reserved ', new.quantity, '.'),
      null
    )
    on conflict (request_id) do update
      set medicine_id = excluded.medicine_id,
          admin_id = excluded.admin_id,
          notes = excluded.notes;
  elsif new.status = 'claimed' then
    insert into public.claims_history (
      request_id,
      medicine_id,
      delivered_by,
      claimed_at,
      notes
    )
    values (
      new.id,
      new.medicine_id,
      auth.uid(),
      now(),
      'Marked as claimed/completed.'
    )
    on conflict (request_id) do update
      set medicine_id = excluded.medicine_id,
          delivered_by = excluded.delivered_by,
          claimed_at = excluded.claimed_at,
          notes = excluded.notes;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_claims_history_from_request on public.medicine_requests;

create trigger trg_sync_claims_history_from_request
after update of status on public.medicine_requests
for each row
when (new.status in ('approved', 'claimed'))
execute function public.sync_claims_history_from_request();