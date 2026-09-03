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
        <time className={styles.updated} dateTime="2026-09-03">Last updated: 3 September 2026</time>

        <section className={styles.section}><h2>What the service is</h2><p>The Studio is designed to let a visitor describe a bot, receive one generated blueprint, and test a limited preview. It is currently closed while its model is selected and its runtime is verified. It is a portfolio experiment, not a connected Telegram, Instagram, WhatsApp, or production automation service.</p></section>
        <section className={styles.section}><h2>Identity data</h2><p>To enforce one successful generation per person, the Studio uses Supabase Auth. If you choose GitHub OAuth, GitHub and Supabase may provide an account identifier, email address, and basic OAuth profile data made available by that sign-in flow. If you choose an email magic link, the email address is used to send the link and identify the account. The Studio does not ask you to create a password.</p></section>
        <section className={styles.section}><h2>Studio data</h2><ul><li>Your bot purpose, audience, channel, language, tone, selected capabilities, supplied knowledge, escalation rule, and action boundary.</li><li>The generated BotBlueprint, capability graph, and model/provider metadata.</li><li>Your limited preview messages and the generated replies.</li><li>Generation status, timestamps, duration, error code, token counts, cache usage, any provider-reported cost estimate, and quota counters used for reliability, spend visibility, and abuse prevention.</li></ul><p>Do not submit secrets, confidential records, or unnecessary personal data in a brief or chat.</p></section>
        <section className={styles.section}><h2>AI processing</h2><p>When the Studio is opened, a validated brief or preview message will travel server-side from Vercel through a restricted Studio Bridge to a private OpenClaw Gateway and the selected Kimi Code model. Kimi and OpenClaw credentials will remain on the private runtime host; the browser will receive neither provider credentials nor Gateway credentials. The runtime prompt and tool policy prohibit external actions and unsupported integration claims. The exact model label will be shown in the Studio before public generation is enabled.</p></section>
        <section className={styles.section}><h2>Storage and separation</h2><p>Supabase stores identity and Studio records. Row Level Security limits signed-in users to their own records; server-only keys perform controlled writes. Vercel hosts the web application and may process standard request metadata such as IP address, user agent, timestamps, and security logs. OpenClaw may retain short-lived runtime session records on the private host; the prepared policy prunes inactive Studio sessions after 24 hours. Data is otherwise retained while needed to operate and evaluate the experiment or until a valid deletion request is completed, subject to provider backups and security obligations.</p></section>
        <section className={styles.section}><h2>Cookies and local storage</h2><p>Supabase authentication uses essential session cookies so sign-in persists and server routes can verify the current user. The Studio does not intentionally use advertising cookies, behavioral advertising, or third-party analytics. Browser and infrastructure providers may apply strictly necessary storage or security controls.</p></section>
        <section className={styles.section}><h2>Your choices</h2><p>You may avoid the Studio and view the portfolio without signing in. You may sign out at any time. To request access, correction, or deletion of Studio data associated with your identity, email <a href="mailto:emirsemenov@yahoo.com">emirsemenov@yahoo.com</a>. A request may require identity verification.</p></section>
        <section className={styles.section}><h2>Security and changes</h2><p>Controls include HTTPS, server-only credentials, input validation, same-origin checks, atomic quotas, restricted database permissions, and RLS. No internet service can promise absolute security. This policy may change when the Studio&apos;s providers or behavior change; the date above will be updated and material changes will be reflected on this public page.</p></section>
      </article>
      <footer className={styles.footer}><Link href="/">Portfolio</Link><Link href="/labs">Bot Studio</Link><Link href="/terms">Terms</Link><a href="mailto:emirsemenov@yahoo.com">Contact</a></footer>
    </main>
  );
}
