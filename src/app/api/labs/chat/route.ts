import { NextRequest, NextResponse } from "next/server";
import {
  botBlueprintSchema,
  runRulesPreview,
  studioChatRequestSchema,
  type StudioBrief,
} from "@/lib/bot-studio";
import { chatWithBot, getNvidiaModel, NvidiaLabError } from "@/lib/nvidia";
import {
  createStudioContext,
  isStudioOwner,
  isStudioSupabaseConfigured,
} from "@/lib/supabase/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
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

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return json({ error: "origin_not_allowed" }, 403);
  if (process.env.AI_DEMO_PUBLIC !== "true") return json({ error: "demo_not_open" }, 503);
  if (!isStudioSupabaseConfigured()) return json({ error: "studio_storage_not_configured" }, 503);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4_000) return json({ error: "request_too_large" }, 413);

  const parsed = studioChatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  const { data: context } = await createStudioContext();
  if (!context?.user) return json({ error: "authentication_required" }, 401);

  const { data: row } = await context.supabase
    .from("studio_projects")
    .select("id, blueprint, brief, preview_messages_used, preview_message_limit")
    .eq("id", parsed.data.projectId)
    .maybeSingle();
  if (!row) return json({ error: "project_not_found" }, 404);

  const blueprintResult = botBlueprintSchema.safeParse(row.blueprint);
  if (!blueprintResult.success) return json({ error: "project_invalid" }, 500);
  const blueprint = blueprintResult.data;
  const brief = row.brief as Pick<StudioBrief, "locale">;
  const owner = isStudioOwner(context.user);
  let claimed = owner;

  if (!owner) {
    const { data: allowed, error } = await context.supabase.rpc("claim_studio_preview_message", {
      target_project: parsed.data.projectId,
    });
    if (error) return json({ error: "studio_storage_error" }, 503);
    claimed = Boolean(allowed);
    if (!claimed) return json({ error: "preview_limit_reached" }, 429);
  }

  const provider = blueprint.mode === "rules" ? "Rules preview" : "NVIDIA NIM";
  const model = blueprint.mode === "rules" ? "deterministic-v1" : getNvidiaModel();
  const startedAt = Date.now();
  const { data: run } = await context.supabaseAdmin
    .from("studio_generation_runs")
    .insert({
      owner_user_id: context.user.id,
      project_id: parsed.data.projectId,
      operation: "chat",
      provider,
      model,
      status: "started",
    })
    .select("id")
    .single();

  try {
    const answer = blueprint.mode === "rules"
      ? runRulesPreview(blueprint, parsed.data.message)
      : await chatWithBot(blueprint, parsed.data.message, brief.locale === "ru" ? "ru" : "en");

    const { error: messageError } = await context.supabaseAdmin.from("studio_messages").insert([
      {
        project_id: parsed.data.projectId,
        owner_user_id: context.user.id,
        role: "user",
        content: parsed.data.message,
      },
      {
        project_id: parsed.data.projectId,
        owner_user_id: context.user.id,
        role: "assistant",
        content: answer,
      },
    ]);
    if (messageError) throw new Error("studio_storage_error");

    if (run?.id) {
      await context.supabaseAdmin
        .from("studio_generation_runs")
        .update({
          status: "succeeded",
          duration_ms: Date.now() - startedAt,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id);
    }

    const used = owner ? row.preview_messages_used : row.preview_messages_used + 1;
    return json({
      answer,
      remaining: owner ? null : Math.max(0, row.preview_message_limit - used),
      meta: { provider, model, actionsExecuted: false },
    });
  } catch (error) {
    if (!owner && claimed) {
      await context.supabaseAdmin.rpc("release_studio_preview_message", {
        target_user: context.user.id,
        target_project: parsed.data.projectId,
      });
    }
    if (run?.id) {
      await context.supabaseAdmin
        .from("studio_generation_runs")
        .update({
          status: "failed",
          error_code: error instanceof NvidiaLabError ? error.code : "studio_chat_error",
          duration_ms: Date.now() - startedAt,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id);
    }
    if (error instanceof NvidiaLabError) return json({ error: error.code }, error.status);
    if (error instanceof Error && error.message.startsWith("studio_")) {
      return json({ error: error.message }, 503);
    }
    return json({ error: "provider_error" }, 502);
  }
}
