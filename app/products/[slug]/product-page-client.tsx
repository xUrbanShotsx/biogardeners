"use client";

import { useState, useEffect, useRef }       from "react";
import Link                                   from "next/link";
import Image                                  from "next/image";
import { motion, AnimatePresence }            from "framer-motion";
import { ArrowLeft, ShoppingBag, ChevronDown, Star, Users, Truck, RotateCcw, ShieldCheck, Minus, Plus, Check } from "lucide-react";
import { ProductCard }                        from "@/components/product-card";
import { formatPrice }                        from "@/lib/utils";
import { useCart }                            from "@/lib/cart-context";
import { useAi }                             from "@/lib/ai-context";
import type { ShopifyProduct }                from "@/lib/shopify";

/* ─── Static data ─────────────────────────────────────────────────── */

const VARIANTS: Record<string, { label: string; price: string }[]> = {
  "gp-fertiliser-premium-garden-lawn": [
    { label: "5 KG",  price: "17.00" },
    { label: "12 KG", price: "36.00" },
    { label: "20 KG", price: "50.00" },
  ],
  "lawn-fertilizer-premium-granulated-concentrated": [
    { label: "1 Pack", price: "35.00" },
    { label: "2 Pack", price: "60.00" },
  ],
};

const PRODUCT_DETAILS: Record<string, {
  benefits:    string[];
  howToUse:    string;
  ingredients: string;
  weight:      string;
}> = {
  "gp-fertiliser-premium-garden-lawn": {
    benefits:    [
      "One fertiliser for your entire garden — lawns, fruit trees, vegetables, flowers, pot plants and natives",
      "Improves soil health and encourages strong, healthy growth",
      "Fast results with no unpleasant smells — easy to spread",
      "Made with natural volcanic minerals, meat and bone meal, and essential trace elements",
    ],
    howToUse:    "Apply evenly to soil surface and water in thoroughly. For lawns, apply 100g per m². For garden beds and pots, work into the top 5cm of soil before planting or as a top dress. Reapply every 6–8 weeks during the growing season.",
    ingredients: "Natural volcanic minerals, Meat and bone meal, Essential nutrients and trace elements. 100% Australian owned and made.",
    weight:      "Available in 5KG, 12KG, 20KG",
  },
  "lawn-fertilizer-premium-granulated-concentrated": {
    benefits:    [
      "Concentrated formula — a little goes a long way",
      "Slow-release granules feed your lawn for months",
      "Promotes thick, green growth and deep root development",
      "Easy to spread with no unpleasant smells",
    ],
    howToUse:    "Apply 50g per m² to lawn surface using a spreader or by hand. Water thoroughly after application. Apply every 8–10 weeks during the growing season for best results. Avoid applying in extreme heat.",
    ingredients: "Concentrated granulated fertiliser blend. Slow-release nitrogen, phosphorus and potassium with essential trace elements. 100% Australian made.",
    weight:      "Available as 1 Pack or 2 Pack (save $10)",
  },
  "volcanic-dust-trace-elements": {
    benefits:    [
      "Over 60 naturally occurring trace elements and minerals",
      "Remineralises depleted soils and restores soil biology",
      "Improves microbial activity and overall soil health",
      "Slow-release — a single application lasts for months",
    ],
    howToUse:    "Apply 100–200g per m² and work into the top 10cm of soil, or use as a top dress and water in. Can be mixed into potting mix at 10% by volume. Safe for all plants, lawns, and vegetables.",
    ingredients: "100% natural volcanic basalt dust. Contains silicon, calcium, magnesium, iron, manganese, zinc, copper, boron, and 50+ additional trace minerals. No additives.",
    weight:      "See product listing for available sizes",
  },
  "soil-health-conditioner-powder": {
    benefits:    [
      "Improves soil structure and aeration in all soil types",
      "Boosts beneficial microbial populations for long-term fertility",
      "Enhances nutrient availability and uptake by plant roots",
      "Easy to apply — mixes directly into soil or potting mix",
    ],
    howToUse:    "Mix 50–100g per m² into the top 10cm of soil before planting, or apply as a top dress and water in. Can be added directly to potting mix at 5–10% by volume. Apply every season for best results.",
    ingredients: "Natural mineral complex, biological soil stimulants, humic substances, trace elements. 100% Australian made.",
    weight:      "See product listing for available sizes",
  },
  "liquid-npk-fertilizer": {
    benefits:    [
      "Balanced NPK formula for rapid, visible growth results",
      "Liquid delivery for fast root and foliar uptake",
      "Suitable for all plants, vegetables, lawns, and fruit trees",
      "Ideal for regular feeding programs or quick green-up",
    ],
    howToUse:    "Dilute as directed on the label and apply to the root zone or as a foliar spray. For lawns, apply via hose-end sprayer or watering can. Water in after application. Apply every 2–4 weeks during the growing season.",
    ingredients: "Soluble nitrogen, phosphorus, potassium, and trace elements in liquid concentrate. See label for full analysis.",
    weight:      "See product listing for available sizes",
  },
  "glacial-milk": {
    benefits:    [
      "Ultra-fine glacial rock flour rich in silica and trace minerals",
      "Strengthens plant cell walls and improves drought tolerance",
      "Remineralises soils with slow-release natural minerals",
      "Improves soil structure and water-holding capacity",
    ],
    howToUse:    "Apply 200g per m² and work into the top 10cm of soil, or mix into potting mix at 10% by volume. Can also be used as a foliar spray when diluted. Safe for all plants, vegetables, and lawns.",
    ingredients: "100% natural glacial rock flour. Rich in silica, calcium, magnesium, and a wide spectrum of trace minerals. No additives or fillers.",
    weight:      "See product listing for available sizes",
  },
  "soil-health-conditioner": {
    benefits:    [
      "Feeds beneficial soil microbes for long-term soil health",
      "Improves water retention and reduces watering frequency",
      "Breaks up compacted soils and improves aeration",
      "Works synergistically with all BioGardeners fertilisers",
    ],
    howToUse:    "Dilute as directed and apply to the root zone using a watering can or hose-end sprayer. Use every 4–6 weeks as part of a regular soil maintenance program. Can be combined with fertiliser applications.",
    ingredients: "Liquid humic and fulvic acid complex, biological soil stimulants, seaweed extract, trace elements. 100% natural.",
    weight:      "See product listing for available sizes",
  },
  "plant-spray": {
    benefits:    [
      "Protects against common fungal diseases and pest damage",
      "Ready-to-use — no mixing or dilution required",
      "Safe for edibles, vegetables, and ornamentals when used as directed",
      "Strengthens plant natural defences against environmental stress",
    ],
    howToUse:    "Spray directly onto affected plant surfaces, ensuring full coverage of leaves — top and bottom. Apply in the morning or evening, avoiding hot conditions. Repeat every 7–14 days or as needed. Do not spray in direct sunlight.",
    ingredients: "Active botanical and mineral complex. Biodegradable formula. Safe for beneficial insects when dry. See label for full active ingredient list.",
    weight:      "See product listing for available sizes",
  },
  "penetrator": {
    benefits:    [
      "Breaks through hydrophobic and water-repellent soils",
      "Improves water and nutrient infiltration to the root zone",
      "Reduces run-off and dry patch in lawns and garden beds",
      "Works quickly — visible improvement after first application",
    ],
    howToUse:    "Dilute as directed and apply to the target area using a watering can or hose-end sprayer. For severe dry patches, apply and repeat after 7 days. Use regularly throughout the growing season to maintain soil wettability.",
    ingredients: "Non-ionic surfactant blend, soil penetrating agents, plant-safe wetting compounds. Biodegradable formula.",
    weight:      "See product listing for available sizes",
  },
};

