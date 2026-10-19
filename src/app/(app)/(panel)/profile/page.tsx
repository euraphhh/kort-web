import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { requireAccess } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Perfil | kort", robots: { index: false, follow: false } };

export default async function Page() {
  await requireAccess("/profile");
  return <ComingSoon title="Perfil" />;
}
