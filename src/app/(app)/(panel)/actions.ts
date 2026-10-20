"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  // "local": ends only this device; the default would end the person's sessions everywhere.
  await supabase?.auth.signOut({ scope: "local" });
  redirect("/login");
}
