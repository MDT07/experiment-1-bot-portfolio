"use client";

import { FormEvent, useState } from "react";
import { createStudioBrowserClient } from "@/lib/supabase/browser";
import styles from "./SignIn.module.css";

export default function SignInForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signInWithGithub() {
    const supabase = createStudioBrowserClient();
    if (!supabase) return setMessage("Studio authentication is not configured yet.");
    setMessage(null);
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createStudioBrowserClient();
    if (!supabase) return setMessage("Studio authentication is not configured yet.");
    setMessage(null);
    setLoading(true);
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo, shouldCreateUser: true },
    });
    setMessage(error ? error.message : "Magic link sent. You can close this tab after opening the email.");
    setLoading(false);
  }

  return (
    <div className={styles.actions}>
      <button type="button" onClick={signInWithGithub} disabled={loading} className={styles.github}>
        Continue with GitHub <span>↗</span>
      </button>
      <div className={styles.divider}><span>OR</span></div>
      <form onSubmit={sendMagicLink}>
        <label htmlFor="studio-email">Email magic link</label>
        <div>
          <input
            id="studio-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <button type="submit" disabled={loading}>{loading ? "Sending…" : "Send link"}</button>
        </div>
      </form>
      {message && <p className={styles.message} role="status">{message}</p>}
    </div>
  );
}
