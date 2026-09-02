import "server-only";

import { createServerClient } from "@supabase/ssr";
import {
  createAdminClient,
  createContextClient,
  verifyCredentials,
} from "@supabase/server/core";
import type { AuthModeWithKey, SupabaseEnv } from "@supabase/server";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import type { StudioUser } from "./owner";

export { isStudioOwner } from "./owner";

function resolveStudioEnv(): Partial<SupabaseEnv> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  return {
    url: url || undefined,
    publishableKeys: publishableKey ? { default: publishableKey } : {},
    secretKeys: secretKey ? { default: secretKey } : {},
  };
}

let cachedJwks: SupabaseEnv["jwks"] = null;

async function getJwks(supabaseUrl: string): Promise<SupabaseEnv["jwks"]> {
  if (cachedJwks) return cachedJwks;
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/.well-known/jwks.json`, {
      cache: "force-cache",
    });
    if (!response.ok) return null;
    cachedJwks = (await response.json()) as SupabaseEnv["jwks"];
    return cachedJwks;
  } catch {
    return null;
  }
}

export function isStudioSupabaseConfigured(): boolean {
  const env = resolveStudioEnv();
  return Boolean(
    env.url &&
      env.publishableKeys?.default?.startsWith("sb_publishable_") &&
      env.secretKeys?.default?.startsWith("sb_secret_"),
  );
}

export async function createStudioContext(
  options: { auth?: AuthModeWithKey | AuthModeWithKey[] } = { auth: "user" },
) {
  const nextEnv = resolveStudioEnv();
  if (!nextEnv.url || !nextEnv.publishableKeys?.default) {
    return { data: null, error: new Error("studio_storage_not_configured") };
  }

  const cookieStore = await cookies();
  const ssrClient = createServerClient(nextEnv.url, nextEnv.publishableKeys.default, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
            cookieStore.set(name, value, cookieOptions),
          );
        } catch {
          // Server Components are read-only. src/proxy.ts refreshes the cookies.
        }
      },
    },
  });

  const {
    data: { session },
  } = await ssrClient.auth.getSession();
  const token = session?.access_token ?? null;
  const jwks = await getJwks(nextEnv.url);
  const env: Partial<SupabaseEnv> = { ...nextEnv, jwks };
  const { data: auth, error } = await verifyCredentials(
    { token, apikey: null },
    { auth: options.auth ?? "user", env },
  );

  if (error || !auth) return { data: null, error: error || new Error("studio_unauthorized") };

  const supabase = createContextClient<Database>({ auth: { token: auth.token }, env });
  const supabaseAdmin = createAdminClient<Database>({ env });
  const user: StudioUser | null = session?.user
    ? { id: session.user.id, email: session.user.email || null }
    : null;

  return {
    data: { supabase, supabaseAdmin, user, authMode: auth.authMode },
    error: null,
  };
}

export function createStudioAdminClient() {
  if (!isStudioSupabaseConfigured()) throw new Error("studio_storage_not_configured");
  return createAdminClient<Database>({ env: resolveStudioEnv() });
}
