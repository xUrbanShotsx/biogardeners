"use client";

import { useState, useEffect, useRef }       from "react";
import Link                                   from "next/link";
import { motion, AnimatePresence }            from "framer-motion";
import { ArrowLeft, ShoppingBag, ChevronDown, Star, Users, Truck, RotateCcw, ShieldCheck, Minus, Plus, Check } from "lucide-react";
import { ProductCard }                        from "@/components/product-card";
import { formatPrice }                        from "@/lib/utils";
import { useCart }                            from "@/lib/cart-context";
import type { ShopifyProduct }                from "@/lib/shopify";

/* ─── Static data ─────────────────────────────────────────────────── */

const VARIANTS: Record<string, { label: string; price: string }[]> = {
  "bio-bloom-fertiliser": [
    { label: "1 kg",            price: "34.95"  },
    { label: "2.5 kg",          price: "79.95"  },
    { label: "5 kg",            price: "149.95" },
  ],
  "terra-pro-soil-mix": [
    { label: "10 L",            price: "28.00"  },
    { label: "25 L",            price: "62.00"  },
  ],
  "deep-root-tonic": [
    { label: "250 ml",          price: "42.00"  },
    { label: "500 ml",          price: "79.00"  },
    { label: "1 L",             price: "149.00" },
  ],
  "season-starter-kit": [
    { label: "Standard bundle", price: "89.00"  },
  ],
};

const PRODUCT_DETAILS: Record<string, {
  benefits:    string[];
  howToUse:    string;
  ingredients: string;
  weight:      string;
}> = {
  "bio-bloom-fertiliser": {
    benefits:    [
      "Optimised NPK 8-12-6 ratio for flowering and fruiting",
      "Slow-release nitrogen with 90-day soil residue",
      "Chelated trace elements for rapid uptake",
      "Safe for vegetables, herbs, and ornamentals",
    ],
    howToUse:    "Apply 30g per m² into the top 5cm of soil before planting, or apply as a side-dress every 6–8 weeks. Water thoroughly after application.",
    ingredients: "Monoammonium phosphate, Potassium sulfate, Calcium nitrate, Magnesium sulfate, Iron EDTA, Manganese sulfate, Zinc sulfate, Humic acid (15%), Seaweed extract (5%)",
    weight:      "Available in 1kg, 2.5kg, 5kg",
  },
  "terra-pro-soil-mix": {
    benefits:    [
      "pH buffered to 6.2–6.8 for optimal nutrient availability",
      "45% coconut coir for superior water retention",
      "Volcanic basalt for long-term trace mineral release",
      "Wetting agent included for hydrophobic soil correction",
    ],
    howToUse:    "Use as a direct replacement for standard potting mix. For garden beds, blend 30% Terra Pro with existing soil. Refresh annually with a 5cm top-dressing.",
    ingredients: "Composted pine bark (40%), Coconut coir (35%), Perlite (15%), Volcanic basalt (5%), Dolomite lime, Wetting agent, Slow-release fertiliser charge",
    weight:      "Available in 10L, 25L",
  },
  "deep-root-tonic": {
    benefits:    [
      "Mycorrhizal fungi consortium — 5 species blend",
      "Humic acid complex improves cation exchange capacity",
      "Kelp-derived cytokinins stimulate root branching",
      "Concentrated — 1 bottle treats up to 100 plants",
    ],
    howToUse:    "Dilute 5ml per litre of water. Apply to root zone at transplanting, or as a monthly drench for established plants. Do not mix with chemical fungicides.",
    ingredients: "Glomus intraradices, Rhizophagus irregularis, Trichoderma harzianum, Humic acid (8%), Fulvic acid (3%), Ascophyllum nodosum extract (5%), Amino acids",
    weight:      "Available in 250ml, 500ml, 1L",
  },
  "season-starter-kit": {
    benefits:    [
      "Complete foundation system — everything to start strong",
      "Includes Bio Bloom (1kg), Terra Pro (10L), Deep Root Tonic (250ml)",
      "15% saving vs individual purchase",
      "Paired growing guide included",
    ],
    howToUse:    "Prepare beds with Terra Pro, treat transplants with Deep Root Tonic, then apply Bio Bloom after first 2 weeks of establishment.",
    ingredients: "See individual product pages for full ingredient lists.",
    weight:      "Kit weight approx. 12kg",
  },
};

