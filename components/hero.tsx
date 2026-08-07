"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, ArrowRight, Star, Truck, RotateCcw, CheckCircle2 } from "lucide-react";

// Floating feature cards around the product
const FEATURE_CARDS = [
  { label: "60+ Minerals",  sub: "Volcanic rock",    top: "12%",  left: "-10%",  right: "auto", delay: 0.75 },
  { label: "pH 6.2–6.8",   sub: "Optimal balance",  top: "50%",  left: "auto",  right: "-12%", delay: 0.90 },
  { label: "NPK 8-12-6",   sub: "Precision ratio",  top: "78%",  left: "-8%",   right: "auto", delay: 1.05 },
];

function FeatureCard({
  label, sub, top, left, right, delay,
}: {
  label: string; sub: string; top: string; left: string; right: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="absolute flex items-center gap-2.5 bg-white rounded-2xl px-3.5 py-2.5"
      style={{
        top, left, right,
        whiteSpace:   "nowrap",
        boxShadow:    "0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.06)",
        zIndex:        20,
      }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "var(--green-xlight)" }}
      >
        <CheckCircle2 size={13} style={{ color: "var(--green-accent)" }} />
      </div>
      <div>
        <p className="text-xs font-bold leading-none" style={{ color: "var(--green-house)" }}>{label}</p>
        <p className="text-[10px] leading-none mt-0.5" style={{ color: "var(--text-black-soft)" }}>{sub}</p>
      </div>
    </motion.div>
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

          {/* ── Right: product visual */}
          <motion.div
            style={{ y, height: "clamp(440px, 52vw, 580px)" }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Circle stage — sage gradient */}
            <div
              className="absolute rounded-full"
              style={{
                width:      "min(430px, 78vw)",
                height:     "min(430px, 78vw)",
                background: "radial-gradient(circle at 38% 32%, var(--green-light) 0%, var(--green-xlight) 55%, rgba(212,233,226,0.30) 100%)",
              }}
              aria-hidden="true"
            />

            {/* Subtle inner ring */}
            <div
              className="absolute rounded-full"
              style={{
                width:        "min(310px, 58vw)",
                height:       "min(310px, 58vw)",
                border:       "1.5px solid rgba(0,98,65,0.10)",
                borderRadius: "50%",
              }}
              aria-hidden="true"
            />

            {/* Feature cards */}
            {FEATURE_CARDS.map((c) => <FeatureCard key={c.label} {...c} />)}

            {/* Product bag — floating */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="relative z-10"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.16))" }}
            >
              <svg
                viewBox="0 0 320 400"
                xmlns="http://www.w3.org/2000/svg"
                className="w-56 md:w-64 lg:w-72"
                aria-label="BioGardeners GP Fertiliser bag"
              >
                <defs>
                  <linearGradient id="bagGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2b5148" />
                    <stop offset="100%" stopColor="#0d2419" />
                  </linearGradient>
                </defs>
                <rect x="60" y="80" width="200" height="270" rx="16" fill="url(#bagGrad2)" />
                <path d="M60 80 Q160 58 260 80 L260 114 Q160 92 60 114 Z" fill="rgba(255,255,255,0.07)" />
                <path d="M110 80 Q110 38 140 38 Q160 38 160 58" fill="none" stroke="#2b5148" strokeWidth="9" strokeLinecap="round" />
                <path d="M210 80 Q210 38 180 38 Q160 38 160 58" fill="none" stroke="#2b5148" strokeWidth="9" strokeLinecap="round" />
                <rect x="80" y="132" width="160" height="170" rx="9" fill="white" opacity="0.97" />
                <circle cx="160" cy="170" r="24" fill="#006241" opacity="0.08" />
                <text x="160" y="163" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="10" fill="#006241" letterSpacing="2">BIO</text>
                <text x="160" y="178" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="10" fill="#006241" letterSpacing="2">GARDENERS</text>
                <text x="160" y="218" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="14" fill="#1E3932">GP Fertiliser</text>
                <text x="160" y="236" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="14" fill="#1E3932">Garden / Lawn</text>
                <rect x="80" y="250" width="160" height="3" rx="1.5" fill="#00754A" opacity="0.40" />
                <text x="160" y="274" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="400" fontSize="11" fill="rgba(0,0,0,0.50)">5 kg · 12 kg · 20 kg</text>
                <rect x="80" y="287" width="160" height="15" fill="#006241" opacity="0.07" />
                <text x="160" y="298" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="9" fill="#006241" letterSpacing="1.5">AUSTRALIAN MADE</text>
                <ellipse cx="160" cy="358" rx="80" ry="9" fill="rgba(0,0,0,0.12)" />
              </svg>
            </motion.div>

            {/* Rating pill */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute top-6 right-2 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 bg-white"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
            >
              <Star size={13} fill="var(--gold)" stroke="none" />
              <div>
                <p className="text-xs font-bold leading-none" style={{ color: "var(--green-house)" }}>4.9 / 5</p>
                <p className="text-[10px] leading-none mt-0.5" style={{ color: "var(--text-black-soft)" }}>380+ reviews</p>
              </div>
            </motion.div>

            {/* Australian made stamp */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-6 right-2 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 bg-white"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
            >
              <CheckCircle2 size={13} style={{ color: "var(--green-accent)" }} />
              <div>
                <p className="text-xs font-bold leading-none" style={{ color: "var(--green-house)" }}>Aust. made</p>
                <p className="text-[10px] leading-none mt-0.5" style={{ color: "var(--text-black-soft)" }}>Ships nationwide</p>
              </div>
            </motion.div>
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
