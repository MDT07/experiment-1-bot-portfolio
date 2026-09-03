import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  createStudioContext,
  isStudioOwner,
  isStudioSupabaseConfigured,
} from "@/lib/supabase/context";
import styles from "./OpsConsole.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner Operations",
  robots: { index: false, follow: false, nocache: true },
};

function configured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function gatewayLabel(): string {
  const value = process.env.OPENCLAW_BRIDGE_URL;
  if (!value) return "Not connected";
  try {
    return new URL(value).host;
  } catch {
    return "Invalid target";
  }
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function OwnerOperationsPage() {
  if (!isStudioSupabaseConfigured()) notFound();

  const { data: context } = await createStudioContext();
  if (!context?.user) redirect("/auth/sign-in?next=/ops");
  if (!isStudioOwner(context.user)) notFound();

  const [projectsResult, usersResult, runsResult, usageRunsResult, recentRunsResult] = await Promise.all([
    context.supabaseAdmin.from("studio_projects").select("id", { count: "exact", head: true }),
    context.supabaseAdmin.from("studio_generation_entitlements").select("user_id", { count: "exact", head: true }),
    context.supabaseAdmin.from("studio_generation_runs").select("id", { count: "exact", head: true }),
    context.supabaseAdmin
      .from("studio_generation_runs")
      .select("total_tokens, estimated_cost_usd")
      .eq("status", "succeeded"),
    context.supabaseAdmin
      .from("studio_generation_runs")
      .select("id, operation, provider, model, status, error_code, duration_ms, total_tokens, estimated_cost_usd, billing_mode, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const checks = [
    { label: "Supabase identity + RLS", ready: isStudioSupabaseConfigured() },
    { label: "OpenClaw Studio Bridge", ready: configured("OPENCLAW_BRIDGE_URL") },
    { label: "Bridge service credential", ready: configured("OPENCLAW_BRIDGE_TOKEN") },
    { label: "Reviewed model selection", ready: configured("OPENCLAW_MODEL_LABEL") },
    { label: "Bot Studio exposure", ready: process.env.AI_DEMO_PUBLIC === "true" },
  ];

  const recentRuns = recentRunsResult.data ?? [];
  const successfulUsageRuns = usageRunsResult.data ?? [];
  const usageTotals = successfulUsageRuns.reduce(
    (total, run) => ({
      tokens: total.tokens + (run.total_tokens ?? 0),
      estimatedCostUsd: total.estimatedCostUsd + Number(run.estimated_cost_usd ?? 0),
      itemizedRuns: total.itemizedRuns + (run.estimated_cost_usd === null ? 0 : 1),
    }),
    { tokens: 0, estimatedCostUsd: 0, itemizedRuns: 0 },
  );
  const queryFailed = [projectsResult, usersResult, runsResult, usageRunsResult, recentRunsResult].some((result) => result.error);

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div><span>E/S</span><b>OWNER OPERATIONS</b></div>
        <div className={styles.headerActions}>
          <p>{context.user.email} / NOINDEX</p>
          <form action="/auth/sign-out" method="post"><button type="submit">Sign out</button></form>
        </div>
      </header>

      <section className={styles.hero}>
        <p>EXPERIMENT 01 / PRIVATE CONTROL PLANE</p>
        <h1>Observe usage. Keep agent execution isolated.</h1>
        <div className={styles.heroMeta}>
          <span>Studio Bridge target</span>
          <b>{gatewayLabel()}</b>
        </div>
      </section>

      <section className={styles.metrics} aria-label="Studio activity">
        <article><span>PROJECTS</span><b>{projectsResult.count ?? "—"}</b></article>
        <article><span>GUEST IDENTITIES</span><b>{usersResult.count ?? "—"}</b></article>
        <article><span>MODEL RUNS</span><b>{runsResult.count ?? "—"}</b></article>
        <article><span>TOTAL TOKENS</span><b>{successfulUsageRuns.length ? usageTotals.tokens.toLocaleString("en-US") : "—"}</b><small>{successfulUsageRuns.length ? "provider-reported" : "usage not returned"}</small></article>
        <article><span>ITEMIZED COST</span><b>{usageTotals.itemizedRuns ? `$${usageTotals.estimatedCostUsd.toFixed(4)}` : successfulUsageRuns.length ? "INCLUDED" : "UNREPORTED"}</b><small>{successfulUsageRuns.length ? "Kimi membership quota" : "no successful usage payload"}</small></article>
        <article><span>TEST BUDGET</span><b>1</b><small>owner blueprint request</small></article>
      </section>

      <section className={styles.grid}>
        <article className={styles.statusPanel}>
          <header><span>01</span><h2>Readiness gate</h2></header>
          <ul>
            {checks.map((check) => (
              <li key={check.label}>
                <i className={check.ready ? styles.ready : styles.missing} />
                <span>{check.label}</span>
                <b>{check.ready ? "READY" : "PENDING"}</b>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.statusPanel}>
          <header><span>02</span><h2>Runtime boundary</h2></header>
          <dl>
            <div><dt>Public site</dt><dd>Vercel / bounded UI and API only</dd></div>
            <div><dt>Guest identity</dt><dd>Supabase Auth / isolated by RLS</dd></div>
            <div><dt>Ingress</dt><dd>Narrow Studio Bridge / no browser access</dd></div>
            <div><dt>Agent runtime</dt><dd>Dedicated OpenClaw profile / persistent host</dd></div>
            <div><dt>Selected model</dt><dd>{process.env.OPENCLAW_MODEL_LABEL || "Pending evaluation"}</dd></div>
            <div><dt>Write policy</dt><dd>Disabled until explicit human approval</dd></div>
          </dl>
        </article>

        <article className={`${styles.statusPanel} ${styles.activity}`}>
          <header><span>03</span><h2>Recent model activity</h2></header>
          {queryFailed ? (
            <p className={styles.notice}>One or more telemetry queries failed. No permissions were widened.</p>
          ) : recentRuns.length ? (
            <div className={styles.runTable} role="table" aria-label="Recent model activity">
              {recentRuns.map((run) => (
                <div role="row" key={run.id}>
                  <span role="cell" data-status={run.status}>{run.status}</span>
                  <b role="cell">{run.operation}</b>
                  <p role="cell">{run.model}</p>
                  <time role="cell" dateTime={run.created_at}>{formatTimestamp(run.created_at)} UTC</time>
                  <small role="cell">{run.error_code || (run.duration_ms === null ? "pending" : `${run.duration_ms} ms · ${run.total_tokens ?? 0} tok`)}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.notice}>No model runs have been recorded yet.</p>
          )}
        </article>

        <article className={styles.runbook}>
          <header><span>04</span><h2>Isolated gateway bootstrap</h2></header>
          <pre><code>{`docker compose run --rm openclaw-setup plugins install @openclaw/kimi-provider
docker compose run --rm openclaw-setup config validate
docker compose up -d --build openclaw-gateway studio-bridge
docker compose --profile cli run --rm openclaw-cli security audit --deep`}</code></pre>
          <p>
            Kimi credentials and the operator-level Gateway token stay on the persistent host. Vercel receives only
            the separately scoped Bridge token and never exposes it to the browser.
          </p>
        </article>

        <article className={styles.runbook}>
          <header><span>05</span><h2>Release conditions</h2></header>
          <ol>
            <li>Kimi K2.7 Code is selected for the single measured baseline run.</li>
            <li>Keep the raw Gateway on loopback/private Docker networking.</li>
            <li>Expose only the Bridge path through authenticated HTTPS ingress.</li>
            <li>Deny host execution, filesystem, browser, cron, channels, and Gateway mutation.</li>
            <li>Require a clean deep security audit before AI_DEMO_PUBLIC is enabled.</li>
          </ol>
        </article>
      </section>
    </main>
  );
}
