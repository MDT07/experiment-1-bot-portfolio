# Isolated OpenClaw runtime — Experiment 01

This directory is a deployment kit, not a Vercel application. OpenClaw owns
long-lived WebSocket connections, state, sessions, plugin installs, and model
authentication, so it runs on a persistent host. Vercel hosts the public Bot
Studio, its bounded inference API, and the owner-authenticated `/ops` surface.

## Runtime boundary

```text
Public visitor → Vercel Bot Studio → NVIDIA NIM (one build + five messages)

Owner → identity-aware private ingress → OpenClaw Gateway
      → isolated Experiment 01 profile → Kimi Code
```

The public site cannot call OpenClaw. The container publishes the Gateway to
host loopback only. Do not change the Compose mapping to `0.0.0.0`; remote
access belongs to Tailscale Serve or Cloudflare Tunnel + Access.

## Why `kimi/kimi-for-coding`

The Gateway uses Kimi Coding, not the Moonshot pay-as-you-go provider. They use
different keys, endpoints, plugins, and model prefixes. `kimi/kimi-for-coding`
is the conservative membership model available across Kimi Code plans. K3 is
not selected automatically: `kimi/k3` is tier-gated and `kimi/k3-256k` consumes
more valuable quota. Upgrade only after a measured evaluation justifies it.

Current source of truth:

- https://docs.openclaw.ai/providers/moonshot
- https://www.kimi.com/code/console

## Bootstrap

1. Provision a persistent Linux host with Docker Compose v2 and at least 2 GB
   RAM. A local Mac is suitable for private testing but must stay online.
2. Copy `.env.example` to `.env` on that host. Set dedicated state directories,
   a generated Gateway token, and the Kimi Code membership key.
3. Copy `openclaw.example.json5` to
   `${OPENCLAW_CONFIG_DIR}/openclaw.json`. Keep its tool denials intact.
4. Install the official external Kimi provider into this isolated state volume:

```bash
docker compose --profile cli run --rm openclaw-cli \
  plugins install @openclaw/kimi-provider
```

5. Validate configuration and model discovery before starting channels:

```bash
docker compose --profile cli run --rm openclaw-cli config validate
docker compose up -d openclaw-gateway
docker compose --profile cli run --rm openclaw-cli models list --provider kimi
docker compose --profile cli run --rm openclaw-cli gateway probe
docker compose --profile cli run --rm openclaw-cli security audit --deep
```

6. Run one owner-only smoke test. The result must identify provider `kimi` and
   model `kimi-for-coding`; do not paste the key into a command argument or log.

The security audit must have zero critical findings. Each warning needs an
explicit accept/reject decision.

## Channels and tools

Telegram stays disabled in the template. Before enabling any channel:

- create a dedicated demo bot/account;
- use pairing plus an explicit owner allowlist;
- reject every unknown DM and group by default;
- keep host exec, filesystem, browser, cron, Gateway mutation, and elevated
  tools denied;
- add one permission at a time only for a demonstrated owner workflow;
- require human approval before any future external write action.

## Vercel `/ops`

`/ops` is protected by Supabase identity and an exact owner-email match. It
shows quotas, model-run telemetry, and readiness configuration. It is not a
reverse proxy and does not make the Gateway public. `OPENCLAW_GATEWAY_TOKEN`
is reserved for a future narrow, read-only RPC integration; it is not sent to
the browser by the current implementation.
