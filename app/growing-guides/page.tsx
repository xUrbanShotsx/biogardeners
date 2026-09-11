"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout, Leaf, Apple, FlaskConical, Sun, Droplets,
  Clock, ChevronDown, BookOpen,
  CheckCircle2, TreePine,
} from "lucide-react";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";


const GUIDES = [
  {
    category:      "Vegetables",
    icon:          Sprout,
    color:         "#2D6A4F",
    title:         "Getting started with raised bed vegetables",
    summary:       "How to build, fill, and feed a raised bed from scratch — the right layering order, soil ratios, and first-season fertiliser schedule.",
    readTime:      "8 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "Perfect for new gardeners starting their first bed",
    steps: [
      "Choose a location with at least 6 hours of direct sun per day.",
      "Fill the bed with 60% GP Fertiliser blended with 40% existing topsoil for the bottom third, then 100% GP for the top two-thirds.",
      "Apply Penetrator (5ml/L dilution) as a drench before planting — this inoculates the soil with mycorrhizal fungi.",
      "Wait 2 weeks after planting before applying fertiliser at 30g/m². Water in well.",
      "Reapply every 6–8 weeks through the growing season.",
    ],
  },
  {
    category:      "Vegetables",
    icon:          Sprout,
    color:         "#2D6A4F",
    title:         "Tomatoes: from seedling to harvest",
    summary:       "The complete tomato feeding guide — when to start, how often to apply, and what to look for when something goes wrong.",
    readTime:      "10 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "Australia's most popular home vegetable — get it right",
    steps: [
      "Transplant seedlings into enriched soil. Apply Penetrator at transplanting — tomatoes are heavy feeders and need a strong root network early.",
      "Hold off fertiliser for 2 weeks while the plant establishes. You'll see new leaf growth when it's ready.",
      "Begin fertiliser at 30g/m² around the base (not touching the stem). Water in thoroughly.",
      "As flowers appear, increase to every 5–6 weeks. Tomatoes need phosphorus for fruit set.",
      "Once fruiting begins, reduce application to monthly. Over-feeding at this stage can cause blossom end rot.",
    ],
  },
  {
    category:      "Herbs",
    icon:          Leaf,
    color:         "#40916C",
    title:         "Growing herbs in pots — a feeding guide",
    summary:       "Potted herbs need more frequent feeding than in-ground plants. Here's the schedule that keeps basil, parsley, rosemary, and mint thriving.",
    readTime:      "6 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "The fastest way to fresh herbs on your kitchen windowsill",
    steps: [
      "Use a quality potting mix as the base — its water retention and pH buffer make it ideal for herb pots.",
      "Apply a half-strength fertiliser application (15g per pot for a 30cm pot) every 4–5 weeks during active growth.",
      "Soft-leafed herbs (basil, coriander, parsley) need more nitrogen. A half-strength liquid feed between granular applications helps in summer.",
      "Woody herbs (rosemary, thyme, sage) are light feeders. One full application per season is enough — over-fertilising makes them leggy.",
      "Mint is a heavy feeder and fast spreader — keep it in its own pot and feed monthly.",
    ],
  },
  {
    category:      "Herbs",
    icon:          Leaf,
    color:         "#40916C",
    title:         "Companion planting to improve soil naturally",
    summary:       "Some plants fix nitrogen, repel pests, or improve soil structure. Here's how to design a garden bed that feeds itself.",
    readTime:      "7 min",
    difficulty:    "Intermediate",
    product:       "Volcanic Dust",
    productHandle: "volcanic-dust-trace-elements",
    highlight:     "Let your garden work smarter, not harder",
    steps: [
      "Legumes (beans, peas) fix atmospheric nitrogen into the soil — plant them before brassicas or leafy greens in your rotation.",
      "Deep-rooted plants like comfrey and chicory pull up minerals from subsoil layers. Their leaves can be used as mulch around feeding plants.",
      "Marigolds deter nematodes and whitefly — plant them as a border around tomatoes and capsicums.",
      "After harvesting legumes, cut the roots rather than pulling them. The root nodules left in the soil continue releasing nitrogen.",
      "Add trace elements (Volcanic Dust) when replanting to reset the physical structure after a legume season before introducing heavy feeders.",
    ],
  },
  {
    category:      "Fruits & Trees",
    icon:          Apple,
    color:         "#1B4332",
    title:         "Feeding established fruit trees",
    summary:       "Mature citrus, stone fruit, and apple trees have different feeding needs through the year. This guide covers the full seasonal cycle.",
    readTime:      "9 min",
    difficulty:    "Intermediate",
    product:       "Penetrator",
    productHandle: "penetrator",
    highlight:     "Get more fruit from trees you already have",
    steps: [
      "In early spring (August–September), apply Penetrator as a drench across the entire root zone — from trunk to drip line.",
      "Follow with fertiliser at 50g/m² under the canopy (not touching the trunk) once soil temperature is consistently above 12°C.",
      "Citrus specifically: feed again in November. Citrus are heavy potassium consumers during fruit development.",
      "Stone fruit (peaches, nectarines, plums): fertilise immediately after harvest in late summer to build reserves for next season's flowering.",
      "Do not feed after February — encouraging late growth makes trees vulnerable to frost and disease.",
    ],
  },
  {
    category:      "Fruits & Trees",
    icon:          TreePine,
    color:         "#1B4332",
    title:         "Reviving a struggling tree",
    summary:       "Yellow leaves, poor growth, and sparse fruiting are all fixable. Here's a diagnostic approach and recovery plan.",
    readTime:      "8 min",
    difficulty:    "Intermediate",
    product:       "Penetrator",
    productHandle: "penetrator",
    highlight:     "Don't give up — most struggling trees can recover",
    steps: [
      "Check the soil pH first — most nutrient deficiencies in Australian gardens are actually pH problems, not lack of nutrients. Aim for 6.2–6.8.",
      "If the pH is fine, look at the symptoms: yellow between veins = magnesium or iron deficiency; pale overall = nitrogen; purple leaves = phosphorus.",
      "Apply Penetrator to rebuild the soil's ability to absorb existing nutrients.",
      "Add compost as a 5cm top-dressing around the drip line to improve soil structure and water penetration.",
      "Begin feeding 3 weeks later at the standard rate. Monitor new leaf colour — improvement should be visible within 4–6 weeks.",
    ],
  },
  {
    category:      "Soil prep",
    icon:          FlaskConical,
    color:         "#6B4226",
    title:         "How to read your soil — a home gardener's guide",
    summary:       "You don't need a lab. These simple tests tell you what your soil is doing and what it needs before you plant anything.",
    readTime:      "7 min",
    difficulty:    "Beginner",
    product:       "Soil Health Conditioner",
    productHandle: "soil-health-conditioner",
    highlight:     "Know your soil before spending a cent on anything else",
    steps: [
      "The jar test: fill a jar with soil and water, shake, and let settle. Sand sinks first, then silt, then clay floats on top. This tells you your soil texture.",
      "The squeeze test: wet soil and squeeze — if it ribbons out and stays together, you have clay-heavy soil. If it crumbles immediately, it's sandy.",
      "The worm count: dig a 30cm cube and count earthworms. Fewer than 5 worms indicates low organic matter or soil biology. More than 10 is healthy.",
      "pH strips: test soil at 10cm depth after watering. Most vegetables prefer 6.2–6.8. Below 5.5 means lime is needed; above 7.5 means acidifying inputs.",
      "Based on your results: add Soil Health Conditioner for structure (clay or sand), Penetrator for low worm count (poor biology), and fertiliser to correct nutrient deficiency.",
    ],
  },
  {
    category:      "Soil prep",
    icon:          FlaskConical,
    color:         "#6B4226",
    title:         "Preparing a new bed from scratch",
    summary:       "Starting from lawn, compacted clay, or bare dirt? This is the fastest path to a productive bed without raised borders.",
    readTime:      "6 min",
    difficulty:    "Beginner",
    product:       "Penetrator",
    productHandle: "penetrator",
    highlight:     "Turn any patch of ground into a productive bed",
    steps: [
      "Remove grass or weeds. A layer of cardboard directly on the surface (newspaper-box sheets, overlapping) kills existing growth without digging.",
      "Apply a 10cm layer of quality potting mix over the cardboard. Water it well.",
      "Add a second 5cm layer of compost (any type) on top. This creates the planting layer.",
      "Apply Penetrator across the whole bed surface before planting — it inoculates the new soil before roots arrive.",
      "Plant directly into the top compost layer. By the second season, earthworms and soil biology will have broken down the cardboard and integrated the layers.",
    ],
  },
  {
    category:      "Seasonal",
    icon:          Sun,
    color:         "#B45309",
    title:         "Spring garden prep checklist",
    summary:       "The 6 things to do in August and September to set your garden up for the best season it's ever had.",
    readTime:      "5 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "What you do in August determines your whole summer harvest",
    steps: [
      "Week 1: Test soil pH and amend if needed. Add lime to raise pH, sulfur to lower it. Allow 2 weeks before planting.",
      "Week 2: Top-dress existing beds with 5cm of compost. This refreshes structure and adds fresh organic matter after winter.",
      "Week 2: Apply Penetrator to trees, shrubs, and established perennials — spring is when fungal networks are most active.",
      "Week 3: Plant warm-season seedlings once soil temperature consistently reaches 12°C (use a $10 soil thermometer).",
      "Week 3: Apply fertiliser at planting — the NPK charge gives transplants the nutrients they need immediately without burning.",
      "Ongoing: water consistently. More plants fail from inconsistent watering than from any nutrient issue.",
    ],
  },
  {
    category:      "Seasonal",
    icon:          Droplets,
    color:         "#1E40AF",
    title:         "Watering and feeding in Australian summer",
    summary:       "Heat stress and drought cycles make summer the hardest season. Here's how to feed without burning and water without waste.",
    readTime:      "7 min",
    difficulty:    "Intermediate",
    product:       "Penetrator",
    productHandle: "penetrator",
    highlight:     "Most summer plant failures are watering mistakes, not nutrient problems",
    steps: [
      "Never apply granular fertiliser to dry soil — always water thoroughly first, apply, then water again. Dry application burns roots.",
      "Reduce fertiliser frequency to every 8–10 weeks in peak summer. Plants slow their uptake in heat stress — pushing nutrients causes burn.",
      "Penetrator can be applied through summer as it doesn't add salts that cause burn. It helps roots access existing soil moisture.",
      "Water deeply and infrequently rather than shallowly every day. Deep watering encourages deep roots that are more heat and drought resistant.",
      "Mulch is the single highest-impact summer action — a 10cm layer of sugar cane mulch or straw reduces soil temperature by up to 8°C and halves water loss.",
    ],
  },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Beginner:     { bg: "#dcfce7", color: "#15803d" },
    Intermediate: { bg: "#fef3c7", color: "#b45309" },
    Advanced:     { bg: "#fee2e2", color: "#dc2626" },
  };
  const s = map[level] ?? map.Beginner;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {level}
    </span>
  );
}

