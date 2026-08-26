"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaBanner() {
  return (
    <>
      {/* Main CTA band */}
      <section
        className="py-12 lg:py-24"
        style={{ background: "var(--green-accent)" }}
        aria-labelledby="cta-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
          >
            <div>
              <h2
                id="cta-heading"
                className="font-bold text-3xl lg:text-5xl mb-4"
                style={{ color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.12 }}
              >
                Grow more, waste less —<br />
                <em className="font-serif" style={{ color: "var(--green-light)", fontStyle: "italic" }}>
                  results you can see.
                </em>
              </h2>
              <p className="text-base max-w-[400px]" style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.65 }}>
                Science-backed formulas crafted for Australian soil. Over 2,400 home gardeners
                choose BioGardeners every season. Delivered across Australia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link href="/products/gp-fertiliser-premium-garden-lawn" className="btn btn-white-filled w-full sm:w-auto justify-center" style={{ fontSize: 16, padding: "15px 32px" }}>
                Shop Bestseller
              </Link>
              <Link href="/products" className="btn btn-outline-white w-full sm:w-auto justify-center" style={{ fontSize: 16, padding: "15px 32px" }}>
                View all products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}
