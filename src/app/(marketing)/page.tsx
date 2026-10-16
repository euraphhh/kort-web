import Agenda from "@/components/marketing/agenda";
import ChatDemo from "@/components/marketing/chat-demo";
import { Cta, Footer } from "@/components/marketing/closing";
import Features from "@/components/marketing/features";
import Hero from "@/components/marketing/hero";
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
        <Hero />
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
