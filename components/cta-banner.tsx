"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export function CtaBanner() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <>
      {/* Main CTA band */}
      <section
        className="py-16 lg:py-24"
        style={{ background: "var(--green-house)" }}
        aria-labelledby="cta-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
          >
            <div>
              <h2
                id="cta-heading"
                className="font-bold text-4xl lg:text-5xl mb-4"
                style={{ color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.12 }}
              >
                Grow more, waste less —<br />
                <em className="font-serif" style={{ color: "var(--green-light)", fontStyle: "italic" }}>
                  results you can see.
                </em>
              </h2>
              <p className="text-base max-w-[400px]" style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.65 }}>
                Science-backed formulas crafted for Australian soil. Over 2,400 home gardeners
                choose BioGardeners every season. Flat rate $17.95 shipping, Australia wide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/products/gp-fertiliser-premium-garden-lawn" className="btn btn-white-filled" style={{ fontSize: 16, padding: "15px 32px" }}>
                Shop Bestseller
              </Link>
              <Link href="/products" className="btn btn-outline-white" style={{ fontSize: 16, padding: "15px 32px" }}>
                View all products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Email capture strip */}
      <section
        className="py-12"
        style={{ background: "var(--green-bio)" }}
        aria-labelledby="newsletter-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Mail size={18} color="#fff" />
              </div>
              <div>
                <h3 id="newsletter-heading" className="font-bold text-lg" style={{ color: "#fff", letterSpacing: "-0.01em" }}>
                  Get 10% off your first order
                </h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
                  Plus seasonal growing tips from our team — no spam, ever.
                </p>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--green-light)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                You&apos;re in! Check your inbox.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 sm:w-64 px-4 py-3 rounded-full text-sm font-medium border-0 outline-none"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", caretColor: "#fff" }}
                  aria-label="Email address"
                />
                <button type="submit" className="btn btn-white-filled gap-2 shrink-0" style={{ fontSize: 14, padding: "10px 22px" }}>
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
