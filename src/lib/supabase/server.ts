import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "./env";

/** Supabase client for Server Components and Server Actions, acting as the logged-in user (RLS applies). */
export async function createClient() {
  // Read the cookies first, even when the settings are missing: it marks the caller as runtime
  // data, so Next never prerenders a page (and bakes in a redirect to /login) at build time.
  const cookieStore = await cookies();
  const env = supabaseEnv();
  if (!env) return null;

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only: the proxy refreshes the session.
        }
      },
    },
  });
}
