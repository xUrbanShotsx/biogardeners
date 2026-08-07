"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title:  "Choose your product",
    body:   "Browse our range of Australian-made fertilisers, soil conditioners, and supplements. Pick the right formula for your lawn, garden beds, or pot plants.",
    bg:     "var(--green-xlight)",
    accent: "var(--green-accent)",
    inkBg:  "#fff",
  },
  {
    number: "02",
    title:  "We ship it fast",
    body:   "Order today and we'll get it on its way. Standard delivery 3–5 business days, express available. Free shipping on orders over $80.",
    bg:     "var(--ceramic)",
    accent: "var(--green-bio)",
    inkBg:  "#fff",
  },
  {
    number: "03",
    title:  "Apply and watch it work",
    body:   "Follow the simple instructions on the pack. Most customers see stronger colour, new growth, and healthier plants within a couple of weeks.",
    bg:     "var(--green-house)",
    accent: "#fff",
    inkBg:  "rgba(255,255,255,0.15)",
  },
];

// Animated progress line — draws in as section scrolls into view
function ProgressLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target:  ref,
    offset:  ["start 85%", "start 30%"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <div ref={ref} className="hidden md:block relative h-px my-0" aria-hidden="true">
      {/* Track */}
      <div className="absolute inset-0" style={{ background: "var(--ceramic)" }} />
      {/* Fill */}
      <motion.div
        className="absolute inset-0 origin-left"
        style={{ background: "var(--green-accent)", scaleX }}
      />
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24" style={{ background: "var(--canvas)" }} aria-labelledby="how-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h2
            id="how-heading"
            className="font-bold mb-2"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--green-bio)", letterSpacing: "-0.02em" }}
          >
            How it works
          </h2>
          <p className="text-base" style={{ color: "var(--text-black-soft)" }}>Simple process, real results.</p>
        </motion.div>

        {/* Animated connecting line across all 3 cards */}
        <ProgressLine />

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.14, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ background: step.bg, borderRadius: "var(--radius-card)", padding: "2rem" }}
            >
              {/* Large watermark number */}
              <span
                className="absolute top-3 right-4 font-bold select-none"
                style={{
                  fontSize:      "5.5rem",
                  color:         i === 2 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  letterSpacing: "-0.04em",
                  lineHeight:    1,
                }}
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Step circle */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.14, duration: 0.45, type: "spring", stiffness: 300, damping: 18 }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-5 text-sm font-bold"
                style={{ background: step.accent, color: i === 2 ? "var(--green-house)" : "#fff" }}
              >
                {step.number}
              </motion.div>

              <h3
                className="font-bold text-xl mb-3 relative z-10"
                style={{ color: i === 2 ? "#fff" : "var(--green-house)", letterSpacing: "-0.01em" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed relative z-10"
                style={{ color: i === 2 ? "rgba(255,255,255,0.68)" : "var(--text-black-soft)" }}
              >
                {step.body}
              </p>

              {/* Connector arrow between cards (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-20 w-7 h-7 rounded-full items-center justify-center"
                  style={{ background: "var(--canvas)", border: "1px solid var(--ceramic)", fontSize: 11 }}
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
