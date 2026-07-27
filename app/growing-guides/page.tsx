"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Leaf, Apple, FlaskConical, Sun, Droplets, ArrowRight, Clock } from "lucide-react";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

const CATEGORIES = ["All", "Vegetables", "Herbs", "Fruits & Trees", "Soil prep", "Seasonal"];

const GUIDES = [
  {
    category: "Vegetables",
    icon: Sprout,
    title: "Getting started with raised bed vegetables",
    summary: "How to build, fill, and feed a raised bed from scratch — the right layering order, soil ratios, and first-season fertiliser schedule.",
    readTime: "8 min read",
    difficulty: "Beginner",
    product: "Terra Pro Soil Mix",
    productHandle: "terra-pro-soil-mix",
    steps: [
      "Choose a location with at least 6 hours of direct sun per day.",
      "Fill the bed with 60% Terra Pro Soil Mix blended with 40% existing topsoil for the bottom third, then 100% Terra Pro for the top two-thirds.",
      "Apply Deep Root Tonic (5ml/L dilution) as a drench before planting — this inoculates the soil with mycorrhizal fungi.",
      "Wait 2 weeks after planting before applying Bio Bloom Fertiliser at 30g/m². Water in well.",
      "Reapply Bio Bloom every 6–8 weeks through the growing season.",
    ],
  },
  {
    category: "Vegetables",
    icon: Sprout,
    title: "Tomatoes: from seedling to harvest",
    summary: "The complete tomato feeding guide — when to start, how often to apply, and what to look for when something goes wrong.",
    readTime: "10 min read",
    difficulty: "Beginner",
    product: "Bio Bloom Fertiliser",
    productHandle: "bio-bloom-fertiliser",
    steps: [
      "Transplant seedlings into Terra Pro–enriched soil. Apply Deep Root Tonic at transplanting — tomatoes are heavy feeders and need a strong root network early.",
      "Hold off fertiliser for 2 weeks while the plant establishes. You'll see new leaf growth when it's ready.",
      "Begin Bio Bloom at 30g/m² around the base (not touching the stem). Water in thoroughly.",
      "As flowers appear, increase to every 5–6 weeks. Tomatoes need phosphorus for fruit set — Bio Bloom's 8-12-6 ratio is optimised for this stage.",
      "Once fruiting begins, reduce application to monthly. Over-feeding at this stage can cause blossom end rot.",
    ],
  },
  {
    category: "Herbs",
    icon: Leaf,
    title: "Growing herbs in pots — a feeding guide",
    summary: "Potted herbs need more frequent feeding than in-ground plants. Here's the schedule that keeps basil, parsley, rosemary, and mint thriving.",
    readTime: "6 min read",
    difficulty: "Beginner",
    product: "Bio Bloom Fertiliser",
    productHandle: "bio-bloom-fertiliser",
    steps: [
      "Use Terra Pro Soil Mix as the base potting medium — its water retention and pH buffer make it ideal for herb pots.",
      "Apply a half-strength Bio Bloom application (15g per pot for a 30cm pot) every 4–5 weeks during active growth.",
      "Soft-leafed herbs (basil, coriander, parsley) need more nitrogen. A half-strength liquid feed between granular applications helps in summer.",
      "Woody herbs (rosemary, thyme, sage) are light feeders. One full application per season is enough — over-fertilising makes them leggy.",
      "Mint is a heavy feeder and fast spreader — keep it in its own pot and feed monthly.",
    ],
  },
  {
    category: "Herbs",
    icon: Leaf,
    title: "Companion planting to improve soil naturally",
    summary: "Some plants fix nitrogen, repel pests, or improve soil structure. Here's how to design a garden bed that feeds itself.",
    readTime: "7 min read",
    difficulty: "Intermediate",
    product: "Terra Pro Soil Mix",
    productHandle: "terra-pro-soil-mix",
    steps: [
      "Legumes (beans, peas) fix atmospheric nitrogen into the soil — plant them before brassicas or leafy greens in your rotation.",
      "Deep-rooted plants like comfrey and chicory pull up minerals from subsoil layers. Their leaves can be used as mulch around feeding plants.",
      "Marigolds deter nematodes and whitefly — plant them as a border around tomatoes and capsicums.",
      "After harvesting legumes, cut the roots rather than pulling them. The root nodules left in the soil continue releasing nitrogen.",
      "Add Terra Pro when replanting to reset the physical structure after a legume season before introducing heavy feeders.",
    ],
  },
  {
    category: "Fruits & Trees",
    icon: Apple,
    title: "Feeding established fruit trees",
    summary: "Mature citrus, stone fruit, and apple trees have different feeding needs through the year. This guide covers the full seasonal cycle.",
    readTime: "9 min read",
    difficulty: "Intermediate",
    product: "Deep Root Tonic",
    productHandle: "deep-root-tonic",
    steps: [
      "In early spring (August–September), apply Deep Root Tonic as a drench across the entire root zone — from trunk to drip line.",
      "Follow with Bio Bloom at 50g/m² under the canopy (not touching the trunk) once soil temperature is consistently above 12°C.",
      "Citrus specifically: feed again in November with Bio Bloom. Citrus are heavy potassium consumers during fruit development.",
      "Stone fruit (peaches, nectarines, plums): fertilise immediately after harvest in late summer to build reserves for next season's flowering.",
      "Do not feed after February — encouraging late growth makes trees vulnerable to frost and disease.",
    ],
  },
  {
    category: "Fruits & Trees",
    icon: Apple,
    title: "Reviving a struggling tree",
    summary: "Yellow leaves, poor growth, and sparse fruiting are all fixable. Here's a diagnostic approach and recovery plan.",
    readTime: "8 min read",
    difficulty: "Intermediate",
    product: "Deep Root Tonic",
    productHandle: "deep-root-tonic",
    steps: [
      "Check the soil pH first — most nutrient deficiencies in Australian gardens are actually pH problems, not lack of nutrients. Aim for 6.2–6.8.",
      "If the pH is fine, look at the symptoms: yellow between veins = magnesium or iron deficiency; pale overall = nitrogen; purple leaves = phosphorus.",
      "Apply Deep Root Tonic to rebuild the mycorrhizal network — this dramatically improves the tree's ability to absorb existing soil nutrients.",
      "Add Terra Pro as a 5cm top-dressing around the drip line to improve soil structure and water penetration.",
      "Begin Bio Bloom 3 weeks later at the standard rate. Monitor new leaf colour — improvement should be visible within 4–6 weeks.",
    ],
  },
  {
    category: "Soil prep",
    icon: FlaskConical,
    title: "How to read your soil — a home gardener's guide",
    summary: "You don't need a lab. These simple tests tell you what your soil is doing and what it needs before you plant anything.",
    readTime: "7 min read",
    difficulty: "Beginner",
    product: "Terra Pro Soil Mix",
    productHandle: "terra-pro-soil-mix",
    steps: [
      "The jar test: fill a jar with soil and water, shake, and let settle. Sand sinks first, then silt, then clay floats on top. This tells you your soil texture.",
      "The squeeze test: wet soil and squeeze — if it ribbons out and stays together, you have clay-heavy soil. If it crumbles immediately, it's sandy.",
      "The worm count: dig a 30cm cube and count earthworms. Fewer than 5 worms indicates low organic matter or soil biology. More than 10 is healthy.",
      "pH strips: test soil at 10cm depth after watering. Most vegetables prefer 6.2–6.8. Below 5.5 means lime is needed; above 7.5 means acidifying inputs.",
      "Based on your results: add Terra Pro for structure (clay or sand), Deep Root Tonic for low worm count (poor biology), and Bio Bloom to correct nutrient deficiency.",
    ],
  },
  {
    category: "Soil prep",
    icon: FlaskConical,
    title: "Preparing a new bed from scratch",
    summary: "Starting from lawn, compacted clay, or bare dirt? This is the fastest path to a productive bed without raised borders.",
    readTime: "6 min read",
    difficulty: "Beginner",
    product: "Terra Pro Soil Mix",
    productHandle: "terra-pro-soil-mix",
    steps: [
      "Remove grass or weeds. A layer of cardboard directly on the surface (newspaper-box sheets, overlapping) kills existing growth without digging.",
      "Apply a 10cm layer of Terra Pro Soil Mix over the cardboard. Water it well.",
      "Add a second 5cm layer of compost (any type) on top of the Terra Pro. This creates the planting layer.",
      "Apply Deep Root Tonic across the whole bed surface before planting — it inoculates the new soil before roots arrive.",
      "Plant directly into the top compost layer. By the second season, earthworms and soil biology will have broken down the cardboard and integrated the layers.",
    ],
  },
  {
    category: "Seasonal",
    icon: Sun,
    title: "Spring garden prep checklist",
    summary: "The 6 things to do in August and September to set your garden up for the best season it's ever had.",
    readTime: "5 min read",
    difficulty: "Beginner",
    product: "Season Starter Kit",
    productHandle: "season-starter-kit",
    steps: [
      "Week 1: Test soil pH and amend if needed. Add lime to raise pH, sulfur to lower it. Allow 2 weeks before planting.",
      "Week 2: Top-dress existing beds with 5cm of Terra Pro. This refreshes structure and adds fresh organic matter after winter.",
      "Week 2: Apply Deep Root Tonic to trees, shrubs, and established perennials — spring is when fungal networks are most active.",
      "Week 3: Plant warm-season seedlings once soil temperature consistently reaches 12°C (use a $10 soil thermometer).",
      "Week 3: Apply Bio Bloom at planting — the NPK charge gives transplants the nutrients they need immediately without burning.",
      "Ongoing: water consistently. More plants fail from inconsistent watering than from any nutrient issue.",
    ],
  },
  {
    category: "Seasonal",
    icon: Droplets,
    title: "Watering and feeding in Australian summer",
    summary: "Heat stress and drought cycles make summer the hardest season. Here's how to feed without burning and water without waste.",
    readTime: "7 min read",
    difficulty: "Intermediate",
    product: "Deep Root Tonic",
    productHandle: "deep-root-tonic",
    steps: [
      "Never apply granular fertiliser to dry soil — always water thoroughly first, apply, then water again. Dry application burns roots.",
      "Reduce Bio Bloom frequency to every 8–10 weeks in peak summer. Plants slow their uptake in heat stress — pushing nutrients causes burn.",
      "Deep Root Tonic can be applied through summer as it doesn't add salts that cause burn. It helps roots access existing soil moisture.",
      "Water deeply and infrequently rather than shallowly every day. Deep watering encourages deep roots that are more heat and drought resistant.",
      "Mulch is the single highest-impact summer action — a 10cm layer of sugar cane mulch or straw reduces soil temperature by up to 8°C and halves water loss.",
    ],
  },
];

