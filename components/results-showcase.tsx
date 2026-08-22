"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Drop your result photos into /public/results/ with these filenames.
// A styled placeholder is shown for any missing file.
const SLIDES = [
  {
    image:    "/results/result-1.jpg",
    caption:  "Lawn transformation — 3 weeks",
    customer: "Sarah M. · Sydney, NSW",
    product:  "GP Fertiliser",
  },
  {
    image:    "/results/result-2.jpg",
    caption:  "Tomatoes doubled this season",
    customer: "James T. · Melbourne, VIC",
    product:  "Liquid NPK Fertilizer",
  },
  {
    image:    "/results/result-3.jpg",
    caption:  "Dense green lawn in 2 weeks",
    customer: "Helen R. · Brisbane, QLD",
    product:  "Lawn Fertilizer",
  },
  {
    image:    "/results/result-4.jpg",
    caption:  "Herb garden thriving all season",
    customer: "David K. · Perth, WA",
    product:  "Soil Conditioner",
  },
  {
    image:    "/results/result-5.jpg",
    caption:  "New growth on every branch",
    customer: "Amy C. · Adelaide, SA",
    product:  "Penetrator",
  },
  {
    image:    "/results/result-6.jpg",
    caption:  "Native garden restored",
    customer: "Mark W. · Canberra, ACT",
    product:  "Volcanic Dust",
  },
];

const GRADIENTS = [
  "linear-gradient(160deg, #152E27 0%, #007845 100%)",
  "linear-gradient(160deg, #1a3d2a 0%, #00A856 100%)",
  "linear-gradient(160deg, #0d2e1e 0%, #007845 80%)",
  "linear-gradient(160deg, #152E27 20%, #2b5148 100%)",
  "linear-gradient(160deg, #1a3d2a 0%, #007845 70%)",
  "linear-gradient(160deg, #0d2e1e 0%, #2b5148 100%)",
];

function SlideCard({ slide, index }: { slide: typeof SLIDES[0]; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex-shrink-0"
      style={{ width: "var(--card-w)", height: "var(--card-h)" }}
    >
      {!imgError ? (
        <Image
          src={slide.image}
          alt={slide.caption}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4"
          style={{ background: GRADIENTS[index % GRADIENTS.length] }}
        >
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M24 4C24 4 8 12 8 28C8 36.837 15.163 44 24 44C32.837 44 40 36.837 40 28C40 12 24 4 24 4Z" fill="rgba(255,255,255,0.10)" />
            <path d="M24 44V20M24 28C24 28 16 24 14 18M24 32C24 32 30 28 33 22" stroke="rgba(255,255,255,0.30)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-center font-medium" style={{ color: "rgba(255,255,255,0.40)" }}>
            Add {slide.image.replace("/results/", "")} to /public/results/
          </p>
        </div>
      )}

      {/* Bottom gradient + caption */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(8,20,14,0.82) 0%, rgba(8,20,14,0.10) 50%, transparent 100%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green-accent)" }}>
          {slide.product}
        </p>
        <p className="font-bold text-base leading-snug text-white mb-0.5" style={{ letterSpacing: "-0.01em" }}>
          {slide.caption}
        </p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
          {slide.customer}
        </p>
      </div>
    </div>
  );
}

export function ResultsShowcase() {
  const total    = SLIDES.length;
  const [offset, setOffset] = useState(0); // 0-based index of leftmost visible card
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // How many cards to show depends on viewport — handled via CSS var
  // For JS logic we use a simple clamp
  const visibleCount = useRef(3);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      visibleCount.current = w < 640 ? 1 : w < 1024 ? 2 : 3;
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxOffset = total - 1;

  const next = useCallback(() => setOffset((o) => Math.min(o + 1, maxOffset)), [maxOffset]);
  const prev = useCallback(() => setOffset((o) => Math.max(o - 1, 0)), []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setOffset((o) => (o >= maxOffset ? 0 : o + 1));
    }, 4500);
    return () => clearInterval(t);
  }, [paused, maxOffset]);

  return (
    <section
      className="py-16 lg:py-24 overflow-hidden"
      style={{ background: "var(--canvas)" }}
      aria-labelledby="results-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* CSS vars for card dimensions — responsive */}
      <style>{`
        :root {
          --card-w: min(84vw, 420px);
          --card-h: 480px;
          --card-gap: 16px;
        }
        @media (min-width: 640px) {
          :root {
            --card-w: min(46vw, 400px);
            --card-h: 500px;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --card-w: min(32vw, 420px);
            --card-h: 520px;
            --card-gap: 20px;
          }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green-accent)", letterSpacing: "0.12em" }}>
              See it for yourself
            </p>
            <h2
              id="results-heading"
              className="font-bold mb-2"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "var(--green-house)", letterSpacing: "-0.02em" }}
            >
              Real gardens.{" "}
              <em className="font-serif" style={{ color: "var(--green-accent)", fontStyle: "italic" }}>Real results.</em>
            </h2>
            <p className="text-base" style={{ color: "var(--text-black-soft)" }}>
              Real customer gardens with real results.
            </p>
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={prev}
              disabled={offset === 0}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background:   offset === 0 ? "var(--ceramic)" : "var(--green-house)",
                color:        offset === 0 ? "var(--text-black-soft)" : "#fff",
                border:       "none",
                cursor:       offset === 0 ? "default" : "pointer",
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={offset === maxOffset}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background:   offset === maxOffset ? "var(--ceramic)" : "var(--green-house)",
                color:        offset === maxOffset ? "var(--text-black-soft)" : "#fff",
                border:       "none",
                cursor:       offset === maxOffset ? "default" : "pointer",
              }}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Card track */}
        <div className="overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex"
            animate={{ x: `calc(-${offset} * (var(--card-w) + var(--card-gap)))` }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ gap: "var(--card-gap)" }}
          >
            {SLIDES.map((slide, i) => (
              <SlideCard key={i} slide={slide} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-2 mt-8" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === offset}
              onClick={() => setOffset(i)}
              style={{
                width:        i === offset ? "28px" : "8px",
                height:       "8px",
                borderRadius: "4px",
                background:   i === offset ? "var(--green-accent)" : "var(--ceramic)",
                border:       "none",
                cursor:       "pointer",
                transition:   "all 0.3s ease",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
