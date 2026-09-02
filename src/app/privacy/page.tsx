import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Bot Studio",
  description: "How Emir Semenov's Bot Studio processes identity, project briefs, generated blueprints, and preview messages.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}><Link href="/">E/S</Link><span>PUBLIC DOCUMENT / NO SIGN-IN REQUIRED</span></header>
      <article className={styles.document}>
        <p className={styles.eyebrow}>BOT STUDIO / DATA PRACTICE</p>
        <h1>Privacy Policy</h1>
        <p className={styles.lead}>This policy describes the data actually used by the Bot Studio inside Emir Semenov&apos;s experimental bot-systems portfolio.</p>
        <time className={styles.updated} dateTime="2026-09-02">Last updated: 2 September 2026</time>

        <section className={styles.section}><h2>What the service is</h2><p>The public Studio lets a visitor describe a bot, receive one generated blueprint, and test a limited preview. It is a portfolio experiment, not a connected Telegram, Instagram, WhatsApp, or production automation service. The separate owner-only OpenClaw environment does not currently receive public visitor projects.</p></section>
        <section className={styles.section}><h2>Identity data</h2><p>To enforce one successful generation per person, the Studio uses Supabase Auth. If you choose GitHub OAuth, GitHub and Supabase may provide an account identifier, email address, and basic OAuth profile data made available by that sign-in flow. If you choose an email magic link, the email address is used to send the link and identify the account. The Studio does not ask you to create a password.</p></section>
        <section className={styles.section}><h2>Studio data</h2><ul><li>Your bot purpose, audience, channel, language, tone, selected capabilities, supplied knowledge, escalation rule, and action boundary.</li><li>The generated BotBlueprint, capability graph, and model/provider metadata.</li><li>Your limited preview messages and the generated replies.</li><li>Generation status, timestamps, duration, error code, and quota counters used for reliability and abuse prevention.</li></ul><p>Do not submit secrets, confidential records, or unnecessary personal data in a brief or chat.</p></section>
        <section className={styles.section}><h2>AI processing</h2><p>The validated brief and preview message are sent server-side to NVIDIA NIM so a selected model can generate the blueprint or response. Provider credentials are never sent to the browser. Prompts explicitly prohibit external actions and unsupported integration claims. Refer to NVIDIA&apos;s own terms and privacy information for its processing practices.</p></section>
        <section className={styles.section}><h2>Storage and separation</h2><p>Supabase stores identity and Studio records. Row Level Security limits signed-in users to their own records; server-only keys perform controlled writes. Vercel hosts the web application and may process standard request metadata such as IP address, user agent, timestamps, and security logs. Data is retained while needed to operate and evaluate the experiment or until a valid deletion request is completed, subject to provider backups and security obligations.</p></section>
        <section className={styles.section}><h2>Cookies and local storage</h2><p>Supabase authentication uses essential session cookies so sign-in persists and server routes can verify the current user. The Studio does not intentionally use advertising cookies, behavioral advertising, or third-party analytics. Browser and infrastructure providers may apply strictly necessary storage or security controls.</p></section>
        <section className={styles.section}><h2>Your choices</h2><p>You may avoid the Studio and view the portfolio without signing in. You may sign out at any time. To request access, correction, or deletion of Studio data associated with your identity, email <a href="mailto:emirsemenov@yahoo.com">emirsemenov@yahoo.com</a>. A request may require identity verification.</p></section>
        <section className={styles.section}><h2>Security and changes</h2><p>Controls include HTTPS, server-only credentials, input validation, same-origin checks, atomic quotas, restricted database permissions, and RLS. No internet service can promise absolute security. This policy may change when the Studio&apos;s providers or behavior change; the date above will be updated and material changes will be reflected on this public page.</p></section>
      </article>
      <footer className={styles.footer}><Link href="/">Portfolio</Link><Link href="/labs">Bot Studio</Link><Link href="/terms">Terms</Link><a href="mailto:emirsemenov@yahoo.com">Contact</a></footer>
    </main>
  );
}
