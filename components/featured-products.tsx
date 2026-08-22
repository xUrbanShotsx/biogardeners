"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import { type ShopifyProduct } from "@/lib/shopify";

export function FeaturedProducts({ products }: { products: ShopifyProduct[] }) {
  return (
    <section className="py-16 lg:py-24" style={{ background: "var(--surface-alt)" }} aria-labelledby="products-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#4ade80" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--green-bio)" }}>
                $17.95 flat rate · Australia wide
              </span>
            </div>
            <h2
              id="products-heading"
              className="font-bold text-4xl lg:text-5xl mb-1.5"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.02em" }}
            >
              Shop Bestsellers
            </h2>
            <p className="text-base" style={{ color: "var(--text-black-soft)" }}>
              Over 2,400 Australian gardeners trust these formulas — soil-tested, season after season.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-colors duration-200"
            style={{ color: "var(--green-bio)" }}
          >
            View all 9 products <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Grid — 4 products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <ProductCard product={p} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
