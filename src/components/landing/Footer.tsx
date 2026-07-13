export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-sm text-muted sm:flex-row">
        <p className="font-display text-foreground">LuxeStitch AI</p>
        <p>&copy; {new Date().getFullYear()} LuxeStitch AI. South Florida.</p>
      </div>
    </footer>
  );
}
