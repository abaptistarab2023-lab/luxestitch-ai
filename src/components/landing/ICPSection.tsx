const audienceTraits = [
  "Women, ages 28–60, living in South Florida",
  "Shopping for wedding, baptism, baby, and housewarming gifts",
  "Value quality, personal touches, and a premium unboxing feel",
  "Want a simple way to turn inspiration into a real order",
];

const problems = [
  "Manually describing a monogram idea over email or DMs",
  "Guessing at fonts, thread colors, and placement with no preview",
  "Losing track of gift ideas across screenshots and bookmarks",
  "No single place to save and revisit past personalization projects",
];

export function ICPSection() {
  return (
    <section className="border-y border-border bg-muted-bg/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Who LuxeStitch AI is for
            </h2>
            <ul className="mt-6 space-y-3">
              {audienceTraits.map((trait) => (
                <li key={trait} className="flex gap-3 text-muted">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              The problem we solve
            </h2>
            <ul className="mt-6 space-y-3">
              {problems.map((problem) => (
                <li key={problem} className="flex gap-3 text-muted">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 max-w-3xl text-muted">
          Paste a link to any towel, robe, or linen set you love &mdash;
          LuxeStitch AI pulls in the product details automatically, so you
          can focus on the personalization: the monogram, the thread color,
          the recipient, and the occasion. Every project is saved to your
          own private dashboard.
        </p>
      </div>
    </section>
  );
}
