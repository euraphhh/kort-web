import Agenda from "@/components/marketing/agenda";
import ChatDemo from "@/components/marketing/chat-demo";
import { Cta, Footer } from "@/components/marketing/closing";
import Features from "@/components/marketing/features";
import { Suspense } from "react";
import HeroSwitch from "@/components/marketing/hero-switch";
import Marquee from "@/components/marketing/marquee";
import Nav from "@/components/marketing/nav";
import { PatternBand } from "@/components/marketing/patterns";
import Moment from "@/components/marketing/photos";
import Stages from "@/components/marketing/stages";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Suspense fallback={<section className="hero hero-split" />}>
          <HeroSwitch />
        </Suspense>
        <Marquee />
        <ChatDemo />
        <PatternBand kind="conversa" />
        <Agenda />
        <PatternBand kind="agenda" />
        <Stages />
        <Moment />
        <Features />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
