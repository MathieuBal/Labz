alter table public.labz_feedback
  drop constraint if exists labz_feedback_project_check;

alter table public.labz_feedback
  add constraint labz_feedback_project_check
  check (
    char_length(project) <= 64
    and project ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  );
