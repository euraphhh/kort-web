import Providers from "@/components/app/providers";

// The panel has its own layout and never shares one with the marketing site. In production it
// lives at app.<domain>.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
