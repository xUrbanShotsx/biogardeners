"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, Star, Truck, RotateCcw } from "lucide-react";

function HeroProductVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(140deg, #d4e9e2 0%, #a8cfc0 55%, #87baa8 100%)" }}
      />

      {/* Decorative circle backdrop */}
      <div
        className="absolute inset-8 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #006241 0%, transparent 70%)" }}
      />

      <svg
        viewBox="0 0 320 400"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-56 lg:w-72 drop-shadow-2xl"
        aria-label="BioGardeners Bio Bloom Fertiliser"
      >
        <rect x="60" y="80" width="200" height="270" rx="16" fill="#1E3932" />
        <rect x="60" y="80" width="200" height="270" rx="16" fill="url(#heroGrad)" opacity="0.45" />
        <defs>
          <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2b5148" />
            <stop offset="100%" stopColor="#1E3932" />
          </linearGradient>
        </defs>
        <path d="M60 80 Q160 60 260 80 L260 110 Q160 90 60 110 Z" fill="#2b5148" opacity="0.55" />
        <path d="M110 80 Q110 40 140 40 Q160 40 160 60" fill="none" stroke="#2b5148" strokeWidth="8" strokeLinecap="round" />
        <path d="M210 80 Q210 40 180 40 Q160 40 160 60" fill="none" stroke="#2b5148" strokeWidth="8" strokeLinecap="round" />
        <rect x="80" y="130" width="160" height="170" rx="8" fill="white" opacity="0.96" />
        <circle cx="160" cy="168" r="22" fill="#006241" opacity="0.10" />
        <text x="160" y="162" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="10" fill="#006241" letterSpacing="2">BIO</text>
        <text x="160" y="175" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="10" fill="#006241" letterSpacing="2">GARDENERS</text>
        <text x="160" y="216" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="14" fill="#1E3932">Bio Bloom</text>
        <text x="160" y="234" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="14" fill="#1E3932">Fertiliser</text>
        <rect x="80" y="248" width="160" height="3" rx="1.5" fill="#00754A" opacity="0.4" />
        <text x="160" y="272" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="400" fontSize="11" fill="rgba(0,0,0,0.52)">1 kg · NPK 8-12-6</text>
        <rect x="80" y="285" width="160" height="15" fill="#006241" opacity="0.07" />
        <text x="160" y="296" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="9" fill="#006241" letterSpacing="1.5">AUSTRALIAN MADE</text>
        <ellipse cx="160" cy="355" rx="80" ry="10" fill="rgba(0,0,0,0.09)" />
      </svg>

      {/* Floating stat cards */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-8 right-0 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--green-xlight)" }}>
            <Star size={14} fill="var(--gold)" stroke="none" />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: "var(--green-bio)" }}>4.9 / 5</p>
            <p className="text-[10px]" style={{ color: "var(--text-black-soft)" }}>380+ reviews</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.85, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute bottom-12 left-0 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--green-xlight)" }}>
            <Truck size={13} style={{ color: "var(--green-accent)" }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: "var(--green-bio)" }}>Free shipping</p>
            <p className="text-[10px]" style={{ color: "var(--text-black-soft)" }}>Orders over $80</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold"
        style={{ background: "var(--green-accent)", color: "#fff", letterSpacing: "0.05em" }}
      >
        BESTSELLER
      </motion.div>
    </div>
  );
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } },
  item: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} style={{ background: "var(--canvas)", paddingTop: 99 }} aria-labelledby="hero-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-8 lg:gap-16 items-center min-h-[calc(100vh-99px)] py-14">

          {/* Content */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Heading */}
            <motion.h1
              variants={stagger.item}
              id="hero-heading"
              className="font-bold mb-5"
              style={{
                fontSize: "clamp(2.6rem, 5.2vw, 4.8rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                color: "var(--green-house)",
              }}
            >
              Feed your garden<br />
              <em className="font-serif" style={{ color: "var(--green-accent)", fontStyle: "italic", fontWeight: 700 }}>
                the right way.
              </em>
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={stagger.item}
              className="text-lg mb-8 max-w-[480px]"
              style={{ color: "var(--text-black-soft)", lineHeight: 1.65 }}
            >
              Australian-made fertilisers and soil formulas backed by science.
              Designed for Australian conditions, tested in real home gardens.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={stagger.item} className="flex flex-wrap gap-3 mb-10">
              <Link href="/products/season-starter-kit" className="btn btn-primary" style={{ fontSize: 16, padding: "15px 34px" }}>
                <ShoppingBag size={16} />
                Shop Starter Kit
              </Link>
              <Link href="/products" className="btn btn-outline" style={{ fontSize: 16, padding: "15px 34px" }}>
                View all products
              </Link>
            </motion.div>

            {/* Trust micro-line */}
            <motion.div
              variants={stagger.item}
              className="flex items-center gap-1.5 text-xs mb-10"
              style={{ color: "var(--text-black-soft)" }}
            >
              <RotateCcw size={12} />
              30-day money back guarantee &nbsp;·&nbsp;
              <Truck size={12} />
              Free shipping over $80
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              variants={stagger.item}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8"
              style={{ borderTop: "1px solid var(--ceramic)" }}
            >
              {[
                { stat: "4.9★",    label: "Average rating"       },
                { stat: "380+",    label: "Verified reviews"     },
                { stat: "100%",    label: "Australian made"      },
                { stat: "10 days", label: "Avg. visible results" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-bold" style={{ color: "var(--green-bio)" }}>{s.stat}</p>
                  <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Product visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ y }}
            className="hidden lg:block w-full aspect-[4/5]"
          >
            <HeroProductVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
