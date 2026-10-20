import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { requireAccess } from "@/lib/auth/session";

export const metadata: Metadata = { title: "A fechar | kort", robots: { index: false, follow: false } };

export default async function Page() {
  await requireAccess("/to-close");
  return <ComingSoon title="A fechar" />;
}
