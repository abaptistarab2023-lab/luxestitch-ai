import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, Button } from "@/components/ui";
import { ITEM_TYPE_LABELS } from "@/lib/validations/project";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("catalog_products")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center">
            <h1 className="font-display text-3xl text-foreground">
              The Catalog
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              A curated selection of the fine linens our clients personalize
              most. Paste any of these — or your own find — into a new
              project to get started.
            </p>
          </div>

          {!products || products.length === 0 ? (
            <p className="text-center text-sm text-muted">
              The catalog is being refreshed — check back shortly.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] w-full bg-muted-bg">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-lg text-foreground">
                        {product.title}
                      </p>
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {ITEM_TYPE_LABELS[product.item_type]}
                      </span>
                    </div>
                    {product.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted">
                        {product.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link href="/register">
              <Button>Start Your Own Project</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
