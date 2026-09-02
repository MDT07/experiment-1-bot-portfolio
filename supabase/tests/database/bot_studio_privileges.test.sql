begin;

create extension if not exists pgtap with schema extensions;

select plan(20);

select ok(
  not has_table_privilege('anon', 'public.studio_projects', 'SELECT'),
  'anonymous users cannot read Studio projects'
);
select ok(
  has_table_privilege('authenticated', 'public.studio_projects', 'SELECT'),
  'authenticated users can reach owner-scoped project reads'
);
select ok(
  not has_table_privilege('authenticated', 'public.studio_projects', 'INSERT'),
  'authenticated users cannot insert projects directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.studio_messages', 'INSERT'),
  'authenticated users cannot insert messages directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.studio_generation_runs', 'INSERT'),
  'authenticated users cannot forge model runs'
);
select ok(
  not has_table_privilege('authenticated', 'public.studio_generation_runs', 'UPDATE'),
  'authenticated users cannot mutate model runs'
);
select ok(
  has_table_privilege('service_role', 'public.studio_projects', 'INSERT'),
  'server role can persist validated projects'
);
select ok(
  has_table_privilege('service_role', 'public.studio_generation_runs', 'UPDATE'),
  'server role can complete telemetry runs'
);

select ok(
  not has_function_privilege('anon', 'public.reserve_studio_generation()', 'EXECUTE'),
  'anonymous users cannot reserve a build'
);
select ok(
  not has_function_privilege('anon', 'public.complete_studio_generation(uuid,uuid)', 'EXECUTE'),
  'anonymous users cannot complete a reservation'
);
select ok(
  not has_function_privilege('anon', 'public.claim_studio_preview_message(uuid)', 'EXECUTE'),
  'anonymous users cannot claim preview messages'
);
select ok(
  has_function_privilege('authenticated', 'public.reserve_studio_generation()', 'EXECUTE'),
  'authenticated users can atomically reserve their build'
);
select ok(
  has_function_privilege('authenticated', 'public.complete_studio_generation(uuid,uuid)', 'EXECUTE'),
  'authenticated users can complete their own reservation'
);
select ok(
  has_function_privilege('authenticated', 'public.claim_studio_preview_message(uuid)', 'EXECUTE'),
  'authenticated users can atomically claim a preview message'
);
select ok(
  not has_function_privilege('authenticated', 'public.release_studio_generation(uuid,uuid)', 'EXECUTE'),
  'guests cannot release build reservations'
);
select ok(
  not has_function_privilege('authenticated', 'public.release_studio_preview_message(uuid,uuid)', 'EXECUTE'),
  'guests cannot replenish preview messages'
);
select ok(
  has_function_privilege('service_role', 'public.release_studio_generation(uuid,uuid)', 'EXECUTE'),
  'server role can recover a failed build reservation'
);
select ok(
  has_function_privilege('service_role', 'public.release_studio_preview_message(uuid,uuid)', 'EXECUTE'),
  'server role can recover a failed message claim'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.studio_projects'::regclass),
  'RLS is enabled for Studio projects'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.studio_messages'::regclass),
  'RLS is enabled for Studio messages'
);

select * from finish();
rollback;
