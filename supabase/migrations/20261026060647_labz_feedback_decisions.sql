create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.labz_topics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project text not null check (char_length(project) <= 64 and project ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  type text not null default 'signal' check (type in ('idea','problem','signal')),
  title text not null check (char_length(btrim(title)) between 3 and 120),
  synthesis text not null default '' check (char_length(synthesis) <= 3000),
  impact text not null default 'medium' check (impact in ('low','medium','high')),
  effort text not null default 'medium' check (effort in ('low','medium','high')),
  state text not null default 'to_study' check (state in ('to_study','in_progress','deferred','abandoned','shipped')),
  decision_rationale text not null default '' check (char_length(decision_rationale) <= 2000)
);

create table public.labz_topic_feedback (
  topic_id uuid not null references public.labz_topics(id) on delete cascade,
  feedback_id uuid not null references public.labz_feedback(request_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (topic_id, feedback_id)
);

create table public.labz_decisions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.labz_topics(id) on delete cascade,
  state text not null check (state in ('to_study','in_progress','deferred','abandoned','shipped')),
  rationale text not null check (char_length(btrim(rationale)) between 3 and 2000),
  decided_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index labz_topics_project_state_updated on public.labz_topics(project, state, updated_at desc);
create index labz_topic_feedback_feedback on public.labz_topic_feedback(feedback_id);
create index labz_decisions_topic_created on public.labz_decisions(topic_id, created_at desc);

alter table public.labz_topics enable row level security;
alter table public.labz_topic_feedback enable row level security;
alter table public.labz_decisions enable row level security;

revoke all on public.labz_topics, public.labz_topic_feedback, public.labz_decisions from public, anon, authenticated;
grant select on public.labz_topics to authenticated;
grant insert (project, type, title, synthesis, impact, effort) on public.labz_topics to authenticated;
grant update (type, title, synthesis, impact, effort, state, decision_rationale) on public.labz_topics to authenticated;
grant select, insert, delete on public.labz_topic_feedback to authenticated;
grant select on public.labz_decisions to authenticated;
grant select, insert, update, delete on public.labz_topics, public.labz_topic_feedback, public.labz_decisions to service_role;

create policy labz_topics_read on public.labz_topics for select to authenticated
  using (exists (select 1 from public.labz_admins where user_id = (select auth.uid())));
create policy labz_topics_insert on public.labz_topics for insert to authenticated
  with check (
    state = 'to_study' and decision_rationale = '' and
    exists (select 1 from public.labz_admins where user_id = (select auth.uid()))
  );
create policy labz_topics_update on public.labz_topics for update to authenticated
  using (exists (select 1 from public.labz_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.labz_admins where user_id = (select auth.uid())));

create policy labz_topic_feedback_read on public.labz_topic_feedback for select to authenticated
  using (exists (select 1 from public.labz_admins where user_id = (select auth.uid())));
create policy labz_topic_feedback_insert on public.labz_topic_feedback for insert to authenticated
  with check (
    exists (select 1 from public.labz_admins where user_id = (select auth.uid())) and
    exists (
      select 1
      from public.labz_topics t
      join public.labz_feedback f on f.request_id = feedback_id
      where t.id = topic_id and t.project = f.project
    )
  );
create policy labz_topic_feedback_delete on public.labz_topic_feedback for delete to authenticated
  using (exists (select 1 from public.labz_admins where user_id = (select auth.uid())));

create policy labz_decisions_read on public.labz_decisions for select to authenticated
  using (exists (select 1 from public.labz_admins where user_id = (select auth.uid())));

create or replace function private.labz_topics_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.title := btrim(new.title);
  new.synthesis := btrim(new.synthesis);
  new.decision_rationale := btrim(new.decision_rationale);
  new.updated_at := now();

  if tg_op = 'INSERT' then
    if new.state <> 'to_study' and char_length(new.decision_rationale) < 3 then
      raise exception using errcode = 'P0001', message = 'decision_rationale_required';
    end if;
    if new.state = 'in_progress' then
      perform pg_advisory_xact_lock(20261026, 1812);
      if (select count(*) from public.labz_topics where state = 'in_progress') >= 3 then
        raise exception using errcode = 'P0001', message = 'topic_wip_limit';
      end if;
    end if;
  elsif new.state is distinct from old.state then
    if char_length(new.decision_rationale) < 3 then
      raise exception using errcode = 'P0001', message = 'decision_rationale_required';
    end if;
    if new.state = 'in_progress' and old.state is distinct from 'in_progress' then
      perform pg_advisory_xact_lock(20261026, 1812);
      if (select count(*) from public.labz_topics where state = 'in_progress' and id <> new.id) >= 3 then
        raise exception using errcode = 'P0001', message = 'topic_wip_limit';
      end if;
    end if;
  end if;

  return new;
end;
$$;

create or replace function private.labz_topics_record_decision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (tg_op = 'INSERT' and new.state <> 'to_study') or
     (tg_op = 'UPDATE' and new.state is distinct from old.state) then
    insert into public.labz_decisions(topic_id, state, rationale, decided_by)
    values(new.id, new.state, new.decision_rationale, auth.uid());
  end if;
  return new;
end;
$$;

revoke all on function private.labz_topics_before_write() from public, anon, authenticated;
revoke all on function private.labz_topics_record_decision() from public, anon, authenticated;

create trigger labz_topics_before_write
before insert or update on public.labz_topics
for each row execute function private.labz_topics_before_write();

create trigger labz_topics_record_decision
after insert or update on public.labz_topics
for each row execute function private.labz_topics_record_decision();

create or replace function public.labz_create_topic(
  p_feedback_id uuid,
  p_project text,
  p_type text,
  p_title text,
  p_synthesis text,
  p_impact text,
  p_effort text
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  topic_id uuid;
  feedback_project text;
begin
  if p_feedback_id is not null then
    select project into feedback_project
    from public.labz_feedback
    where request_id = p_feedback_id;
    if feedback_project is null then
      raise exception using errcode = 'P0001', message = 'feedback_not_found';
    end if;
    if feedback_project <> p_project then
      raise exception using errcode = 'P0001', message = 'feedback_project_mismatch';
    end if;
  end if;

  insert into public.labz_topics(project, type, title, synthesis, impact, effort)
  values(p_project, p_type, btrim(p_title), btrim(p_synthesis), p_impact, p_effort)
  returning id into topic_id;

  if p_feedback_id is not null then
    insert into public.labz_topic_feedback(topic_id, feedback_id)
    values(topic_id, p_feedback_id);
  end if;

  return topic_id;
end;
$$;

revoke all on function public.labz_create_topic(uuid, text, text, text, text, text, text) from public, anon;
grant execute on function public.labz_create_topic(uuid, text, text, text, text, text, text) to authenticated, service_role;
