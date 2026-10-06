"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout, HeartHandshake, Smile } from "lucide-react";

const principles = [
  {
    Icon: Sprout,
    title: "Regenerative & Eco-Friendly",
    body:  "We stock products that work with your soil, not against it — feeding the living ecosystem beneath your garden so it gets healthier season after season.",
  },
  {
    Icon: HeartHandshake,
    title: "Safe Around Family & Pets",
    body:  "Our range is chosen to be gentle around the people and pets who share your backyard, when used as directed. Garden with confidence.",
  },
  {
    Icon: Smile,
    title: "Genuinely Easy to Use",
    body:  "Clear rates, simple steps and results you can be proud of. Whether you're a first-time grower or a seasoned green thumb, it just works.",
  },
];

export function ScienceSection() {
  return (
    <section
      id="science"
      className="py-16 lg:py-24"
      style={{ background: "var(--green-house)" }}
      aria-labelledby="science-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              id="science-heading"
              className="font-bold mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.08 }}
            >
              Why we love{" "}
              <em className="font-serif" style={{ color: "var(--green-accent)", fontStyle: "italic" }}>
                what we stock.
              </em>
            </h2>

            <p className="text-base mb-10 max-w-[44ch]" style={{ color: "rgba(255,255,255,0.60)", lineHeight: 1.7 }}>
              At BioGardeners, we&apos;re gardeners first. We hand-pick Healthy Earth
              products — a proudly Aussie brand — because they&apos;re kind to the
              environment, safe around your family and pets, and a joy to use. Your
              garden deserves the good stuff, and so do you.
            </p>

            <div className="flex gap-3">
              <Link href="/growing-guides" className="btn btn-white-filled" style={{ fontSize: 14, padding: "11px 26px" }}>
                Learn more
              </Link>
              <Link href="/products" className="btn btn-outline-white" style={{ fontSize: 14, padding: "11px 26px" }}>
                Shop now
              </Link>
            </div>
          </motion.div>

          {/* Right — principle cards */}
          <div className="flex flex-col gap-4">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + i * 0.10, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-5 items-start"
                style={{ background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "var(--green-accent)" }}
                >
                  <p.Icon size={18} color="#fff" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1.5" style={{ color: "#fff", letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.58)" }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
