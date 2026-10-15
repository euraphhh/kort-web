import Image from "next/image";

// Logo só pelos SVGs oficiais de public/brand. Wordmark com no mínimo 64px de largura.
// Cada SVG tem tinta fixa, então trocamos o arquivo conforme o tema.

const RATIO = 120 / 230; // viewBox do wordmark

export function Wordmark({ width, eager = false }: { width: number; eager?: boolean }) {
  const w = Math.max(width, 64);
  const h = Math.round(w * RATIO);
  const loading = eager ? "eager" : "lazy";
  return (
    <>
      <Image src="/brand/kort-wordmark.svg" alt="kort" width={w} height={h} loading={loading} className="dark:hidden" />
      <Image
        src="/brand/kort-wordmark-creme.svg"
        alt="kort"
        width={w}
        height={h}
        loading={loading}
        className="hidden dark:block"
      />
    </>
  );
}
