"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, TrendingUp, Check, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { DEMO_PRODUCTS } from "@/lib/shopify";

/* ─── Static data ─────────────────────────────────────────────────── */

const CATEGORIES: Record<string, string> = {
  "bio-bloom-fertiliser": "Fertilisers",
  "terra-pro-soil-mix":   "Soil",
  "deep-root-tonic":      "Tonics",
  "season-starter-kit":   "Bundles",
};

const BG_COLORS: Record<string, string> = {
  "bio-bloom-fertiliser": "linear-gradient(140deg, #d4e9e2 0%, #b0d0c4 100%)",
  "terra-pro-soil-mix":   "linear-gradient(140deg, #fdebc8 0%, #f2d49a 100%)",
  "deep-root-tonic":      "linear-gradient(140deg, #dde8e0 0%, #bcd5c8 100%)",
  "season-starter-kit":   "linear-gradient(140deg, #1E3932 0%, #2b5148 100%)",
};

const VARIANTS: Record<string, { label: string; price: number }[]> = {
  "bio-bloom-fertiliser": [
    { label: "1 kg",           price: 34.95  },
    { label: "2.5 kg",         price: 79.95  },
    { label: "5 kg",           price: 149.95 },
  ],
  "terra-pro-soil-mix": [
    { label: "10 L",           price: 28.00  },
    { label: "25 L",           price: 62.00  },
  ],
  "deep-root-tonic": [
    { label: "250 ml",         price: 42.00  },
    { label: "500 ml",         price: 79.00  },
    { label: "1 L",            price: 149.00 },
  ],
  "season-starter-kit": [
    { label: "Complete bundle", price: 89.00 },
  ],
};

const SPEC_LINE: Record<string, string> = {
  "bio-bloom-fertiliser": "NPK 8-12-6 · Slow-release nitrogen",
  "terra-pro-soil-mix":   "pH 6.2–6.8 · Coconut coir blend",
  "deep-root-tonic":      "Mycorrhizal fungi · Humic acid",
  "season-starter-kit":   "Bio Bloom + Terra Pro + Deep Root",
};

const RATINGS: Record<string, { avg: number; count: number }> = {
  "bio-bloom-fertiliser": { avg: 4.9, count: 184 },
  "terra-pro-soil-mix":   { avg: 4.8, count: 97  },
  "deep-root-tonic":      { avg: 4.9, count: 61  },
  "season-starter-kit":   { avg: 5.0, count: 38  },
};

const BADGE: Record<string, string> = {
  "bio-bloom-fertiliser": "Bestseller",
  "terra-pro-soil-mix":   "New",
  "deep-root-tonic":      "Popular",
  "season-starter-kit":   "Best Value",
};

const SOLD: Record<string, string> = {
  "bio-bloom-fertiliser": "142 this month",
  "terra-pro-soil-mix":   "89 this month",
  "deep-root-tonic":      "73 this month",
  "season-starter-kit":   "38 this month",
};

const FILTER_LABELS = ["All", "Fertilisers", "Soil", "Tonics", "Bundles"];

/* ─── Product illustration (SVG) ──────────────────────────────────── */