const GALLERY_BG: Record<string, string[]> = {
  "bio-bloom-fertiliser": [
    "linear-gradient(140deg,#d4e9e2,#a8cfc0)",
    "linear-gradient(140deg,#c8e0d8,#9fc5b6)",
    "linear-gradient(140deg,#bcd8ce,#91b9a8)",
  ],
  "terra-pro-soil-mix": [
    "linear-gradient(140deg,#fdebc8,#f2d49a)",
    "linear-gradient(140deg,#fde5b8,#efcc88)",
    "linear-gradient(140deg,#fad89e,#e8c170)",
  ],
  "deep-root-tonic": [
    "linear-gradient(140deg,#dde8e0,#bcd5c8)",
    "linear-gradient(140deg,#d4e2dc,#afd0c0)",
    "linear-gradient(140deg,#c8dcd4,#a2c8b8)",
  ],
  "season-starter-kit": [
    "linear-gradient(140deg,#faf6ee,#ede4d0)",
    "linear-gradient(140deg,#f5f0e6,#e6dcc4)",
    "linear-gradient(140deg,#eeeadf,#dcd4b6)",
  ],
};

const REVIEWS = [
  { name: "Sarah M.", city: "Sydney",    rating: 5, text: "Visible results in just 8 days. Bio Bloom doubled my tomato yield.",        initial: "S", color: "#006241" },
  { name: "James T.", city: "Melbourne", rating: 5, text: "Finally a brand that explains every ingredient. Trust built immediately.",    initial: "J", color: "#00754A" },
  { name: "Helen R.", city: "Brisbane",  rating: 5, text: "Best potting mix I've ever used. Drainage is perfect, herbs are thriving.",  initial: "H", color: "#1E3932" },
  { name: "David K.", city: "Perth",     rating: 5, text: "New growth on every branch within two weeks. Incredible product.",           initial: "D", color: "#2b5148" },
];

/* ─── Sub-components ──────────────────────────────────────────────── */

function Stars({ count, size = 13 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size}
          fill={s <= count ? "var(--gold)" : "none"}
          stroke={s <= count ? "none" : "var(--input-border)"}
        />
      ))}
    </div>
  );
}

function ProductIllustration({ handle, label }: { handle: string; label: string }) {
  const labels: Record<string, { line1: string; line2: string; spec: string }> = {
    "bio-bloom-fertiliser": { line1: "Bio Bloom",      line2: "Fertiliser", spec: "1 kg · NPK 8-12-6"   },
    "terra-pro-soil-mix":   { line1: "Terra Pro",      line2: "Soil Mix",   spec: "10 L · pH 6.2–6.8"   },
    "deep-root-tonic":      { line1: "Deep Root",      line2: "Tonic",      spec: "500 ml · Mycorrhizal" },
    "season-starter-kit":   { line1: "Season Starter", line2: "Kit",        spec: "Bundle · 3 products"  },
  };
  const lbl = labels[handle] ?? { line1: "BioGardeners", line2: "Product", spec: label };

  return (
    <svg viewBox="0 0 280 360" xmlns="http://www.w3.org/2000/svg" className="w-48 lg:w-64 drop-shadow-2xl" aria-label={label}>
      <rect x="20" y="70" width="240" height="275" rx="14" fill="#1E3932" />
      <path d="M20 70 Q140 48 260 70 L260 105 Q140 83 20 105 Z" fill="#2b5148" opacity="0.6" />
      <path d="M90 70 Q90 32 130 32 Q140 32 140 46" fill="none" stroke="#2b5148" strokeWidth="8" strokeLinecap="round" />
      <path d="M190 70 Q190 32 150 32 Q140 32 140 46" fill="none" stroke="#2b5148" strokeWidth="8" strokeLinecap="round" />
      <rect x="38" y="118" width="204" height="196" rx="8" fill="white" opacity="0.96" />
      <circle cx="140" cy="160" r="30" fill="#006241" opacity="0.08" />
      <text x="140" y="154" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="11" fill="#006241" letterSpacing="2">BIO</text>
      <text x="140" y="170" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="11" fill="#006241" letterSpacing="2">GARDENERS</text>
      <text x="140" y="210" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="15" fill="#1E3932">{lbl.line1}</text>
      <text x="140" y="230" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="15" fill="#1E3932">{lbl.line2}</text>
      <rect x="38" y="244" width="204" height="2" fill="#00754A" opacity="0.30" />
      <text x="140" y="266" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="400" fontSize="10" fill="rgba(0,0,0,0.50)">{lbl.spec}</text>
      <rect x="38" y="278" width="204" height="18" fill="#006241" opacity="0.07" />
      <text x="140" y="291" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="9" fill="#006241" letterSpacing="1.5">AUSTRALIAN MADE · PRECISION FORMULA</text>
      <ellipse cx="140" cy="350" rx="100" ry="10" fill="rgba(0,0,0,0.07)" />
    </svg>
  );
}

