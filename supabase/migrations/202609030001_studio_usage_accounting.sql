alter table public.studio_projects
  add column if not exists generation_usage jsonb
    check (generation_usage is null or jsonb_typeof(generation_usage) = 'object');

alter table public.studio_generation_runs
  add column if not exists input_tokens integer
    check (input_tokens is null or input_tokens >= 0),
  add column if not exists output_tokens integer
    check (output_tokens is null or output_tokens >= 0),
  add column if not exists total_tokens integer
    check (total_tokens is null or total_tokens >= 0),
  add column if not exists cached_input_tokens integer
    check (cached_input_tokens is null or cached_input_tokens >= 0),
  add column if not exists estimated_cost_usd numeric(14, 8)
    check (estimated_cost_usd is null or estimated_cost_usd >= 0),
  add column if not exists billing_mode text
    check (billing_mode is null or billing_mode in ('kimi_membership_quota'));

create index if not exists studio_generation_runs_status_created_idx
  on public.studio_generation_runs (status, created_at desc);
