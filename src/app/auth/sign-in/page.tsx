import type { Metadata } from "next";
import Link from "next/link";
import SignInForm from "./SignInForm";
import styles from "./SignIn.module.css";

export const metadata: Metadata = {
  title: "Studio access",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/labs";

  return (
    <main className={styles.shell}>
      <div className={styles.frame}>
        <header>
          <Link href="/">E/S</Link>
          <span>BOT STUDIO / ACCESS GATE</span>
        </header>
        <section>
          <p className={styles.eyebrow}>ONE VERIFIED PERSON / ONE GENERATION</p>
          <h1>Enter the studio without creating another password.</h1>
          <p className={styles.lead}>
            GitHub or an email magic link verifies one identity. Guests receive one successful bot generation and five preview messages. Failed model runs do not consume the generation.
          </p>
          <SignInForm nextPath={next} />
        </section>
        <footer>
          <span>No public profile is created.</span>
          <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href={next}>Return to studio</Link></div>
        </footer>
      </div>
    </main>
  );
}
