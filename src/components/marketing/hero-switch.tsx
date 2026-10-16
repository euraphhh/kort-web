"use client";
import { useSearchParams } from "next/navigation";
import Hero from "./hero";

/** Provisório: compara as duas direções do hero com ?hero=center ou ?hero=split. */
export default function HeroSwitch() {
  const variant = useSearchParams().get("hero") === "center" ? "center" : "split";
  return <Hero variant={variant} />;
}
