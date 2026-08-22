"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

const CATEGORIES = ["All", "Products", "Orders", "Shipping", "Returns", "Growing tips"];

const FAQS = [
  {
    category: "Products",
    q: "What makes BioGardeners different from supermarket fertilisers?",
    a: "Supermarket fertilisers are typically generic blends with cheap salt-based nutrients that release too quickly, burning roots and washing through the soil. Our formulas use chelated minerals, slow-release nitrogen, and living soil inputs (like mycorrhizal fungi in Deep Root Tonic) calibrated to Australian soil profiles. Every ingredient earns its place.",
  },
  {
    category: "Products",
    q: "Are your products safe for edible gardens — vegetables, herbs, fruits?",
    a: "Yes. All BioGardeners products are safe for edible plants. Bio Bloom Fertiliser and Terra Pro Soil Mix are specifically formulated for vegetables, herbs, and fruiting plants. Deep Root Tonic is also safe for edibles and is particularly beneficial for fruit trees and tomatoes.",
  },
  {
    category: "Products",
    q: "Can I use Bio Bloom and Deep Root Tonic together?",
    a: "Absolutely — they work synergistically. Apply Deep Root Tonic at transplanting to establish the root network, then begin Bio Bloom fertiliser two weeks later once the plant is settled. Do not mix Deep Root Tonic with chemical fungicides as these will kill the beneficial fungi.",
  },
  {
    category: "Products",
    q: "How long does a bag of Bio Bloom last?",
    a: "A 1kg bag covers approximately 33m² at the standard 30g/m² application rate, or treats a typical 4×8m raised bed about twice. For a standard 20–30m² home vegetable garden used every 6–8 weeks, a 1kg bag lasts roughly one season.",
  },
  {
    category: "Products",
    q: "Are your products organic?",
    a: "Our products use a mix of organic inputs (humic acid, seaweed extract, mycorrhizal fungi, composted bark) and precision mineral compounds to achieve the best results. We prioritise soil biology over certification labels — but if organic certification is important to you, please contact us and we can advise which products best fit that requirement.",
  },
  {
    category: "Products",
    q: "What is the shelf life of your products?",
    a: "Bio Bloom Fertiliser and Terra Pro Soil Mix are stable for 3 years when stored in a cool, dry place. Deep Root Tonic contains living organisms and should be used within 18 months of manufacture — the batch date is printed on each bottle. Store out of direct sunlight and do not freeze.",
  },
  {
    category: "Orders",
    q: "How do I place an order?",
    a: "Add any product to your cart, then proceed to checkout. We accept Visa, Mastercard, Amex, PayPal, and Afterpay. Orders are confirmed by email immediately after payment.",
  },
  {
    category: "Orders",
    q: "Can I change or cancel my order after placing it?",
    a: "Orders can be modified or cancelled within 2 hours of placing them by emailing hello@biogardeners.com.au with your order number. After that window, our fulfilment team will have already packed your order and we cannot guarantee changes.",
  },
  {
    category: "Orders",
    q: "Do you offer bulk or wholesale pricing?",
    a: "Yes. For orders over 20 units or for wholesale/trade accounts (nurseries, market gardens, councils), please contact us at wholesale@biogardeners.com.au. We offer tiered pricing from 15% off for recurring orders.",
  },
  {
    category: "Shipping",
    q: "How long does delivery take?",
    a: "Standard shipping takes 3–5 business days to metro areas and 5–8 business days to regional addresses. Express shipping (1–2 business days) is available at checkout for an additional $14.95. We dispatch all orders placed before 12pm AEST on the same business day.",
  },
  {
    category: "Shipping",
    q: "Do you ship to all of Australia?",
    a: "Yes — we ship to all states and territories including remote WA, NT, and regional QLD. Some remote postcodes may incur an additional freight surcharge; this will be displayed at checkout before payment.",
  },
  {
    category: "Shipping",
    q: "How much does shipping cost?",
    a: "We ship Australia wide for a flat rate of $17.95 per order, regardless of size or location. Standard delivery takes 3–5 business days.",
  },
  {
    category: "Shipping",
    q: "Can I track my order?",
    a: "Yes. Once your order is dispatched, you'll receive a tracking link by email. We ship via Australia Post and Sendle depending on your location. Tracking updates within 24 hours of dispatch.",
  },
  {
    category: "Returns",
    q: "What is your returns policy?",
    a: "We offer 30-day returns on all unopened products in original packaging. If you're unsatisfied for any reason, contact us at hello@biogardeners.com.au and we'll arrange a return and full refund, no questions asked.",
  },
  {
    category: "Returns",
    q: "What if my order arrives damaged?",
    a: "If your order arrives damaged or incorrect, photograph the packaging and product and email us within 48 hours of delivery. We'll ship a replacement immediately at no cost — you keep the damaged product.",
  },
  {
    category: "Returns",
    q: "My plants didn't improve — can I get a refund?",
    a: "Results depend on multiple factors including existing soil conditions, climate, and application method. If you followed our application guide and didn't see improvement within 30 days, contact us — we'll troubleshoot together and, if we can't help, we'll refund you in full.",
  },
  {
    category: "Growing tips",
    q: "When is the best time to apply Bio Bloom Fertiliser?",
    a: "Apply at the start of the growing season (late August–September in most of Australia) and then every 6–8 weeks through flowering and fruiting. Avoid applying in the heat of summer (above 35°C) or directly before heavy rain. Morning application with a good water-in works best.",
  },
  {
    category: "Growing tips",
    q: "My soil is very sandy / very clay — which product should I start with?",
    a: "For sandy soils, start with Terra Pro Soil Mix as a 30% blend-in — the coir and bark structure dramatically improves water retention. For clay soils, Terra Pro's perlite content improves drainage. Follow with Deep Root Tonic at planting to establish the fungal network that makes both soil types more accessible to roots.",
  },
  {
    category: "Growing tips",
    q: "How do I use Deep Root Tonic for established trees?",
    a: "For established trees, dilute 5ml per litre and apply as a drench to the root zone — from the trunk out to the drip line. For large trees, use 10–20 litres of diluted solution per application. Apply in spring when soil temperature rises above 10°C, then once more in autumn.",
  },
];

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid var(--ceramic)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-base" style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--text-black-soft)" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex,      setOpenIndex]      = useState<number | null>(0);
  const [search,         setSearch]         = useState("");

  const filtered = FAQS.filter((f) => {
    const matchCat    = activeCategory === "All" || f.category === activeCategory;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Header band */}
        <div style={{ background: "var(--green-house)" }} className="px-6 lg:px-10 py-14">
          <div className="max-w-[1440px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                Support
              </p>
              <h1 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "#fff", letterSpacing: "-0.02em" }}>
                Frequently asked questions
              </h1>
              <p className="text-base max-w-lg" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                Can&apos;t find what you need?{" "}
                <Link href="/contact" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Contact our team
                </Link>{" "}
                — we usually reply within a few hours.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
          <div className="max-w-3xl mx-auto">

            {/* Search */}
            <div className="relative mb-8">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-black-soft)" }} />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
                placeholder="Search questions…"
                className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border outline-none transition-all duration-200"
                style={{
                  borderColor:     "var(--input-border)",
                  background:      "#fff",
                  color:           "var(--text-black)",
                  boxShadow:       "var(--shadow-card)",
                }}
                onFocus={(e)  => { e.currentTarget.style.borderColor = "var(--green-accent)"; }}
                onBlur={(e)   => { e.currentTarget.style.borderColor = "var(--input-border)"; }}
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                  className="shrink-0 text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-200"
                  style={{
                    background:  activeCategory === cat ? "var(--green-house)" : "transparent",
                    color:       activeCategory === cat ? "#fff" : "var(--text-black-soft)",
                    borderColor: activeCategory === cat ? "var(--green-house)" : "var(--input-border)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion */}
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: "var(--text-black-soft)" }}>
                <p className="text-base font-semibold mb-2">No results found</p>
                <p className="text-sm">Try a different search term or <Link href="/contact" className="underline" style={{ color: "var(--green-accent)" }}>contact us</Link>.</p>
              </div>
            ) : (
              <motion.div
                key={activeCategory + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ borderTop: "1px solid var(--ceramic)" }}
              >
                {filtered.map((f, i) => (
                  <AccordionItem
                    key={i}
                    q={f.q}
                    a={f.a}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </motion.div>
            )}

            {/* Still need help */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 rounded-2xl p-8 text-center"
              style={{ background: "var(--surface-alt)" }}
            >
              <h2 className="font-bold text-xl mb-2" style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}>
                Still have a question?
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-black-soft)" }}>
                Our team is online Monday–Friday, 8am–5pm AEST. We usually reply within 2 hours.
              </p>
              <Link href="/contact" className="btn btn-primary" style={{ fontSize: 14, padding: "12px 28px" }}>
                Contact us
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
