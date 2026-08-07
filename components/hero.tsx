"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ShoppingBag, ArrowRight, Star, Truck, RotateCcw, Leaf } from "lucide-react";

const SPECS = [
  { label: "NPK",       value: "8-12-6"   },
  { label: "Minerals",  value: "60+"      },
  { label: "pH",        value: "6.2–6.8"  },
];

const SIZES = [
  { label: "5 kg",  price: "from $17" },
  { label: "12 kg", price: "from $34" },
  { label: "20 kg", price: "from $49" },
];

function ProductPanel() {
  const [selected, setSelected] = useState(0);

  return (
    <div
      className="relative overflow-hidden rounded-3xl w-full"
      style={{
        background:  "var(--green-house)",
        minHeight:   "clamp(440px, 50vw, 560px)",
      }}
    >
      {/* Subtle organic texture layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 15%, rgba(0,117,74,0.28) 0%, transparent 50%),
                            radial-gradient(circle at 10% 90%, rgba(0,98,65,0.20) 0%, transparent 45%)`,
        }}
        aria-hidden="true"
      />

      {/* Dot-grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.055]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)`,
          backgroundSize:  "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-10" style={{ minHeight: "clamp(440px, 50vw, 560px)" }}>

        {/* ── Top row: category label + rating */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Leaf size={13} style={{ color: "rgba(212,233,226,0.70)" }} />
            <span
              className="text-[11px] font-semibold"
              style={{ color: "rgba(212,233,226,0.70)", letterSpacing: "0.08em" }}
            >
              GP FERTILISER
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[0,1,2,3,4].map((i) => (
              <Star key={i} size={11} fill="var(--gold)" stroke="none" />
            ))}
            <span className="text-xs font-semibold ml-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              4.9 (380+)
            </span>
          </div>
        </motion.div>

        {/* ── Middle: product name + specs */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.50, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold mb-2"
            style={{
              fontSize:      "clamp(2.4rem, 4.4vw, 3.8rem)",
              lineHeight:    1.05,
              letterSpacing: "-0.03em",
              color:         "#fff",
            }}
          >
            Garden &amp;
            <br />
            <em
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle:  "italic",
                color:      "var(--green-light)",
                fontWeight: 600,
              }}
            >
              Lawn Formula
            </em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.55 }}
            className="text-sm mb-7 max-w-[34ch]"
            style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}
          >
            A balanced slow-release fertiliser with volcanic minerals, tailored for Australian soils.
          </motion.p>

          {/* Spec pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.5 }}
            className="flex flex-wrap gap-2.5 mb-8"
          >
            {SPECS.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.13)" }}
              >
                <span className="text-[10px] font-semibold" style={{ color: "rgba(212,233,226,0.65)", letterSpacing: "0.06em" }}>
                  {s.label}
                </span>
                <span className="text-xs font-bold" style={{ color: "#fff" }}>
                  {s.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.10)", marginBottom: "1.5rem" }} />

          {/* Size selector */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.80, duration: 0.5 }}
          >
            <p className="text-[11px] font-semibold mb-3" style={{ color: "rgba(255,255,255,0.40)", letterSpacing: "0.07em" }}>
              SIZE
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {SIZES.map((sz, i) => (
                <button
                  key={sz.label}
                  onClick={() => setSelected(i)}
                  className="flex flex-col items-center px-5 py-2.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: selected === i ? "#fff" : "rgba(255,255,255,0.07)",
                    border:     selected === i ? "none" : "1px solid rgba(255,255,255,0.14)",
                    transform:  selected === i ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <span
                    className="text-sm font-bold leading-none"
                    style={{ color: selected === i ? "var(--green-house)" : "#fff" }}
                  >
                    {sz.label}
                  </span>
                  <span
                    className="text-[10px] mt-0.5 leading-none"
                    style={{ color: selected === i ? "var(--green-accent)" : "rgba(255,255,255,0.40)" }}
                  >
                    {sz.price}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom: CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.90, duration: 0.55 }}
          className="flex items-center gap-3 flex-wrap"
        >
          <Link
            href="/products/gp-fertiliser-premium-garden-lawn"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:brightness-105 active:scale-95 flex-1 justify-center"
            style={{
              background: "var(--green-accent)",
              color:      "#fff",
              boxShadow:  "0 4px 20px rgba(0,117,74,0.40)",
            }}
          >
            <ShoppingBag size={15} />
            Add to bag — {SIZES[selected].price}
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70 whitespace-nowrap"
            style={{ color: "rgba(212,233,226,0.70)" }}
          >
            View all
            <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#fff", paddingTop: "var(--nav-h)" }}
      aria-labelledby="hero-heading"
    >
      {/* ── Background: soft gradient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Main sage bloom — right side behind product */}
        <div
          className="absolute"
          style={{
            width:        680,
            height:       680,
            right:        -80,
            top:          -60,
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(212,233,226,0.72) 0%, rgba(212,233,226,0.24) 55%, transparent 75%)",
          }}
        />
        {/* Secondary warm accent — lower right */}
        <div
          className="absolute"
          style={{
            width:        360,
            height:       360,
            right:        120,
            bottom:       -80,
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(168,207,192,0.35) 0%, transparent 70%)",
          }}
        />
        {/* Subtle gold warmth — lower left */}
        <div
          className="absolute"
          style={{
            width:        280,
            height:       280,
            left:         -60,
            bottom:       -40,
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(203,162,88,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Main content grid */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        <div
          className="grid grid-cols-1 lg:grid-cols-[54fr_46fr] gap-8 lg:gap-0 items-center"
          style={{ minHeight: "calc(100vh - var(--nav-h))", paddingTop: "2rem", paddingBottom: "4rem" }}
        >

          {/* ── Left: text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } } }}
            className="flex flex-col"
          >
            {/* Bestseller chip */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }}
              className="inline-flex items-center gap-2.5 mb-7 self-start"
            >
              <span
                className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: "var(--gold)", color: "#fff", letterSpacing: "0.07em" }}
              >
                ★ BESTSELLER
              </span>
              <span className="text-[11px] font-semibold" style={{ color: "var(--text-black-soft)" }}>
                GP Fertiliser · 98 sold this month
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              id="hero-heading"
              variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.80, ease: [0.16, 1, 0.3, 1] } } }}
              className="font-bold mb-5"
              style={{
                fontSize:      "clamp(2.8rem, 5.6vw, 5.2rem)",
                lineHeight:    1.04,
                letterSpacing: "-0.03em",
                color:         "var(--green-house)",
                textWrap:      "balance",
              }}
            >
              Feed your garden
              <br />
              <em
                style={{
                  color:      "var(--green-accent)",
                  fontStyle:  "italic",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 600,
                }}
              >
                the right way.
              </em>
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } }}
              className="text-base md:text-lg mb-8 max-w-[460px]"
              style={{ color: "var(--text-black-soft)", lineHeight: 1.65 }}
            >
              Australian-made fertilisers and soil formulas backed by science.
              Designed for Australian conditions, tested in real home gardens.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}
              className="flex flex-wrap gap-3 mb-5"
            >
              <Link
                href="/products/gp-fertiliser-premium-garden-lawn"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:brightness-105 active:scale-95"
                style={{
                  background:  "var(--green-bio)",
                  color:       "#fff",
                  boxShadow:   "0 4px 20px rgba(0,98,65,0.28)",
                }}
              >
                <ShoppingBag size={15} />
                Shop Bestseller — from $17
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:bg-[var(--surface-alt)]"
                style={{ border: "1.5px solid var(--ceramic)", color: "var(--green-bio)" }}
              >
                View all products
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Trust micro */}
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.45 } } }}
              className="flex flex-wrap items-center gap-2 text-xs mb-10"
              style={{ color: "var(--text-black-soft)" }}
            >
              <RotateCcw size={11} />
              30-day money-back guarantee
              <span aria-hidden style={{ color: "var(--input-border)" }}>·</span>
              <Truck size={11} />
              Free shipping over $80
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, delay: 0.15 } } }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8"
              style={{ borderTop: "1px solid var(--ceramic)" }}
            >
              {[
                { value: "4.9★",    label: "Average rating"       },
                { value: "380+",    label: "Verified reviews"      },
                { value: "100%",    label: "Australian made"       },
                { value: "10 days", label: "Avg. visible results"  },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="font-bold leading-none mb-1.5"
                    style={{
                      fontSize:      "clamp(1.1rem, 2vw, 1.4rem)",
                      color:         "var(--green-bio)",
                      fontFamily:    "var(--font-serif)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: product panel */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.90, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full lg:pl-8"
          >
            <ProductPanel />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1.5px solid var(--input-border)" }}
        >
          <div className="w-[3px] h-2 rounded-full" style={{ background: "var(--text-black-soft)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
