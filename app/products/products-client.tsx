"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, TrendingUp, Check, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAi }  from "@/lib/ai-context";
import { type ShopifyProduct } from "@/lib/shopify";

/* ─── Static data ─────────────────────────────────────────────────── */

const CATEGORIES: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":             "Fertilisers",
  "lawn-fertilizer-premium-granulated-concentrated": "Fertilisers",
  "volcanic-dust-trace-elements":                  "Fertilisers",
  "soil-health-conditioner-powder":                "Fertilisers",
  "liquid-npk-fertilizer":                         "Fertilisers",
  "glacial-milk":                                  "Fertilisers",
  "soil-health-conditioner":                       "Fertilisers",
  "plant-spray":                                   "Disease Control",
  "penetrator":                                    "Supplements",
};

const BG_COLORS: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":             "#fdf9f6",
  "lawn-fertilizer-premium-granulated-concentrated": "#fdf9f6",
  "volcanic-dust-trace-elements":                  "#fdf9f6",
  "soil-health-conditioner-powder":                "#fdf9f6",
  "liquid-npk-fertilizer":                         "#fdf9f6",
  "glacial-milk":                                  "#fdf9f6",
  "soil-health-conditioner":                       "#fdf9f6",
  "plant-spray":                                   "#fdf9f6",
  "penetrator":                                    "#fdf9f6",
};

const VARIANTS: Record<string, { label: string; price: number }[]> = {
  "gp-fertiliser-premium-garden-lawn": [
    { label: "5 KG",  price: 17.00 },
    { label: "12 KG", price: 36.00 },
    { label: "20 KG", price: 50.00 },
  ],
  "lawn-fertilizer-premium-granulated-concentrated": [
    { label: "1 Pack", price: 35.00 },
    { label: "2 Pack", price: 60.00 },
  ],
};

const SPEC_LINE: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":             "Volcanic Minerals · Meat & Bone Meal",
  "lawn-fertilizer-premium-granulated-concentrated": "Granulated · Slow-Release · Concentrated",
  "volcanic-dust-trace-elements":                  "60+ Trace Elements · Natural Volcanic",
  "soil-health-conditioner-powder":                "Powder · Microbial Boost · All Soils",
  "liquid-npk-fertilizer":                         "Liquid · Fast-Acting · NPK Balanced",
  "glacial-milk":                                  "Glacial Rock Flour · Silica · Trace Minerals",
  "soil-health-conditioner":                       "Liquid · Microbial · Water Retention",
  "plant-spray":                                   "Disease Control · Ready to Use",
  "penetrator":                                    "Soil Wetter · Penetrating Agent",
};

const RATINGS: Record<string, { avg: number; count: number }> = {
  "gp-fertiliser-premium-garden-lawn":             { avg: 4.9, count: 142 },
  "lawn-fertilizer-premium-granulated-concentrated": { avg: 4.8, count: 89  },
  "volcanic-dust-trace-elements":                  { avg: 5.0, count: 34  },
  "soil-health-conditioner-powder":                { avg: 4.8, count: 27  },
  "liquid-npk-fertilizer":                         { avg: 4.9, count: 53  },
  "glacial-milk":                                  { avg: 4.9, count: 41  },
  "soil-health-conditioner":                       { avg: 4.8, count: 38  },
  "plant-spray":                                   { avg: 4.7, count: 62  },
  "penetrator":                                    { avg: 4.9, count: 48  },
};

const BADGE: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":             "Bestseller",
  "lawn-fertilizer-premium-granulated-concentrated": "Popular",
  "volcanic-dust-trace-elements":                  "New",
  "soil-health-conditioner-powder":                "New",
  "liquid-npk-fertilizer":                         "Popular",
  "glacial-milk":                                  "New",
  "soil-health-conditioner":                       "Popular",
  "plant-spray":                                   "Bestseller",
  "penetrator":                                    "Popular",
};

const SOLD: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":             "98 this month",
  "lawn-fertilizer-premium-granulated-concentrated": "74 this month",
  "volcanic-dust-trace-elements":                  "31 this month",
  "soil-health-conditioner-powder":                "44 this month",
  "liquid-npk-fertilizer":                         "67 this month",
  "glacial-milk":                                  "29 this month",
  "soil-health-conditioner":                       "52 this month",
  "plant-spray":                                   "83 this month",
  "penetrator":                                    "58 this month",
};

const FILTER_LABELS = ["All", "Fertilisers", "Disease Control", "Supplements"];

/* ─── Product illustration (SVG) ──────────────────────────────────── */

