import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Systems Catalog",
  description: "How Emir Semenov's public bot and agent systems portfolio handles data.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}><Link href="/">E/S</Link><span>PUBLIC DOCUMENT / NO SIGN-IN REQUIRED</span></header>
      <article className={styles.document}>
        <p className={styles.eyebrow}>SYSTEMS CATALOG / DATA PRACTICE</p>
        <h1>Privacy Policy</h1>
        <p className={styles.lead}>This policy describes the data practice of Emir Semenov&apos;s public bot and agent systems portfolio and its static implementation catalog.</p>
        <time className={styles.updated} dateTime="2026-09-03">Last updated: 3 September 2026</time>

        <section className={styles.section}><h2>What the site is</h2><p>The site presents portfolio material and prepared architecture blueprints for bot, assistant, and automation projects. The catalog is informational: it does not generate a custom bot, connect to an AI provider, authenticate visitors, execute external tools, or deploy any of the described systems.</p></section>
        <section className={styles.section}><h2>Data submitted to the site</h2><p>The catalog does not contain a registration form, sign-in flow, chat, prompt field, file upload, or database-backed project form. Selecting a filter or blueprint is temporary interface state in the current browser tab and is not sent to an application database or stored in local storage.</p></section>
        <section className={styles.section}><h2>Hosting data</h2><p>Vercel hosts the website and may process ordinary request and security information needed to deliver it, such as IP address, user agent, requested URL, timestamps, and diagnostic logs. That infrastructure processing is controlled by Vercel under its own terms and privacy documentation. This site does not intentionally add advertising trackers or behavioral analytics.</p></section>
        <section className={styles.section}><h2>AI and provider data</h2><p>Model and provider names in the systems catalog are architecture options only. No visitor content is sent to OpenAI, Anthropic, Google, Mistral AI, Kimi, OpenClaw, or another model runtime through this public site. If a separate client implementation later connects a provider, its data flow, retention, permissions, and legal basis must be defined for that implementation before launch.</p></section>
        <section className={styles.section}><h2>External links and contact</h2><p>The portfolio links to external services including GitHub, Kaggle, Telegram, the public reference board, and email. Opening those links leaves this site, and the destination service may process data under its own policies. If you email <a href="mailto:emirsemenov@yahoo.com">emirsemenov@yahoo.com</a>, the message and contact details you choose to provide will be used to respond to the inquiry.</p></section>
        <section className={styles.section}><h2>Cookies and browser storage</h2><p>The application does not intentionally set its own authentication, advertising, or preference cookies and does not use local storage for the catalog. The hosting platform may use strictly necessary infrastructure or security mechanisms.</p></section>
        <section className={styles.section}><h2>Your choices and deletion</h2><p>You may browse without identifying yourself. You may avoid external links or email contact. To ask about personal data contained in an email conversation, or to request correction or deletion where applicable, contact <a href="mailto:emirsemenov@yahoo.com">emirsemenov@yahoo.com</a>. Identity verification may be required before fulfilling a request.</p></section>
        <section className={styles.section}><h2>Security and changes</h2><p>The site uses HTTPS and keeps the public catalog independent from model credentials and private runtimes. No internet service can promise absolute security. This policy may change if the site&apos;s actual data practice changes; the update date above will be revised and the new version will remain publicly accessible.</p></section>
      </article>
      <footer className={styles.footer}><Link href="/">Portfolio</Link><Link href="/labs">Systems catalog</Link><Link href="/terms">Terms</Link><a href="mailto:emirsemenov@yahoo.com">Contact</a></footer>
    </main>
  );
}
