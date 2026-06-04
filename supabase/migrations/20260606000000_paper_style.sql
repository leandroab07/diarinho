-- Estilo de papel pra cada anotação do diário
alter table public.diary_entries
  add column if not exists paper_style text not null default 'plain';

-- garantir só valores válidos
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'diary_entries_paper_style_check'
  ) then
    alter table public.diary_entries
      add constraint diary_entries_paper_style_check
      check (paper_style in ('plain','lined','grid','dotted','margin','parchment'));
  end if;
end $$;
