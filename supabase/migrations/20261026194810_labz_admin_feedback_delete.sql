grant delete on public.labz_feedback to authenticated;

create policy labz_admin_delete
on public.labz_feedback
for delete
to authenticated
using (
  exists (
    select 1
    from public.labz_admins
    where user_id = (select auth.uid())
  )
);
