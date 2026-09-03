import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Use — Bot Studio",
  description: "Terms for using Emir Semenov's experimental Bot Studio and generated bot-system previews.",
};

export default function TermsPage() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}><Link href="/">E/S</Link><span>PUBLIC DOCUMENT / NO SIGN-IN REQUIRED</span></header>
      <article className={styles.document}>
        <p className={styles.eyebrow}>BOT STUDIO / USE BOUNDARY</p>
        <h1>Terms of Use</h1>
        <p className={styles.lead}>These terms apply to the portfolio and its limited Bot Studio experiment. By using the Studio, you agree to use it within the boundaries below.</p>
        <time className={styles.updated} dateTime="2026-09-03">Last updated: 3 September 2026</time>

        <section className={styles.section}><h2>Purpose and availability</h2><p>The Studio produces design blueprints and a short conversational preview for learning, evaluation, and portfolio demonstration. It does not deploy a bot, connect a social account, execute external tools, promise business results, or provide a production service-level commitment. Features, providers, limits, and availability may change or stop without notice.</p></section>
        <section className={styles.section}><h2>Permitted use</h2><p>You may create a blueprint for a lawful bot or assistant concept and evaluate the generated result. You are responsible for reviewing output before relying on it. You may not attempt to bypass generation or message limits, probe other users&apos; data, disrupt the service, extract credentials, submit malware, automate abusive traffic, or use the Studio for unlawful, deceptive, harmful, or rights-infringing activity.</p></section>
        <section className={styles.section}><h2>Your input and responsibility</h2><p>You retain responsibility for content you submit and must have the right to use it. Do not provide secrets, sensitive personal data, confidential client material, or regulated records. Generated output may be incomplete or incorrect; it is a design aid, not legal, medical, financial, security, or professional advice.</p></section>
        <section className={styles.section}><h2>AI and third-party services</h2><p>The service depends on Vercel, Supabase, GitHub when selected for OAuth, email delivery used by Supabase Auth, OpenClaw, and—after model approval—Kimi Code infrastructure. Their terms and availability also apply to their services. No affiliation, certification, or partnership with Telegram, Instagram, WhatsApp, GitHub, Supabase, Vercel, Kimi, or OpenClaw is claimed unless explicitly stated elsewhere with evidence.</p></section>
        <section className={styles.section}><h2>Intellectual property</h2><p>The portfolio&apos;s original code, editorial structure, and presentation remain with their respective owner. Reference media is presented as visual research and is not claimed as client work or original authorship. A generated blueprint does not grant rights to third-party names, platforms, datasets, media, or trademarks it may mention.</p></section>
        <section className={styles.section}><h2>Suspension and limits</h2><p>Access may be restricted or terminated to protect the service, users, providers, or legal interests, including suspected quota bypass or abuse. To the extent permitted by applicable law, the service is provided as available without warranties, and liability for indirect, consequential, or reliance-based losses is limited. Nothing here excludes liability that cannot legally be excluded.</p></section>
        <section className={styles.section}><h2>Changes and contact</h2><p>These terms may be updated as the experiment changes. Continued use after the published update means the new terms apply from that date. Questions may be sent to <a href="mailto:emirsemenov@yahoo.com">emirsemenov@yahoo.com</a>. No legal entity, street address, or company registration is asserted by this page.</p></section>
      </article>
      <footer className={styles.footer}><Link href="/">Portfolio</Link><Link href="/labs">Bot Studio</Link><Link href="/privacy">Privacy</Link><a href="mailto:emirsemenov@yahoo.com">Contact</a></footer>
    </main>
  );
}
