import { LegalPageShell } from "@/components/landing/LegalPageShell";

export const metadata = { title: "Privacy Policy | LuxeStitch AI" };

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" updated="Draft — pending business review">
      <p>
        This page describes, in plain language, what information LuxeStitch
        AI collects and how it&rsquo;s used. It is a starting draft for the
        pilot and should be reviewed by qualified counsel before the service
        handles customer data at commercial scale.
      </p>

      <section>
        <h2 className="font-display text-lg text-foreground">
          Information We Collect
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your email address, used to create and secure your account.</li>
          <li>
            The personalization details you enter for a project — item type,
            occasion, monogram text, thread color, notes, and any product
            link or inspiration image you provide.
          </li>
          <li>
            Your name and phone number, collected only when you submit a
            project for a quote, so our team can follow up with you.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">
          How We Use It
        </h2>
        <p className="mt-2">
          We use this information to operate your account, prepare and
          communicate quotes, and fulfill personalization orders you submit.
          We do not sell your information.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">
          Third-Party Services
        </h2>
        <p className="mt-2">LuxeStitch AI relies on a small number of service providers to operate:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong className="text-foreground">Supabase</strong> — hosts our
            account authentication, database, and file storage.
          </li>
          <li>
            <strong className="text-foreground">Firecrawl</strong> —
            retrieves product details from links you choose to paste into a
            project.
          </li>
          <li>
            <strong className="text-foreground">Vercel</strong> — hosts the
            website itself.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">
          Your Choices
        </h2>
        <p className="mt-2">
          You can edit or delete a project yourself from your dashboard while
          it&rsquo;s still a draft. To request a copy of your data or full
          account deletion, contact us using the details on our{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact page
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">Contact</h2>
        <p className="mt-2">
          Questions about this policy can be sent via our{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact page
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
