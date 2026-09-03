# Kimi live Studio test — 2026-09-03

> Archived engineering record. The current public portfolio is a static systems
> catalog and contains no Kimi, OpenClaw, Supabase, authentication, or model-call
> integration.

## Result

- Production surface: `https://experiment-1-bot-portfolio.vercel.app/ru/labs`
- Logical Studio blueprint runs authorized: **1**
- Model ref: `kimi/kimi-for-coding`
- Provider protocol: Anthropic Messages through the official OpenClaw Kimi provider
- Provider endpoint reached: `https://api.kimi.com/coding/v1/messages`
- Outcome: **failed — provider HTTP 500 / `server_error`**
- OpenClaw provider attempts: **4** (initial request plus three transient retries)
- Blueprint projects created: **0**
- Input/output/total/cached tokens reported by Kimi: **0 / 0 / 0 / 0**
- Provider-reported itemized USD charge: **not returned**
- External actions, tools, channels, browser control, and writes: **none**
- Second logical Studio run: **blocked by the production test budget**

The same Kimi credential and endpoint also returned HTTP 500 for a non-inference
catalog request. This supports classifying the event as a provider-side service
failure rather than a prompt-validation failure. It does not prove that Kimi
consumed zero membership quota: no usage payload was returned, so only the
reported token count and itemized cash charge can be recorded as zero/unavailable.

## Before a second live run

1. Confirm the Kimi Code membership and API-key status in the Kimi Code Console.
2. Wait for the Kimi Code service to recover or contact Kimi support if HTTP 500 persists.
3. Decide whether to upgrade the pinned OpenClaw runtime to a version that exposes a configurable provider retry budget.
4. Run config validation and a deep security audit after any runtime upgrade.
5. Set a new `AI_DEMO_RUNS_SINCE` value only when one additional measured run is explicitly authorized.

No credential value, private token, or hidden prompt is stored in this report.
