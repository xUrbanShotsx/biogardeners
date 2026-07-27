"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout, FlaskConical, Ban } from "lucide-react";

const principles = [
  {
    Icon: Sprout,
    title: "Soil First",
    body: "Every BioGardeners formula starts with the microbial ecosystem beneath the surface. Healthy soil biology is the foundation of healthy plants.",
  },
  {
    Icon: FlaskConical,
    title: "Precision Ratios",
    body: "NPK ratios are not guesses. We run soil analysis across Australian climate zones and adjust seasonal formulas to match what home gardens actually need.",
  },
  {
    Icon: Ban,
    title: "No Filler",
    body: "Common fertilisers pad their blends with cheap salts that burn roots over time. Every gram in a BioGardeners product earns its place.",
  },
];

export function ScienceSection() {
  return (
    <>
      {/* Feature band — House Green, full width. Starbucks dark-green strip. */}
      <section
        id="science"
        className="py-16 lg:py-24"
        style={{ background: "var(--green-house)" }}
        aria-labelledby="science-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — content */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2
                id="science-heading"
                className="font-bold text-4xl lg:text-5xl mb-4"
                style={{ color: "#fff", letterSpacing: "-0.01em" }}
              >
                The science behind
                <br />
                <em className="font-serif" style={{ color: "var(--green-light)", fontStyle: "italic" }}>
                  every granule.
                </em>
              </h2>

              <p className="text-base mb-8 max-w-[44ch]" style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.65 }}>
                Most gardeners never see what's actually happening in their soil.
                We do. Our team of soil scientists and gardening experts analyse Australian
                growing conditions year-round to create formulas that actually work.
              </p>

              <div className="flex gap-3">
                <Link href="/#science" className="btn btn-white-filled" style={{ fontSize: 14, padding: "10px 24px" }}>
                  Learn more
                </Link>
                <Link href="/products" className="btn btn-outline-white" style={{ fontSize: 14, padding: "10px 24px" }}>
                  Shop now
                </Link>
              </div>
            </motion.div>

            {/* Right — principles list */}
            <div className="flex flex-col gap-6">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex gap-5 items-start"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "var(--radius-card)",
                    padding: "1.5rem",
                  }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <p.Icon size={18} color="rgba(255,255,255,0.90)" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1.5" style={{ color: "#fff", letterSpacing: "-0.01em" }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip — warm cream */}
      <section style={{ background: "var(--ceramic)" }} aria-label="Key statistics">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "pH 6.2–6.8", label: "Optimal soil balance"   },
              { value: "47+",        label: "Trace minerals included" },
              { value: "10 days",    label: "Avg. visible results"    },
              { value: "100%",       label: "Australian made"         },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <p className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: "var(--green-bio)" }}>
                  {s.value}
                </p>
                <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
