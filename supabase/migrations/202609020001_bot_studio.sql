create extension if not exists pgcrypto with schema extensions;

create table if not exists public.studio_projects (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  brief jsonb not null check (jsonb_typeof(brief) = 'object'),
  blueprint jsonb not null check (jsonb_typeof(blueprint) = 'object'),
  provider text not null,
  model text not null,
  status text not null default 'ready' check (status in ('ready', 'archived')),
  preview_messages_used integer not null default 0 check (preview_messages_used >= 0),
  preview_message_limit integer not null default 5 check (preview_message_limit between 1 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_generation_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state text not null default 'available' check (state in ('available', 'reserved', 'used')),
  reservation_id uuid,
  reserved_at timestamptz,
  used_at timestamptz,
  project_id uuid references public.studio_projects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_messages (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.studio_projects(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 5000),
  created_at timestamptz not null default now()
);

create table if not exists public.studio_generation_runs (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.studio_projects(id) on delete set null,
  operation text not null check (operation in ('blueprint', 'chat')),
  provider text not null,
  model text not null,
  status text not null check (status in ('started', 'succeeded', 'failed')),
  error_code text,
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists studio_projects_owner_created_idx
  on public.studio_projects (owner_user_id, created_at desc);
create index if not exists studio_messages_project_created_idx
  on public.studio_messages (project_id, created_at);
create index if not exists studio_generation_runs_owner_created_idx
  on public.studio_generation_runs (owner_user_id, created_at desc);

alter table public.studio_projects enable row level security;
alter table public.studio_generation_entitlements enable row level security;
alter table public.studio_messages enable row level security;
alter table public.studio_generation_runs enable row level security;

revoke all on table public.studio_projects from anon, authenticated;
revoke all on table public.studio_generation_entitlements from anon, authenticated;
revoke all on table public.studio_messages from anon, authenticated;
revoke all on table public.studio_generation_runs from anon, authenticated;

grant select on table public.studio_projects to authenticated;
grant select on table public.studio_generation_entitlements to authenticated;
grant select on table public.studio_messages to authenticated;
grant select on table public.studio_generation_runs to authenticated;
grant all on table public.studio_projects to service_role;
grant all on table public.studio_generation_entitlements to service_role;
grant all on table public.studio_messages to service_role;
grant all on table public.studio_generation_runs to service_role;
grant usage, select on sequence public.studio_messages_id_seq to service_role;

drop policy if exists "studio projects are isolated by owner" on public.studio_projects;
create policy "studio projects are isolated by owner"
  on public.studio_projects for select to authenticated
  using ((select auth.uid()) = owner_user_id);

drop policy if exists "studio entitlements are visible to owner" on public.studio_generation_entitlements;
create policy "studio entitlements are visible to owner"
  on public.studio_generation_entitlements for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "studio messages are isolated by owner" on public.studio_messages;
create policy "studio messages are isolated by owner"
  on public.studio_messages for select to authenticated
  using ((select auth.uid()) = owner_user_id);

drop policy if exists "studio runs are isolated by owner" on public.studio_generation_runs;
create policy "studio runs are isolated by owner"
  on public.studio_generation_runs for select to authenticated
  using ((select auth.uid()) = owner_user_id);

create or replace function public.reserve_studio_generation()
returns table (allowed boolean, reservation_id uuid, reason text, project_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  entitlement public.studio_generation_entitlements%rowtype;
  next_reservation uuid := gen_random_uuid();
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  insert into public.studio_generation_entitlements (
    user_id, state, reservation_id, reserved_at, updated_at
  ) values (
    current_user_id, 'reserved', next_reservation, now(), now()
  ) on conflict (user_id) do nothing;

  select * into entitlement
  from public.studio_generation_entitlements
  where user_id = current_user_id
  for update;

  if entitlement.state = 'used' then
    return query select false, null::uuid, 'already_used'::text, entitlement.project_id;
    return;
  end if;

  if entitlement.state = 'reserved'
    and entitlement.reservation_id <> next_reservation
    and entitlement.reserved_at > now() - interval '3 minutes' then
    return query select false, null::uuid, 'generation_in_progress'::text, entitlement.project_id;
    return;
  end if;

  if entitlement.reservation_id <> next_reservation then
    update public.studio_generation_entitlements
    set state = 'reserved', reservation_id = next_reservation, reserved_at = now(), updated_at = now()
    where user_id = current_user_id;
  end if;

  return query select true, next_reservation, 'reserved'::text, null::uuid;
end;
$$;

create or replace function public.complete_studio_generation(
  target_reservation uuid,
  target_project uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  changed integer;
begin
  update public.studio_generation_entitlements
  set state = 'used', project_id = target_project, used_at = now(), updated_at = now()
  where user_id = auth.uid()
    and state = 'reserved'
    and reservation_id = target_reservation
    and exists (
      select 1 from public.studio_projects project
      where project.id = target_project and project.owner_user_id = auth.uid()
    );
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

drop function if exists public.release_studio_generation(uuid);
create or replace function public.release_studio_generation(
  target_user uuid,
  target_reservation uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  changed integer;
begin
  update public.studio_generation_entitlements
  set state = 'available', reservation_id = null, reserved_at = null, updated_at = now()
  where user_id = target_user
    and state = 'reserved'
    and reservation_id = target_reservation;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

create or replace function public.claim_studio_preview_message(target_project uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  changed integer;
begin
  update public.studio_projects
  set preview_messages_used = preview_messages_used + 1, updated_at = now()
  where id = target_project
    and owner_user_id = auth.uid()
    and preview_messages_used < preview_message_limit;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

drop function if exists public.release_studio_preview_message(uuid);
create or replace function public.release_studio_preview_message(
  target_user uuid,
  target_project uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  changed integer;
begin
  update public.studio_projects
  set preview_messages_used = greatest(0, preview_messages_used - 1), updated_at = now()
  where id = target_project and owner_user_id = target_user;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

-- Supabase grants API roles function execution through default privileges.
-- Reset every callable role explicitly, then grant only the intended surface.
revoke all on function public.reserve_studio_generation() from public, anon, authenticated, service_role;
revoke all on function public.complete_studio_generation(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public.release_studio_generation(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public.claim_studio_preview_message(uuid) from public, anon, authenticated, service_role;
revoke all on function public.release_studio_preview_message(uuid, uuid) from public, anon, authenticated, service_role;

grant execute on function public.reserve_studio_generation() to authenticated;
grant execute on function public.complete_studio_generation(uuid, uuid) to authenticated;
grant execute on function public.claim_studio_preview_message(uuid) to authenticated;
grant execute on function public.release_studio_generation(uuid, uuid) to service_role;
grant execute on function public.release_studio_preview_message(uuid, uuid) to service_role;
