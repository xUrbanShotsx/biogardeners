"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Drop your result photos into /public/results/
// ── Use any filename — update `image` below to match.
// ── If an image file doesn't exist yet, a styled placeholder is shown instead.
const SLIDES = [
  {
    image:    "/results/result-1.jpg",
    caption:  "Lawn transformation after 3 weeks",
    customer: "Sarah M. — Sydney, NSW",
    product:  "GP Fertiliser",
  },
  {
    image:    "/results/result-2.jpg",
    caption:  "Tomatoes doubled in size this season",
    customer: "James T. — Melbourne, VIC",
    product:  "Liquid NPK Fertilizer",
  },
  {
    image:    "/results/result-3.jpg",
    caption:  "Dense, dark green lawn — 2 weeks in",
    customer: "Helen R. — Brisbane, QLD",
    product:  "Lawn Fertilizer",
  },
  {
    image:    "/results/result-4.jpg",
    caption:  "Herb garden thriving all season",
    customer: "David K. — Perth, WA",
    product:  "Soil Conditioner",
  },
  {
    image:    "/results/result-5.jpg",
    caption:  "Fruit trees with new growth on every branch",
    customer: "Amy C. — Adelaide, SA",
    product:  "Penetrator",
  },
  {
    image:    "/results/result-6.jpg",
    caption:  "Native garden restored with volcanic minerals",
    customer: "Mark W. — Canberra, ACT",
    product:  "Volcanic Dust",
  },
];

const GRADIENT_PLACEHOLDERS = [
  "linear-gradient(135deg, #152E27 0%, #007845 100%)",
  "linear-gradient(135deg, #1a3d2a 0%, #00A856 100%)",
  "linear-gradient(135deg, #0d2e1e 0%, #007845 80%)",
  "linear-gradient(135deg, #152E27 20%, #2b5148 100%)",
  "linear-gradient(135deg, #1a3d2a 0%, #007845 70%)",
  "linear-gradient(135deg, #0d2e1e 0%, #2b5148 100%)",
];

function Slide({ slide, index, isActive }: { slide: typeof SLIDES[0]; index: number; isActive: boolean }) {
  const [imgError, setImgError] = useState(false);
  const gradient = GRADIENT_PLACEHOLDERS[index % GRADIENT_PLACEHOLDERS.length];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden flex-shrink-0">
      {/* Image or placeholder */}
      {!imgError ? (
        <Image
          src={slide.image}
          alt={slide.caption}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          onError={() => setImgError(true)}
          priority={isActive}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: gradient }}
        >
          {/* Leaf SVG placeholder */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M24 4C24 4 8 12 8 28C8 36.837 15.163 44 24 44C32.837 44 40 36.837 40 28C40 12 24 4 24 4Z" fill="rgba(255,255,255,0.12)" />
            <path d="M24 44V20" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 28C24 28 16 24 14 18" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 32C24 32 30 28 33 22" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-xs font-semibold text-center px-4" style={{ color: "rgba(255,255,255,0.50)" }}>
            Add {slide.image} to /public/results/
          </p>
        </div>
      )}

      {/* Dark gradient overlay for text */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(10,28,20,0.90) 0%, rgba(10,28,20,0.15) 55%, transparent 100%)" }} />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
        <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "var(--green-accent)" }}>
          {slide.product}
        </p>
        <p className="font-bold text-lg lg:text-xl leading-snug mb-1.5" style={{ color: "#fff", letterSpacing: "-0.01em" }}>
          {slide.caption}
        </p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          {slide.customer}
        </p>
      </div>
    </div>
  );
}

export function ResultsShowcase() {
  const [active,  setActive]  = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = SLIDES.length;

  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);
  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  return (
    <section
      className="py-16 lg:py-24 overflow-hidden"
      style={{ background: "var(--green-house)" }}
      aria-labelledby="results-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10"
        >
          <div>
            <h2
              id="results-heading"
              className="font-bold mb-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", letterSpacing: "-0.02em" }}
            >
              Real gardens.{" "}
              <em className="font-serif" style={{ color: "var(--green-accent)", fontStyle: "italic" }}>
                Real results.
              </em>
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
              Submitted by our customers — every garden, every season.
            </p>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{ border: "1.5px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.7)" }}
              aria-label="Previous result"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{ border: "1.5px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.7)" }}
              aria-label="Next result"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Main slide + sidebar stack */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 items-start" style={{ minHeight: "420px" }}>

          {/* Active slide — large */}
          <div className="relative" style={{ height: "clamp(320px, 55vw, 560px)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97, x: 24 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: -16 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                <Slide slide={SLIDES[active]} index={active} isActive />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next 2 previews stacked (desktop only) */}
          <div className="hidden lg:flex flex-col gap-3" style={{ height: "clamp(320px, 55vw, 560px)" }}>
            {[1, 2].map((offset) => {
              const idx = (active + offset) % total;
              return (
                <motion.button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className="relative flex-1 rounded-xl overflow-hidden text-left transition-all"
                  style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`View result: ${SLIDES[idx].caption}`}
                >
                  <Slide slide={SLIDES[idx]} index={idx} isActive={false} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-2 mt-8" role="tablist" aria-label="Slide navigation">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className="transition-all duration-300"
              style={{
                width:        i === active ? "28px" : "8px",
                height:       "8px",
                borderRadius: "4px",
                background:   i === active ? "var(--green-accent)" : "rgba(255,255,255,0.22)",
                border:       "none",
                cursor:       "pointer",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
