-- Workspace de projetos por conta (Condutores).
create table if not exists cabos_workspace (
  user_id    text not null primary key,
  current_id text not null,
  projects   jsonb not null,
  updated_at timestamptz not null default now()
);
