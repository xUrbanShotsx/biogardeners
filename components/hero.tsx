"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, ArrowRight, Star, Truck, RotateCcw } from "lucide-react";

// ── Fixed cell positions — no Math.random() to avoid SSR mismatch
const BG_CELLS = [
  { w: 220, h: 220, x: 5,  y: 8,  dur: 14, del: 0   },
  { w: 90,  h: 90,  x: 18, y: 74, dur: 10, del: 1.4  },
  { w: 170, h: 170, x: 42, y: 18, dur: 16, del: 0.7  },
  { w: 80,  h: 80,  x: 62, y: 84, dur: 11, del: 2.3  },
  { w: 260, h: 260, x: 76, y: 6,  dur: 18, del: 0.4  },
  { w: 130, h: 130, x: 90, y: 50, dur: 12, del: 2.0  },
  { w: 65,  h: 65,  x: 33, y: 90, dur: 9,  del: 1.1  },
  { w: 200, h: 200, x: 96, y: 72, dur: 15, del: 1.7  },
  { w: 110, h: 110, x: 54, y: 52, dur: 13, del: 3.0  },
];

// ── Orbit bubble – runs on every animation frame, mutates style directly
function OrbitBubble({
  radius,
  period,
  initialAngleDeg,
  label,
  sub,
  delay = 0,
}: {
  radius: number;
  period: number;
  initialAngleDeg: number;
  label: string;
  sub: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const startAngle = (initialAngleDeg * Math.PI) / 180;
  const startTime  = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (!ref.current) return;
    if (startTime.current === null) startTime.current = time;
    const elapsed = (time - startTime.current) / 1000;
    if (elapsed < delay) return;
    const angle = startAngle + ((elapsed - delay) / period) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });

  const initX = Math.cos(startAngle) * radius;
  const initY = Math.sin(startAngle) * radius;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.0 + delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute pointer-events-none"
      style={{
        top:       "50%",
        left:      "50%",
        transform: `translate(calc(-50% + ${initX}px), calc(-50% + ${initY}px))`,
      }}
    >
      <div
        className="rounded-2xl px-3 py-2 text-center"
        style={{
          background:     "rgba(255,255,255,0.08)",
          border:         "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(8px)",
          whiteSpace:     "nowrap",
        }}
      >
        <p className="text-xs font-bold leading-tight" style={{ color: "#fff" }}>{label}</p>
        <p className="text-[10px] leading-tight mt-0.5" style={{ color: "rgba(255,255,255,0.52)" }}>{sub}</p>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const visualY  = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "var(--green-house)", paddingTop: "var(--nav-h)" }}
      aria-labelledby="hero-heading"
    >
      {/* ── Background: floating soil cells + dot grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize:  "28px 28px",
          }}
        />

        {/* Radial glow – upper right */}
        <div
          className="absolute"
          style={{
            width:        700,
            height:       700,
            right:       -120,
            top:         -120,
            borderRadius: "50%",
            background:  "radial-gradient(circle, rgba(0,117,74,0.20) 0%, transparent 65%)",
          }}
        />

        {/* Floating cells */}
        {BG_CELLS.map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width:           c.w,
              height:          c.h,
              left:            `${c.x}%`,
              top:             `${c.y}%`,
              background:      "rgba(255,255,255,0.028)",
              border:          "1px solid rgba(255,255,255,0.042)",
              animation:       `cell-drift ${c.dur}s ease-in-out infinite alternate`,
              animationDelay:  `${c.del}s`,
              willChange:      "transform",
            }}
          />
        ))}
      </motion.div>

      {/* ── Main grid */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10">
        <div
          className="grid grid-cols-1 lg:grid-cols-[54fr_46fr] gap-8 lg:gap-0 items-center"
          style={{ minHeight: "calc(100vh - var(--nav-h))", paddingTop: "2rem", paddingBottom: "5rem" }}
        >

          {/* ── Left: content */}
          <motion.div
            style={{ y: contentY }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
            }}
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
              <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.48)" }}>
                GP Fertiliser · 98 sold this month
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              id="hero-heading"
              variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.80, ease: [0.16, 1, 0.3, 1] } } }}
              className="font-bold mb-5"
              style={{
                fontSize:      "clamp(2.8rem, 5.8vw, 5.4rem)",
                lineHeight:    1.04,
                letterSpacing: "-0.03em",
                color:         "#fff",
                textWrap:      "balance",
              }}
            >
              Feed your garden
              <br />
              <em
                style={{
                  color:       "var(--green-light)",
                  fontStyle:   "italic",
                  fontFamily:  "var(--font-serif)",
                  fontWeight:  600,
                }}
              >
                the right way.
              </em>
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } }}
              className="text-base md:text-lg mb-8 max-w-[460px]"
              style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.65 }}
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
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:brightness-110 active:scale-95"
                style={{ background: "var(--green-accent)", color: "#fff", boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 6px 24px rgba(0,117,74,0.40)" }}
              >
                <ShoppingBag size={15} />
                Shop Bestseller — from $17
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.88)" }}
              >
                View all products
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Trust micro-line */}
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.45 } } }}
              className="flex flex-wrap items-center gap-2 text-xs mb-10"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              <RotateCcw size={11} />
              30-day money-back guarantee
              <span style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
              <Truck size={11} />
              Free shipping over $80
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, delay: 0.15 } } }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
            >
              {[
                { value: "4.9★",    label: "Average rating"      },
                { value: "380+",    label: "Verified reviews"    },
                { value: "100%",    label: "Australian made"     },
                { value: "10 days", label: "Avg. visible results"},
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="font-bold leading-none mb-1.5"
                    style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "#fff", fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.48)" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: product visual */}
          <motion.div
            style={{ y: visualY, height: "clamp(440px, 52vw, 600px)" }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Ambient glow behind product */}
            <div
              className="absolute"
              style={{
                width:        420,
                height:       420,
                borderRadius: "50%",
                background:   "radial-gradient(circle, rgba(0,98,65,0.40) 0%, transparent 68%)",
                pointerEvents:"none",
              }}
              aria-hidden="true"
            />

            {/* Outer orbit ring (dashed, slowly rotates) */}
            <div
              className="absolute"
              style={{
                width:        380,
                height:       380,
                border:       "1px dashed rgba(255,255,255,0.09)",
                borderRadius: "50%",
                animation:    "slow-spin 60s linear infinite",
              }}
              aria-hidden="true"
            />

            {/* Inner ring */}
            <div
              className="absolute"
              style={{
                width:        280,
                height:       280,
                border:       "1px solid rgba(255,255,255,0.05)",
                borderRadius: "50%",
              }}
              aria-hidden="true"
            />

            {/* Orbit bubbles */}
            <OrbitBubble radius={170} period={22} initialAngleDeg={20}  label="60+ Minerals" sub="Volcanic rock"   delay={0}   />
            <OrbitBubble radius={162} period={29} initialAngleDeg={148} label="pH 6.2–6.8"   sub="Optimal balance" delay={0.2} />
            <OrbitBubble radius={174} period={18} initialAngleDeg={268} label="NPK 8-12-6"   sub="Precision ratio" delay={0.4} />

            {/* Product bag — gently floating */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="relative z-10"
              style={{ filter: "drop-shadow(0 28px 48px rgba(0,0,0,0.50))" }}
            >
              <svg
                viewBox="0 0 320 400"
                xmlns="http://www.w3.org/2000/svg"
                className="w-52 md:w-60 lg:w-64"
                aria-label="BioGardeners GP Fertiliser"
              >
                <defs>
                  <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2b5148" />
                    <stop offset="100%" stopColor="#0d2419" />
                  </linearGradient>
                </defs>
                <rect x="60" y="80" width="200" height="270" rx="16" fill="url(#bagGrad)" />
                <path d="M60 80 Q160 58 260 80 L260 114 Q160 92 60 114 Z" fill="rgba(255,255,255,0.07)" />
                <path d="M110 80 Q110 38 140 38 Q160 38 160 58" fill="none" stroke="#2b5148" strokeWidth="9" strokeLinecap="round" />
                <path d="M210 80 Q210 38 180 38 Q160 38 160 58" fill="none" stroke="#2b5148" strokeWidth="9" strokeLinecap="round" />
                <rect x="80" y="132" width="160" height="170" rx="9" fill="white" opacity="0.97" />
                <circle cx="160" cy="170" r="24" fill="#006241" opacity="0.08" />
                <text x="160" y="163" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="10" fill="#006241" letterSpacing="2">BIO</text>
                <text x="160" y="178" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="800" fontSize="10" fill="#006241" letterSpacing="2">GARDENERS</text>
                <text x="160" y="218" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="14" fill="#1E3932">GP Fertiliser</text>
                <text x="160" y="236" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="14" fill="#1E3932">Garden / Lawn</text>
                <rect x="80" y="250" width="160" height="3" rx="1.5" fill="#00754A" opacity="0.4" />
                <text x="160" y="274" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="400" fontSize="11" fill="rgba(0,0,0,0.50)">5 kg · 12 kg · 20 kg</text>
                <rect x="80" y="287" width="160" height="15" fill="#006241" opacity="0.07" />
                <text x="160" y="298" textAnchor="middle" fontFamily="'Nunito Sans',sans-serif" fontWeight="700" fontSize="9" fill="#006241" letterSpacing="1.5">AUSTRALIAN MADE</text>
                <ellipse cx="160" cy="358" rx="80" ry="9" fill="rgba(0,0,0,0.18)" />
              </svg>
            </motion.div>

            {/* Rating pill */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute top-6 right-0 md:right-4 flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(8px)" }}
            >
              <Star size={13} fill="var(--gold)" stroke="none" />
              <div>
                <p className="text-xs font-bold leading-none" style={{ color: "#fff" }}>4.9 / 5</p>
                <p className="text-[10px] leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.52)" }}>380+ reviews</p>
              </div>
            </motion.div>

            {/* Shipping pill */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              className="absolute bottom-14 left-0 md:left-4 flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(8px)" }}
            >
              <Truck size={13} style={{ color: "var(--green-light)" }} />
              <div>
                <p className="text-xs font-bold leading-none" style={{ color: "#fff" }}>Free shipping</p>
                <p className="text-[10px] leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.52)" }}>Orders over $80</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1.5px solid rgba(255,255,255,0.18)" }}
        >
          <div className="w-[3px] h-2 rounded-full" style={{ background: "rgba(255,255,255,0.38)" }} />
        </motion.div>
      </motion.div>

      {/* ── CSS animations */}
      <style>{`
        @keyframes cell-drift {
          from { transform: translateY(0px) scale(1);    opacity: 1;   }
          to   { transform: translateY(-26px) scale(1.06); opacity: 0.6; }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cell-drift, [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