function ProductVisual({ handle }: { handle: string }) {
  const labels: Record<string, { line1: string; line2: string; spec: string }> = {
    "bio-bloom-fertiliser": { line1: "Bio Bloom",      line2: "Fertiliser",  spec: "1 kg · NPK 8-12-6"   },
    "terra-pro-soil-mix":   { line1: "Terra Pro",      line2: "Soil Mix",    spec: "10 L · pH 6.2–6.8"   },
    "deep-root-tonic":      { line1: "Deep Root",      line2: "Tonic",       spec: "500 ml · Mycorrhizal" },
    "season-starter-kit":   { line1: "Season Starter", line2: "Kit",         spec: "Bundle · 3 products"  },
  };
  const lbl = labels[handle] ?? { line1: "BioGardeners", line2: "Product", spec: "" };
  const isBundle = handle === "season-starter-kit";

  if (isBundle) {
    return (
      <div className="w-full h-full flex items-center justify-center gap-2 px-4">
        {["Bio Bloom", "Terra Pro", "Deep Root"].map((name, i) => (
          <svg
            key={name}
            viewBox="0 0 120 160"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
            style={{ width: `${i === 1 ? 44 : 36}%`, opacity: i === 1 ? 1 : 0.8 }}
            aria-hidden="true"
          >
            <rect x="10" y="30" width="100" height="120" rx="8" fill="rgba(255,255,255,0.15)" />
            <rect x="10" y="30" width="100" height="120" rx="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <path d="M38 30 Q38 14 60 14 Q82 14 82 30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" strokeLinecap="round" />
            <rect x="20" y="56" width="80" height="76" rx="5" fill="white" opacity="0.92" />
            <text x="60" y="74" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="6" fill="#006241" letterSpacing="1">BIOGARDENERS</text>
            <text x="60" y="92" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="8" fill="#1E3932">{name.split(" ")[0]}</text>
            <text x="60" y="104" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="8" fill="#1E3932">{name.split(" ")[1]}</text>
            <rect x="20" y="110" width="80" height="1.5" fill="#00754A" opacity="0.25" />
            <text x="60" y="124" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="600" fontSize="6" fill="#006241" letterSpacing="0.8">AUSTRALIAN MADE</text>
            <ellipse cx="60" cy="152" rx="38" ry="5" fill="rgba(0,0,0,0.09)" />
          </svg>
        ))}
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
        <text x="100" y="148" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="11" fill="#1E3932">{lbl.line1}</text>
        <text x="100" y="163" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="11" fill="#1E3932">{lbl.line2}</text>
        <rect x="34" y="173" width="132" height="2.5" rx="1" fill="#00754A" opacity="0.35" />
        <text x="100" y="194" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="400" fontSize="8" fill="rgba(0,0,0,0.50)">{lbl.spec}</text>
        <rect x="34" y="203" width="132" height="12" fill="#006241" opacity="0.07" />
        <text x="100" y="212" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="600" fontSize="7" fill="#006241" letterSpacing="1.2">AUSTRALIAN MADE</text>
        <ellipse cx="100" cy="248" rx="60" ry="8" fill="rgba(0,0,0,0.07)" />
      </svg>
    </div>
  );
}

/* ─── Quick Pick Card ──────────────────────────────────────────────── */

function QuickPickCard({ handle, title, description, index }: {
  handle: string;
  title: string;
  description: string;
  index: number;
}) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addState, setAddState] = useState<"idle" | "added">("idle");

  const variants = VARIANTS[handle] ?? [{ label: "Standard", price: 0 }];
  const variant  = variants[selectedVariant];
  const rating   = RATINGS[handle];
  const badge    = BADGE[handle];
  const sold     = SOLD[handle];
  const isBundle = handle === "season-starter-kit";
  const spec     = SPEC_LINE[handle];

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id:      `${handle}-v${selectedVariant}`,
      handle,
      title,
      variant: variant.label,
      price:   variant.price,
    });
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
      style={{
        boxShadow: "var(--shadow-card)",
        background: "#fff",
      }}
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
          <ProductVisual handle={handle} />

          {/* Badge top-left */}
          <span
            className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
            style={{
              background: isBundle ? "var(--gold)" : "var(--green-house)",
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
                  background:   selectedVariant === i ? "var(--green-house)" : "var(--ceramic)",
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
              background: addState === "added" ? "var(--green-accent)" : "var(--green-house)",
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

export function ProductsClient() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = DEMO_PRODUCTS.filter((p) => {
    if (activeFilter === "All") return true;
    return CATEGORIES[p.handle] === activeFilter;
  });

  return (
    <>
      {/* Page header */}
      <div style={{ background: "var(--green-house)", paddingTop: "3.5rem", paddingBottom: "3rem" }}>
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
                    background: activeFilter === label ? "var(--green-house)" : "transparent",
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
            {filtered.map((p, i) => (
              <QuickPickCard
                key={p.handle}
                handle={p.handle}
                title={p.title}
                description={p.description}
                index={i}
              />
            ))}
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

      {/* Bundle promo strip — always shown at bottom */}
      {(activeFilter === "All" || activeFilter === "Bundles") && (
        <div
          className="border-t"
          style={{ background: "var(--green-xlight)", borderColor: "var(--ceramic)" }}
        >
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-14">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--green-house)" }}
                >
                  <Package size={22} color="#fff" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight mb-1" style={{ color: "var(--green-house)" }}>
                    New to BioGardeners?
                  </p>
                  <p className="text-sm max-w-sm" style={{ color: "var(--text-black-soft)", lineHeight: 1.6 }}>
                    Start with the Season Starter Kit — Bio Bloom, Terra Pro, and Deep Root bundled at 15% off. Everything your garden needs.
                  </p>
                </div>
              </div>
              <Link
                href="/products/season-starter-kit"
                className="btn btn-primary shrink-0"
                style={{ padding: "11px 24px", fontSize: 14 }}
              >
                <ShoppingBag size={15} />
                View Starter Kit — $89
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
