// Supabase settings, read by server code only (Server Components, Server Actions, proxy).
// Local values come from `npx supabase start` (see .env.example).
//
// Bracket access on purpose: Next inlines `process.env.NEXT_PUBLIC_X` at build time, and the Docker
// image is built without the variables (they arrive at runtime through env_file). Reading by key
// keeps the value dynamic, so the same image works in any environment.
export function supabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  return url && anonKey ? { url, anonKey } : null;
}
