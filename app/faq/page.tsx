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
    q: "Who makes the products you sell?",
    a: "BioGardeners is an Australian garden retailer — we hand-pick and sell Healthy Earth products because we genuinely love them. They come from a proudly Aussie brand and are regenerative, environmentally friendly, gentle around family and pets when used as directed, and easy to use. We choose the range so you don't have to.",
  },
  {
    category: "Products",
    q: "Are the products okay to use around edible gardens, family and pets?",
    a: "Our range is chosen to be gentle and easy to use around vegetables, herbs, fruit trees, and the people and pets who share your backyard — when used as directed. Always follow the rates and directions on each product page, and feel free to email us if you'd like a hand.",
  },
  {
    category: "Products",
    q: "Can I use more than one product together?",
    a: "Absolutely — plenty of our customers build a little routine. Apply Penetrator first so water and nutrients reach the roots, then follow with your fertiliser or Bloom N Yield. Check each product page for rates, and email us if you'd like help putting a combo together.",
  },
  {
    category: "Products",
    q: "How far does a bag of GP Fertiliser go?",
    a: "At the standard rate of 100g per m², a 5kg bag covers around 50m² per application, a 12kg bag around 120m², and a 20kg bag around 200m².",
  },
  {
    category: "Products",
    q: "Are the products organic?",
    a: "The range is built around natural, regenerative inputs like volcanic minerals, sea minerals and glacial rock flour. We don't make certified-organic claims, but if that's important to you, email us and we'll happily check the specific product you have in mind.",
  },
  {
    category: "Products",
    q: "How should I store my products?",
    a: "Keep products in a cool, dry place out of direct sunlight, and don't let liquids freeze. Check the label on your product for batch and storage details.",
  },
  {
    category: "Orders",
    q: "How do I place an order?",
    a: "Add any product to your cart, then proceed to checkout. We accept Visa, Mastercard, Amex, PayPal, and Afterpay. Orders are confirmed by email immediately after payment.",
  },
  {
    category: "Orders",
    q: "Can I change or cancel my order after placing it?",
    a: "Orders can be modified or cancelled within 2 hours of placing them by emailing bgshop48@gmail.com with your order number. After that window, our fulfilment team will have already packed your order and we cannot guarantee changes.",
  },
  {
    category: "Orders",
    q: "Do you offer bulk or wholesale pricing?",
    a: "Yes. For orders over 20 units or for wholesale/trade accounts (nurseries, market gardens, councils), please contact us at bgshop48@gmail.com. We offer tiered pricing from 15% off for recurring orders.",
  },
  {
    category: "Shipping",
    q: "How long does delivery take?",
    a: "Standard shipping takes 5–8 business days Australia wide. We dispatch all orders placed before 12pm AEST on the same business day.",
  },
  {
    category: "Shipping",
    q: "Do you ship to all of Australia?",
    a: "Yes — we ship to all states and territories including remote WA, NT, and regional QLD. Some remote postcodes may incur an additional freight surcharge; this will be displayed at checkout before payment.",
  },
  {
    category: "Shipping",
    q: "How much does shipping cost?",
    a: "We ship Australia wide with weight-based rates starting from $9.95. Standard delivery takes 5–8 business days. Exact shipping cost is calculated at checkout based on your order weight.",
  },
  {
    category: "Shipping",
    q: "Can I track my order?",
    a: "Yes. Once your order is dispatched, you'll receive a tracking link by email. We ship via Australia Post and Sendle depending on your location. Tracking updates within 24 hours of dispatch.",
  },
  {
    category: "Returns",
    q: "What is your returns policy?",
    a: "All sales are final. We do not accept change-of-mind returns or exchanges. If your order arrives damaged, faulty, or not as described, email bgshop48@gmail.com within 48 hours of delivery with your order number and photos, and we'll arrange a remedy as required by Australian Consumer Law.",
  },
  {
    category: "Returns",
    q: "What if my order arrives damaged?",
    a: "If your order arrives damaged or incorrect, photograph the packaging and product and email us within 48 hours of delivery. We'll ship a replacement immediately at no cost — you keep the damaged product.",
  },
  {
    category: "Returns",
    q: "My plants didn't improve — what should I do?",
    a: "Results depend on multiple factors including existing soil conditions, climate, and application method. If you followed our application guide and aren't seeing improvement, email bgshop48@gmail.com — our team will troubleshoot your situation and help you get the best from the product.",
  },
  {
    category: "Growing tips",
    q: "When is the best time to apply GP Fertiliser?",
    a: "Start at the beginning of the growing season (late August–September in most of Australia) and apply 4–6 times per year. Avoid heat above 35°C or just before heavy rain — a morning application on moist soil with a good water-in works best.",
  },
  {
    category: "Growing tips",
    q: "My soil is very sandy / very clay — where should I start?",
    a: "For clay or water-repellent soils, start with Penetrator so water can soak in properly. For sandy soils, Volcanic Dust and Soil Health Conditioner help build the minerals and soil life that hold onto nutrients. Then feed with GP Fertiliser. Not sure? Email us and we'll point you in the right direction.",
  },
  {
    category: "Growing tips",
    q: "How do I use Bloom N Yield on fruit trees?",
    a: "Dilute 20ml per litre (10ml for sensitive plants) and apply as a foliar spray, stem drench or soil drench 2–3 times per season, in the early morning or evening.",
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
        <div style={{ background: "var(--green-accent)" }} className="px-6 lg:px-10 py-14">
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
                    background:  activeCategory === cat ? "var(--green-accent)" : "transparent",
                    color:       activeCategory === cat ? "#fff" : "var(--text-black-soft)",
                    borderColor: activeCategory === cat ? "var(--green-accent)" : "var(--input-border)",
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
