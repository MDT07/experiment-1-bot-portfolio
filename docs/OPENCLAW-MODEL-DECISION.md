# OpenClaw / Kimi Code model decision gate

Status: **not selected**. Updated 2026-09-03.

The Studio must remain closed (`AI_DEMO_PUBLIC=false`) until this decision is
completed. A key format does not prove that every model is available on the
account, and no live inference test belongs in repository setup.

## Candidate references

Confirm the current Kimi Code plan and the account-visible catalog before using
one of these OpenClaw model references:

| Candidate | Intended comparison | Do not assume |
| --- | --- | --- |
| `kimi/kimi-for-coding` | baseline quality, latency, and membership usage | that it is cheapest for this account |
| `kimi/kimi-for-coding-highspeed` | latency-sensitive preview | that higher speed justifies quota use |
| `kimi/k3` | complex blueprint quality | that the current membership tier includes it |
| `kimi/k3-256k` | bounded-context K3 evaluation | that its output cost/quality is better for short previews |

Provider keys, endpoints, and model prefixes for Kimi Coding are distinct from
Moonshot pay-as-you-go API credentials. This project targets the Kimi Coding
provider and installs `@openclaw/kimi-provider`.

Primary references:

- https://docs.openclaw.ai/providers/moonshot
- https://docs.openclaw.ai/plugins/reference/kimi
- https://docs.openclaw.ai/gateway/openai-http-api

## Evaluation before selection

Use the same private test set for every account-visible candidate:

1. Ten bilingual bot briefs: support, lead qualification, internal knowledge,
   booking, moderation, and human handoff.
2. Valid JSON rate against `BotBlueprint` without repair.
3. Capability-graph validity and absence of invented live integrations.
4. Russian and English instruction adherence.
5. Median and p95 latency for blueprint and preview-chat operations.
6. Account quota consumed per successful run.
7. Prompt-injection resistance with tools disabled.

Record results without storing API keys, private prompts, hidden reasoning, or
personal data. Pick the lowest-cost account-visible candidate that clears the
quality threshold; do not choose from marketing names alone.

## Activation checklist

- [ ] Set `OPENCLAW_MODEL` only on the persistent OpenClaw host.
- [ ] Set the matching non-secret `OPENCLAW_MODEL_LABEL` in Vercel.
- [ ] Store `KIMI_API_KEY` only on the persistent host.
- [ ] Generate distinct Gateway and Bridge tokens.
- [ ] Install and verify `@openclaw/kimi-provider` in the isolated state volume.
- [ ] Validate OpenClaw config and run a deep security audit.
- [ ] Confirm the raw Gateway is not reachable from the public internet.
- [ ] Confirm only `/studio/v1/generate` is exposed through the HTTPS Bridge.
- [ ] Run quota, RLS, failure-release, and owner-bypass tests.
- [ ] Enable `AI_DEMO_PUBLIC` only after every item above passes.
