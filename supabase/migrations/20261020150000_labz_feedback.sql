begin;
create table public.labz_feedback (
  request_id uuid primary key,
  created_at timestamptz not null default now(),
  project text not null check(project in ('sensoria','million-de-pixels','lootchest','diagnostic','constella','chess','pipboy','atelierflow')),
  kind text not null check(kind in ('idea','bug','opinion')),
  summary text not null check(char_length(btrim(summary)) between 3 and 120),
  message text not null check(char_length(btrim(message)) between 5 and 3000),
  nickname text not null default '' check(char_length(nickname)<=50)
);
create index labz_feedback_date on public.labz_feedback(created_at);
create table public.labz_feedback_quota(day date primary key, count integer not null);
alter table public.labz_feedback enable row level security;
alter table public.labz_feedback_quota enable row level security;
revoke all on public.labz_feedback, public.labz_feedback_quota from public, anon, authenticated, service_role;
-- Inbox is only readable by the project owner through the database dashboard.
create function public.labz_submit_feedback(p_request_id uuid,p_project text,p_kind text,p_summary text,p_message text,p_nickname text)
returns text language plpgsql security definer set search_path = '' as $$
declare current_count integer; today date := (now() at time zone 'UTC')::date;
begin
  -- Serializes admissions: simultaneous requests cannot exceed the quota.
  perform pg_advisory_xact_lock(20261020, 1500);
  delete from public.labz_feedback where created_at < now() - interval '90 days';
  delete from public.labz_feedback_quota where day < today - 7;
  if exists(select 1 from public.labz_feedback where request_id=p_request_id) then return 'accepted'; end if;
  select count into current_count from public.labz_feedback_quota where day=today;
  if coalesce(current_count,0)>=100 or (select count(*) from public.labz_feedback)>=500 then return 'limited'; end if;
  insert into public.labz_feedback(request_id,project,kind,summary,message,nickname)
    values(p_request_id,p_project,p_kind,btrim(p_summary),btrim(p_message),btrim(p_nickname));
  insert into public.labz_feedback_quota(day,count) values(today,1)
    on conflict(day) do update set count=public.labz_feedback_quota.count+1;
  return 'accepted';
end;
$$;
revoke all on function public.labz_submit_feedback(uuid,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.labz_submit_feedback(uuid,text,text,text,text,text) to service_role;
commit;
