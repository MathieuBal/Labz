create table public.labz_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.labz_admins enable row level security;
revoke all on public.labz_admins from public, anon, authenticated;
grant select on public.labz_admins to authenticated;
grant select, insert, delete on public.labz_admins to service_role;
create policy labz_admin_self on public.labz_admins for select to authenticated
 using (user_id = (select auth.uid()));
alter table public.labz_feedback add column status text not null default 'new'
 check (status in ('new', 'in_progress', 'done'));
grant select on public.labz_feedback to authenticated;
grant update (status) on public.labz_feedback to authenticated;
create policy labz_admin_read on public.labz_feedback for select to authenticated
 using (exists (select 1 from public.labz_admins where user_id = (select auth.uid())));
create policy labz_admin_status on public.labz_feedback for update to authenticated
 using (exists (select 1 from public.labz_admins where user_id = (select auth.uid())))
 with check (exists (select 1 from public.labz_admins where user_id = (select auth.uid())));
-- Admin membership is provisioned explicitly only after verifying the chosen Auth account.
-- No signup hook, email claim, user_metadata or first-user bootstrap grants access.
