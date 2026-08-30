import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FrapButton } from "@/components/frap-button";
import { Leaf, Droplets, Sun, Sprout, ArrowRight, Snowflake, RefreshCcw, Shovel, Wheat, Home, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Care Bundles | BioGardeners",
  description: "Curated soil and fertiliser bundles for every garden type. Everything you need, matched and ready to go.",
};

const BUNDLES = [
  {
    name: "Spring Care Package",
    tagline: "Wake up your soil and kickstart the growing season",
    description: "Spring is when plants push new growth and soil biology reactivates after winter. This package remineralises the root zone with 60+ minerals, opens compacted soil so water and nutrients can penetrate, and delivers a fast foliar boost to get new growth strong from the start.",
    includes: ["GP Fertiliser 5KG", "Volcanic Dust 2KG", "Penetrator 1L", "Plant Spray 500ml"],
    icon: Sprout,
    color: "var(--green-accent)",
    tag: "Seasonal",
  },
  {
    name: "Summer Care Package",
    tagline: "Drought-tough, heat-resistant plants through Australian summers",
    description: "Cobalt and silicon in our volcanic minerals thicken plant cell walls and raise plant sugar concentration — the two natural mechanisms that protect against heat stress, drought, and wilting. Penetrator ensures every drop of water reaches deep into the root zone rather than running off hardened soil.",
    includes: ["Volcanic Dust 5KG", "GP Fertiliser 5KG", "Penetrator 1L"],
    icon: Sun,
    color: "var(--gold)",
    tag: "Seasonal",
  },
  {
    name: "Autumn Care Package",
    tagline: "Rebuild soil reserves before the cold sets in",
    description: "Autumn is your best window to remineralise. Soil microbes are still active and will process minerals into plant-available form over winter, so by spring your garden has a full mineral bank. Soil Conditioner feeds the microbial community while Volcanic Dust floods the rhizosphere with trace elements.",
    includes: ["Volcanic Dust 5KG", "Soil Health Conditioner", "GP Fertiliser 5KG"],
    icon: Leaf,
    color: "#b35c1e",
    tag: "Seasonal",
  },
  {
    name: "Winter Care Package",
    tagline: "Frost protection and steady slow-release nutrition",
    description: "High mineral content raises plant sugar concentration — the same mechanism that stops water in plant cells from freezing. Glacial Milk provides ultra-fine silica for cell wall strength, while our granulated fertiliser delivers slow-release nutrition through the colder months without pushing soft new growth.",
    includes: ["Glacial Milk 2KG", "Volcanic Dust 2KG", "GP Fertiliser 5KG"],
    icon: Snowflake,
    color: "#4a8fa8",
    tag: "Seasonal",
  },
  {
    name: "Regenerative Treatment Pack",
    tagline: "Full-spectrum restoration for depleted, dead, or acidic soil",
    description: "For soils that have been chemically farmed, stripped bare, or are compacted and lifeless. Volcanic Dust and Glacial Milk together provide over 60 minerals, reduce acidity without CO₂ release, and restore cation exchange capacity. Soil Conditioner reintroduces microbial diversity, and Penetrator breaks the crust so everything can get in.",
    includes: ["Volcanic Dust 5KG", "Glacial Milk 2KG", "Soil Health Conditioner", "Penetrator 1L"],
    icon: RefreshCcw,
    color: "var(--green-bio)",
    tag: "Best Value",
  },
  {
    name: "Planting Pack",
    tagline: "Give new plants the mineral foundation to establish fast",
    description: "Whether planting trees, shrubs, vegetables, or natives — what you put in the ground at planting time determines the next five years. This pack enriches the root zone with broad-spectrum minerals, opens soil structure for root penetration, and delivers a foliar spray to reduce transplant shock.",
    includes: ["GP Fertiliser 5KG", "Volcanic Dust 2KG", "Penetrator 1L", "Plant Spray 500ml"],
    icon: Shovel,
    color: "var(--green-uplift)",
    tag: "Planting",
  },
  {
    name: "Seed & Soil Treatment Pack",
    tagline: "Maximum germination and vigorous early growth",
    description: "Seeds germinate faster and seedlings establish stronger when the surrounding soil has the full mineral profile they need from day one. Volcanic Dust conditions the growing medium, GP Fertiliser provides broad nutrition, and a gentle foliar treatment supports the seedling through its most vulnerable stage.",
    includes: ["Volcanic Dust 2KG", "GP Fertiliser 5KG", "Liquid NPK 1L"],
    icon: Wheat,
    color: "var(--gold)",
    tag: "Seeds",
  },
  {
    name: "Indoor Plants Feed & Care Pack",
    tagline: "Lush, healthy indoor plants that actually thrive",
    description: "Indoor plants are cut off from the natural mineral cycle and rely entirely on what you give them. This pack delivers a balanced liquid feed, a selenium-enriched foliar spray for disease resistance and glossy leaf colour, and a light granular base fertiliser to keep potting mix nutritious between feeds.",
    includes: ["Liquid NPK 1L", "Plant Spray 500ml", "GP Fertiliser 2KG"],
    icon: Home,
    color: "var(--green-accent)",
    tag: "Indoor",
  },
  {
    name: "Insect & Fungus Care Pack",
    tagline: "Natural resistance from the inside out",
    description: "Mineral-rich plants are naturally harder for insects and fungal disease to penetrate — thick cell walls, high plant sugars, and elevated selenium all act as deterrents. This pack addresses the root cause (mineral deficiency) while Plant Spray provides direct foliar protection with selenium toxic to aphids and whiteflies at the leaf surface.",
    includes: ["Plant Spray 500ml", "Volcanic Dust 2KG", "Liquid NPK 1L", "Penetrator 500ml"],
    icon: Shield,
    color: "var(--green-bio)",
    tag: "Protection",
  },
];

