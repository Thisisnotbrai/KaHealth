create or replace function public.deduct_stock_on_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.medicine_id is null then
    return new;
  end if;

  if new.status = 'approved' and (old.status is distinct from 'approved') then
    if coalesce((select stock from public.medicines where id = new.medicine_id), 0) < new.quantity then
      raise exception 'Insufficient stock for this medicine request.';
    end if;

    update public.medicines
    set stock = stock - new.quantity
    where id = new.medicine_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_deduct_stock_on_approval on public.medicine_requests;

create trigger trg_deduct_stock_on_approval
after update of status on public.medicine_requests
for each row
when (new.status = 'approved' and (old.status is distinct from 'approved'))
execute function public.deduct_stock_on_approval();
