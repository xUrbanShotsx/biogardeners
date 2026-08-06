"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title:  "Choose your product",
    body:   "Browse our range of Australian-made fertilisers, soil conditioners, and supplements. Pick the right formula for your lawn, garden beds, or pot plants.",
    color:  "var(--green-xlight)",
    accent: "var(--green-accent)",
  },
  {
    number: "02",
    title:  "We ship it fast",
    body:   "Order today and we'll get it on its way. Standard delivery 3–5 business days, express available. Free shipping on orders over $80.",
    color:  "var(--green-light)",
    accent: "var(--green-bio)",
  },
  {
    number: "03",
    title:  "Apply and watch it work",
    body:   "Follow the simple instructions on the pack. Most customers see stronger colour, new growth, and healthier plants within a couple of weeks.",
    color:  "#d4e9e2",
    accent: "var(--green-house)",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24" style={{ background: "var(--canvas)" }} aria-labelledby="how-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="mb-12"
        >
          <h2
            id="how-heading"
            className="font-bold text-4xl lg:text-5xl mb-2"
            style={{ color: "var(--green-bio)", letterSpacing: "-0.02em" }}
          >
            How it works
          </h2>
          <p className="text-base" style={{ color: "var(--text-black-soft)" }}>
            Simple process, real results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              className="relative overflow-hidden"
              style={{
                background:   step.color,
                borderRadius: "var(--radius-card)",
                padding:      "2rem",
              }}
            >
              {/* Large number backdrop */}
              <span
                className="absolute top-3 right-4 font-bold select-none"
                style={{ fontSize: "5.5rem", color: "rgba(0,0,0,0.05)", letterSpacing: "-0.04em", lineHeight: 1 }}
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Step number chip */}
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-5 text-white font-bold text-sm"
                style={{ background: step.accent }}
              >
                {step.number}
              </div>

              <h3
                className="font-bold text-xl mb-3 relative z-10"
                style={{ color: "var(--green-house)", letterSpacing: "-0.01em" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--text-black-soft)" }}>
                {step.body}
              </p>

              {/* Connector line — hidden on last */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 -translate-y-1/2 z-20"
                  style={{ background: "var(--input-border)" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
