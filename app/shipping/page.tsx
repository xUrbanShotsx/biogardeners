"use client";

import { motion } from "framer-motion";
import { Truck, Zap, MapPin, Clock, RotateCcw, ShieldCheck, PackageCheck, AlertCircle } from "lucide-react";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

const SHIPPING_OPTIONS = [
  {
    icon:     Truck,
    name:     "Standard Shipping",
    price:    "Free over $80 · $8.95 under",
    delivery: "3–5 business days (metro) · 5–8 days (regional)",
    detail:   "Available for all Australian addresses. Orders placed before 12pm AEST are dispatched same day.",
    highlight: false,
  },
  {
    icon:     Zap,
    name:     "Express Shipping",
    price:    "$14.95",
    delivery: "1–2 business days",
    detail:   "Available for metro areas in NSW, VIC, QLD, SA, WA. Order before 12pm AEST for same-day dispatch.",
    highlight: true,
  },
];

const STATES = [
  { state: "NSW / ACT",  standard: "2–4 days", express: "Next day"   },
  { state: "VIC",        standard: "2–4 days", express: "Next day"   },
  { state: "QLD",        standard: "3–5 days", express: "1–2 days"   },
  { state: "SA",         standard: "3–5 days", express: "1–2 days"   },
  { state: "WA",         standard: "5–8 days", express: "2–3 days"   },
  { state: "TAS",        standard: "4–6 days", express: "2–3 days"   },
  { state: "NT",         standard: "6–9 days", express: "3–5 days"   },
  { state: "Remote",     standard: "8–12 days", express: "Not available" },
];

const RETURN_STEPS = [
  { step: "01", title: "Contact us", body: "Email hello@biogardeners.com.au with your order number and reason for return. We'll respond within 24 hours." },
  { step: "02", title: "Pack it up", body: "Repack the product in its original packaging if possible. We'll email you a prepaid return label for eligible returns." },
  { step: "03", title: "Drop it off", body: "Drop the parcel at any Australia Post outlet. Keep your receipt — it's your proof of return." },
  { step: "04", title: "Get your refund", body: "Once we receive and inspect the return, your refund is processed within 2 business days to your original payment method." },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  },
};

