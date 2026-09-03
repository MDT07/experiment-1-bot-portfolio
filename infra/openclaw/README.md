# Isolated OpenClaw Studio runtime — Experiment 01

This directory prepares the persistent runtime for Bot Studio. It is not a
Vercel application: OpenClaw owns long-lived state, sessions, plugins, and model
authentication, so it must run on a persistent Linux host or an always-on local
machine.

The exact Kimi Code model and API key are intentionally absent. Do not start a
live inference test until the model decision in
`../../docs/OPENCLAW-MODEL-DECISION.md` is complete.

## Trust boundary

```text
Browser
  → Vercel /api/labs/*
  → HTTPS ingress
  → Studio Bridge :8787 (separate bearer token, strict text schema)
  → OpenClaw Gateway :18789 (private Docker network + host loopback)
  → openclaw/studio agent
  → selected Kimi Code model
```

The raw Gateway HTTP API treats its shared token as operator access. It must not
be exposed to the public internet. Vercel receives only the separate
`OPENCLAW_BRIDGE_TOKEN`; the Bridge holds the Gateway token locally and forwards
only bounded, non-streaming requests with no client tools.

The Bridge permits exactly one path, caps request size/tokens, allows one
in-flight request, and applies a global requests-per-minute ceiling. It does not
enable browser CORS, log prompt content, expose model credentials, or proxy any
Gateway administration/tool route.

## Prepared files

- `docker-compose.yml` — Gateway, setup CLI, operations CLI, and Studio Bridge.
- `openclaw.example.json5` — model-agnostic Studio agent with tools/channels
  denied and 24-hour inactive-session pruning.
- `bridge/server.mjs` — dependency-free narrow relay to OpenClaw Chat
  Completions.
- `.env.example` — names only; no credentials or selected model.

## Bootstrap without inference

1. Provision a persistent Linux host with Docker Compose v2 and at least 2 GB
   RAM. Keep firewall ingress closed while preparing it.
2. Copy `.env.example` to `.env` on that host. Set fully resolved host paths.
3. Generate two different random credentials on the host:
   `OPENCLAW_GATEWAY_TOKEN` and `OPENCLAW_BRIDGE_TOKEN`.
4. Copy `openclaw.example.json5` to
   `${OPENCLAW_CONFIG_DIR}/openclaw.json`.
5. Install the official Kimi provider into the isolated state volume:

```bash
docker compose run --rm openclaw-setup \
  plugins install @openclaw/kimi-provider
```

Stop here until the model decision is approved. Provider installation does not
require a live model call.

## Activation after model selection

1. Put the Kimi Code credential in host `.env` as `KIMI_API_KEY`.
2. Put the chosen exact `provider/model` ref in host `.env` as
   `OPENCLAW_MODEL`.
3. Validate config and start both private services:

```bash
docker compose run --rm openclaw-setup config validate
docker compose up -d --build openclaw-gateway studio-bridge
docker compose --profile cli run --rm openclaw-cli gateway probe
docker compose --profile cli run --rm openclaw-cli security audit --deep
```

The deep audit must have zero critical findings. Review every warning instead
of suppressing it.

4. Publish only host port `8787` through an authenticated HTTPS reverse proxy or
   tunnel. Never publish port `18789`; both Compose mappings remain loopback.
5. Configure Vercel with:

```text
OPENCLAW_BRIDGE_URL=https://your-private-bridge-origin.example
OPENCLAW_BRIDGE_TOKEN=<the bridge token, not the Gateway token>
OPENCLAW_MODEL_LABEL=<the reviewed non-secret model ref>
AI_DEMO_PUBLIC=false
```

6. Run a controlled owner-only end-to-end test, quota/RLS tests, and failure
   recovery tests. Only then set `AI_DEMO_PUBLIC=true` and redeploy.

## Provider boundary

This kit installs `@openclaw/kimi-provider` for the Kimi Coding provider. Kimi
Coding and Moonshot pay-as-you-go use different provider prefixes, endpoints,
and credentials; never assume their keys are interchangeable. The selected
model remains an environment value rather than a Git-tracked default.

Primary documentation:

- https://docs.openclaw.ai/gateway/openai-http-api
- https://docs.openclaw.ai/gateway/security
- https://docs.openclaw.ai/plugins/reference/kimi
- https://docs.openclaw.ai/providers/moonshot

## Tools, channels, and retention

- The Studio agent has no filesystem, shell, browser, cron, node, channel, or
  Gateway-management tool.
- Telegram and every other external channel remain disabled.
- External write actions are not implemented by this environment.
- Requests are stateless at the Bridge boundary. OpenClaw session maintenance
  prunes inactive records after 24 hours and caps session storage.
- Supabase remains the source of truth for identity, one-shot entitlements,
  projects, preview messages, and application telemetry.
