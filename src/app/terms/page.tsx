import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Use — Systems Catalog",
  description: "Terms for using Emir Semenov's public bot and agent systems portfolio and architecture catalog.",
};

export default function TermsPage() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}><Link href="/">E/S</Link><span>PUBLIC DOCUMENT / NO SIGN-IN REQUIRED</span></header>
      <article className={styles.document}>
        <p className={styles.eyebrow}>SYSTEMS CATALOG / USE BOUNDARY</p>
        <h1>Terms of Use</h1>
        <p className={styles.lead}>These terms apply to Emir Semenov&apos;s portfolio and the static catalog of bot, assistant, and automation architectures.</p>
        <time className={styles.updated} dateTime="2026-09-03">Last updated: 3 September 2026</time>

        <section className={styles.section}><h2>Purpose and status</h2><p>The site demonstrates design thinking, technical architecture, delivery scope, and safety controls for possible software projects. Catalog entries are prepared concepts, not deployed client systems, live third-party integrations, guaranteed delivery offers, or claims of measured production results.</p></section>
        <section className={styles.section}><h2>Permitted use</h2><p>You may browse the portfolio, study the public architecture descriptions, and contact the author about a potential implementation. You may not disrupt the site, probe for credentials, automate abusive traffic, misrepresent catalog material as a deployed system, or use the site for unlawful, deceptive, harmful, or rights-infringing activity.</p></section>
        <section className={styles.section}><h2>Architecture guidance</h2><p>Functions, stacks, integrations, providers, and model names are design options that require discovery, evaluation, security review, provider eligibility, current pricing, and legal review before a real implementation. The catalog is not legal, medical, financial, security, procurement, or other professional advice.</p></section>
        <section className={styles.section}><h2>Third-party services</h2><p>The site is hosted by Vercel and links to third-party services. Catalog entries may mention Telegram, WhatsApp, Instagram, Discord, OpenAI, Anthropic, Google, Mistral AI, Supabase, and other products as possible components. Their terms, technical restrictions, account eligibility, and availability apply to any future implementation. No affiliation, certification, or partnership with those services is claimed.</p></section>
        <section className={styles.section}><h2>Intellectual property</h2><p>The portfolio&apos;s original code, editorial structure, architecture writing, and presentation remain with their respective owner. Reference media is presented as visual research and is not claimed as client work or original authorship. Third-party names, trademarks, documentation, platforms, models, and media remain the property of their respective owners.</p></section>
        <section className={styles.section}><h2>Availability and liability</h2><p>The public site may change, move, or become unavailable. To the extent permitted by applicable law, it is provided as available without warranties, and responsibility for decisions based solely on concept material remains with the user. Nothing here excludes liability that cannot legally be excluded.</p></section>
        <section className={styles.section}><h2>Changes and contact</h2><p>These terms may be updated as the portfolio changes. The published update date will be revised. Questions may be sent to <a href="mailto:emirsemenov@yahoo.com">emirsemenov@yahoo.com</a>. No legal entity, street address, or company registration is asserted by this page.</p></section>
      </article>
      <footer className={styles.footer}><Link href="/">Portfolio</Link><Link href="/labs">Systems catalog</Link><Link href="/privacy">Privacy</Link><a href="mailto:emirsemenov@yahoo.com">Contact</a></footer>
    </main>
  );
}
