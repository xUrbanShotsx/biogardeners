import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FrapButton } from "@/components/frap-button";
import { BundleAddToCart } from "./bundle-add-to-cart";
import { getProductsByTag } from "@/lib/shopify";
import { type ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import {
  Leaf, Sun, Sprout, Snowflake, RefreshCcw,
  Shovel, Wheat, Home, Shield, Layers, Flower2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Care Bundles | BioGardeners",
  description: "Curated soil and fertiliser bundles for every garden type. Everything you need, matched and ready to go.",
};

/* ── Per-bundle metadata matched by keywords in the product title ── */
type BundleMeta = {
  icon:    React.ElementType;
  color:   string;
  tag:     string;
  includes: string[];
};

function getMeta(title: string): BundleMeta {
  const t = title.toLowerCase();
  if (t.includes("spring"))
    return {
      icon: Sprout, color: "var(--green-accent)", tag: "Seasonal",
      includes: ["1L NPK Liquid Fertiliser", "1L Bloom N Yield", "1L EcoSpray", "5kg Premium GP Fertiliser", "1L Penetrator"],
    };
  if (t.includes("summer"))
    return {
      icon: Sun, color: "var(--gold)", tag: "Seasonal",
      includes: ["5kg Premium GP Fertiliser", "1L EcoSpray", "1L NPK Liquid Fertiliser", "1L Bloom N Yield"],
    };
  if (t.includes("autumn"))
    return {
      icon: Leaf, color: "#b35c1e", tag: "Seasonal",
      includes: ["1L NPK Liquid Fertiliser", "100g Glacial Milk", "5kg Premium GP Fertiliser"],
    };
  if (t.includes("winter"))
    return {
      icon: Snowflake, color: "#4a8fa8", tag: "Seasonal",
      includes: ["1L NPK Liquid Fertiliser", "1L Liquid Soil Conditioner", "100g Glacial Milk"],
    };
  if (t.includes("regenerative"))
    return {
      icon: RefreshCcw, color: "var(--green-bio)", tag: "Treatment",
      includes: ["5kg Premium GP Fertiliser", "1L NPK Liquid Fertiliser", "1L Liquid Soil Conditioner", "1L EcoSpray"],
    };
  if (t.includes("planting") && !t.includes("seed"))
    return {
      icon: Shovel, color: "var(--green-accent)", tag: "Planting",
      includes: ["5kg Premium GP Fertiliser", "1L Liquid Soil Conditioner", "1L Liquid NPK Fertiliser"],
    };
  if (t.includes("seed"))
    return {
      icon: Wheat, color: "var(--gold)", tag: "Seeds",
      includes: ["1L NPK Liquid Fertiliser", "1L Bloom N Yield", "100g Glacial Milk"],
    };
  if (t.includes("indoor"))
    return {
      icon: Home, color: "var(--green-accent)", tag: "Indoor",
      includes: ["1L Liquid NPK Fertiliser", "1L Soil Conditioner", "100g Glacial Milk", "1L EcoSpray"],
    };
  if (t.includes("insect") || t.includes("fungus"))
    return {
      icon: Shield, color: "var(--green-bio)", tag: "Protection",
      includes: ["1L EcoSpray"],
    };
  if (t.includes("clay") || t.includes("heavy"))
    return {
      icon: Layers, color: "#7c5c3a", tag: "Soil",
      includes: ["4L Liquid Instant ClayBreaker", "1L Penetrator"],
    };
  if (t.includes("flower"))
    return {
      icon: Flower2, color: "#c0527a", tag: "Flowering",
      includes: ["1L Bloom N Yield", "1L Liquid NPK Fertiliser", "100g Glacial Milk"],
    };
  return {
    icon: Sprout, color: "var(--green-accent)", tag: "Bundle",
    includes: [],
  };
}

function BundleCard({ product }: { product: ShopifyProduct }) {
  const meta  = getMeta(product.title);
  const Icon  = meta.icon;
  const price = formatPrice(product.priceRange.minVariantPrice.amount);

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)", background: "#fff" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: meta.color + "18" }}
          >
            <Icon size={22} style={{ color: meta.color }} />
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: meta.color + "15", color: meta.color }}
          >
            {meta.tag}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-bold text-xl leading-snug" style={{ color: "var(--text-black)", letterSpacing: "-0.02em" }}>
            {product.title}
          </h2>
          <span className="font-bold text-xl shrink-0" style={{ color: "var(--green-bio)" }}>
            {price}
          </span>
        </div>

        {product.description && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
            {product.description}
          </p>
        )}
      </div>

      {/* Includes */}
      {meta.includes.length > 0 && (
        <div
          className="mx-6 mb-5 rounded-xl px-4 py-3"
          style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2.5" style={{ color: "var(--text-black-soft)" }}>
            Includes
          </p>
          <ul className="flex flex-col gap-1.5">
            {meta.includes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-black)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add to cart */}
      <div className="px-6 pb-6 mt-auto">
        <BundleAddToCart product={product} />
      </div>
    </div>
  );
}

export default async function BundlesPage() {
  let bundles: ShopifyProduct[] = [];
  try {
    bundles = await getProductsByTag("Bundle", 20);
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

        {/* Minimum sizes note */}
        <div
          className="flex items-start gap-3 px-5 md:px-10 py-4 text-sm"
          style={{ background: "var(--green-xlight)", borderBottom: "1px solid var(--green-light)" }}
        >
          <span className="text-base shrink-0 mt-0.5">📦</span>
          <p style={{ color: "var(--green-bio)" }}>
            <strong>Note:</strong> The packs are minimum sizes for delivery economy. If you need larger sizes, simply order individually and add to the cart.
          </p>
        </div>

        {/* Bundle grid */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 md:py-24">
          {bundles.length === 0 ? (
            <p className="text-center text-sm" style={{ color: "var(--text-black-soft)" }}>
              Bundles coming soon — <Link href="/contact" className="underline font-semibold">contact us</Link> to order.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
