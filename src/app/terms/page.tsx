import { LegalPageShell } from "@/components/landing/LegalPageShell";

export const metadata = { title: "Terms of Use | LuxeStitch AI" };

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Use" updated="Draft — pending business review">
      <p>
        These terms are a starting draft for the LuxeStitch AI pilot and
        should be reviewed by qualified counsel before the service is
        offered commercially at scale.
      </p>

      <section>
        <h2 className="font-display text-lg text-foreground">The Service</h2>
        <p className="mt-2">
          LuxeStitch AI lets you create and save personalization projects for
          embroidered linens, and submit a project to our team for a quote.
          Submitting a project is a request for a quote, not a purchase —
          this pilot does not process payments.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">
          Accounts
        </h2>
        <p className="mt-2">
          You&rsquo;re responsible for the accuracy of the information in
          your account and for keeping your password secure. We may suspend
          an account used in violation of these terms.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">
          Quotes &amp; Orders
        </h2>
        <p className="mt-2">
          Product details imported from a link you provide are for reference
          only — colors, materials, and availability may vary from the
          original source. A quote is not final until confirmed by our team,
          and no order is placed until you and our team agree on it outside
          this pilot version of the app.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">
          Acceptable Use
        </h2>
        <p className="mt-2">
          Please don&rsquo;t use LuxeStitch AI to submit unlawful content, to
          attempt to access another customer&rsquo;s account or data, or to
          abuse the product-link import feature outside its intended use.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">
          Limitation of Liability
        </h2>
        <p className="mt-2">
          The service is provided &ldquo;as is&rdquo; during this pilot.
          To the fullest extent permitted by law, LuxeStitch AI is not liable
          for indirect or incidental damages arising from use of the service.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">Contact</h2>
        <p className="mt-2">
          Questions about these terms can be sent via our{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact page
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
