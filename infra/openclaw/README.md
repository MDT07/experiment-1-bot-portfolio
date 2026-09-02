# Isolated OpenClaw runtime — Experiment 01

This directory is a deployment kit, not a Vercel application. OpenClaw Gateway
owns long-lived WebSocket connections, SQLite state, channel sessions, agent
workspaces, and encrypted authentication profiles. It therefore runs on a
persistent host. Vercel hosts only the public portfolio, bounded inference API,
and authenticated `/ops` presentation layer.

## Boundary

```text
Public visitor → Vercel /labs → NVIDIA NIM

Owner → Tailscale Serve or Cloudflare Access
      → 127.0.0.1:18789 on the gateway host
      → isolated OpenClaw state and auth-secret volumes
```

The container publishes the gateway to host loopback only. Do not change the
Compose port mapping to `0.0.0.0`. Remote access belongs to an identity-aware
proxy or tailnet.

## Bootstrap

1. Provision a persistent Linux host with Docker Compose v2 and at least 2 GB
   RAM. A local Mac is acceptable for recorded demos, but it must remain online.
2. Copy `.env.example` to `.env` on that host and set dedicated directories.
3. Generate `OPENCLAW_GATEWAY_TOKEN` on the host. Add `NVIDIA_API_KEY` through
   the host secret mechanism; never pass either secret as a CLI argument.
4. Copy `openclaw.example.json5` to
   `${OPENCLAW_CONFIG_DIR}/openclaw.json` and replace the exact allowed origin
   only after the remote-access layer exists.
5. Validate before start:

```bash
docker compose --profile cli run --rm openclaw-cli config validate
docker compose up -d openclaw-gateway
docker compose --profile cli run --rm openclaw-cli gateway probe
docker compose --profile cli run --rm openclaw-cli security audit --deep
```

The deep audit must have zero critical findings. Warnings need a written
accept/reject decision; they are not silently waived.

## Telegram release gate

Telegram stays disabled in the template. Before enabling it:

- use a new bot token dedicated to Experiment 01;
- set `dmPolicy: "pairing"` and explicitly list only the owner numeric user ID;
- keep `groupPolicy: "disabled"` unless one exact demo group is needed;
- if a group is needed, add its negative chat ID under `groups`, keep
  `requireMention: true`, and restrict senders to the owner;
- retain the minimal tool profile for the first demo;
- record an owner approval step before any future write integration.

## Remote access choices

- **Tailscale Serve:** preferred for a truly private owner console. No public
  login surface; the gateway stays on loopback and Tailscale supplies identity.
- **Cloudflare Tunnel + Access:** preferred when a stable HTTPS hostname and
  GitHub/email identity policy are required. Keep gateway ingress inaccessible
  except through the local tunnel.
- **Public hostname with only a shared token:** rejected for this project.

The `/ops` page on Vercel is not a security proxy for OpenClaw. Its purpose is
to show readiness, evaluation evidence, and eventually read-only health data.