export default function BundlesPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Hero */}
        <section
          className="px-5 md:px-10 py-16 md:py-24 text-center"
          style={{ background: "var(--green-house)" }}
        >
          <p className="text-xs font-bold tracking-[0.12em] uppercase mb-4" style={{ color: "var(--green-accent)" }}>
            Care Packages
          </p>
          <h1
            className="font-bold text-4xl md:text-6xl mb-5 mx-auto max-w-3xl"
            style={{ color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Everything your garden needs,{" "}
            <span style={{ color: "var(--green-accent)" }}>matched and ready.</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            Curated combinations of BioGardeners products for every garden type and goal.
            No guesswork — just the right minerals, in the right order.
          </p>
        </section>

        {/* Coming soon banner */}
        <div
          className="flex items-center justify-center gap-3 px-5 py-4 text-sm font-semibold"
          style={{ background: "var(--gold-lightest)", borderBottom: "1px solid #f0d9a0", color: "var(--gold)" }}
        >
          <span>⏳</span>
          <span>Bundles launching soon — sign up to be notified or{" "}
            <Link href="/contact" className="underline font-bold" style={{ color: "var(--gold)" }}>
              contact us
            </Link>
            {" "}to arrange a custom order.
          </span>
        </div>

        {/* Bundle grid */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUNDLES.map((bundle) => {
              const Icon = bundle.icon;
              return (
                <div
                  key={bundle.name}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{ boxShadow: "var(--shadow-card)", background: "#fff" }}
                >
                  {/* Card header */}
                  <div className="px-6 pt-6 pb-5">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: bundle.color + "18" }}
                      >
                        <Icon size={22} style={{ color: bundle.color }} />
                      </div>
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: bundle.color + "15", color: bundle.color }}
                      >
                        {bundle.tag}
                      </span>
                    </div>
                    <h2 className="font-bold text-xl mb-1" style={{ color: "var(--text-black)", letterSpacing: "-0.02em" }}>
                      {bundle.name}
                    </h2>
                    <p className="text-sm font-semibold mb-3" style={{ color: bundle.color }}>
                      {bundle.tagline}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
                      {bundle.description}
                    </p>
                  </div>

                  {/* Includes list */}
                  <div
                    className="mx-6 mb-5 rounded-xl px-4 py-3"
                    style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2.5" style={{ color: "var(--text-black-soft)" }}>
                      Includes
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {bundle.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-black)" }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: bundle.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="px-6 pb-6 mt-auto">
                    <Link
                      href="/contact"
                      className="w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all hover:brightness-110"
                      style={{ background: "var(--green-house)", color: "#fff" }}
                    >
                      Enquire about this bundle <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section
          className="mx-5 md:mx-10 mb-16 rounded-2xl px-8 py-12 text-center max-w-[1280px] md:mx-auto"
          style={{ background: "var(--green-house)" }}
        >
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
            Need something specific?
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.60)" }}>
            Our team can put together a custom package based on your soil type, climate, and garden goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Contact us
            </Link>
            <Link href="/products" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}>
              Shop individual products
            </Link>
          </div>
        </section>

      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
