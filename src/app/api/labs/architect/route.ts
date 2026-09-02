import { NextRequest, NextResponse } from "next/server";
import { isLabRequest, type LabResponse } from "@/lib/ai-lab";
import { createLabArchitecture, getNvidiaModel, NvidiaLabError } from "@/lib/nvidia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxRequests = 3;
const windowMs = 10 * 60 * 1000;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function json(body: unknown, status = 200, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const requestOrigin = new URL(request.url).origin;
  const productionOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return origin === requestOrigin || origin === productionOrigin || /^http:\/\/localhost:\d+$/.test(origin);
}

function clientAddress(request: NextRequest): string {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous"
  );
}

function consumeRequest(address: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const current = requestBuckets.get(address);

  if (!current || current.resetAt <= now) {
    requestBuckets.set(address, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: Math.ceil(windowMs / 1000) };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

export async function GET() {
  return json({
    configured: Boolean(process.env.NVIDIA_API_KEY),
    public: process.env.AI_DEMO_PUBLIC === "true",
    provider: "NVIDIA NIM",
    model: getNvidiaModel(),
    limits: { requests: maxRequests, windowMinutes: windowMs / 60_000 },
  });
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return json({ error: "origin_not_allowed" }, 403);
  if (process.env.AI_DEMO_PUBLIC !== "true") return json({ error: "demo_not_open" }, 503);
  if (!process.env.NVIDIA_API_KEY) return json({ error: "provider_not_configured" }, 503);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 12_000) return json({ error: "request_too_large" }, 413);

  const rate = consumeRequest(clientAddress(request));
  if (!rate.allowed) {
    return json({ error: "rate_limited", retryAfter: rate.retryAfter }, 429, {
      "Retry-After": String(rate.retryAfter),
    });
  }

  const body = await request.json().catch(() => null);
  if (!isLabRequest(body)) return json({ error: "invalid_request" }, 400);

  try {
    const architecture = await createLabArchitecture(body);
    const response: LabResponse = {
      architecture,
      meta: {
        provider: "NVIDIA NIM",
        model: getNvidiaModel(),
        generatedAt: new Date().toISOString(),
        actionsExecuted: false,
      },
    };

    return json(response);
  } catch (error) {
    if (error instanceof NvidiaLabError) return json({ error: error.code }, error.status);
    return json({ error: "provider_error" }, 502);
  }
}
