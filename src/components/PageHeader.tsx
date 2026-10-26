// Navy title band at the top of inner pages.
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-primary text-white dark:bg-primary-dark">
      <div className="absolute inset-0 pattern-grid" aria-hidden />
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden
      />
      <div className="container relative mx-auto px-4 py-14 md:py-20">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-3xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-white/75">{description}</p>}
        {children}
      </div>
    </section>
  );
}
