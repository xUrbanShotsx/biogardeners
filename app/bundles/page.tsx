import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FrapButton } from "@/components/frap-button";
import { Package, Leaf, Droplets, Sun, Sprout, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Care Bundles | BioGardeners",
  description: "Curated soil and fertiliser bundles for every garden type. Everything you need, matched and ready to go.",
};

const BUNDLES = [
  {
    name: "Starter Garden Kit",
    tagline: "The perfect first step to a healthier garden",
    description: "Everything a new gardener needs to remineralise depleted soil and get plants thriving fast. GP Fertiliser feeds broadly, Penetrator gets water and nutrients deep into the root zone, and Volcanic Dust rebuilds the mineral base that most soils are missing.",
    includes: ["GP Fertiliser 5KG", "Penetrator 1L", "Volcanic Dust 2KG"],
    icon: Sprout,
    color: "var(--green-accent)",
    tag: "Most Popular",
  },
  {
    name: "Lawn Revival Bundle",
    tagline: "Thick, green, drought-tough lawn all year round",
    description: "Designed to push deep root growth and mineral density in lawn grasses. Premium concentrated lawn fertiliser paired with our soil penetrant for even coverage across compacted Australian soils.",
    includes: ["Lawn Fertilizer Premium 1 Pack", "Penetrator 1L", "Volcanic Dust 2KG"],
    icon: Sun,
    color: "var(--gold)",
    tag: "Lawn Care",
  },
  {
    name: "Ultimate Soil Rebuild",
    tagline: "Full-spectrum remineralisation for seriously depleted soil",
    description: "For soils that have been chemically farmed or are dry, acidic, and lifeless. Volcanic Dust, Glacial Milk, and Soil Conditioner work together to restore microbial life, improve cation exchange capacity, and flood the rhizosphere with 60+ minerals.",
    includes: ["Volcanic Dust 5KG", "Glacial Milk 2KG", "Soil Health Conditioner"],
    icon: Leaf,
    color: "var(--green-bio)",
    tag: "Best Value",
  },
  {
    name: "Plant Health Bundle",
    tagline: "Fight pests, disease, and stress at the same time",
    description: "A foliar and root treatment duo for plants under pressure. Liquid NPK delivers fast mineral nutrition through the leaf, Plant Spray provides selenium-enriched protection against fungal attack and pest insects, and Penetrator keeps the root zone open.",
    includes: ["Liquid NPK 1L", "Plant Spray 500ml", "Penetrator 500ml"],
    icon: Droplets,
    color: "var(--green-uplift)",
    tag: "Plant Care",
  },
  {
    name: "Veggie Patch Pro",
    tagline: "More flavour, more yield, fewer problems",
    description: "Vegetable gardens draw heavily on soil minerals — especially calcium, selenium, and trace elements — and most soils can't keep up. This bundle covers the full mineral spectrum from soil through to foliar, giving your vegetables the nutrition to produce food that actually tastes like food.",
    includes: ["GP Fertiliser 5KG", "Liquid NPK 1L", "Volcanic Dust 2KG", "Plant Spray 500ml"],
    icon: Package,
    color: "var(--green-accent)",
    tag: "Edibles",
  },
  {
    name: "Drought Defence Kit",
    tagline: "Keep plants alive and productive through Australian summers",
    description: "Cobalt and silicon in our volcanic minerals strengthen cell walls and increase plant sugar concentration — the two mechanisms that make plants naturally drought and frost resistant. Penetrator ensures every drop of water reaches deep roots instead of running off.",
    includes: ["Volcanic Dust 5KG", "GP Fertiliser 5KG", "Penetrator 1L"],
    icon: Sun,
    color: "var(--gold)",
    tag: "Drought",
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
