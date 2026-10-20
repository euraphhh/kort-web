import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAccess, homePath, type Role } from "./access";

export type Session = {
  userId: string;
  email: string;
  role: Role;
  barbershopId: string;
  /** Set for barbers: the only agenda they may open. */
  professionalId: string | null;
  /** Null for a barber: RLS lets only the owner read the barbershop; members read the summary view. */
  barbershopName: string | null;
};

/** The logged-in person and their place in a barbershop, or null (no session, or not a member of any). */
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: member } = await supabase
    .from("barbershop_member")
    .select("barbershop_id, role, professional_id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!member) return null;

  const { data: shop } = await supabase
    .from("barbershop_summary")
    .select("name")
    .eq("id", member.barbershop_id)
    .maybeSingle();

  return {
    userId: auth.user.id,
    email: auth.user.email ?? "",
    role: member.role as Role,
    barbershopId: member.barbershop_id,
    professionalId: member.professional_id,
    barbershopName: shop?.name ?? null,
  };
});

/** For layouts and pages of the panel: no session goes to /login. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** For a page: sends the person to their home if their role does not reach this path. */
export async function requireAccess(pathname: string): Promise<Session> {
  const session = await requireSession();
  if (!canAccess(session.role, pathname)) redirect(homePath());
  return session;
}