export default function ShippingPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Header band */}
        <div style={{ background: "var(--green-accent)" }} className="px-6 lg:px-10 py-14">
          <div className="max-w-[1440px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}>
              <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                Orders
              </p>
              <h1 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "#fff", letterSpacing: "-0.02em" }}>
                Shipping &amp; Returns
              </h1>
              <p className="text-base max-w-lg" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                We ship to every corner of Australia. Free standard shipping on orders over $80.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-14">

          {/* Shipping options */}
          <section className="mb-16" aria-labelledby="shipping-options-heading">
            <motion.h2
              id="shipping-options-heading"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="font-bold text-2xl lg:text-3xl mb-6"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            >
              Shipping options
            </motion.h2>

            <motion.div
              variants={stagger.container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {SHIPPING_OPTIONS.map(({ icon: Icon, name, price, delivery, detail, highlight }) => (
                <motion.div
                  key={name}
                  variants={stagger.item}
                  className="rounded-2xl p-6"
                  style={{
                    background:  highlight ? "var(--green-accent)" : "var(--surface-alt)",
                    boxShadow:   "var(--shadow-card)",
                    outline:     highlight ? "none" : "1px solid var(--ceramic)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: highlight ? "rgba(255,255,255,0.15)" : "var(--green-xlight)" }}
                    >
                      <Icon size={17} style={{ color: highlight ? "#fff" : "var(--green-accent)" }} />
                    </div>
                    <div>
                      <p className="font-bold text-base" style={{ color: highlight ? "#fff" : "var(--text-black)", letterSpacing: "-0.01em" }}>
                        {name}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: highlight ? "var(--green-light)" : "var(--green-bio)" }}>
                        {price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={13} style={{ color: highlight ? "rgba(255,255,255,0.6)" : "var(--text-black-soft)" }} />
                    <span className="text-sm font-semibold" style={{ color: highlight ? "rgba(255,255,255,0.85)" : "var(--text-black)" }}>
                      {delivery}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: highlight ? "rgba(255,255,255,0.65)" : "var(--text-black-soft)" }}>
                    {detail}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Delivery times by state */}
          <section className="mb-16" aria-labelledby="delivery-times-heading">
            <motion.h2
              id="delivery-times-heading"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="font-bold text-2xl lg:text-3xl mb-6"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            >
              Estimated delivery by state
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)", border: "1px solid var(--ceramic)" }}
            >
              {/* Table header */}
              <div className="grid grid-cols-3 px-6 py-3.5" style={{ background: "var(--green-accent)" }}>
                {["State / Territory", "Standard", "Express"].map((h) => (
                  <p key={h} className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: "rgba(255,255,255,0.60)" }}>{h}</p>
                ))}
              </div>
              {STATES.map((row, i) => (
                <div
                  key={row.state}
                  className="grid grid-cols-3 px-6 py-4"
                  style={{ background: i % 2 === 0 ? "#fff" : "var(--surface-alt)", borderTop: "1px solid var(--ceramic)" }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>
                    <MapPin size={12} className="inline mr-1.5" style={{ color: "var(--green-accent)" }} />
                    {row.state}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>{row.standard}</p>
                  <p className="text-sm" style={{ color: row.express === "Not available" ? "var(--text-black-soft)" : "var(--text-black)" }}>
                    {row.express}
                  </p>
                </div>
              ))}
            </motion.div>
            <p className="text-xs mt-3" style={{ color: "var(--text-black-soft)" }}>
              * Delivery estimates are from dispatch date, on business days only. Remote postcodes may take longer.
            </p>
          </section>

          {/* Important shipping info */}
          <section className="mb-16" aria-labelledby="shipping-info-heading">
            <motion.h2
              id="shipping-info-heading"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="font-bold text-2xl lg:text-3xl mb-6"
              style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            >
              Good to know
            </motion.h2>

            <motion.div
              variants={stagger.container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[
                { icon: PackageCheck, title: "Same-day dispatch",  body: "Orders placed before 12pm AEST Monday–Friday are packed and dispatched the same business day." },
                { icon: MapPin,       title: "Tracking included",  body: "Every order includes tracking. You'll receive a link by email once your parcel is on its way." },
                { icon: AlertCircle,  title: "Remote surcharge",   body: "Some remote postcodes (outback WA, far north QLD, NT) may attract a freight surcharge shown at checkout." },
              ].map(({ icon: Icon, title, body }) => (
                <motion.div
                  key={title}
                  variants={stagger.item}
                  className="flex gap-4 rounded-xl p-5"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--green-xlight)" }}>
                    <Icon size={15} style={{ color: "var(--green-accent)" }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: "var(--text-black)" }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Returns */}
          <section className="mb-16" aria-labelledby="returns-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--green-xlight)" }}>
                <RotateCcw size={17} style={{ color: "var(--green-accent)" }} />
              </div>
              <motion.h2
                id="returns-heading"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="font-bold text-2xl lg:text-3xl"
                style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
              >
                Returns policy
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-6 lg:p-8 mb-8"
              style={{ background: "var(--green-xlight)", border: "1px solid var(--green-light)" }}
            >
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} style={{ color: "var(--green-bio)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="font-bold text-lg mb-1.5" style={{ color: "var(--green-accent)" }}>30-day satisfaction guarantee</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
                    If you&apos;re unhappy with any BioGardeners product for any reason within 30 days of purchase, we&apos;ll refund you in full. No forms, no fine print. Unopened products can be returned for a full refund. Opened products are covered under our satisfaction guarantee — if it didn&apos;t work for your garden, we want to know.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Return steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RETURN_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                  className="rounded-xl p-5 relative overflow-hidden"
                  style={{ background: "#fff", border: "1px solid var(--ceramic)", boxShadow: "var(--shadow-card)" }}
                >
                  <span
                    className="absolute top-3 right-4 font-bold select-none"
                    style={{ fontSize: "3.5rem", color: "rgba(0,0,0,0.04)", letterSpacing: "-0.04em", lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {s.step}
                  </span>
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold mb-4"
                    style={{ background: "var(--green-accent)" }}
                  >
                    {s.step}
                  </div>
                  <p className="font-bold text-sm mb-2" style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>{s.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{s.body}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--surface-alt)" }}
          >
            <h2 className="font-bold text-xl mb-2" style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}>Need help with an order?</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-black-soft)" }}>
              Email us at{" "}
              <a href="mailto:hello@biogardeners.com.au" className="font-semibold" style={{ color: "var(--green-accent)" }}>
                hello@biogardeners.com.au
              </a>
              {" "}or visit our FAQ page.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn btn-primary" style={{ fontSize: 14, padding: "12px 28px" }}>Contact us</Link>
              <Link href="/faq" className="btn btn-outline" style={{ fontSize: 14, padding: "12px 28px" }}>View FAQ</Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
