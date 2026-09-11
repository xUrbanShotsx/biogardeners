import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FrapButton } from "@/components/frap-button";
import { BundleAddToCart } from "./bundle-add-to-cart";
import { getBundleMeta } from "./bundle-meta";
import { getProductsByTag } from "@/lib/shopify";
import { type ShopifyProduct } from "@/lib/shopify";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Care Bundles | BioGardeners",
  description: "Curated soil and fertiliser bundles for every garden type. Everything you need, matched and ready to go.",
};

function BundleCard({ product }: { product: ShopifyProduct }) {
  const meta      = getBundleMeta(product.title);
  const Icon      = meta.icon;
  const bundleAmt = parseFloat(product.priceRange.minVariantPrice.amount);
  const saving    = meta.fullPrice > 0 ? +(meta.fullPrice - bundleAmt).toFixed(2) : 0;

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)", background: "#fff" }}
    >
      {/* Clickable header area → detail page */}
      <Link href={`/bundles/${product.handle}`} className="block px-3 pt-3 pb-2 md:px-6 md:pt-6 md:pb-5 hover:opacity-90 transition-opacity">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div
            className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center"
            style={{ background: meta.color + "18" }}
          >
            <Icon size={16} className="md:hidden" style={{ color: meta.color }} />
            <Icon size={22} className="hidden md:block" style={{ color: meta.color }} />
          </div>
          <div className="flex items-center gap-1.5">
            {saving > 0 && (
              <span
                className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full"
                style={{ background: "#dcfce7", color: "#15803d" }}
              >
                Save ${saving.toFixed(2)}
              </span>
            )}
            <span
              className="hidden md:inline text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: meta.color + "15", color: meta.color }}
            >
              {meta.tag}
            </span>
          </div>
        </div>

        <h2 className="font-bold text-xs md:text-xl leading-snug mb-1.5 md:mb-3" style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>
          {product.title}
        </h2>

        <div className="flex items-baseline gap-1.5 md:gap-2.5 mb-0 md:mb-3">
          <span className="font-bold text-sm md:text-2xl" style={{ color: "var(--green-bio)" }}>
            ${bundleAmt.toFixed(2)}
          </span>
          {meta.fullPrice > 0 && (
            <span className="text-xs md:text-sm line-through" style={{ color: "var(--text-black-soft)" }}>
              ${meta.fullPrice.toFixed(2)}
            </span>
          )}
          {saving > 0 && (
            <span className="hidden md:inline text-xs font-semibold" style={{ color: "#15803d" }}>
              10% off
            </span>
          )}
        </div>

        {meta.blurb && (
          <p className="hidden md:block text-sm leading-relaxed mt-3" style={{ color: "var(--text-black-soft)" }}>
            {meta.blurb}
          </p>
        )}

        {/* View details link — desktop only */}
        <p className="hidden md:flex items-center gap-1 text-xs font-semibold mt-3" style={{ color: meta.color }}>
          View details <ArrowRight size={11} />
        </p>
      </Link>

      {/* Includes — desktop only */}
      {meta.includes.length > 0 && (
        <div
          className="hidden md:block mx-6 mb-5 rounded-xl px-4 py-3"
          style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2.5" style={{ color: "var(--text-black-soft)" }}>
            Includes
          </p>
          <ul className="flex flex-col gap-1.5">
            {meta.includes.map((item) => (
              <li key={item.name} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-black)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add to cart */}
      <div className="px-3 pb-3 pt-2 md:px-6 md:pb-6 md:pt-0 mt-auto">
        <BundleAddToCart product={product} />
      </div>
    </div>
  );
}

export default async function BundlesPage() {
  let bundles: ShopifyProduct[] = [];
  try {
    const raw = await getProductsByTag("Bundle", 20);
    // Pin Spring pack first, rest in original order
    const spring = raw.filter(b => b.title.toLowerCase().includes("spring"));
    const rest   = raw.filter(b => !b.title.toLowerCase().includes("spring"));
    bundles = [...spring, ...rest];
  } catch {
    // Shopify not configured or unreachable — render empty
  }

  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Hero */}
        <section
          className="px-5 md:px-10 py-16 md:py-24 text-center"
          style={{ background: "var(--green-house)" }}
        >
          <p className="text-xs font-bold tracking-[0.12em] uppercase mb-4" style={{ color: "var(--green-accent)" }}>
            Care Packages
          </p>
          <h1
            className="font-bold text-4xl md:text-6xl mb-5 mx-auto max-w-3xl"
            style={{ color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Everything your garden needs,{" "}
            <span style={{ color: "var(--green-accent)" }}>matched and ready.</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            Curated combinations of BioGardeners products for every garden type and goal.
            No guesswork — just the right minerals, in the right order.
          </p>
        </section>

        {/* Bundle grid */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 md:py-24">
          {bundles.length === 0 ? (
            <p className="text-center text-sm" style={{ color: "var(--text-black-soft)" }}>
              Bundles coming soon — <Link href="/contact" className="underline font-semibold">contact us</Link> to order.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {bundles.map((b) => (
                <BundleCard key={b.id} product={b} />
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section
          className="mx-5 md:mx-10 mb-16 rounded-2xl px-8 py-12 text-center max-w-[1280px] lg:mx-auto"
          style={{ background: "var(--green-house)" }}
        >
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
            Need something specific?
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.60)" }}>
            Our team can put together a custom package based on your soil type, climate, and garden goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Contact us
            </Link>
            <Link href="/products" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}>
              Shop individual products
            </Link>
          </div>
        </section>

      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
