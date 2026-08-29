"use client";

import { motion } from "framer-motion";
import {
  Truck, MapPin, Clock, RotateCcw, ShieldCheck,
  PackageCheck, AlertCircle, ChevronRight,
} from "lucide-react";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

const STATES = [
  { state: "NSW / ACT", delivery: "2–4 business days" },
  { state: "VIC",        delivery: "2–4 business days" },
  { state: "QLD",        delivery: "3–5 business days" },
  { state: "SA",         delivery: "3–5 business days" },
  { state: "WA",         delivery: "5–8 business days" },
  { state: "TAS",        delivery: "4–6 business days" },
  { state: "NT",         delivery: "6–9 business days" },
  { state: "Remote",     delivery: "8–12 business days" },
];

const FAULTY_STEPS = [
  {
    n: "01", title: "Contact us within 48 hrs",
    body: "Email hello@biogardeners.com.au with your order number and photos of the damaged or faulty item within 48 hours of delivery.",
  },
  {
    n: "02", title: "We assess your claim",
    body: "Our team reviews your case within one business day and confirms the appropriate remedy under Australian Consumer Law.",
  },
  {
    n: "03", title: "Remedy arranged",
    body: "Where applicable, we'll arrange a replacement, repair, or remedy. We'll advise you on next steps once your claim is confirmed.",
  },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const fade = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.48, delay, ease: EASE },
});

export default function ShippingPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* ── Hero band ─────────────────────────────── */}
        <div className="px-6 lg:px-10 py-16 lg:py-24" style={{ background: "var(--green-house)" }}>
          <div className="max-w-[1440px] mx-auto">
            <motion.div {...fade()}>
              <h1 className="font-bold mb-4" style={{ fontSize: "clamp(2.2rem,4.5vw,3.8rem)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.06 }}>
                Shipping &amp; Returns
              </h1>
              <p className="text-base max-w-lg mb-8" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                One simple rate, every address in Australia. No minimum spend, no surprises at checkout.
              </p>

              {/* Rate callout */}
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--green-accent)" }}>
                  <Truck size={20} color="#fff" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white leading-none">$15.95</p>
                  <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                    Flat rate · every Australian address
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-14">

          {/* ── Delivery info cards ──────────────────── */}
          <section className="mb-16" aria-labelledby="shipping-info-heading">
            <motion.h2
              id="shipping-info-heading"
              {...fade()}
              className="font-bold text-2xl lg:text-3xl mb-6"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            >
              How it works
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Clock,
                  title: "Processing time",
                  body: "Orders are packed and dispatched within 1–2 business days of being placed.",
                },
                {
                  icon: PackageCheck,
                  title: "Tracking included",
                  body: "Every order ships with full tracking. You'll receive a tracking link by email once dispatched.",
                },
                {
                  icon: AlertCircle,
                  title: "Remote areas",
                  body: "Deliveries to remote postcodes (outback WA, far north QLD, NT) may take up to 12 business days.",
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  {...fade(i * 0.07)}
                  className="flex gap-4 rounded-2xl p-5"
                  style={{ background: "#fff", border: "1px solid var(--ceramic)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}>
                    <Icon size={15} style={{ color: "var(--green-bio)" }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: "var(--green-house)" }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── State delivery table ─────────────────── */}
          <section className="mb-16" aria-labelledby="delivery-times-heading">
            <motion.h2
              id="delivery-times-heading"
              {...fade()}
              className="font-bold text-2xl lg:text-3xl mb-6"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            >
              Estimated delivery times
            </motion.h2>

            <motion.div
              {...fade(0.05)}
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--ceramic)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              {/* Table head */}
              <div className="grid grid-cols-2 px-6 py-3.5" style={{ background: "var(--green-house)" }}>
                {["State / Territory", "Estimated delivery from dispatch"].map((h) => (
                  <p key={h} className="text-xs font-bold uppercase tracking-[0.08em]"
                    style={{ color: "rgba(255,255,255,0.50)" }}>{h}</p>
                ))}
              </div>

              {STATES.map((row, i) => (
                <div
                  key={row.state}
                  className="grid grid-cols-2 px-6 py-4 items-center"
                  style={{
                    background: i % 2 === 0 ? "#fff" : "var(--surface-alt)",
                    borderTop: "1px solid var(--ceramic)",
                  }}
                >
                  <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--text-black)" }}>
                    <MapPin size={12} style={{ color: "var(--green-accent)", flexShrink: 0 }} />
                    {row.state}
                  </p>
                  <p className="text-sm" style={{ color: row.state === "Remote" ? "var(--text-black-soft)" : "var(--text-black)" }}>
                    {row.delivery}
                  </p>
                </div>
              ))}
            </motion.div>

            <p className="text-xs mt-3 pl-1" style={{ color: "var(--text-black-soft)" }}>
              Estimates are from dispatch date on business days. Remote postcodes may exceed the upper bound.
            </p>
          </section>

          {/* ── Returns ─────────────────────────────── */}
          <section className="mb-16" aria-labelledby="returns-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}>
                <RotateCcw size={16} style={{ color: "var(--green-bio)" }} />
              </div>
              <h2 id="returns-heading" className="font-bold text-2xl lg:text-3xl"
                style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}>
                Returns policy
              </h2>
            </div>

            {/* No-returns callout */}
            <motion.div
              {...fade()}
              className="rounded-2xl p-6 lg:p-8 mb-8 flex items-start gap-4"
              style={{ background: "var(--green-house)" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <ShieldCheck size={18} color="rgba(255,255,255,0.70)" />
              </div>
              <div>
                <p className="font-bold text-lg mb-2" style={{ color: "#fff" }}>All sales are final</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>
                  We do not accept change-of-mind returns or exchanges. Please review your order carefully before completing purchase.
                  If your order arrives damaged, faulty, or not as described, please contact us within 48 hours of delivery — we&apos;ll
                  arrange a remedy in accordance with your rights under the Australian Consumer Law.
                </p>
              </div>
            </motion.div>

            {/* Faulty goods process */}
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-black-soft)" }}>
              Received a damaged or faulty item? Here&apos;s what to do:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FAULTY_STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  {...fade(i * 0.08)}
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: "#fff", border: "1px solid var(--ceramic)" }}
                >
                  <span
                    className="absolute top-2 right-3 font-bold select-none pointer-events-none"
                    style={{ fontSize: "3.5rem", color: "rgba(0,0,0,0.04)", letterSpacing: "-0.04em", lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {s.n}
                  </span>
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold mb-4"
                    style={{ background: "var(--green-bio)" }}>
                    {s.n}
                  </div>
                  <p className="font-bold text-sm mb-1.5" style={{ color: "var(--green-house)" }}>{s.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{s.body}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Contact CTA ──────────────────────────── */}
          <motion.div
            {...fade()}
            className="rounded-2xl p-8 lg:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
          >
            <div>
              <h2 className="font-bold text-xl mb-1.5" style={{ color: "var(--green-house)", letterSpacing: "-0.01em" }}>
                Need help with an order?
              </h2>
              <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>
                Email{" "}
                <a href="mailto:hello@biogardeners.com.au" className="font-semibold"
                  style={{ color: "var(--green-accent)" }}>
                  hello@biogardeners.com.au
                </a>
                {" "}and we&apos;ll get back to you within one business day.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/contact" className="btn btn-primary flex items-center gap-1.5"
                style={{ fontSize: 14, padding: "11px 24px" }}>
                Contact us <ChevronRight size={14} />
              </Link>
              <Link href="/faq" className="btn btn-outline"
                style={{ fontSize: 14, padding: "11px 24px" }}>
                View FAQ
              </Link>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
