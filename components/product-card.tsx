"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, TrendingUp } from "lucide-react";
import { type ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const BG_COLORS: Record<string, string> = {
  "bio-bloom-fertiliser": "#fdf9f6",
  "terra-pro-soil-mix":   "#fdf9f6",
  "deep-root-tonic":      "#fdf9f6",
  "season-starter-kit":   "#fdf9f6",
};

const SOCIAL_PROOF: Record<string, string> = {
  "bio-bloom-fertiliser": "142 sold this month",
  "terra-pro-soil-mix":   "89 sold this month",
  "deep-root-tonic":      "73 sold this month",
  "season-starter-kit":   "38 sold this month",
};

const RATINGS: Record<string, { avg: number; count: number }> = {
  "bio-bloom-fertiliser": { avg: 4.9, count: 184 },
  "terra-pro-soil-mix":   { avg: 4.8, count: 97  },
  "deep-root-tonic":      { avg: 4.9, count: 61  },
  "season-starter-kit":   { avg: 5.0, count: 38  },
};

function ProductVisual({ handle, imageUrl, imageAlt }: { handle: string; imageUrl?: string; imageAlt?: string }) {
  const bg = BG_COLORS[handle] ?? "#fdf9f6";

  if (imageUrl) {
    return (
      <div className="w-full h-full relative" style={{ background: bg }}>
        <Image
          src={imageUrl}
          alt={imageAlt ?? handle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
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

interface ProductCardProps {
  product: ShopifyProduct;
  index?:  number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const price    = formatPrice(product.priceRange.minVariantPrice.amount);
  const tag      = product.tags[0];
  const proof    = SOCIAL_PROOF[product.handle];
  const rating   = RATINGS[product.handle];
  const firstImg = product.images.edges[0]?.node;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    setAdding(true);
    const firstVariant = product.variants.edges[0]?.node;
    addItem({
      id:      firstVariant?.id ?? product.id,
      handle:  product.handle,
      title:   product.title,
      variant: firstVariant?.title ?? "Default",
      price:   parseFloat(product.priceRange.minVariantPrice.amount),
    });
    setTimeout(() => setAdding(false), 1400);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="group"
    >
      <Link href={`/products/${product.handle}`} className="block">
        {/* Image */}
        <div
          className="relative w-full aspect-[4/4.5] overflow-hidden mb-4 transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)" }}
        >
          <ProductVisual handle={product.handle} imageUrl={firstImg?.url} imageAlt={firstImg?.altText ?? product.title} />

          {/* Social proof chip */}
          {proof && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 + 0.3 }}
              className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(30,57,50,0.88)", color: "#fff", backdropFilter: "blur(4px)" }}
            >
              <TrendingUp size={10} aria-hidden="true" />
              {proof}
            </motion.div>
          )}

          {/* Tag */}
          {tag && (
            <span
              className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
              style={{
                background: tag === "Bundle" ? "var(--gold)" : "var(--green-accent)",
                color: "#fff",
              }}
            >
              {tag}
            </span>
          )}

          {/* Hover overlay — quick add */}
          <div
            className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250"
          >
            <button
              className="btn btn-primary w-full gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              style={{ fontSize: 13, padding: "10px 16px" }}
              onClick={handleAddToCart}
            >
              {adding ? (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Added!
                </motion.span>
              ) : (
                <>
                  <ShoppingBag size={13} />
                  Quick add
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-0.5">
          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1.5 mb-1.5">
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

          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="font-bold text-base leading-snug"
              style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}
            >
              {product.title}
            </h3>
            <span className="font-bold text-sm shrink-0" style={{ color: "var(--green-bio)" }}>
              {price}
            </span>
          </div>
          <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
            {product.description}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
