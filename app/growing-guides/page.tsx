"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout, Leaf, Apple, FlaskConical, Sun, Droplets,
  Clock, ChevronDown, BookOpen,
  CheckCircle2, TreePine, Package,
} from "lucide-react";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

type GuideData = {
  category:      string;
  icon:          React.ElementType;
  color:         string;
  title:         string;
  summary:       string;
  readTime:      string;
  difficulty:    string;
  product:       string;
  productHandle: string;
  highlight:     string;
  steps:         string[];
  bundle?:       { name: string };
};

const GUIDES: GuideData[] = [
  {
    category:      "Vegetables",
    icon:          Sprout,
    color:         "#2D6A4F",
    title:         "Getting started with raised bed vegetables",
    summary:       "How to build, fill, and feed a raised bed from scratch — the right layering order, soil preparation, and first-season fertiliser schedule.",
    readTime:      "8 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "Perfect for new gardeners starting their first bed",
    steps: [
      "Choose a location with at least 6 hours of direct sun per day.",
      "Fill the bed with quality topsoil or garden mix from your local supplier. Work GP Fertiliser into the top 10cm before planting, following the directions on the product label — this gives roots an immediate mineral-rich environment.",
      "Apply Penetrator as a drench before planting, following the directions on the product label — it opens the soil so water and nutrients reach the root zone rather than running off the surface.",
      "After planting, let the plants settle in before the next fertiliser application. Reapply GP Fertiliser as directed on the label and water in well.",
      "Feed through the growing season, following the directions on the product label, and check in if plants show yellowing.",
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
      "Apply Penetrator at transplanting time, following the directions on the label. Tomatoes are heavy feeders and Penetrator ensures the root zone is open and able to absorb what you put in.",
      "Hold off fertiliser while the plant establishes. New leaf growth tells you it's ready.",
      "Begin GP Fertiliser around the base (not touching the stem), following the directions on the label. Water in thoroughly.",
      "As flowers appear, continue feeding as directed on the label. Add Bloom N Yield at this stage — tomatoes need calcium, magnesium, and sea minerals to support fruit set.",
      "Once fruiting begins, ease back on feeding and follow the directions on the label. Over-feeding at this stage can cause blossom end rot.",
    ],
    bundle: { name: "Spring Care Bundle" },
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
      "Use a quality potting mix from your local garden centre as the base. Add Volcanic Dust to each pot as directed on the label — the trace minerals make a real difference to herb flavour and oil content.",
      "Feed with GP Fertiliser during active growth, following the directions on the label for pots.",
      "Soft-leafed herbs (basil, coriander, parsley) need more nitrogen. Liquid NPK, used as directed on the label between granular feeds, keeps them lush through summer.",
      "Woody herbs (rosemary, thyme, sage) are light feeders. One full GP Fertiliser application per season is enough — over-feeding makes them leggy and reduces flavour intensity.",
      "Mint is a heavy feeder and fast spreader — keep it in its own pot and feed with GP Fertiliser as directed on the label.",
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
      "Marigolds planted as a border around tomatoes and capsicums can help deter certain insects — they also attract beneficial insects that support plant health.",
      "After harvesting legumes, cut the roots rather than pulling them. The root nodules left in the soil continue releasing nitrogen.",
      "Add Volcanic Dust when replanting, as directed on the label, to replenish trace minerals after a legume season before introducing heavy feeders.",
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
      "In early spring (August–September), apply Penetrator as a drench across the entire root zone — from trunk to drip line — following the directions on the label. This opens the soil so the fertiliser that follows actually reaches the roots.",
      "Follow with GP Fertiliser under the canopy (not touching the trunk) once soil temperature is consistently above 12°C, as directed on the label.",
      "Citrus specifically: feed again in November with Liquid NPK as directed on the label. Citrus are heavy potassium consumers during fruit development.",
      "Stone fruit (peaches, nectarines, plums): fertilise immediately after harvest in late summer to build reserves for next season's flowering.",
      "Do not feed after February — encouraging late growth makes trees vulnerable to frost and disease.",
    ],
    bundle: { name: "Spring Care Bundle" },
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
      "Look at the symptoms: yellow between veins = magnesium or iron deficiency; pale overall = nitrogen; purple leaves = phosphorus.",
      "Apply Penetrator first to open the root zone, then Soil Health Conditioner to restore the biological activity needed to process nutrients — follow the directions on each product label.",
      "Add compost as a 5cm top-dressing around the drip line to improve soil structure and water retention.",
      "Once the soil has had time to settle, begin GP Fertiliser as directed on the label. Monitor new leaf colour as the soil biology reestablishes — consistent applications make the difference.",
    ],
    bundle: { name: "Regenerative Soil Care Bundle" },
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
      "Based on results: add Soil Health Conditioner for depleted biology, Penetrator for compacted or water-repellent soil, Volcanic Dust for mineral depletion, GP Fertiliser to correct nutrient deficiency.",
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
      "Apply a 10cm layer of compost or aged garden mix on top of the cardboard. Water it in well — the cardboard below provides a weed-suppressing base while it breaks down.",
      "Add GP Fertiliser and work it into the compost layer, following the directions on the label. This sets up the mineral environment before any roots arrive.",
      "Apply Penetrator across the whole bed surface before planting, as directed on the label — it opens the new soil layer so water penetrates evenly rather than running off.",
      "Plant directly into the top layer. By the second season, earthworms and soil biology will have broken down the cardboard and integrated all the layers.",
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
      "Week 2: Apply Penetrator to trees, shrubs, and established perennials — spring's wet-dry cycles make soils prone to becoming water-repellent, and Penetrator resets the soil's ability to absorb water.",
      "Week 3: Plant warm-season seedlings once soil temperature consistently reaches 12°C.",
      "Week 3: Apply GP Fertiliser at planting, following the directions on the label — the mineral charge gives transplants what they need immediately without burning.",
      "Ongoing: water consistently. More plants fail from inconsistent watering than from any nutrient issue.",
    ],
    bundle: { name: "Spring Care Bundle" },
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
      "Never apply GP Fertiliser to dry soil — always water thoroughly first, apply, then water again. Dry application can burn roots.",
      "Ease back on fertiliser in peak summer, following the directions on the label. Plants slow their uptake in heat stress — pushing nutrients causes build-up and burn.",
      "Penetrator can be applied through summer as it doesn't add salts. It helps roots access existing soil moisture more efficiently.",
      "Water deeply and infrequently rather than shallowly every day. Deep watering encourages deep roots that are more heat and drought resistant.",
      "Mulch is the single highest-impact summer action — a 10cm layer of sugar cane mulch or straw reduces soil temperature by up to 8°C and halves water loss.",
    ],
    bundle: { name: "Summer Care Bundle" },
  },

  // ── 10 new guides ──────────────────────────────────────────────────────────

  {
    category:      "Vegetables",
    icon:          Sprout,
    color:         "#2D6A4F",
    title:         "Growing leafy greens year-round",
    summary:       "Spinach, silverbeet, kale, and lettuce are the easiest crops to keep in rotation — if you manage heat, bolting, and feeding correctly.",
    readTime:      "6 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "A steady supply of greens from the same small space all year",
    steps: [
      "In summer, grow heat-tolerant varieties (silverbeet, perpetual spinach) and keep them shaded during the hottest part of the day.",
      "Feed leafy greens with GP Fertiliser as directed on the label — they are nitrogen lovers but can burn easily in heat.",
      "In autumn and winter, switch to full-sun positions. Cooler months are when true spinach and butter lettuce are at their best. Return to your usual feeding routine as directed on the label.",
      "Harvest outer leaves only — never strip the whole plant. This keeps it producing for months.",
      "Succession-plant every 3–4 weeks so you always have something at harvest stage.",
    ],
  },
  {
    category:      "Vegetables",
    icon:          Sprout,
    color:         "#2D6A4F",
    title:         "Zucchini and cucumbers: a feeding timeline",
    summary:       "These fast-growing fruiting vegetables exhaust soil quickly. Here's the exact feeding schedule to keep them producing all season.",
    readTime:      "7 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "Zucchinis will outproduce any other vegetable if you feed them right",
    steps: [
      "Prepare beds with GP Fertiliser before planting, following the directions on the label — zucchinis and cucumbers need a rich starting environment.",
      "At transplanting, apply Penetrator as a root drench, as directed on the label, to ensure roots can access water and nutrients from the start.",
      "Begin follow-up feeding with GP Fertiliser once the plant has 4–6 true leaves, following the directions on the label. Avoid feeding before this — seedlings are sensitive.",
      "As flowering starts, keep feeding as directed on the label. Add Bloom N Yield to support both flowering and fruit set.",
      "If fruit production slows mid-season, apply Liquid NPK as a foliar spray in the early morning, as directed on the label.",
    ],
    bundle: { name: "Summer Care Bundle" },
  },
  {
    category:      "Herbs",
    icon:          Leaf,
    color:         "#40916C",
    title:         "Building a low-maintenance herb garden",
    summary:       "A well-designed herb garden almost looks after itself. This guide covers plant selection, spacing, and the one feeding schedule that covers them all.",
    readTime:      "8 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "Design it once, harvest from it for years",
    steps: [
      "Group herbs by water needs: Mediterranean herbs (rosemary, thyme, oregano, sage) in well-drained, drier spots; moisture-lovers (basil, parsley, chives) in richer soil.",
      "Prepare beds by working in Volcanic Dust, following the directions on the label — trace minerals make a noticeable difference to herb flavour and essential oil content.",
      "Apply GP Fertiliser following the directions on the label. Mediterranean herbs prefer lighter feeding; soft-stemmed herbs are happy with a little more.",
      "Mulch Mediterranean herbs with gravel or pebbles to reflect heat and prevent root rot — organic mulch holds too much moisture for them.",
      "Prune flowering stems as they appear. Letting herbs flower triggers them to slow leaf production — unless you want the seed.",
    ],
  },
  {
    category:      "Fruits & Trees",
    icon:          Apple,
    color:         "#1B4332",
    title:         "Getting a young citrus tree established",
    summary:       "The first two years of a citrus tree's life set the pattern for the next twenty. Here's how to give yours the right start.",
    readTime:      "9 min",
    difficulty:    "Beginner",
    product:       "Penetrator",
    productHandle: "penetrator",
    highlight:     "Two years of right care = decades of reliable harvests",
    steps: [
      "Plant citrus in full sun — at least 6 hours direct sun per day. Morning sun with afternoon shade is acceptable in very hot climates.",
      "Prepare the planting hole twice as wide as the root ball but no deeper. Citrus are grafted; keep the graft union above soil level.",
      "Apply Penetrator as a root drench at planting, as directed on the label — it ensures water and fertiliser reach the root zone rather than running off the soil surface.",
      "Hold off on GP Fertiliser while the tree establishes. Once established, begin feeding in late winter as directed on the label.",
      "Remove any fruit that sets in the first year — energy into roots and canopy now means far more fruit from year three onward.",
    ],
    bundle: { name: "Planting Day Care Bundle" },
  },
  {
    category:      "Fruits & Trees",
    icon:          TreePine,
    color:         "#1B4332",
    title:         "Avocado growing in Australian conditions",
    summary:       "Avocados are fussy about drainage, pH, and root health. Get those three things right and they're surprisingly productive.",
    readTime:      "10 min",
    difficulty:    "Intermediate",
    product:       "Soil Health Conditioner",
    productHandle: "soil-health-conditioner",
    highlight:     "Avocados fail from wet feet and wrong pH — both are fixable",
    steps: [
      "Avocados are extremely sensitive to waterlogging. Plant on a raised mound of 30–40cm even in well-drained soil, or in a raised bed.",
      "Target pH of 6.0–6.5. Most Australian soils are either too alkaline (coastal limestone) or too acidic (heavy clay). Test first, amend slowly.",
      "Apply Penetrator first to open waterlogged or compacted ground, then follow with Soil Health Conditioner to restore the biology that avocado roots rely on for phosphorus access — follow the directions on each product label.",
      "Fertilise lightly with GP Fertiliser, following the directions on the label. Avocados are sensitive to salt build-up — never exceed the label directions.",
      "Water deeply but infrequently. Avocados in sandy soils may need twice-weekly watering in summer; in clay, every 10–14 days is often enough.",
    ],
    bundle: { name: "Regenerative Soil Care Bundle" },
  },
  {
    category:      "Soil prep",
    icon:          FlaskConical,
    color:         "#6B4226",
    title:         "Fixing heavy clay soil — the practical guide",
    summary:       "Clay isn't bad soil — it's actually mineral-rich. The problem is structure. Here's how to open it up without years of waiting.",
    readTime:      "8 min",
    difficulty:    "Intermediate",
    product:       "Soil Health Conditioner",
    productHandle: "soil-health-conditioner",
    highlight:     "Clay holds nutrients better than sand — you just need to fix the structure",
    steps: [
      "Never dig clay when wet — it smears and compacts permanently. Work it only when moist enough to crumble but not so wet it sticks.",
      "Apply Penetrator first to force water through the clay profile. Follow immediately with Soil Conditioner — this combination opens the clay matrix and starts restoring biology. Follow the directions on each product label.",
      "Add coarse organic matter (composted wood chip, straw, sugar cane mulch) on top — as it breaks down, earthworms pull it into the clay layer.",
      "Gypsum (calcium sulfate) is excellent for sodic clays — apply following the directions on the product label and water in. It doesn't affect pH.",
      "Repeat the Penetrator + Conditioner treatment as directed on the product labels. Do not add sand to clay — fine sand and clay particles pack into a concrete-like matrix.",
    ],
    bundle: { name: "Clay / Heavy Soil Care Bundle" },
  },
  {
    category:      "Soil prep",
    icon:          FlaskConical,
    color:         "#6B4226",
    title:         "Building soil biology from scratch",
    summary:       "Healthy soil is a living system. Here's how to establish a thriving population of bacteria, fungi, and earthworms in even the most depleted ground.",
    readTime:      "9 min",
    difficulty:    "Intermediate",
    product:       "Soil Health Conditioner",
    productHandle: "soil-health-conditioner",
    highlight:     "Feed the soil and the soil feeds your plants — everything else follows",
    steps: [
      "Stop using synthetic pesticides and herbicides in the target area at least 3 months before beginning. These compounds affect soil biology non-selectively.",
      "Apply Soil Health Conditioner across the area, following the directions on the label — it introduces beneficial bacteria and fungi that form the foundation of a living soil ecosystem.",
      "Add compost as a 5cm surface layer. Don't dig it in — let worms and biology pull it down. Digging disrupts developing fungal networks.",
      "Plant a cover crop (oats, radish, field peas) if the bed will sit empty for more than 4 weeks. Bare soil loses biology fast; roots feed the microbes you're building.",
      "After 8 weeks, count worms in a 30cm cube. More than 10 means your biology is establishing. Under 5 means more organic matter and less disturbance is needed.",
    ],
    bundle: { name: "Regenerative Soil Care Bundle" },
  },
  {
    category:      "Seasonal",
    icon:          Sun,
    color:         "#B45309",
    title:         "Autumn garden wind-down and winter prep",
    summary:       "March to June is when you set the garden up for winter. Done right, you'll have crops through the cold months and healthier soil come spring.",
    readTime:      "6 min",
    difficulty:    "Beginner",
    product:       "Volcanic Dust",
    productHandle: "volcanic-dust-trace-elements",
    highlight:     "Don't let the garden go idle in winter — it's your best growing season for leafy greens",
    steps: [
      "In March–April, pull spent summer crops. Don't leave roots in the ground — they can harbour problems over winter.",
      "Apply Volcanic Dust across the cleared bed, following the directions on the label. Autumn is the ideal time for trace mineral replenishment before winter crops go in.",
      "Plant brassicas (broccoli, cauliflower, cabbage, kale) and winter greens by April in most Australian climates. June in tropical regions.",
      "Add a 5cm layer of compost over the entire bed. Winter rain will work it in slowly, and spring worms will integrate it by September.",
      "Do not fertilise with GP Fertiliser after May — encouraging soft new growth before frost makes plants more vulnerable. Resume in August, following the directions on the label.",
    ],
    bundle: { name: "Autumn Care Bundle" },
  },
  {
    category:      "Seasonal",
    icon:          Droplets,
    color:         "#1E40AF",
    title:         "Winter feeding guide for Australian gardens",
    summary:       "Plants don't stop growing in winter — they just slow down. The rules for feeding change significantly when temperatures drop.",
    readTime:      "6 min",
    difficulty:    "Beginner",
    product:       "GP Fertiliser",
    productHandle: "gp-fertiliser-premium-garden-lawn",
    highlight:     "Half the fertiliser mistakes happen in winter — here's how to avoid them",
    steps: [
      "Go lighter with your GP Fertiliser in winter, following the directions on the label. Plants take up nutrients much more slowly in cold soil.",
      "Allow longer between applications. Nutrients sit in the soil longer in winter — over-applying leads to run-off.",
      "Cool-season crops (brassicas, leafy greens, peas, broad beans) still benefit from feeding; warm-season plants that haven't died back should not be pushed.",
      "Apply Glacial Milk through winter as directed on the label — high silica content supports cell wall strength and frost resistance.",
      "Resume your usual GP Fertiliser routine in August as soil temperatures rise, following the directions on the label — warmer soil means nutrients are taken up more efficiently.",
    ],
    bundle: { name: "Winter Care Bundle" },
  },
  {
    category:      "Vegetables",
    icon:          Sprout,
    color:         "#2D6A4F",
    title:         "Root vegetables: carrots, beetroot, and parsnips",
    summary:       "Root crops need a different soil preparation to leaf and fruit crops. The key is loose depth, low nitrogen, and the right timing.",
    readTime:      "7 min",
    difficulty:    "Beginner",
    product:       "Volcanic Dust",
    productHandle: "volcanic-dust-trace-elements",
    highlight:     "Most carrot failures are soil structure problems, not feeding problems",
    steps: [
      "Root crops need loose, stone-free soil to at least 30cm depth. Fork the bed thoroughly before sowing — any compaction causes forked, stubby roots.",
      "Avoid fresh manure or high-nitrogen fertilisers immediately before sowing. Excess nitrogen causes root crops to fork and produce excessive leaf instead of root.",
      "Apply Volcanic Dust and work it in well, following the directions on the label. Trace minerals — especially boron and potassium — directly affect root quality and sweetness.",
      "Sow seed directly (root crops don't transplant well). Thin to the recommended spacing once seedlings are 3–4cm tall — overcrowding causes small, poor-quality roots.",
      "Once plants are 10cm tall, apply GP Fertiliser lightly, as directed on the label. From here, let the soil minerals do the work — root crops don't need heavy feeding.",
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

function GuideCard({ guide, index }: { guide: GuideData; index: number }) {
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
        <div className="flex items-end justify-between pt-3" style={{ borderTop: "1px solid var(--ceramic)" }}>
          <div className="flex flex-col gap-1.5">
            <Link
              href={`/products/${guide.productHandle}`}
              className="text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-75 self-start"
              style={{ background: color + "12", color }}
            >
              Uses {guide.product}
            </Link>
            {guide.bundle && (
              <Link
                href="/bundles"
                className="flex items-center gap-1 text-[11px] font-semibold hover:underline self-start"
                style={{ color: "var(--text-black-soft)" }}
              >
                <Package size={10} />
                {guide.bundle.name}
              </Link>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-xs font-semibold transition-colors shrink-0"
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
              {guide.bundle && (
                <Link
                  href="/bundles"
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 transition-opacity hover:opacity-80"
                  style={{ background: color + "12", color }}
                >
                  <Package size={12} />
                  Get everything in one: {guide.bundle.name} →
                </Link>
              )}
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
