"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Check } from "lucide-react";
import { type ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const SOCIAL_PROOF: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":               "83 sold this week",
  "lawn-fertilizer-premium-granulated-concentrated": "52 sold this week",
  "volcanic-dust-trace-elements":                    "41 sold this week",
  "soil-health-conditioner-powder":                  "29 sold this week",
  "liquid-npk-fertilizer":                           "37 sold this week",
  "glacial-milk":                                    "21 sold this week",
  "soil-health-conditioner":                         "18 sold this week",
  "plant-spray":                                     "44 sold this week",
  "penetrator":                                      "58 sold this week",
};

const RATINGS: Record<string, { avg: number; count: number }> = {
  "gp-fertiliser-premium-garden-lawn":               { avg: 4.9, count: 184 },
  "lawn-fertilizer-premium-granulated-concentrated": { avg: 4.8, count: 97  },
  "volcanic-dust-trace-elements":                    { avg: 4.9, count: 61  },
  "soil-health-conditioner-powder":                  { avg: 4.7, count: 43  },
  "liquid-npk-fertilizer":                           { avg: 4.8, count: 55  },
  "glacial-milk":                                    { avg: 4.9, count: 41  },
  "soil-health-conditioner":                         { avg: 4.8, count: 38  },
  "plant-spray":                                     { avg: 4.7, count: 62  },
  "penetrator":                                      { avg: 4.8, count: 48  },
};

const BADGE: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":               "Bestseller",
  "penetrator":                                      "Popular",
  "plant-spray":                                     "Popular",
  "lawn-fertilizer-premium-granulated-concentrated": "Top Rated",
};

function ProductVisual({ handle, imageUrl, imageAlt }: { handle: string; imageUrl?: string; imageAlt?: string }) {
  if (imageUrl) {
    return (
      <div className="w-full h-full relative" style={{ background: "#fdf9f6" }}>
        <Image
          src={imageUrl}
          alt={imageAlt ?? handle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4"
        />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#fdf9f6" }}>
      <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="w-28 h-auto drop-shadow-lg" aria-hidden="true">
        <rect x="20" y="50" width="160" height="195" rx="10" fill="#1E3932" />
        <path d="M65 50 Q65 22 100 22 Q135 22 135 50" fill="none" stroke="#1E3932" strokeWidth="6" strokeLinecap="round" />
        <rect x="34" y="90" width="132" height="130" rx="6" fill="white" opacity="0.95" />
        <text x="100" y="118" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="8" fill="#006241" letterSpacing="1.5">BIOGARDENERS</text>
        <ellipse cx="100" cy="248" rx="60" ry="8" fill="rgba(0,0,0,0.07)" />
      </svg>
    </div>
  );
}

export function ProductCard({ product, index = 0 }: { product: ShopifyProduct; index?: number }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const price    = formatPrice(product.priceRange.minVariantPrice.amount);
  const tag      = product.tags[0];
  const proof    = SOCIAL_PROOF[product.handle];
  const rating   = RATINGS[product.handle];
  const badge    = BADGE[product.handle];
  const firstImg = product.images.edges[0]?.node;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    const firstVariant = product.variants.edges[0]?.node;
    addItem({
      id:      firstVariant?.id ?? product.id,
      handle:  product.handle,
      title:   product.title,
      variant: firstVariant?.title ?? "Default",
      price:   parseFloat(product.priceRange.minVariantPrice.amount),
    });
    setTimeout(() => setAdding(false), 1600);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="group flex flex-col rounded-[var(--radius-card)] overflow-hidden bg-white"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Image */}
      <Link href={`/products/${product.handle}`} className="block relative aspect-square overflow-hidden">
        <ProductVisual handle={product.handle} imageUrl={firstImg?.url} imageAlt={firstImg?.altText ?? product.title} />

        {/* Badge */}
        {(badge || tag) && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
            style={{
              background: badge === "Bestseller" ? "var(--green-accent)" : tag === "Bundle" ? "var(--gold)" : "var(--green-bio)",
              color: "#fff",
            }}
          >
            {badge ?? tag}
          </span>
        )}

        {/* Social proof */}
        {proof && (
          <div
            className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{ background: "rgba(20,50,38,0.88)", color: "#fff", backdropFilter: "blur(4px)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#4ade80" }} />
            {proof}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-2">
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={10} fill={s <= Math.round(rating.avg) ? "var(--gold)" : "none"} stroke={s <= Math.round(rating.avg) ? "none" : "var(--text-black-soft)"} />
              ))}
            </div>
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-black-soft)" }}>
              {rating.avg} ({rating.count})
            </span>
          </div>
        )}

        {/* Title + Price */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.handle}`}>
            <h3 className="font-bold text-sm leading-snug hover:underline" style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>
              {product.title}
            </h3>
          </Link>
          <span className="font-bold text-base shrink-0" style={{ color: "var(--green-bio)" }}>{price}</span>
        </div>

        <p className="text-xs line-clamp-2 leading-relaxed flex-1" style={{ color: "var(--text-black-soft)" }}>
          {product.description}
        </p>

        {/* Add to cart — always visible */}
        <button
          onClick={handleAddToCart}
          className="mt-1 w-full flex items-center justify-center gap-2 rounded-full font-bold text-sm py-2.5 transition-all active:scale-[0.97]"
          style={{
            background: adding ? "var(--green-bio)" : "var(--green-house)",
            color: "#fff",
            boxShadow: adding ? "none" : "0 2px 12px rgba(0,0,0,0.18)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {adding ? (
              <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <Check size={14} /> Added!
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <ShoppingBag size={14} /> Add to cart
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.article>
  );
}