const GALLERY_BG: Record<string, string[]> = {
  "gp-fertiliser-premium-garden-lawn":               ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "lawn-fertilizer-premium-granulated-concentrated": ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "volcanic-dust-trace-elements":                    ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "soil-health-conditioner-powder":                  ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "liquid-npk-fertilizer":                           ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "glacial-milk":                                    ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "soil-health-conditioner":                         ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "plant-spray":                                     ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
  "penetrator":                                      ["#fdf9f6", "#fdf9f6", "#fdf9f6"],
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
    "gp-fertiliser-premium-garden-lawn":             { line1: "GP Fertiliser",   line2: "Garden / Lawn",   spec: "5 kg · 12 kg · 20 kg"    },
    "lawn-fertilizer-premium-granulated-concentrated": { line1: "Lawn Fertilizer", line2: "Concentrated",    spec: "Granulated · Slow-Release"},
    "volcanic-dust-trace-elements":                  { line1: "Volcanic Dust",   line2: "Trace Elements",  spec: "60+ Natural Minerals"     },
    "soil-health-conditioner-powder":                { line1: "Soil Health",     line2: "Conditioner",     spec: "Powder · Microbial Boost" },
    "liquid-npk-fertilizer":                         { line1: "Liquid NPK",      line2: "Fertilizer",      spec: "Fast-Acting · Balanced"   },
    "glacial-milk":                                  { line1: "Glacial Milk",    line2: "Rock Flour",      spec: "Silica · Trace Minerals"  },
    "soil-health-conditioner":                       { line1: "Soil Health",     line2: "Conditioner",     spec: "Liquid · Microbial"       },
    "plant-spray":                                   { line1: "Plant Spray",     line2: "Disease Control", spec: "Ready to Use"             },
    "penetrator":                                    { line1: "Penetrator",      line2: "Soil Wetter",     spec: "Wetting Agent"            },
  };
  const lbl = labels[handle] ?? { line1: "BioGardeners", line2: "Product", spec: label };

  return (
    <svg viewBox="0 0 280 360" xmlns="http://www.w3.org/2000/svg" className="w-36 lg:w-48 drop-shadow-2xl" aria-label={label}>
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
  const shopifyVarIds = product.variants.edges.map((e) => e.node.id);
  const shopifyVars   = product.variants.edges.map((e) => ({ label: e.node.title, price: e.node.price.amount }));
  const variants      = VARIANTS[slug] ?? (shopifyVars.length ? shopifyVars : [{ label: "Standard", price: product.priceRange.minVariantPrice.amount }]);
  const galleries     = GALLERY_BG[slug] ?? GALLERY_BG["gp-fertiliser-premium-garden-lawn"];
  const shopifyImages = product.images.edges.map((e) => e.node);
  const hasImages     = shopifyImages.length > 0;
  const bundleItems   = related.slice(0, 2); // "Frequently bought together" = first 2 related

  const [activeVariant, setActiveVariant] = useState(0);
  const [activeGallery, setActiveGallery] = useState(0);
  const [quantity,      setQuantity]      = useState(1);
  const [openSection,   setOpenSection]   = useState<string | null>("benefits");
  const { addItem }                       = useCart();
  const { showCartMessage }               = useAi();
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
      id:      shopifyVarIds[activeVariant] ?? product.variants.edges[activeVariant]?.node.id ?? product.id,
      handle:  product.handle,
      title:   product.title,
      variant: variant?.label ?? "Standard",
      price:   parseFloat(variant?.price ?? currentPrice),
      quantity,
    });
    showCartMessage(product.handle, product.title, []);
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
        <div className="grid grid-cols-1 lg:grid-cols-[44fr_56fr] gap-6 lg:gap-14 mb-6 lg:mb-8 items-start">

          {/* Gallery */}
          <div className="flex gap-3 self-stretch">
            {/* Thumbnails — show only if multiple images */}
            {(hasImages ? shopifyImages.length : galleries.length) > 1 && (
              <div className="hidden sm:flex flex-col gap-2.5">
                {(hasImages ? shopifyImages : galleries).map((item, i) => {
                  const isImg = hasImages && typeof item === "object" && "url" in item;
                  const bg    = !isImg ? (item as string) : (galleries[i] ?? galleries[0]);
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveGallery(i)}
                      className="w-14 h-14 rounded-xl overflow-hidden transition-all duration-200 shrink-0 relative"
                      style={{
                        background:    bg,
                        outline:       activeGallery === i ? "2px solid var(--green-accent)" : "2px solid transparent",
                        outlineOffset: 2,
                      }}
                      aria-label={`View image ${i + 1}`}
                    >
                      {isImg ? (
                        <Image
                          src={(item as { url: string }).url}
                          alt={(item as { altText: string | null }).altText ?? product.title}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center scale-75 opacity-80">
                          <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-8" aria-hidden="true">
                            <rect x="8" y="20" width="64" height="75" rx="4" fill="#1E3932" />
                            <rect x="14" y="36" width="52" height="52" rx="2" fill="white" opacity="0.9" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main image */}
            <motion.div
              key={activeGallery}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className="flex-1 flex items-center justify-center rounded-2xl overflow-hidden relative"
              style={{
                background:  hasImages ? (galleries[activeGallery] ?? "#f6faf8") : galleries[activeGallery],
                boxShadow:   "var(--shadow-card)",
                minHeight:   "320px",
              }}
            >
              {hasImages && shopifyImages[activeGallery] ? (
                <Image
                  src={shopifyImages[activeGallery].url}
                  alt={shopifyImages[activeGallery].altText ?? product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <ProductIllustration handle={slug} label={product.title} />
              )}

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
            <p className="text-sm mb-4 max-w-[48ch]" style={{ color: "var(--text-black-soft)", lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Top 3 benefits — inline social proof before buy button */}
            {details?.benefits && (
              <ul className="flex flex-col gap-2 mb-1">
                {details.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm font-semibold" style={{ color: "var(--green-house)" }}>
                    <Check size={15} className="shrink-0 mt-0.5" style={{ color: "var(--green-accent)" }} />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>

        {/* Purchase section — sits under the right (info) column */}
        <div className="grid grid-cols-1 lg:grid-cols-[44fr_56fr] gap-6 lg:gap-14 mb-10 lg:mb-16">
          <div className="hidden lg:block" aria-hidden="true" />
          <div>

            {/* Urgency row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--red)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: "var(--red)" }} />
                Only {stockLeft} left in stock
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--green-bio)" }}>
                <Truck size={14} className="shrink-0" />
                Order before 2pm AEST — ships today
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div ref={addBtnRef} className="flex gap-3 mb-4">
              {/* Quantity stepper */}
              <div className="flex items-center rounded-full shrink-0" style={{ border: "1.5px solid var(--input-border)" }}>
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

              {/* Add to cart — dominant CTA */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary flex-1 gap-2"
                style={{ fontSize: 17, padding: "16px 24px", boxShadow: "0 4px 18px rgba(0,168,86,0.35)" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {addState === "idle" && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <ShoppingBag size={18} /> Add to cart
                    </motion.span>
                  )}
                  {addState === "adding" && (
                    <motion.span key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Adding…
                    </motion.span>
                  )}
                  {addState === "added" && (
                    <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Check size={18} /> Added to cart!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Post-ATC reassurance strip */}
            <div
              className="flex items-center justify-center gap-4 flex-wrap py-3 px-4 rounded-xl mb-5 text-xs font-semibold"
              style={{ background: "var(--green-xlight)", color: "var(--green-house)" }}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} style={{ color: "var(--green-accent)" }} />
                30-day money-back guarantee
              </span>
              <span className="w-px h-3 rounded-full" style={{ background: "var(--green-light)" }} aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <Truck size={13} style={{ color: "var(--green-accent)" }} />
                Free shipping over $80
              </span>
              <span className="w-px h-3 rounded-full" style={{ background: "var(--green-light)" }} aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <span className="text-[11px]">🇦🇺</span>
                Australian made
              </span>
            </div>

            {/* Trust badges — horizontal strip */}
            <div
              className="grid grid-cols-4 gap-0 mb-6 rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--ceramic)" }}
            >
              {[
                { icon: Truck,       label: "Free shipping", sub: "Orders $80+"       },
                { icon: RotateCcw,   label: "30-day returns",sub: "No questions"      },
                { icon: ShieldCheck, label: "Secure checkout",sub: "SSL encrypted"    },
                { icon: Star,        label: "4.9 / 5",       sub: "380 reviews"       },
              ].map(({ icon: Icon, label, sub }, idx, arr) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 py-3.5 px-2 text-center"
                  style={{
                    borderRight: idx < arr.length - 1 ? "1px solid var(--ceramic)" : "none",
                    background: "var(--canvas)",
                  }}
                >
                  <Icon size={16} style={{ color: "var(--green-accent)" }} />
                  <p className="text-[10px] font-bold leading-tight" style={{ color: "var(--green-house)" }}>{label}</p>
                  <p className="text-[9px] leading-tight" style={{ color: "var(--text-black-soft)" }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently bought together */}
        {bundleItems.length > 0 && (
          <section className="mb-16 rounded-2xl p-6 lg:p-8" style={{ background: "var(--green-xlight)", border: "1.5px solid var(--green-light)" }} aria-labelledby="bundle-heading">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div>
                <h2 id="bundle-heading" className="font-bold text-xl" style={{ color: "var(--green-house)", letterSpacing: "-0.01em" }}>
                  Frequently bought together
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-black-soft)" }}>
                  Customers who viewed this also added these — bundle &amp; save 10%
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--green-accent)", color: "#fff" }}>
                Save 10% on bundle
              </span>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Current product thumbnail */}
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative"
                  style={{ background: galleries[0], boxShadow: "var(--shadow-card)" }}
                >
                  {shopifyImages[0] ? (
                    <Image src={shopifyImages[0].url} alt={product.title} fill sizes="80px" className="object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center scale-75 opacity-80">
                      <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-10" aria-hidden="true">
                        <rect x="8" y="20" width="64" height="75" rx="4" fill="#1E3932" />
                        <rect x="14" y="36" width="52" height="52" rx="2" fill="white" opacity="0.9" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>{product.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>{displayPrice}</p>
                </div>
              </div>

              {bundleItems.map((bp) => {
                const bpGalleries  = GALLERY_BG[bp.handle] ?? GALLERY_BG["gp-fertiliser-premium-garden-lawn"];
                const bpFirstImg   = bp.images.edges[0]?.node;
                return (
                  <div key={bp.handle} className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: "var(--text-black-soft)" }}>+</span>
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative"
                      style={{ background: bpGalleries[0], boxShadow: "var(--shadow-card)" }}
                    >
                      {bpFirstImg ? (
                        <Image src={bpFirstImg.url} alt={bp.title} fill sizes="80px" className="object-contain p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center scale-75 opacity-80">
                          <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-10" aria-hidden="true">
                            <rect x="8" y="20" width="64" height="75" rx="4" fill="#1E3932" />
                            <rect x="14" y="36" width="52" height="52" rx="2" fill="white" opacity="0.9" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>{bp.title}</p>
                      <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>{formatPrice(bp.priceRange.minVariantPrice.amount)}</p>
                    </div>
                  </div>
                );
              })}

              <div className="lg:ml-auto shrink-0 flex flex-col items-end gap-1">
                <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>
                  Total: <span className="line-through">{formatPrice((parseFloat(currentPrice) + bundleItems.reduce((s, p) => s + parseFloat(p.priceRange.minVariantPrice.amount), 0)).toFixed(2))}</span>
                  {" "}<span className="font-bold" style={{ color: "var(--green-bio)" }}>{formatPrice(((parseFloat(currentPrice) + bundleItems.reduce((s, p) => s + parseFloat(p.priceRange.minVariantPrice.amount), 0)) * 0.9).toFixed(2))}</span>
                </p>
                <button className="btn btn-primary gap-2" style={{ fontSize: 14, padding: "12px 24px" }}>
                  <ShoppingBag size={15} />
                  Add all to cart — save 10%
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div>
              <h2
                id="pdp-reviews-heading"
                className="font-bold text-2xl lg:text-3xl"
                style={{ color: "var(--green-house)", letterSpacing: "-0.01em" }}
              >
                Customer reviews
              </h2>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto shrink-0">
              <div className="flex flex-col items-center px-4 py-2.5 rounded-xl" style={{ background: "var(--green-xlight)" }}>
                <span className="text-3xl font-bold" style={{ color: "var(--green-bio)", letterSpacing: "-0.02em" }}>4.9</span>
                <Stars count={5} size={12} />
                <span className="text-[10px] mt-0.5" style={{ color: "var(--text-black-soft)" }}>380 verified reviews</span>
              </div>
            </div>
          </div>
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

      {/* Sticky bottom bar — appears when add-to-cart scrolls out of view */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed bottom-0 inset-x-0 z-[150]"
            style={{ boxShadow: "var(--shadow-sticky)" }}
          >
            <div className="max-w-[1440px] mx-auto flex items-center gap-4 px-4 lg:px-10 py-3.5" style={{ background: "#fff" }}>
              {/* Product info */}
              <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative" style={{ background: galleries[0] }}>
                  {shopifyImages[0] && (
                    <Image src={shopifyImages[0].url} alt={product.title} fill sizes="40px" className="object-contain p-0.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: "var(--text-black)" }}>{product.title}</p>
                  <p className="text-sm font-bold" style={{ color: "var(--green-bio)" }}>{displayPrice}</p>
                </div>
              </div>
              {/* Mobile — just title + price */}
              <div className="sm:hidden flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: "var(--text-black)" }}>{product.title}</p>
                <p className="text-xs font-bold" style={{ color: "var(--green-bio)" }}>{displayPrice}</p>
              </div>
              {/* Trust hint */}
              <p className="hidden lg:block text-xs font-semibold shrink-0" style={{ color: "var(--text-black-soft)" }}>
                ✓ 30-day guarantee &nbsp;·&nbsp; Free shipping $80+
              </p>
              {/* CTA */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary gap-2 shrink-0"
                style={{ fontSize: 15, padding: "12px 28px", boxShadow: "0 2px 12px rgba(0,168,86,0.30)" }}
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
