import type { Metadata } from "next";
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
  const value = process.env.OPENCLAW_GATEWAY_URL;
  if (!value) return "Not connected";
  try {
    return new URL(value).host;
  } catch {
    return "Configured target";
  }
}

export default function OwnerOperationsPage() {
  const checks = [
    { label: "NVIDIA server credential", ready: configured("NVIDIA_API_KEY") },
    { label: "Public lab exposure", ready: process.env.AI_DEMO_PUBLIC === "true" },
    { label: "Gateway target", ready: configured("OPENCLAW_GATEWAY_URL") },
    { label: "Gateway service credential", ready: configured("OPENCLAW_GATEWAY_TOKEN") },
    { label: "Owner authentication", ready: configured("ADMIN_USERNAME") && configured("ADMIN_PASSWORD") },
  ];

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div><span>E/S</span><b>OWNER OPERATIONS</b></div>
        <p>PRIVATE CONTROL SURFACE / NOINDEX</p>
      </header>

      <section className={styles.hero}>
        <p>EXPERIMENT 01 / CONTROL PLANE</p>
        <h1>Observe the system. Keep execution somewhere else.</h1>
        <div className={styles.heroMeta}>
          <span>Gateway target</span>
          <b>{gatewayLabel()}</b>
        </div>
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
            <div><dt>Public site</dt><dd>Vercel / stateless UI + bounded API</dd></div>
            <div><dt>Agent runtime</dt><dd>Dedicated OpenClaw profile / persistent host</dd></div>
            <div><dt>Remote access</dt><dd>Tailscale Serve or Cloudflare Access</dd></div>
            <div><dt>Write policy</dt><dd>Disabled until explicit human approval</dd></div>
          </dl>
        </article>

        <article className={styles.runbook}>
          <header><span>03</span><h2>Isolated profile bootstrap</h2></header>
          <pre><code>{`openclaw --profile experiment-1 onboard
openclaw --profile experiment-1 config validate
openclaw --profile experiment-1 security audit --deep
openclaw --profile experiment-1 gateway run --bind loopback --tailscale serve`}</code></pre>
          <p>
            This profile resolves to a separate state/config directory. It must not inherit personal channels,
            sessions, skills, plugins, or host-level execution permissions.
          </p>
        </article>

        <article className={styles.runbook}>
          <header><span>04</span><h2>Release conditions</h2></header>
          <ol>
            <li>Pair only the owner account and a dedicated demo bot.</li>
            <li>Use allowlists; reject unknown direct messages and every group by default.</li>
            <li>Sandbox every agent and deny host exec, filesystem write, browser, cron, and gateway mutation.</li>
            <li>Keep NVIDIA and channel credentials in the runtime secret provider.</li>
            <li>Require a clean deep security audit before enabling the remote endpoint.</li>
          </ol>
        </article>
      </section>
    </main>
  );
}
