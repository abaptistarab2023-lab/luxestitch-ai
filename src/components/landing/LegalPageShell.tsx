import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function LegalPageShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display text-3xl text-foreground">{title}</h1>
          {updated && (
            <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
          )}
          <div className="prose-legal mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
