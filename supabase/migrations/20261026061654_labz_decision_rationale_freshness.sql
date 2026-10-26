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
    if char_length(new.decision_rationale) < 3 or new.decision_rationale is not distinct from old.decision_rationale then
      raise exception using errcode = 'P0001', message = 'decision_rationale_required';
    end if;
    if new.state = 'in_progress' and old.state is distinct from 'in_progress' then
      perform pg_advisory_xact_lock(20261026, 1812);
      if (select count(*) from public.labz_topics where state = 'in_progress' and id <> new.id) >= 3 then
        raise exception using errcode = 'P0001', message = 'topic_wip_limit';
      end if;
    end if;
  elsif new.decision_rationale is distinct from old.decision_rationale then
    raise exception using errcode = 'P0001', message = 'decision_rationale_state_change_required';
  end if;

  return new;
end;
$$;
