import { LegalPageShell } from "@/components/landing/LegalPageShell";

export const metadata = { title: "Contact | LuxeStitch AI" };

// Placeholder contact details — replace with the business's real email and
// phone number before this page goes in front of real customers. Left as a
// static page (no form/backend) until transactional email (priority #6) is
// configured, so there's somewhere to actually deliver a submission.
const CONTACT_EMAIL = "hello@luxestitchai.com";
const CONTACT_PHONE = "(555) 555-0100";

export default function ContactPage() {
  return (
    <LegalPageShell title="Contact Us">
      <p>
        Have a question about a project, a quote, or LuxeStitch AI in
        general? We&rsquo;d love to hear from you.
      </p>

      <div className="rounded-2xl border border-border bg-card p-6">
        <dl className="flex flex-col gap-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Email
            </dt>
            <dd className="mt-1 text-base text-foreground">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Phone
            </dt>
            <dd className="mt-1 text-base text-foreground">{CONTACT_PHONE}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Serving
            </dt>
            <dd className="mt-1 text-base text-foreground">South Florida</dd>
          </div>
        </dl>
      </div>

      <p className="text-xs text-muted">
        Placeholder contact details shown above — update with the
        business&rsquo;s real email and phone before launch.
      </p>
    </LegalPageShell>
  );
}
