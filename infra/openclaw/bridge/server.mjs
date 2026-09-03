import { timingSafeEqual } from "node:crypto";
import http from "node:http";

const port = Number(process.env.OPENCLAW_BRIDGE_PORT || 8787);
const bridgeToken = process.env.OPENCLAW_BRIDGE_TOKEN?.trim() || "";
const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN?.trim() || "";
const selectedModel = process.env.OPENCLAW_MODEL?.trim() || "";
const gatewayUrl = new URL(
  "/v1/chat/completions",
  process.env.OPENCLAW_INTERNAL_URL || "http://openclaw-gateway:18789",
);
const maxBodyBytes = 32_768;
const configuredRpm = Number(process.env.OPENCLAW_BRIDGE_RPM || 20);
const maxRequestsPerMinute = Number.isSafeInteger(configuredRpm) && configuredRpm >= 1 && configuredRpm <= 120
  ? configuredRpm
  : 20;
const requestTimes = [];
let activeRequests = 0;

const missing = [
  ["OPENCLAW_BRIDGE_TOKEN", bridgeToken],
  ["OPENCLAW_GATEWAY_TOKEN", gatewayToken],
].filter(([, value]) => value.length < 32).map(([name]) => name);
if (!selectedModel) missing.push("OPENCLAW_MODEL");

if (missing.length) {
  console.error(`[studio-bridge] refusing startup; missing or weak ${missing.join(", ")}`);
  process.exit(78);
}

function send(response, status, body, extraHeaders = {}) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  response.end(payload);
}

function tokenMatches(header) {
  if (!header?.startsWith("Bearer ")) return false;
  const candidate = Buffer.from(header.slice(7), "utf8");
  const expected = Buffer.from(bridgeToken, "utf8");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function takeRateSlot(now = Date.now()) {
  const threshold = now - 60_000;
  while (requestTimes.length && requestTimes[0] < threshold) requestTimes.shift();
  if (requestTimes.length >= maxRequestsPerMinute) return false;
  requestTimes.push(now);
  return true;
}

async function readJson(request) {
  const declared = Number(request.headers["content-length"] || 0);
  if (declared > maxBodyBytes) throw new Error("request_too_large");

  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > maxBodyBytes) throw new Error("request_too_large");
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("invalid_json");
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  if (payload.operation !== "blueprint" && payload.operation !== "chat") return null;
  if (payload.agent !== "openclaw/studio") return null;
  if (typeof payload.system !== "string" || payload.system.length < 20 || payload.system.length > 24_000) return null;
  if (typeof payload.user !== "string" || payload.user.length < 2 || payload.user.length > 8_000) return null;

  const requestedTokens = Number(payload.maxCompletionTokens);
  const tokenCeiling = payload.operation === "blueprint" ? 2_800 : 500;
  if (!Number.isSafeInteger(requestedTokens) || requestedTokens < 1 || requestedTokens > tokenCeiling) return null;

  return {
    operation: payload.operation,
    agent: payload.agent,
    system: payload.system,
    user: payload.user,
    maxCompletionTokens: requestedTokens,
  };
}

function upstreamCode(status) {
  if (status === 400 || status === 413 || status === 422) return "gateway_request_rejected";
  if (status === 401 || status === 403) return "gateway_auth_error";
  if (status === 404) return "gateway_agent_unavailable";
  if (status === 429) return "gateway_rate_limited";
  return "gateway_unavailable";
}

function tokenCount(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : 0;
}

function estimatedCost(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function normalizeUsage(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const details = source.prompt_tokens_details && typeof source.prompt_tokens_details === "object"
    ? source.prompt_tokens_details
    : {};
  const cost = source.cost && typeof source.cost === "object" ? source.cost : {};
  const inputTokens = tokenCount(source.prompt_tokens ?? source.input_tokens);
  const outputTokens = tokenCount(source.completion_tokens ?? source.output_tokens);
  const totalTokens = tokenCount(source.total_tokens) || inputTokens + outputTokens;

  return {
    reported: Object.keys(source).length > 0,
    inputTokens,
    outputTokens,
    totalTokens,
    cachedInputTokens: tokenCount(details.cached_tokens ?? source.cache_read_input_tokens),
    estimatedCostUsd: estimatedCost(cost.total ?? source.estimated_cost_usd ?? source.cost_usd),
    billingMode: "kimi_membership_quota",
  };
}

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/healthz") {
    return send(response, 200, { ok: true });
  }

  if (request.method !== "POST" || request.url !== "/studio/v1/generate") {
    return send(response, 404, { error: { code: "not_found" } });
  }
  if (request.headers["content-type"]?.split(";", 1)[0] !== "application/json") {
    return send(response, 415, { error: { code: "unsupported_media_type" } });
  }
  if (!tokenMatches(request.headers.authorization)) {
    return send(response, 401, { error: { code: "unauthorized" } });
  }
  if (!takeRateSlot()) {
    return send(response, 429, { error: { code: "rate_limited" } }, { "Retry-After": "60" });
  }
  if (activeRequests >= 1) {
    return send(response, 429, { error: { code: "busy" } }, { "Retry-After": "5" });
  }

  activeRequests += 1;
  try {
    const payload = validatePayload(await readJson(request));
    if (!payload) return send(response, 422, { error: { code: "invalid_request" } });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    let upstream;
    try {
      upstream = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${gatewayToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: payload.agent,
          stream: false,
          tool_choice: "none",
          messages: [
            { role: "system", content: payload.system },
            { role: "user", content: payload.user },
          ],
          max_completion_tokens: payload.maxCompletionTokens,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("[studio-bridge] gateway request failed", { status: upstream.status });
      return send(response, upstream.status, { error: { code: upstreamCode(upstream.status) } });
    }

    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) return send(response, 502, { error: { code: "invalid_gateway_response" } });
    return send(response, 200, {
      content,
      agent: payload.agent,
      usage: normalizeUsage(data.usage),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "request_too_large") {
      return send(response, 413, { error: { code: "request_too_large" } });
    }
    if (error instanceof Error && error.message === "invalid_json") {
      return send(response, 400, { error: { code: "invalid_json" } });
    }
    if (error instanceof Error && error.name === "AbortError") {
      return send(response, 504, { error: { code: "gateway_timeout" } });
    }
    console.error("[studio-bridge] request failed", {
      errorName: error instanceof Error ? error.name : "unknown",
    });
    return send(response, 502, { error: { code: "gateway_unavailable" } });
  } finally {
    activeRequests -= 1;
  }
});

server.requestTimeout = 55_000;
server.headersTimeout = 10_000;
server.listen(port, "0.0.0.0", () => {
  console.log(`[studio-bridge] listening on ${port}`);
});
