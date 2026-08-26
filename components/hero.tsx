"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh" }} aria-labelledby="hero-heading">

      {/* Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Layered overlay — bottom heavy for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(10,25,18,0.82) 0%, rgba(10,25,18,0.38) 45%, rgba(10,25,18,0.10) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content — centred lower third */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-[10vh] px-5 md:px-10 lg:px-16 max-w-[1440px] mx-auto w-full">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 mb-5"
        >
          <span
            className="text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: "var(--gold)", color: "#fff", letterSpacing: "0.07em" }}
          >
            ★ BESTSELLER
          </span>
          <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.70)" }}>
            Australian made · 380+ reviews
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.80, ease: [0.16, 1, 0.3, 1] }}
          className="font-bold mb-5"
          style={{
            fontSize:      "clamp(2.8rem, 7vw, 6rem)",
            lineHeight:    1.04,
            letterSpacing: "-0.03em",
            color:         "#fff",
            textWrap:      "balance",
            maxWidth:      "14ch",
          }}
        >
          Feed your garden
          {" "}
          <em
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle:  "italic",
              fontWeight: 600,
              color:      "var(--green-light)",
            }}
          >
            the right way.
          </em>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 max-w-[42ch]"
          style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)", color: "rgba(255,255,255,0.72)", lineHeight: 1.65 }}
        >
          Australian-made fertilisers and soil formulas backed by science.
          Designed for Australian conditions, tested in real home gardens.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.55 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          <Link
            href="/products/gp-fertiliser-premium-garden-lawn"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "var(--green-accent)",
              color:      "#fff",
              boxShadow:  "0 4px 24px rgba(0,117,74,0.45)",
            }}
          >
            <ShoppingBag size={15} />
            Shop Bestseller — from $17
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all"
            style={{
              background:  "rgba(255,255,255,0.12)",
              color:       "#fff",
              border:      "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            View all products
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="flex flex-wrap gap-6 md:gap-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.14)", paddingTop: "1.5rem" }}
        >
          {[
            { value: "4.9★",    label: "Average rating"      },
            { value: "380+",    label: "Verified reviews"     },
            { value: "100%",    label: "Australian made"      },
            { value: "10 days", label: "Avg. visible results" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="font-bold leading-none mb-1"
                style={{
                  fontSize:      "clamp(1.1rem, 2vw, 1.4rem)",
                  color:         "#fff",
                  fontFamily:    "var(--font-serif)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>


    </section>
  );
}
