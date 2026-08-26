"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout, FlaskConical, Ban } from "lucide-react";

const principles = [
  {
    Icon: Sprout,
    title: "Soil First",
    body:  "Every BioGardeners formula starts with the microbial ecosystem beneath the surface. Healthy soil biology is the foundation of healthy plants.",
  },
  {
    Icon: FlaskConical,
    title: "Precision Ratios",
    body:  "NPK ratios are not guesses. We run soil analysis across Australian climate zones and adjust seasonal formulas to match what home gardens actually need.",
  },
  {
    Icon: Ban,
    title: "No Filler",
    body:  "Common fertilisers pad their blends with cheap salts that burn roots over time. Every gram in a BioGardeners product earns its place.",
  },
];

export function ScienceSection() {
  return (
    <section
      id="science"
      className="py-16 lg:py-24"
      style={{ background: "var(--green-accent)" }}
      aria-labelledby="science-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em" }}>
              Our approach
            </p>
            <h2
              id="science-heading"
              className="font-bold mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.08 }}
            >
              The science behind{" "}
              <em className="font-serif" style={{ color: "var(--green-light)", fontStyle: "italic" }}>
                every granule.
              </em>
            </h2>

            <p className="text-base mb-10 max-w-[44ch]" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
              Most gardeners never see what&apos;s actually happening in their soil.
              We do. Our team of soil scientists and gardening experts analyse Australian
              growing conditions year-round to create formulas that actually work.
            </p>

            <div className="flex gap-3">
              <Link href="/growing-guides" className="btn btn-white-filled" style={{ fontSize: 14, padding: "11px 26px" }}>
                Learn more
              </Link>
              <Link href="/products" className="btn btn-outline-white" style={{ fontSize: 14, padding: "11px 26px" }}>
                Shop now
              </Link>
            </div>
          </motion.div>

          {/* Right — principle cards */}
          <div className="flex flex-col gap-4">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + i * 0.10, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-5 items-start"
                style={{ background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(255,255,255,0.14)" }}
                >
                  <p.Icon size={18} color="rgba(255,255,255,0.92)" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1.5" style={{ color: "#fff", letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
