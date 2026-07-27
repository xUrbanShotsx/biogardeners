"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import { type ShopifyProduct } from "@/lib/shopify";

const CATEGORIES = ["All", "Fertiliser", "Soil", "Tonic", "Bundle"];

const PRODUCT_CATEGORY: Record<string, string> = {
  "bio-bloom-fertiliser": "Fertiliser",
  "terra-pro-soil-mix":   "Soil",
  "deep-root-tonic":      "Tonic",
  "season-starter-kit":   "Bundle",
};

export function FeaturedProducts({ products }: { products: ShopifyProduct[] }) {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? products
    : products.filter((p) => PRODUCT_CATEGORY[p.handle] === active);

  return (
    <section className="py-16 lg:py-24" style={{ background: "var(--surface-alt)" }} aria-labelledby="products-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <h2
              id="products-heading"
              className="font-bold text-4xl lg:text-5xl mb-1.5"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.02em" }}
            >
              Our formulas
            </h2>
            <p className="text-base" style={{ color: "var(--text-black-soft)" }}>
              Soil-tested, precision-balanced for Australian conditions.
            </p>
          </div>
          <Link href="/products" className="btn btn-outline shrink-0" style={{ fontSize: 14, padding: "8px 22px" }}>
            View all
          </Link>
        </motion.div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="shrink-0 text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200"
              style={{
                background:   active === cat ? "var(--green-house)" : "transparent",
                color:        active === cat ? "#fff" : "var(--text-black-soft)",
                borderColor:  active === cat ? "var(--green-house)" : "var(--input-border)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
