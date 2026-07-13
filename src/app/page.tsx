import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ICPSection } from "@/components/landing/ICPSection";
import { GiftCategoryGrid } from "@/components/landing/GiftCategoryGrid";
import { CTABanner } from "@/components/landing/CTABanner";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ICPSection />
        <GiftCategoryGrid />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
