import type { Metadata } from "next";
import { Nav }           from "@/components/nav";
import { Footer }        from "@/components/footer";
import { FrapButton }    from "@/components/frap-button";
import { ProductCard }   from "@/components/product-card";
import { DEMO_PRODUCTS } from "@/lib/shopify";

export const metadata: Metadata = {
  title:       "All Products",
  description: "Precision-formulated garden soil and fertilisers for home gardeners.",
};

export default function ProductsPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: 99, paddingBottom: "5rem" }}>

        {/* Page header — dark green band */}
        <div style={{ background: "var(--green-house)", paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              All Products
            </p>
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.15 }}
            >
              Our formulas
            </h1>
            <p className="text-base max-w-md" style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.65 }}>
              Every product in our range is soil-tested and precision-balanced for Australian growing conditions.
            </p>
          </div>
        </div>

        {/* Product grid */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DEMO_PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
