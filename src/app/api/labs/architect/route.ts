import { NextRequest, NextResponse } from "next/server";
import {
  modelUsageSchema,
  studioBriefSchema,
  type BotBlueprint,
  type StudioProject,
  type StudioStatus,
} from "@/lib/bot-studio";
import {
  createBotBlueprint,
  getOpenClawModelLabel,
  isOpenClawStudioConfigured,
  OpenClawLabError,
} from "@/lib/openclaw";
import {
  createStudioContext,
  isStudioOwner,
  isStudioSupabaseConfigured,
} from "@/lib/supabase/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const previewMessageLimit = 5;

function modelRunLimit(): number {
  const configured = Number(process.env.AI_DEMO_RUN_LIMIT || 1);
  return Number.isSafeInteger(configured) && configured >= 1 && configured <= 100 ? configured : 1;
}

function modelRunWindowStart(): string | null {
  const configured = process.env.AI_DEMO_RUNS_SINCE?.trim();
  if (!configured) return null;
  const parsed = new Date(configured);
  return Number.isNaN(parsed.valueOf()) ? null : parsed.toISOString();
}

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
  const localDevelopment = process.env.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(origin);
  return origin === requestOrigin || origin === productionOrigin || localDevelopment;
}

function providerError(error: unknown) {
  if (error instanceof OpenClawLabError) return json({ error: error.code }, error.status);
  return json({ error: "provider_error" }, 502);
}

type ProjectRow = {
  id: string;
  blueprint: BotBlueprint;
  created_at: string;
  preview_messages_used: number;
  generation_usage: unknown;
};

function asProject(row: ProjectRow | null): StudioProject | null {
  if (!row) return null;
  const usage = modelUsageSchema.safeParse(row.generation_usage);
  return {
    id: row.id,
    blueprint: row.blueprint,
    createdAt: row.created_at,
    previewMessagesUsed: row.preview_messages_used,
    generationUsage: usage.success ? usage.data : null,
  };
}

