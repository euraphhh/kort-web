import Providers from "@/components/marketing/providers";
import "./landing.css";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="landing">{children}</div>
    </Providers>
  );
}