/* ─── Main client component ───────────────────────────────────────── */

interface Props {
  product: ShopifyProduct;
  related: ShopifyProduct[];
  slug:    string;
}

export function ProductPageClient({ product, related, slug }: Props) {
  const details       = PRODUCT_DETAILS[slug];
  const variants      = VARIANTS[slug] ?? [{ label: "Standard", price: product.priceRange.minVariantPrice.amount }];
  const galleries     = GALLERY_BG[slug] ?? GALLERY_BG["bio-bloom-fertiliser"];
  const bundleItems   = related.slice(0, 2); // "Frequently bought together" = first 2 related

  const [activeVariant, setActiveVariant] = useState(0);
  const [activeGallery, setActiveGallery] = useState(0);
  const [quantity,      setQuantity]      = useState(1);
  const [openSection,   setOpenSection]   = useState<string | null>("benefits");
  const { addItem }                       = useCart();
  const [addState,      setAddState]      = useState<"idle" | "adding" | "added">("idle");
  const [stickyVisible, setStickyVisible] = useState(false);
  const [viewingCount,  setViewingCount]  = useState(8);
  const [stockLeft,     setStockLeft]     = useState(6);

  const addBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setViewingCount(Math.floor(Math.random() * 14) + 6);
    setStockLeft(Math.floor(Math.random() * 8) + 4);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (addBtnRef.current) observer.observe(addBtnRef.current);
    return () => observer.disconnect();
  }, []);

  const currentPrice = variants[activeVariant]?.price ?? product.priceRange.minVariantPrice.amount;
  const displayPrice = formatPrice(currentPrice);

  function handleAddToCart() {
    if (addState !== "idle") return;
    setAddState("adding");
    const variant = variants[activeVariant];
    addItem({
      id:      `${product.handle}-${activeVariant}`,
      handle:  product.handle,
      title:   product.title,
      variant: variant?.label ?? "Standard",
      price:   parseFloat(variant?.price ?? currentPrice),
      quantity,
    });
    setTimeout(() => setAddState("added"), 600);
    setTimeout(() => setAddState("idle"), 2200);
  }

  const sections = [
    { id: "benefits",    title: "Benefits"     },
    { id: "how-to-use",  title: "How to use"   },
    { id: "ingredients", title: "Ingredients"  },
    { id: "shipping",    title: "Shipping info" },
  ];

  const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

  return (
    <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

      {/* Breadcrumb */}
      <div style={{ background: "var(--green-house)" }} className="px-6 lg:px-10 py-3.5">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          <Link href="/products" className="flex items-center gap-1.5 hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
            <ArrowLeft size={13} />
            All Products
          </Link>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.90)" }}>{product.title}</span>
        </div>
      </div>

      {/* Product layout */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-6 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-16 mb-10 lg:mb-16">

          {/* Gallery */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="hidden sm:flex flex-col gap-2.5">
              {galleries.map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className="w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 shrink-0"
                  style={{
                    background: bg,
                    outline: activeGallery === i ? "2px solid var(--green-accent)" : "2px solid transparent",
                    outlineOffset: 2,
                  }}
                  aria-label={`View ${i + 1}`}
                >
                  <div className="w-full h-full flex items-center justify-center scale-75 opacity-80">
                    <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-8" aria-hidden="true">
                      <rect x="8" y="20" width="64" height="75" rx="4" fill="#1E3932" />
                      <rect x="14" y="36" width="52" height="52" rx="2" fill="white" opacity="0.9" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Main image */}
            <motion.div
              key={activeGallery}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className="flex-1 aspect-square flex items-center justify-center rounded-2xl overflow-hidden relative"
              style={{ background: galleries[activeGallery], boxShadow: "var(--shadow-card)" }}
            >
              <ProductIllustration handle={slug} label={product.title} />

              {/* Social proof bubble */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold"
                style={{ background: "rgba(30,57,50,0.85)", color: "#fff", backdropFilter: "blur(6px)" }}
              >
                <Users size={11} />
                {viewingCount} people viewing now
              </motion.div>
            </motion.div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease }}
          >
            {/* Tag */}
            {product.tags[0] && (
              <span
                className="inline-block mb-3 text-[10px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full"
                style={{ background: "var(--green-xlight)", color: "var(--green-house)" }}
              >
                {product.tags[0]}
              </span>
            )}

            {/* Title */}
            <h1
              className="font-bold mb-3"
              style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)", color: "var(--green-house)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              {product.title}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid var(--ceramic)" }}>
              <div className="flex items-center gap-1.5">
                <Stars count={5} size={14} />
                <span className="text-sm font-bold" style={{ color: "var(--text-black)" }}>4.9</span>
              </div>
              <span className="text-sm" style={{ color: "var(--text-black-soft)" }}>380 reviews</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "var(--green-xlight)", color: "var(--green-bio)" }}>
                Verified
              </span>
            </div>

            {/* Price */}
            <p className="font-bold mb-5" style={{ fontSize: "2rem", color: "var(--green-bio)" }}>
              {displayPrice}
              {activeVariant === 0 && variants.length > 1 && (
                <span className="text-sm font-normal ml-2" style={{ color: "var(--text-black-soft)" }}>from</span>
              )}
            </p>

            {/* Variant selector */}
            {variants.length > 1 && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2.5" style={{ color: "var(--text-black)" }}>
                  Size: <span style={{ color: "var(--green-bio)" }}>{variants[activeVariant].label}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={v.label}
                      onClick={() => setActiveVariant(i)}
                      className={`variant-pill${activeVariant === i ? " active" : ""}`}
                    >
                      {v.label}
                      {i === 0 && variants.length > 1 && (
                        <span className="ml-1.5 text-[10px] opacity-60">best value</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm mb-5 max-w-[48ch]" style={{ color: "var(--text-black-soft)", lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Stock urgency */}
            <div className="flex items-center gap-2 mb-5 text-sm font-semibold" style={{ color: "var(--red)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--red)" }} />
              Only {stockLeft} left in stock — order soon
            </div>

            {/* Quantity + Add to cart */}
            <div ref={addBtnRef} className="flex gap-3 mb-6">
              {/* Quantity stepper */}
              <div className="flex items-center rounded-full" style={{ border: "1.5px solid var(--input-border)" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center transition-colors duration-200 rounded-full"
                  aria-label="Decrease"
                >
                  <Minus size={14} style={{ color: "var(--text-black-soft)" }} />
                </button>
                <span className="w-8 text-center text-sm font-bold" aria-live="polite" style={{ color: "var(--text-black)" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center transition-colors duration-200 rounded-full"
                  aria-label="Increase"
                >
                  <Plus size={14} style={{ color: "var(--text-black-soft)" }} />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary flex-1 gap-2 text-base"
                style={{ padding: "14px 24px" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {addState === "idle" && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <ShoppingBag size={16} /> Add to cart
                    </motion.span>
                  )}
                  {addState === "adding" && (
                    <motion.span key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Adding…
                    </motion.span>
                  )}
                  {addState === "added" && (
                    <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Check size={16} /> Added to cart!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Truck,       label: "Free shipping",   sub: "Orders over $80"      },
                { icon: RotateCcw,   label: "30-day returns",  sub: "No questions asked"   },
                { icon: ShieldCheck, label: "Secure payment",  sub: "SSL encrypted"        },
                { icon: Star,        label: "4.9 / 5 rating",  sub: "380 verified reviews" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl p-3"
                  style={{ background: "var(--surface-alt)" }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--green-xlight)" }}>
                    <Icon size={13} style={{ color: "var(--green-accent)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "var(--text-black)" }}>{label}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-black-soft)" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Frequently bought together */}
        {bundleItems.length > 0 && (
          <section className="mb-16 rounded-2xl p-6 lg:p-8" style={{ background: "var(--surface-alt)" }} aria-labelledby="bundle-heading">
            <h2 id="bundle-heading" className="font-bold text-xl mb-6" style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}>
              Frequently bought together
            </h2>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Current product thumbnail */}
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: galleries[0], boxShadow: "var(--shadow-card)" }}
                >
                  <div className="w-full h-full flex items-center justify-center scale-75 opacity-80">
                    <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-10" aria-hidden="true">
                      <rect x="8" y="20" width="64" height="75" rx="4" fill="#1E3932" />
                      <rect x="14" y="36" width="52" height="52" rx="2" fill="white" opacity="0.9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>{product.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>{displayPrice}</p>
                </div>
              </div>

              {bundleItems.map((bp) => {
                const bpGalleries = GALLERY_BG[bp.handle] ?? GALLERY_BG["bio-bloom-fertiliser"];
                return (
                  <div key={bp.handle} className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: "var(--text-black-soft)" }}>+</span>
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: bpGalleries[0], boxShadow: "var(--shadow-card)" }}
                    >
                      <div className="w-full h-full flex items-center justify-center scale-75 opacity-80">
                        <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-10" aria-hidden="true">
                          <rect x="8" y="20" width="64" height="75" rx="4" fill="#1E3932" />
                          <rect x="14" y="36" width="52" height="52" rx="2" fill="white" opacity="0.9" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>{bp.title}</p>
                      <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>{formatPrice(bp.priceRange.minVariantPrice.amount)}</p>
                    </div>
                  </div>
                );
              })}

              <div className="lg:ml-auto shrink-0">
                <button className="btn btn-primary gap-2" style={{ fontSize: 14, padding: "12px 24px" }}>
                  <ShoppingBag size={15} />
                  Add bundle — save 10%
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Accordion */}
        {details && (
          <div className="max-w-2xl mb-16" style={{ borderTop: "1px solid var(--ceramic)" }}>
            {sections.map((sec) => (
              <div key={sec.id} style={{ borderBottom: "1px solid var(--ceramic)" }}>
                <button
                  onClick={() => setOpenSection(openSection === sec.id ? null : sec.id)}
                  className="w-full flex items-center justify-between py-5 text-left"
                  aria-expanded={openSection === sec.id}
                >
                  <span className="font-bold text-lg" style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>
                    {sec.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 shrink-0 ${openSection === sec.id ? "rotate-180" : ""}`}
                    style={{ color: "var(--text-black-soft)" }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openSection === sec.id && (
                    <motion.div
                      key={sec.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
                        {sec.id === "benefits" && details.benefits ? (
                          <ul className="flex flex-col gap-2.5">
                            {details.benefits.map((b) => (
                              <li key={b} className="flex items-start gap-2.5">
                                <Check size={14} className="mt-0.5 shrink-0" style={{ color: "var(--green-accent)" }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        ) : sec.id === "how-to-use" ? (
                          <p>{details.howToUse}</p>
                        ) : sec.id === "ingredients" ? (
                          <p>{details.ingredients}</p>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {[
                              { icon: Truck,       label: "Standard shipping", info: "3–5 business days · Free over $80, otherwise $8.95" },
                              { icon: ShoppingBag, label: "Express shipping",  info: "1–2 business days · $14.95"                         },
                              { icon: RotateCcw,   label: "Returns",           info: "30-day returns for unopened products. Contact us for damaged goods." },
                            ].map(({ icon: Icon, label, info }) => (
                              <div key={label} className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--green-xlight)" }}>
                                  <Icon size={13} style={{ color: "var(--green-accent)" }} />
                                </div>
                                <div>
                                  <p className="font-semibold text-xs mb-0.5" style={{ color: "var(--text-black)" }}>{label}</p>
                                  <p>{info}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        <section className="mb-16" aria-labelledby="pdp-reviews-heading">
          <h2
            id="pdp-reviews-heading"
            className="font-bold text-2xl lg:text-3xl mb-6"
            style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
          >
            Customer reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease }}
                className="rounded-2xl p-5"
                style={{ background: "var(--surface-alt)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Stars count={r.rating} size={13} />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--green-xlight)", color: "var(--green-bio)" }}>Verified</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-black)" }}>&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: r.color }}>
                    {r.initial}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-black)" }}>{r.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-black-soft)" }}>{r.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="font-bold text-2xl lg:text-3xl mb-8"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            >
              You might also need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky bottom bar — appears when add-to-cart scrolls out */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed bottom-0 inset-x-0 z-[150] lg:hidden"
            style={{ boxShadow: "var(--shadow-sticky)" }}
          >
            <div className="flex items-center gap-3 px-4 py-4" style={{ background: "#fff" }}>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "var(--text-black)" }}>{product.title}</p>
                <p className="text-sm font-bold" style={{ color: "var(--green-bio)" }}>{displayPrice}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary gap-2 shrink-0"
                style={{ fontSize: 14, padding: "12px 24px" }}
              >
                <ShoppingBag size={15} />
                Add to cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
