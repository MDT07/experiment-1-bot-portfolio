# Free-tier AI demo matrix

Last verified: 2026-09-02. Free catalogs and quotas change; check the linked
provider page before recording or publishing a claim.

## Recommended routing

| Role | Provider | Current free boundary | Portfolio use |
| --- | --- | --- | --- |
| Primary agent core | NVIDIA hosted NIM | Catalog marks selected endpoints as free; account-visible rate limits apply | Bot/agent architecture, tool planning, visual-reference reasoning |
| Fast text fallback | Cerebras Inference | Free model quotas are model-specific; several text models list up to 30 RPM and 14.4K RPD | Low-latency intent, classification, response drafting |
| Fast text/audio fallback | Groq | Free limits vary; selected text models list 30 RPM/1K RPD and Whisper lists 20 RPM/2K RPD | Streaming chat and speech-to-text demonstrations |
| Unstable catalog fallback | OpenRouter free router | 50 total free requests/day without purchased credits | Manual showcase fallback, never the default live route |
| Edge model experiment | Cloudflare Workers AI | 10,000 free neurons/day | Small classification, safety, or edge inference demos |
| Optional multimodal fallback | Gemini Developer API | Selected models have free input/output with account/model quotas | Image/video reasoning where the free data policy is acceptable |
| Persistent rate state | Upstash Redis | 500K free commands/month, 256 MB | Per-IP/session limits and daily demo budgets |
| Edge request shield | Vercel WAF | One Hobby rate-limit rule, fixed windows, 1M included allowed requests | Block obvious API abuse before invoking a model |

Primary sources:

- NVIDIA model catalog: https://build.nvidia.com/models
- NVIDIA OpenClaw provider: https://docs.openclaw.ai/providers/nvidia
- Cerebras limits: https://inference-docs.cerebras.ai/support/rate-limits
- Groq limits: https://console.groq.com/docs/rate-limits
- OpenRouter FAQ: https://openrouter.ai/docs/faq
- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Upstash Redis pricing: https://upstash.com/pricing/redis
- Vercel WAF rate limiting: https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting

## What the portfolio can demonstrate

### Public and inexpensive

1. **AI Systems Architect** — implemented first. Produces a bounded design,
   permissions, guardrails, demo script, and evaluation contract.
2. **Visual Reference Analyst** — upload one reference image or short clip to a
   NVIDIA multimodal endpoint; return composition, hierarchy, motion, color,
   accessibility risks, and implementation guidance. Do not claim ownership of
   the reference.
3. **Support Agent Simulator** — replay a fixed synthetic customer scenario and
   expose intent, retrieval evidence, escalation, and approval decisions.
4. **Agent Trace Player** — show model choice, input/output token estimates,
   tool proposals, denials, retry/fallback events, and final response without
   exposing hidden chain-of-thought.
5. **RAG Knowledge Assistant** — answer only from a small, public, versioned
   dataset and display exact citations plus an abstention path.

### Owner-only or recorded

1. **Telegram operator** — dedicated bot, owner pairing, no groups, minimal
   tools, and visible approval before any external write.
2. **Multichannel handoff** — a synthetic conversation moves from web preview
   to Telegram while preserving a bounded case state, not private user history.
3. **Voice intake** — speech-to-text plus grounded answer drafting; recordings
   are synthetic and removed after the run.
4. **OpenClaw operations** — demonstrate a clean audit, isolated profile,
   sandbox/tool policy, pairing, model route, and read-only health dashboard.

## Failure and fallback policy

Fallback is capability-aware, not a random model swap:

1. Retry the same provider only for a short transient error and respect
   `Retry-After` on 429 responses.
2. Use Cerebras or Groq only for text tasks that do not require NVIDIA-specific
   multimodal/tool behavior.
3. Use OpenRouter free only as an operator-triggered fallback because its free
   capacity and selected model can change.
4. Never silently downgrade a vision, citation, or tool-call task to a text-only
   model. Return a clear unavailable state instead.
5. Store provider keys server-side, enforce a global budget, and expose provider
   status without exposing credentials.
