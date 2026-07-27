"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:   "Bio Bloom doubled my tomato yield this season. I've tried 6 different fertilisers and nothing comes close.",
    name:    "Sarah M.",
    city:    "Sydney, NSW",
    rating:  5,
    initial: "S",
    product: "Bio Bloom Fertiliser",
    color:   "#006241",
    verified: true,
  },
  {
    quote:   "Finally a fertiliser that explains exactly why every ingredient is there. That transparency alone sets BioGardeners apart.",
    name:    "James T.",
    city:    "Melbourne, VIC",
    rating:  5,
    initial: "J",
    product: "Deep Root Tonic",
    color:   "#00754A",
    verified: true,
  },
  {
    quote:   "I've gardened for 20 years. Terra Pro is the best potting mix I've ever used — drainage is perfect and my herbs are thriving.",
    name:    "Helen R.",
    city:    "Brisbane, QLD",
    rating:  5,
    initial: "H",
    product: "Terra Pro Soil Mix",
    color:   "#1E3932",
    verified: true,
  },
  {
    quote:   "Deep Root Tonic made a visible difference in my fruit trees within two weeks. New growth on every branch.",
    name:    "David K.",
    city:    "Perth, WA",
    rating:  5,
    initial: "D",
    product: "Deep Root Tonic",
    color:   "#2b5148",
    verified: true,
  },
  {
    quote:   "Love that it's Australian made. My succulents are thriving with Terra Pro. Fast delivery too — ordered Monday, arrived Wednesday.",
    name:    "Amy C.",
    city:    "Adelaide, SA",
    rating:  5,
    initial: "A",
    product: "Terra Pro Soil Mix",
    color:   "#006241",
    verified: true,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, pct: 84 },
  { stars: 4, pct: 11 },
  { stars: 3, pct: 3  },
  { stars: 2, pct: 1  },
  { stars: 1, pct: 1  },
];

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size} fill={s <= count ? "var(--gold)" : "none"} stroke={s <= count ? "none" : "var(--input-border)"} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      className="py-16 lg:py-24"
      style={{ background: "var(--surface-alt)" }}
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

        {/* Header + rating summary */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          >
            <h2
              id="reviews-heading"
              className="font-bold text-4xl lg:text-5xl mb-2"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.02em" }}
            >
              What growers say
            </h2>
            <p className="text-base" style={{ color: "var(--text-black-soft)" }}>
              Verified purchases from Australian home gardeners.
            </p>
          </motion.div>

          {/* Rating breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-bold" style={{ color: "var(--green-bio)" }}>4.9</span>
              <div>
                <Stars count={5} size={16} />
                <p className="text-xs mt-1" style={{ color: "var(--text-black-soft)" }}>380 verified reviews</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {RATING_BREAKDOWN.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2.5">
                  <span className="text-xs w-5 text-right shrink-0" style={{ color: "var(--text-black-soft)" }}>{stars}</span>
                  <Star size={10} fill="var(--gold)" stroke="none" className="shrink-0" />
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--ceramic)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                      className="h-full rounded-full"
                      style={{ background: "var(--green-accent)" }}
                    />
                  </div>
                  <span className="text-xs w-7 shrink-0" style={{ color: "var(--text-black-soft)" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cards — horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 lg:-mx-10 lg:px-10 snap-x snap-mandatory scrollbar-none">
          {testimonials.map((t, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              className="flex-shrink-0 snap-start flex flex-col w-[85vw] sm:w-[340px] rounded-2xl p-6 bg-white"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <Stars count={t.rating} size={13} />
                {t.verified && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--green-xlight)", color: "var(--green-bio)" }}
                  >
                    Verified
                  </span>
                )}
              </div>

              <blockquote className="text-sm flex-1 mb-5 leading-relaxed" style={{ color: "var(--text-black)" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: t.color }}
                    aria-hidden="true"
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>{t.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-black-soft)" }}>{t.city}</p>
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-right max-w-[90px]" style={{ color: "var(--text-black-soft)" }}>
                  {t.product}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
