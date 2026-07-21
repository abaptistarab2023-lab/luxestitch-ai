const moments = [
  {
    label: "Weddings",
    line: "For the couple, the wedding party, and every “yes” in between.",
  },
  {
    label: "Babies",
    line: "Soft enough for the first blanket, personal enough to keep forever.",
  },
  {
    label: "Baptisms",
    line: "A keepsake that carries a name into the family it belongs to.",
  },
  {
    label: "Family Gifts",
    line: "The kind of gift that gets handed down, not used up.",
  },
  {
    label: "Luxury Home Linens",
    line: "Linens that feel like they were always meant to be yours.",
  },
  {
    label: "Hospitality Collections",
    line: "For hotels and stays that want their linens to feel like home.",
  },
  {
    label: "Corporate Gifts",
    line: "Thoughtful and personal, even at scale.",
  },
  {
    label: "Personal Keepsakes",
    line: "You don’t need an occasion to deserve something beautiful.",
  },
];

export function ICPSection() {
  return (
    <section className="border-y border-border bg-muted-bg/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl text-foreground sm:text-3xl">
            Every stitch marks a moment.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            A wedding morning. A baby&rsquo;s first blanket. A baptism gown
            that gets handed down. A home that feels like yours. A welcome a
            guest remembers. A gift that says more than a card ever could.
            Or simply something for yourself, because some moments deserve
            to be marked.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {moments.map((moment) => (
            <div
              key={moment.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="font-display text-lg text-foreground">
                {moment.label}
              </p>
              <p className="mt-1 text-sm text-muted">{moment.line}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-muted">
          Whatever you&rsquo;re celebrating, LuxeStitch turns it into
          something you can hold onto.
        </p>
      </div>
    </section>
  );
}
