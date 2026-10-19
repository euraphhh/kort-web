// Placeholder for a panel screen that belongs to another card. The layout and the menu already
// route here; the screen replaces this component.
export function ComingSoon({ title }: { title: string }) {
  return (
    <section aria-labelledby="page-title" className="max-w-prose">
      <h1 id="page-title" className="text-title">
        {title}
      </h1>
      <p className="mt-(--space-2) text-body text-text-muted">Esta tela ainda não foi construída.</p>
    </section>
  );
}
