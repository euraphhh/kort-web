import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Assistant, Faq, FinalCta, Footer, HowItWorks, Pain, Panel } from "@/components/marketing/sections";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-md bg-surface-1 px-4 py-3 text-body-strong focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Pain />
        <HowItWorks />
        <Assistant />
        <Panel />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
