"use client";

import Link from "next/link";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect } from "react";
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

// Animated counter — counts up from 0 when it enters the viewport
function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref   = useRef<HTMLSpanElement>(null);
  const value = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration: 1.6,
      ease:     [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + Math.round(v).toString() + suffix;
      },
    });
    return controls.stop;
  }, [inView, to, suffix, prefix, value]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function ScienceSection() {
  return (
    <>
      {/* Dark feature band */}
      <section
        id="science"
        className="py-16 lg:py-24"
        style={{ background: "var(--green-house)" }}
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
              <h2
                id="science-heading"
                className="font-bold mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.01em" }}
              >
                The science behind
                <br />
                <em className="font-serif" style={{ color: "var(--green-light)", fontStyle: "italic" }}>
                  every granule.
                </em>
              </h2>

              <p className="text-base mb-8 max-w-[44ch]" style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.65 }}>
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

            {/* Right — principle cards */}
            <div className="flex flex-col gap-5">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.10, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-5 items-start"
                  style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-card)", padding: "1.5rem" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(255,255,255,0.11)" }}
                  >
                    <p.Icon size={18} color="rgba(255,255,255,0.90)" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1.5" style={{ color: "#fff", letterSpacing: "-0.01em" }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip — animated counters */}
      <section style={{ background: "var(--ceramic)" }} aria-label="Key statistics">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {/* pH — static (range, not a single number) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              <p
                className="font-bold mb-1"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", color: "var(--green-bio)", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
              >
                pH 6.2–6.8
              </p>
              <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>Optimal soil balance</p>
            </motion.div>

            {/* 47+ trace minerals */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07, duration: 0.5 }}
            >
              <p
                className="font-bold mb-1"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", color: "var(--green-bio)", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
              >
                <Counter to={47} suffix="+" />
              </p>
              <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>Trace minerals included</p>
            </motion.div>

            {/* 10 days — static */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14, duration: 0.5 }}
            >
              <p
                className="font-bold mb-1"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", color: "var(--green-bio)", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
              >
                10 days
              </p>
              <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>Avg. visible results</p>
            </motion.div>

            {/* 100% */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.21, duration: 0.5 }}
            >
              <p
                className="font-bold mb-1"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", color: "var(--green-bio)", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
              >
                <Counter to={100} suffix="%" />
              </p>
              <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>Australian made</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
