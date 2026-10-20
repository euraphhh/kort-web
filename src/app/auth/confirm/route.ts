import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Landing of the link in the recovery e-mail: exchanges the one-time token for a session and sends
// the person to the "reset password" screen. A used, expired or forged link goes to the same screen
// with ?link=invalid, which explains it and offers to ask for a new one.
// Only the "recovery" type is accepted and the destination is fixed: nothing from the URL decides
// where the person lands (no open redirect).

// Relative on purpose: behind Docker or a proxy the request URL can carry an internal host
// (0.0.0.0), and a relative Location always resolves against the address the browser used.
function redirectTo(path: string) {
  return new Response(null, { status: 307, headers: { Location: path } });
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  if (tokenHash && type === "recovery") {
    const supabase = await createClient();
    const result = await supabase?.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
    if (result && !result.error) return redirectTo("/reset-password");
  }

  return redirectTo("/reset-password?link=invalid");
}