function GuideCard({ guide, index }: { guide: typeof GUIDES[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, color } = guide;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: EASE }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#fff", boxShadow: "var(--shadow-card)", border: "1px solid var(--ceramic)" }}
    >
      {/* Coloured top strip */}
      <div className="h-1" style={{ background: color }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: color + "15" }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <DifficultyBadge level={guide.difficulty} />
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-black-soft)" }}>
              <Clock size={9} />
              {guide.readTime}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-base leading-snug mb-1.5" style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>
          {guide.title}
        </h3>

        {/* Highlight line */}
        <p className="text-xs font-medium mb-2.5" style={{ color }}>
          {guide.highlight}
        </p>

        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-black-soft)" }}>
          {guide.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--ceramic)" }}>
          <Link
            href={`/products/${guide.productHandle}`}
            className="text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-75"
            style={{ background: color + "12", color }}
          >
            Uses {guide.product}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color }}
            aria-expanded={open}
          >
            {open ? "Hide steps" : `${guide.steps.length} steps`}
            <ChevronDown
              size={13}
              className="transition-transform duration-300"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
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
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5" style={{ borderTop: "1px solid var(--ceramic)", background: "var(--surface-alt)" }}>
              <ol className="flex flex-col gap-3 pt-4">
                {guide.steps.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                      style={{ background: color, color: "#fff" }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{step}</p>
                  </motion.li>
                ))}
              </ol>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
                <CheckCircle2 size={12} />
                {guide.steps.length} steps · {guide.readTime} read
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function GrowingGuidesPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Hero */}
        <div style={{ background: "var(--green-house)" }} className="px-6 lg:px-10 pt-14 pb-16">
          <div className="max-w-[1440px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={14} style={{ color: "var(--green-accent)" }} />
                <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--green-accent)" }}>
                  Knowledge base
                </p>
              </div>
              <h1
                className="font-bold mb-3 max-w-2xl"
                style={{ fontSize: "clamp(2rem,4vw,3.2rem)", color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}
              >
                Growing guides
              </h1>
              <p className="text-base max-w-lg" style={{ color: "rgba(255,255,255,0.60)", lineHeight: 1.65 }}>
                Practical, no-nonsense guides for Australian home gardeners — from first bed to first harvest.
              </p>

              {/* Stats row */}
              <div className="flex gap-6 mt-8">
                {[
                  { n: GUIDES.length, label: "guides" },
                  { n: GUIDES.filter(g => g.difficulty === "Beginner").length, label: "beginner-friendly" },
                  { n: [...new Set(GUIDES.map(g => g.category))].length, label: "categories" },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <p className="font-bold text-2xl" style={{ color: "#fff" }}>{n}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">

          {/* Guide grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {GUIDES.map((guide, i) => (
              <GuideCard key={guide.title} guide={guide} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{ background: "var(--green-house)" }}
          >
            <div>
              <p className="font-bold text-xl mb-1.5 text-white" style={{ letterSpacing: "-0.02em" }}>
                Ready to put it into practice?
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                Browse the products used in these guides — or check a bundle for everything in one.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/products" className="btn btn-primary whitespace-nowrap" style={{ fontSize: 14, padding: "11px 22px" }}>
                Shop products
              </Link>
              <Link
                href="/bundles"
                className="btn btn-outline whitespace-nowrap"
                style={{ fontSize: 14, padding: "11px 22px", borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
              >
                View bundles
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
