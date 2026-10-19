import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";

// Runs before the panel routes: refreshes the Supabase session cookie and sends anyone without a
// session to /login. It only decides "logged in or not"; the role check is in the layout and the
// pages (src/lib/auth/access.ts), and the wall between barbershops is RLS.
export async function proxy(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const env = supabaseEnv();
  if (!env) return NextResponse.redirect(loginUrl);

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.redirect(loginUrl);
  return response;
}

export const config = {
  matcher: [
    "/agenda/:path*",
    "/to-close/:path*",
    "/customers/:path*",
    "/services/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