export async function GET() {
  const base = {
    configured: isOpenClawStudioConfigured() && isStudioSupabaseConfigured(),
    public: process.env.AI_DEMO_PUBLIC === "true",
    signedIn: false,
    owner: false,
    generationAvailable: false,
    chatAvailable: process.env.AI_DEMO_CHAT_ENABLED === "true",
    previewMessageLimit,
    provider: "OpenClaw Studio Bridge",
    model: getOpenClawModelLabel(),
    project: null,
  } satisfies StudioStatus;

  if (!isStudioSupabaseConfigured()) return json(base);
  const { data: context } = await createStudioContext();
  if (!context?.user) return json(base);

  const owner = isStudioOwner(context.user);
  let projectRow: ProjectRow | null = null;
  let generationAvailable = owner;

  if (owner) {
    const { data } = await context.supabase
      .from("studio_projects")
      .select("id, blueprint, created_at, preview_messages_used, generation_usage")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    projectRow = data as ProjectRow | null;

    let ownerRunQuery = context.supabaseAdmin
      .from("studio_generation_runs")
      .select("id", { count: "exact", head: true })
      .eq("operation", "blueprint");
    const runWindowStart = modelRunWindowStart();
    if (runWindowStart) ownerRunQuery = ownerRunQuery.gte("created_at", runWindowStart);
    const { count, error } = await ownerRunQuery;
    generationAvailable = !error && (count ?? 0) < modelRunLimit();
  } else {
    const { data: entitlement } = await context.supabase
      .from("studio_generation_entitlements")
      .select("state, project_id")
      .maybeSingle();
    generationAvailable = process.env.AI_DEMO_OWNER_ONLY !== "true"
      && (!entitlement || entitlement.state === "available");
    if (entitlement?.project_id) {
      const { data } = await context.supabase
        .from("studio_projects")
        .select("id, blueprint, created_at, preview_messages_used, generation_usage")
        .eq("id", entitlement.project_id)
        .maybeSingle();
      projectRow = data as ProjectRow | null;
    }
  }

  return json({
    ...base,
    signedIn: true,
    owner,
    generationAvailable,
    project: asProject(projectRow),
  } satisfies StudioStatus);
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return json({ error: "origin_not_allowed" }, 403);
  if (process.env.AI_DEMO_PUBLIC !== "true") return json({ error: "demo_not_open" }, 503);
  if (!isOpenClawStudioConfigured()) return json({ error: "provider_not_configured" }, 503);
  if (!isStudioSupabaseConfigured()) return json({ error: "studio_storage_not_configured" }, 503);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_000) return json({ error: "request_too_large" }, 413);

  const parsed = studioBriefSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  const { data: context } = await createStudioContext();
  if (!context?.user) return json({ error: "authentication_required" }, 401);

  const owner = isStudioOwner(context.user);
  if (process.env.AI_DEMO_OWNER_ONLY === "true" && !owner) {
    return json({ error: "owner_test_only" }, 403);
  }

  let modelRunQuery = context.supabaseAdmin
    .from("studio_generation_runs")
    .select("id", { count: "exact", head: true })
    .eq("operation", "blueprint");
  const runWindowStart = modelRunWindowStart();
  if (runWindowStart) modelRunQuery = modelRunQuery.gte("created_at", runWindowStart);
  const { count: modelRuns, error: modelRunError } = await modelRunQuery;
  if (modelRunError) return json({ error: "studio_storage_error" }, 503);
  if ((modelRuns ?? 0) >= modelRunLimit()) return json({ error: "test_budget_exhausted" }, 429);

  let reservationId: string | null = null;
  let runId: string | null = null;
  let createdProjectId: string | null = null;
  const startedAt = Date.now();

  if (!owner) {
    const { data, error } = await context.supabase.rpc("reserve_studio_generation");
    if (error) return json({ error: "studio_storage_error" }, 503);
    const reservation = (Array.isArray(data) ? data[0] : data) as
      | { allowed: boolean; reservation_id: string | null; reason: string; project_id: string | null }
      | null;
    if (!reservation?.allowed) {
      return json(
        { error: reservation?.reason || "generation_unavailable", projectId: reservation?.project_id || null },
        reservation?.reason === "already_used" ? 409 : 429,
      );
    }
    reservationId = reservation.reservation_id;
  }

  const { data: run } = await context.supabaseAdmin
    .from("studio_generation_runs")
    .insert({
      owner_user_id: context.user.id,
      operation: "blueprint",
      provider: "OpenClaw Studio Bridge",
      model: getOpenClawModelLabel(),
      status: "started",
    })
    .select("id")
    .single();
  runId = run?.id || null;

  try {
    const { blueprint, usage } = await createBotBlueprint(parsed.data);
    const { data: project, error: projectError } = await context.supabaseAdmin
      .from("studio_projects")
      .insert({
        owner_user_id: context.user.id,
        brief: parsed.data,
        blueprint,
        provider: "OpenClaw Studio Bridge",
        model: getOpenClawModelLabel(),
        preview_message_limit: previewMessageLimit,
        generation_usage: usage,
      })
      .select("id, blueprint, created_at, preview_messages_used, generation_usage")
      .single();

    if (projectError || !project) throw new Error("studio_storage_error");
    createdProjectId = project.id;

    if (reservationId) {
      const { data: completed } = await context.supabase.rpc("complete_studio_generation", {
        target_reservation: reservationId,
        target_project: project.id,
      });
      if (!completed) throw new Error("studio_entitlement_error");
    }

    if (runId) {
      await context.supabaseAdmin
        .from("studio_generation_runs")
        .update({
          project_id: project.id,
          status: "succeeded",
          duration_ms: Date.now() - startedAt,
          input_tokens: usage.inputTokens,
          output_tokens: usage.outputTokens,
          total_tokens: usage.totalTokens,
          cached_input_tokens: usage.cachedInputTokens,
          estimated_cost_usd: usage.estimatedCostUsd,
          billing_mode: usage.billingMode,
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);
    }

    return json({
      project: asProject(project as ProjectRow),
      meta: {
        provider: "OpenClaw Studio Bridge",
        model: getOpenClawModelLabel(),
        generatedAt: new Date().toISOString(),
        actionsExecuted: false,
        usage,
      },
    });
  } catch (error) {
    if (reservationId && createdProjectId) {
      await context.supabaseAdmin.from("studio_projects").delete().eq("id", createdProjectId);
    }
    if (reservationId) {
      await context.supabaseAdmin.rpc("release_studio_generation", {
        target_user: context.user.id,
        target_reservation: reservationId,
      });
    }
    if (runId) {
      await context.supabaseAdmin
        .from("studio_generation_runs")
        .update({
          status: "failed",
          error_code: error instanceof OpenClawLabError ? error.code : "studio_generation_error",
          duration_ms: Date.now() - startedAt,
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);
    }
    if (error instanceof Error && error.message.startsWith("studio_")) {
      return json({ error: error.message }, 503);
    }
    return providerError(error);
  }
}
