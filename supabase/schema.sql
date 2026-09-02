-- ============================================================
-- LIFEQUEST — SCHEMA INICIAL (Etapa 2)
-- Cole este arquivo inteiro no SQL Editor do seu projeto Supabase
-- e clique em "Run". Ele cria as tabelas, a segurança (RLS) e
-- o gatilho que calcula XP/nível/moedas automaticamente.
-- ============================================================

-- Extensão usada para gerar IDs únicos
create extension if not exists "uuid-ossp";

-- ---------- PERFIL DO USUÁRIO ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Aventureiro(a)',
  title text not null default 'Iniciante',
  avatar_url text,
  height_cm numeric,
  theme text not null default 'coquette',
  level int not null default 1,
  xp int not null default 0,
  coins int not null default 0,
  streak int not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Usuário vê e edita apenas seu próprio perfil"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Aventureiro(a)'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- TAREFAS CONFIGURÁVEIS ----------
create table if not exists tasks_config (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,        -- ex: 'saude', 'autocuidado', 'conhecimento'
  frequency text not null,       -- 'diaria', 'semanal', 'mensal'
  xp_value int not null default 10,
  coin_value int not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table tasks_config enable row level security;
create policy "Usuário gerencia apenas suas próprias tarefas"
  on tasks_config for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- REGISTRO DE TAREFAS CONCLUÍDAS ----------
create table if not exists task_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references tasks_config(id) on delete cascade,
  completed_at date not null default current_date,
  xp_earned int not null,
  coins_earned int not null,
  created_at timestamptz not null default now(),
  unique (task_id, completed_at)
);

alter table task_logs enable row level security;
create policy "Usuário gerencia apenas seus próprios registros"
  on task_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- PESO ----------
create table if not exists weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_at date not null default current_date,
  weight_kg numeric not null,
  created_at timestamptz not null default now(),
  unique (user_id, logged_at)
);

alter table weight_logs enable row level security;
create policy "Usuário gerencia apenas seu próprio peso"
  on weight_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- METAS ----------
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,            -- 'peso_meta', 'treinos_semana', etc.
  target_value numeric,
  start_value numeric,
  period text,                   -- 'unico', 'semanal', 'mensal'
  created_at timestamptz not null default now()
);

alter table goals enable row level security;
create policy "Usuário gerencia apenas suas próprias metas"
  on goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- GATILHO: sempre que uma tarefa é concluída (task_logs),
-- soma XP/moedas no perfil e recalcula o nível automaticamente.
-- ============================================================

create or replace function public.apply_task_log()
returns trigger as $$
declare
  new_xp int;
  new_level int;
begin
  update profiles
    set xp = xp + new.xp_earned,
        coins = coins + new.coins_earned
    where id = new.user_id
    returning xp into new_xp;

  -- Curva de nível simples: nível = piso(xp / 300) + 1 (ajustável depois)
  new_level := floor(new_xp / 300.0) + 1;

  update profiles set level = new_level where id = new.user_id;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_task_log_insert on task_logs;
create trigger on_task_log_insert
  after insert on task_logs
  for each row execute procedure public.apply_task_log();

-- ============================================================
-- STORAGE: bucket privado para fotos de evolução
-- ============================================================
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "Usuário acessa apenas suas próprias fotos"
  on storage.objects for all
  using (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);