const DIFFICULTY_COLOUR: Record<string, string> = {
  Beginner:     "var(--green-xlight)",
  Intermediate: "#fdf9f2",
  Advanced:     "#fce8e6",
};
const DIFFICULTY_TEXT: Record<string, string> = {
  Beginner:     "var(--green-bio)",
  Intermediate: "var(--gold)",
  Advanced:     "var(--red)",
};

function GuideCard({ guide, index }: { guide: typeof GUIDES[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon } = guide;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", boxShadow: "var(--shadow-card)", border: "1px solid var(--ceramic)" }}
    >
      {/* Card header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--green-xlight)" }}
          >
            <Icon size={17} style={{ color: "var(--green-accent)" }} />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
              style={{ background: DIFFICULTY_COLOUR[guide.difficulty], color: DIFFICULTY_TEXT[guide.difficulty] }}
            >
              {guide.difficulty}
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-black-soft)" }}>
              <Clock size={10} />
              {guide.readTime}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2" style={{ color: "var(--green-house)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
          {guide.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-black-soft)" }}>
          {guide.summary}
        </p>

        <div className="flex items-center justify-between">
          <Link
            href={`/products/${guide.productHandle}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200"
            style={{ background: "var(--green-xlight)", color: "var(--green-bio)" }}
          >
            Uses {guide.product}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
            style={{ color: "var(--green-accent)" }}
            aria-expanded={open}
          >
            {open ? "Hide steps" : "Read guide"}
            <ArrowRight size={14} className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expandable steps */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0" style={{ borderTop: "1px solid var(--ceramic)" }}>
              <p className="text-xs font-bold uppercase tracking-[0.1em] mt-5 mb-4" style={{ color: "var(--text-black-soft)" }}>
                Step-by-step
              </p>
              <ol className="flex flex-col gap-3.5">
                {guide.steps.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                      style={{ background: "var(--green-accent)", color: "#fff" }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{step}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function GrowingGuidesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? GUIDES : GUIDES.filter((g) => g.category === activeCategory);

  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: 99 }}>

        {/* Header band */}
        <div style={{ background: "var(--green-house)" }} className="px-6 lg:px-10 py-14">
          <div className="max-w-[1440px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}>
              <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                Knowledge
              </p>
              <h1 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "#fff", letterSpacing: "-0.02em" }}>
                Growing guides
              </h1>
              <p className="text-base max-w-lg" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                Practical, no-nonsense guides for Australian home gardeners — from first bed to first harvest.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200"
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

          {/* Guides grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filtered.map((guide, i) => (
                <GuideCard key={guide.title} guide={guide} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl p-8 text-center"
            style={{ background: "var(--surface-alt)" }}
          >
            <h2 className="font-bold text-xl mb-2" style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}>
              Ready to put it into practice?
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-black-soft)" }}>
              The Season Starter Kit has everything covered in these guides — soil, tonic, and fertiliser in one bundle.
            </p>
            <Link href="/products/season-starter-kit" className="btn btn-primary" style={{ fontSize: 14, padding: "12px 28px" }}>
              Shop Season Starter Kit
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