function ProductVisual({ handle, imageUrl, imageAlt }: { handle: string; imageUrl?: string; imageAlt?: string }) {
  if (imageUrl) {
    return (
      <div className="w-full h-full relative">
        <Image
          src={imageUrl}
          alt={imageAlt ?? handle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-6"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="w-28 h-auto drop-shadow-lg" aria-hidden="true">
        <rect x="20" y="50" width="160" height="195" rx="10" fill="#1E3932" />
        <path d="M65 50 Q65 22 100 22 Q135 22 135 50" fill="none" stroke="#1E3932" strokeWidth="6" strokeLinecap="round" />
        <rect x="34" y="90" width="132" height="130" rx="6" fill="white" opacity="0.95" />
        <text x="100" y="118" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="8" fill="#006241" letterSpacing="1.5">BIOGARDENERS</text>
        <rect x="34" y="121" width="132" height="1.5" fill="#006241" opacity="0.14" />
        <text x="100" y="163" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="11" fill="#1E3932">BioGardeners</text>
        <ellipse cx="100" cy="248" rx="60" ry="8" fill="rgba(0,0,0,0.07)" />
      </svg>
    </div>
  );
}

/* ─── Quick Pick Card ──────────────────────────────────────────────── */

function QuickPickCard({ handle, title, description, index, shopifyVariants, shopifyVariantIds, basePrice, imageUrl, imageAlt }: {
  handle: string;
  title: string;
  description: string;
  index: number;
  shopifyVariants: { label: string; price: number }[];
  shopifyVariantIds: string[];
  basePrice: number;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const { addItem } = useCart();
  const { showCartMessage, setHoveredProduct, setHoveredRect } = useAi();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addState, setAddState] = useState<"idle" | "added">("idle");
  const [hovered, setHovered] = useState(false);

  const variants = VARIANTS[handle] ?? shopifyVariants;
  const variant  = variants[selectedVariant] ?? { label: "Standard", price: basePrice };
  const rating   = RATINGS[handle];
  const badge    = BADGE[handle];
  const sold     = SOLD[handle];
  const isBundle = false;
  const spec     = SPEC_LINE[handle];

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id:      shopifyVariantIds[selectedVariant] ?? shopifyVariantIds[0] ?? `${handle}-v${selectedVariant}`,
      handle,
      title,
      variant: variant.label,
      price:   variant.price,
    });
    showCartMessage(handle, title, []);
    setAddState("added");
    setTimeout(() => setAddState("idle"), 1800);
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col rounded-[var(--radius-card)] overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)", background: "#fff" }}
      onMouseEnter={(e) => {
        setHovered(true);
        setHoveredProduct({ handle, title });
        const r = e.currentTarget.getBoundingClientRect();
        setHoveredRect({ top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
      }}
      onMouseLeave={() => { setHovered(false); setHoveredProduct(null); }}
    >
      {/* Image area */}
      <Link href={`/products/${handle}`} className="block">
        <div
          className="relative w-full overflow-hidden"
          style={{
            background: BG_COLORS[handle],
            aspectRatio: isBundle ? "16/9" : "4/4.2",
          }}
        >
          <ProductVisual handle={handle} imageUrl={imageUrl} imageAlt={imageAlt} />

          {/* Badge top-left */}
          <span
            className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
            style={{
              background: isBundle ? "var(--gold)" : "var(--green-accent)",
              color: "#fff",
            }}
          >
            {badge}
          </span>

          {/* Sold chip bottom-left */}
          {sold && (
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(30,57,50,0.85)", color: "#fff", backdropFilter: "blur(4px)" }}
            >
              <TrendingUp size={9} />
              {sold}
            </div>
          )}

          {/* Bundle save badge */}
          {isBundle && (
            <div
              className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "var(--green-accent)", color: "#fff" }}
            >
              Save 15%
            </div>
          )}

        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={10}
                  fill={s <= Math.round(rating.avg) ? "var(--gold)" : "none"}
                  stroke={s <= Math.round(rating.avg) ? "none" : "var(--input-border)"}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold" style={{ color: "var(--text-black-soft)" }}>
              {rating.avg} <span className="font-normal">({rating.count})</span>
            </span>
          </div>
        )}

        {/* Title + spec */}
        <Link href={`/products/${handle}`} className="group/link">
          <h3
            className="font-bold text-base leading-tight mb-0.5 group-hover/link:underline"
            style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}
          >
            {title}
          </h3>
          <p className="text-xs mb-3" style={{ color: "var(--text-black-soft)" }}>
            {spec}
          </p>
        </Link>

        {/* Variant size pills */}
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="Select size">
            {variants.map((v, i) => (
              <button
                key={v.label}
                onClick={() => setSelectedVariant(i)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-150"
                style={{
                  background:   selectedVariant === i ? "var(--green-accent)" : "var(--ceramic)",
                  color:        selectedVariant === i ? "#fff" : "var(--text-black)",
                  boxShadow:    selectedVariant === i ? "0 0 0 2px var(--green-house)" : "none",
                }}
                aria-pressed={selectedVariant === i}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Price + Add row — pushes to bottom */}
        <div className="mt-auto flex items-center gap-3">
          <div className="flex-1">
            <span className="text-xl font-bold" style={{ color: "var(--green-bio)", letterSpacing: "-0.02em" }}>
              ${variant.price.toFixed(2)}
            </span>
            {isBundle && (
              <span className="ml-2 text-xs line-through" style={{ color: "var(--text-black-soft)" }}>
                $104.95
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 font-bold rounded-full transition-all duration-200"
            style={{
              background: addState === "added" ? "var(--green-accent)" : "var(--green-accent)",
              color:      "#fff",
              fontSize:   13,
              padding:    "9px 18px",
              minWidth:   96,
              boxShadow:  "0 2px 8px rgba(30,57,50,0.25)",
            }}
            aria-label={`Add ${title} – ${variant.label} to cart`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {addState === "added" ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check size={13} strokeWidth={2.5} />
                  Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <ShoppingBag size={13} />
                  Add
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* View details footer */}
      <Link
        href={`/products/${handle}`}
        className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors duration-150"
        style={{
          borderTop: "1px solid var(--ceramic)",
          color: "var(--green-bio)",
          background: "var(--surface-alt)",
        }}
      >
        <span>View full details</span>
        <ArrowRight size={12} />
      </Link>
    </motion.article>
  );
}

/* ─── Main client component ────────────────────────────────────────── */

export function ProductsClient({ products }: { products: ShopifyProduct[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = products.filter((p) => {
    if (activeFilter === "All") return true;
    return CATEGORIES[p.handle] === activeFilter;
  });

  return (
    <>
      {/* Page header */}
      <div style={{ background: "var(--green-accent)", paddingTop: "3.5rem", paddingBottom: "3rem" }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              color: "#fff",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              textWrap: "balance",
            }}
          >
            Shop the range
          </h1>
          <p className="text-base max-w-md" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            Select a size, add to cart — no detours needed.
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div
        className="sticky z-[50] border-b"
        style={{
          top: "var(--nav-h)",
          background: "#fff",
          borderColor: "var(--ceramic)",
          boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none" style={{ scrollbarWidth: "none" }}>
              {FILTER_LABELS.map((label) => (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className="whitespace-nowrap text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-200 shrink-0"
                  style={{
                    background: activeFilter === label ? "var(--green-accent)" : "transparent",
                    color:      activeFilter === label ? "#fff" : "var(--text-black-soft)",
                    boxShadow:  activeFilter === label ? "none" : "inset 0 0 0 1px var(--input-border)",
                  }}
                  aria-pressed={activeFilter === label}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Product count */}
            <span
              className="text-sm shrink-0"
              style={{ color: "var(--text-black-soft)" }}
              aria-live="polite"
            >
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
        <motion.div
          layout
          className="grid gap-5 md:gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const firstImg = p.images.edges[0]?.node;
              return (
              <QuickPickCard
                key={p.handle}
                handle={p.handle}
                title={p.title}
                description={p.description}
                index={i}
                shopifyVariants={p.variants.edges.map((e) => ({
                  label: e.node.title,
                  price: parseFloat(e.node.price.amount),
                }))}
                shopifyVariantIds={p.variants.edges.map((e) => e.node.id)}
                basePrice={parseFloat(p.priceRange.minVariantPrice.amount)}
                imageUrl={firstImg?.url}
                imageAlt={firstImg?.altText ?? p.title}
              />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold" style={{ color: "var(--text-black-soft)" }}>
              No products in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t" style={{ background: "var(--green-xlight)", borderColor: "var(--ceramic)" }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--green-accent)" }}>
                <Package size={22} color="#fff" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight mb-1" style={{ color: "var(--green-accent)" }}>
                  100% Australian owned and made
                </p>
                <p className="text-sm max-w-sm" style={{ color: "var(--text-black-soft)", lineHeight: 1.6 }}>
                  Natural volcanic minerals, meat and bone meal, and essential trace elements — premium inputs for healthier plants from the ground up.
                </p>
              </div>
            </div>
            <Link href="/growing-guides" className="btn btn-primary shrink-0" style={{ padding: "11px 24px", fontSize: 14 }}>
              Growing guides
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
