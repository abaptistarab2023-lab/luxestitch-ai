const categories = [
  { label: "Towels", blurb: "Beach, bath & bridal party sets" },
  { label: "Linens", blurb: "Sheets, napkins & table linens" },
  { label: "Robes", blurb: "Bridesmaid & spa-day robes" },
  { label: "Baby Gifts", blurb: "Blankets, burp cloths & onesies" },
  { label: "Wedding Gifts", blurb: "For the couple & the wedding party" },
  { label: "Baptism Gifts", blurb: "Christening gowns & keepsake blankets" },
  { label: "Luxury Home Gifts", blurb: "Pillows, throws & housewarming sets" },
];

export function GiftCategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">
          Find the piece that becomes the gift.
        </h2>
        <p className="mt-3 text-muted">
          Every category, ready to be made someone&rsquo;s.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.label}
            className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <p className="font-display text-lg text-foreground">
              {category.label}
            </p>
            <p className="mt-1 text-sm text-muted">{category.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
