/** The `h1` block at the top of a standalone route. */
export const PageHead = ({ id, title, tagline }: { id: string; title: string; tagline: string }) => {
  const headingId = `${id}-page-heading`;
  return (
    <section className="page-head" aria-labelledby={headingId}>
      <h1 id={headingId}>{title}</h1>
      <p className="tagline">{tagline}</p>
    </section>
  );
};
