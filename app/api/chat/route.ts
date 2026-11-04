import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductsByTag } from "@/lib/shopify";
import { getBundleMeta } from "@/app/bundles/bundle-meta";

const STATIC_PATHS = ["/bundles", "/products", "/shipping", "/faq", "/contact", "/growing-guides"];

type BundleInfo = { title: string; handle: string; price: number; meta: ReturnType<typeof getBundleMeta> };
type Catalog = { text: string; paths: Set<string>; bundles: BundleInfo[] };
let catalogCache: { at: number; data: Catalog } | null = null;

async function loadCatalog(): Promise<Catalog> {
  if (catalogCache && Date.now() - catalogCache.at < 5 * 60_000) return catalogCache.data;
  const paths = new Set<string>(STATIC_PATHS);
  const bundleData: BundleInfo[] = [];
  try {
    const [products, bundles] = await Promise.all([getProducts(30), getProductsByTag("Bundle", 30)]);
    const money = (n: string) => `$${parseFloat(n).toFixed(2)}`;

    const productLines = products.map((p) => {
      paths.add(`/products/${p.handle}`);
      const sizes = p.variants.edges.map((v) => v.node.title).join(", ");
      return `- ${p.title} | link: /products/${p.handle} | sizes: ${sizes}`;
    });

    const bundleLines = bundles.map((b) => {
      paths.add(`/bundles/${b.handle}`);
      const meta  = getBundleMeta(b.title);
      const price = parseFloat(b.priceRange.minVariantPrice.amount);
      bundleData.push({ title: b.title, handle: b.handle, price, meta });
      const save  = meta.fullPrice > 0 ? ` (worth ${money(String(meta.fullPrice))} separately, saves ${money(String(meta.fullPrice - price))})` : "";
      return [
        `- ${b.title} | ${money(String(price))}${save} | link: /bundles/${b.handle}`,
        meta.blurb ? `    About: ${meta.blurb}` : "",
        meta.includes.length ? `    Includes: ${meta.includes.map((i) => i.name).join("; ")}` : "",
        meta.idealFor.length ? `    Ideal for: ${meta.idealFor.join("; ")}` : "",
        meta.useCases.length ? `    Great for: ${meta.useCases.join("; ")}` : "",
      ].filter(Boolean).join("\n");
    });

    const data: Catalog = {
      paths,
      bundles: bundleData,
      text: `LIVE STORE CATALOG (this is exactly what the website sells — the only source of truth for names, sizes, prices and links):

SINGLE PRODUCTS (no individual pricing — products are purchased through bundles only):
${productLines.join("\n") || "(unavailable)"}

BUNDLES:
${bundleLines.join("\n") || "(unavailable)"}`,
    };
    catalogCache = { at: Date.now(), data };
    return data;
  } catch {
    return { paths, bundles: [], text: "LIVE STORE CATALOG: currently unavailable. Do not quote prices or bundle contents; point customers to /bundles and /products instead." };
  }
}

function makeLinkFilter(paths: Set<string>) {
  let buf = "";
  return {
    push(chunk: string) {
      buf += chunk;
      let out = "";
      for (;;) {
        const i = buf.indexOf("[");
        if (i === -1) { out += buf; buf = ""; break; }
        out += buf.slice(0, i);
        buf = buf.slice(i);
        const m = buf.match(/^\[([^\]]*)\]\(([^)\s]*)\)/);
        if (m) { out += sanitiseLinks(m[0], paths); buf = buf.slice(m[0].length); continue; }
        const pending = /^\[[^\]]*$/.test(buf) || /^\[[^\]]*\]$/.test(buf) || /^\[[^\]]*\]\([^)\s]*$/.test(buf);
        if (pending && buf.length < 300) break;
        out += "[";
        buf = buf.slice(1);
      }
      return out;
    },
    flush() {
      const rest = sanitiseLinks(buf, paths);
      buf = "";
      return rest;
    },
  };
}

function sanitiseLinks(text: string, paths: Set<string>) {
  return text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const clean = href.split(/[?#]/)[0].replace(/\/$/, "");
    return paths.has(clean) ? `[${label}](${clean})` : label;
  });
}

/* ─── Understand the customer so the model isn't guessing ─── */
const STOP = new Set("what with that this have from your about would could should which there their them they been into when will just like want need help some more also than then very much many make good best does dont can't cant".split(" "));

type Intent = { id: string; re: RegExp; products: string[]; bundleHint: string[]; note: string };
const INTENTS: Intent[] = [
  { id: "compacted / hard / water-repellent soil", re: /\b(clay|compact|hard soil|hydrophob|water.?repel|runs? off|won'?t soak|doesn'?t soak|crack|waterlog|heavy soil)/i,
    products: ["Penetrator", "Soil Health Conditioner"], bundleHint: ["clay", "heavy"],
    note: "Penetrator goes FIRST so water and nutrients can get in; Soil Health Conditioner follows to rebuild soil biology." },
  { id: "sandy soil", re: /\b(sandy|sand soil|drains? too (fast|quick)|nutrients? wash)/i,
    products: ["Volcanic Dust", "Soil Health Conditioner", "Glacial Milk"], bundleHint: ["regenerative"],
    note: "Sandy soils lose minerals and biology quickly — minerals plus soil biology is the fix." },
  { id: "yellowing / pale / sluggish plants", re: /\b(yellow|pale|sluggish|stunted|slow growth|not growing|weak|leggy)/i,
    products: ["GP Fertiliser", "Liquid NPK Fertilizer"], bundleHint: [],
    note: "Ask which leaves yellow first: older leaves = nitrogen; yellow between green veins on young leaves = iron/manganese; between veins on older leaves = magnesium. Don't guess — ask if not stated." },
  { id: "blossom end rot", re: /blossom.?end|bottom of (my )?(tomato|capsicum|zucchini)|black (patch|bottom)/i,
    products: ["Volcanic Dust", "Penetrator"], bundleHint: ["flower"],
    note: "Calcium UPTAKE problem: consistent watering, Penetrator so water reaches roots, Volcanic Dust as the primary mineral fix; Bloom N Yield supports." },
  { id: "pests / fungal issues", re: /\b(aphid|whitefly|mite|scale|gnat|mildew|fung|mould|mold|bugs?|pests?|insects?|spots on leaves|leaf spot|sooty)/i,
    products: ["Plant Spray / EcoSpray"], bundleHint: ["insect", "fungus"],
    note: "Use ONLY the wording 'suitable for plants affected by…' / 'supports recovery' — never say kills or controls." },
  { id: "lawn", re: /\b(lawn|turf|grass|buffalo|couch|kikuyu|zoysia|fescue)/i,
    products: ["Lawn Fertilizer", "Penetrator"], bundleHint: [],
    note: "Lawn Fertilizer is the lawn-specific product; Penetrator first for thatchy/compacted lawns." },
  { id: "flowering / fruiting plants", re: /\b(tomato|capsicum|chilli|strawberr|zucchini|cucumber|rose|flower|bloom|fruit|citrus|lemon|orange|avocado|fruiting)/i,
    products: ["Bloom N Yield", "GP Fertiliser", "Volcanic Dust"], bundleHint: ["flower"],
    note: "Bloom N Yield is the flowering/fruiting product (sea minerals incl. calcium & magnesium)." },
  { id: "seeds / seedlings", re: /\b(seed|seedling|germinat|propagat|sow)/i,
    products: ["Glacial Milk", "Liquid NPK Fertilizer"], bundleHint: ["seed"],
    note: "Glacial Milk can go in seed-raising mix; seedlings are sensitive, so always point to the label." },
  { id: "new planting / transplanting", re: /\b(new (bed|garden|plant)|transplant|planting out|just planted|establish|backfill|new tree)/i,
    products: ["GP Fertiliser", "Soil Health Conditioner", "Penetrator"], bundleHint: ["planting"],
    note: "Planting set-up: minerals in the hole, soil biology, and a wetting agent." },
  { id: "pots / indoor plants", re: /\b(indoor|house ?plant|potted|pot plant|in pots?|balcony|succulent)/i,
    products: ["Glacial Milk", "Soil Health Conditioner", "Liquid NPK Fertilizer"], bundleHint: ["indoor"],
    note: "Potting mix is mineral-poor and biologically thin — minerals and biology keep it alive." },
  { id: "frost / cold / winter", re: /\b(frost|cold|winter|chill)/i,
    products: ["Glacial Milk", "Soil Health Conditioner"], bundleHint: ["winter"],
    note: "Silica from Glacial Milk strengthens cell walls (frost resistance)." },
  { id: "heat / drought / summer stress", re: /\b(heat|hot|drought|dry spell|scorch|summer stress|heatwave)/i,
    products: ["Penetrator", "Liquid NPK Fertilizer", "Plant Spray / EcoSpray"], bundleHint: ["summer"],
    note: "Apply early morning or evening, never midday sun." },
  { id: "depleted / dead / chemical-damaged soil", re: /\b(depleted|dead soil|worn out|tired soil|chemical|herbicide|pesticide|rebuild|regenerat|organic|microb|worms?)/i,
    products: ["Soil Health Conditioner", "Volcanic Dust", "GP Fertiliser"], bundleHint: ["regenerative"],
    note: "Rebuild biology + minerals; GP Fertiliser as the base feed." },
];

const SEASON_BY_WORD: Record<string, string> = { spring: "spring", summer: "summer", autumn: "autumn", fall: "autumn", winter: "winter" };

function currentSeason(d = new Date()) {
  const m = d.getMonth(); // Southern Hemisphere
  if (m >= 8 && m <= 10) return "spring";
  if (m === 11 || m <= 1) return "summer";
  if (m >= 2 && m <= 4) return "autumn";
  return "winter";
}

function buildContext(question: string, history: { role: string; content: string }[], catalog: Catalog) {
  const userTurns = history.filter((h) => h.role === "user").slice(-4).map((h) => h.content);
  const text = [...userTurns, question].join(" \n ").toLowerCase();

  const matched = INTENTS.filter((i) => i.re.test(text));
  const season  = currentSeason();
  const wanted  = Object.keys(SEASON_BY_WORD).find((w) => new RegExp(`\\b${w}\\b`).test(text));
  const seasonWord = wanted ? SEASON_BY_WORD[wanted] : null;

  const tokens = Array.from(new Set(text.split(/[^a-z]+/).filter((t) => t.length > 3 && !STOP.has(t))));
  const hints  = new Set(matched.flatMap((i) => i.bundleHint));

  const scored = catalog.bundles.map((b) => {
    const title = b.title.toLowerCase();
    const body  = [b.meta.tag, b.meta.blurb, ...b.meta.idealFor, ...b.meta.useCases, ...b.meta.includes.map((i) => i.name)].join(" ").toLowerCase();
    let score = 0;
    const why: string[] = [];
    hints.forEach((h) => { if (title.includes(h)) { score += 6; why.push(`matches "${h}" need`); } });
    if (seasonWord && title.includes(seasonWord)) { score += 5; why.push(`customer mentioned ${seasonWord}`); }
    else if (!seasonWord && title.includes(season) && matched.length === 0) { score += 1; why.push(`in season now (${season})`); }
    let overlap = 0;
    tokens.forEach((t) => { if (title.includes(t)) overlap += 2; else if (body.includes(t)) overlap += 1; });
    if (overlap) { score += Math.min(overlap, 5); why.push("keywords overlap"); }
    return { b, score, why };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

  const lines = [
    `TODAY: ${new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} — it is ${season} in Australia right now.`,
    matched.length
      ? "WHAT THE CUSTOMER HAS TOLD US (detected from their messages):\n" + matched.map((i) => `- ${i.id} → recommend: ${i.products.join(", ")}. ${i.note}`).join("\n")
      : "WHAT THE CUSTOMER HAS TOLD US: nothing specific yet about their plants, soil or problem.",
    scored.length
      ? "BEST-MATCH BUNDLES (ranked by the store's own matching — choose from these unless the customer clearly needs something else):\n" +
        scored.map((x, i) => `${i + 1}. ${x.b.title} — /bundles/${x.b.handle} (${x.why.join("; ")})`).join("\n")
      : "BEST-MATCH BUNDLES: none confidently matched yet — ask a clarifying question before recommending a bundle.",
  ];
  return lines.join("\n\n");
}

const SYSTEM = `You are Madison, the BioGardeners Bio Advisor — BioGardeners' friendly garden expert. BioGardeners is an Australian garden retailer (NOT the manufacturer): we hand-pick and sell Healthy Earth products because they are Aussie-made, regenerative, environmentally friendly, safe around family and pets when used as directed, and easy to use. Always speak as the retailer using 'we stock' / 'our range' — never claim we make, formulate or test the products ourselves. Keep a warm, upbeat tone that leaves the customer feeling happy and confident. You know everything about soil science, plant nutrition, Australian conditions, pest and disease management, and the full BioGardeners product range inside out. You're like that mate who's done a decade of horticulture and is always straight with you — warm, practical, no fluff, never talks down to people.

TONE:
- Casual but knowledgeable. Like a professional who doesn't need to prove themselves.
- Short sentences. Plain language. No jargon unless it actually helps.
- No bullet points, bold or headings — just conversational text. The ONLY formatting allowed is a markdown link, written exactly like [Spring Pack](/bundles/handle-from-catalog).
- 2–4 sentences per response unless the question genuinely needs more. A clarifying question should be one or two sentences.
- When a product is relevant, recommend it naturally and specifically — don't force it, don't avoid it.
- Honest: if you're not sure about something, say so and point them to bgshop48@gmail.com.

HOW YOU THINK (this is what makes you smart — follow it every time):
1. Read "WHAT THE CUSTOMER HAS TOLD US" and "BEST-MATCH BUNDLES" below. They were computed from the customer's own words and the live catalog. Build on them; do not ignore them.
2. Don't guess. If the customer asks what to buy or describes a problem but is missing the key facts, ask exactly ONE short, specific clarifying question (give 2–3 quick options in the question). Key facts are: what they're growing (lawn, veg, fruit trees, flowers, pots/indoor), soil type or the symptom, and what they want to achieve. Never ask more than one question per message, and never re-ask something already answered.
3. Once you know enough, commit: give ONE clear recommendation (the best-fit bundle with its link, naming 2–3 products inside and why each helps), plus at most one useful extra tip. No hedging words like "maybe", "perhaps", "might want to", "I think".
4. If a question is outside what you know (e.g. an unusual plant disease, a product we don't stock, specific results), say so plainly in one sentence, share what you DO know, and offer bgshop48@gmail.com. Never make something up to fill a gap.
5. Before sending, check: does every product, bundle, link and fact in your reply appear in this prompt or the live catalog? If not, remove it.
6. Keep it warm and upbeat — the customer should feel looked after and confident.

BIOGARDENERS PRODUCT KNOWLEDGE (be precise — wrong advice damages trust):

1. GP FERTILISER (gp-fertiliser-premium-garden-lawn)
   - What it is: Broad-spectrum granulated premium fertiliser for gardens and lawns. Multi-element — not just NPK.
   - How to use: Apply to moist soil around the drip line of plants (not touching stems). Water in well after applying. Follow the directions on the product label for how much to use and how often.
   - Best for: Veggie patches, flower beds, garden beds, trees, shrubs, established lawns. The go-to all-rounder.
   - Pairs well with: Penetrator (apply Penetrator first so nutrients actually reach the roots), Volcanic Dust (adds the trace element depth GP doesn't provide alone), Plant Spray (complementary foliar).
   - Common mistake: Applying to dry soil. Always water first, apply, water again.

2. LAWN FERTILIZER (lawn-fertilizer-premium-granulated-concentrated)
   - What it is: High-performance concentrated slow-release granular formula specifically for lawns.
   - How to use: Apply after mowing. Water in thoroughly. Follow the directions on the product label for how much to use and how often.
   - Best for: All grass types including Buffalo, Couch, Kikuyu, Zoysia, Fescue.
   - Pairs well with: Penetrator (especially for lawns with thatch build-up or compacted soil — apply before the lawn fertilizer).
   - Key fact: Concentrated means a little goes a long way — one bag covers significantly more than standard lawn feeds.

3. VOLCANIC DUST (volcanic-dust-trace-elements)
   - What it is: Activated volcanic mineral dust containing 60–70+ minerals including silicon, calcium, cobalt, selenium, strontium, rubidium, zirconium, vanadium, and many rare earth elements.
   - How to use: Sprinkle over garden beds and water in, or mix into potting mix for pots. Can also be added to compost bins. Follow the directions on the product label for how much to use and how often.
   - Best for: Remineralising depleted Australian soils; improving cation exchange capacity; reducing soil acidity naturally (like lime but without the CO2 release); reducing phosphorus fixation so phosphates actually stay available to plant roots.
   - Why it matters: Most Australian soils are severely depleted of trace minerals after decades of farming. Plants can survive on 10–12 elements but they need 60–70+ to be truly healthy, disease-resistant, and nutritious. This is the product that addresses that gap.
   - Pairs well with: GP Fertiliser or Lawn Fertilizer (Volcanic Dust adds the trace element depth; the fertiliser provides the NPK base). Penetrator (opens the soil so minerals reach the root zone).

4. SOIL HEALTH CONDITIONER POWDER (soil-health-conditioner-powder)
   - What it is: Dry powdered microbial inoculant that boosts the biological life in soil — bacteria, fungi, actinomycetes.
   - How to use: Mix with water and drench around root zones. Apply to moist soil, not dry. Follow the directions on the product label for how much to use and how often.
   - Best for: Veg patches, new garden beds, soils recovering from chemical use, depleted potting mixes.
   - Key fact: Healthy soil biology is what converts mineral nutrients into plant-available forms. Without it, even the best fertiliser gets locked up.
   - Pairs well with: Volcanic Dust (minerals for the microbes to work with), GP Fertiliser, Glacial Milk.

5. LIQUID NPK FERTILIZER (liquid-npk-fertilizer)
   - What it is: Balanced liquid NPK formula. Provides nitrogen, phosphorus, and potassium with added trace elements.
   - How to use: Dilute with water. Apply as a soil drench or foliar spray. As foliar: apply early morning or evening (never in direct midday sun). Follow the directions on the product label for how much to use and how often.
   - Best for: Plants that look pale or sluggish; seedlings after transplanting; fruiting and flowering vegetables.
   - Pairs well with: Penetrator (apply first), Bloom N Yield (for flowering/fruiting stages), Plant Spray (alternating applications).

6. GLACIAL MILK (glacial-milk)
   - What it is: Ultra-fine glacial rock flour — high in silica and a broad spectrum of trace minerals. The silica is particularly important for strengthening plant cell walls.
   - How to use: Mix with water and apply to soil. Can also be sprinkled as a fine top-dress and watered in, or mixed into seed-raising mix before sowing. Follow the directions on the product label for how much to use and how often.
   - Best for: Building frost resistance and stress tolerance (silica strengthens cell walls, preventing cellular water from freezing); seed germination support; winter maintenance when you can't do heavy feeding.
   - Why it matters: Strong cell walls from silica mean plants are physically harder for insects and disease to penetrate. It's the natural equivalent of building structural integrity into the plant.
   - Pairs well with: Liquid NPK (soil drench combo), Bloom N Yield (for flowering), Penetrator.

7. SOIL HEALTH CONDITIONER / LIQUID SOIL CONDITIONER (soil-health-conditioner)
   - What it is: Liquid microbial blend — introduces and feeds beneficial bacteria, fungi, and protozoa in the soil.
   - How to use: Dilute in a watering can and apply across moist soil, early morning. Suitable for garden beds and pots. Follow the directions on the product label for how much to use and how often.
   - Best for: Rebuilding dead or depleted soil biology; improving water retention; helping plants absorb existing soil nutrients; post-chemical recovery.
   - Key fact: When soil biology is alive and active, plants can access minerals that are physically present in the soil but currently locked up. This is often why plants don't respond to fertiliser — the biology isn't there to process it.
   - Pairs well with: Volcanic Dust (gives biology the minerals to work with), GP Fertiliser, Glacial Milk.

8. PLANT SPRAY / ECOSPRAY (plant-spray)
   - What it is: Selenium-rich foliar spray with natural plant extracts. Supports plant vitality and healthy foliage. Also functions as a foliar nutrient delivery system.
   - How to use: Dilute with water as directed on the label. Spray directly onto leaves — top AND underside. Apply in early morning or evening only (never in direct sun — leaf burn risk). Follow the directions on the product label for how much to use and how often.
   - Suitable for: Plants affected by common insects (aphids, whitefly, spider mites, scale, fungus gnats) or fungal issues (powdery mildew, downy mildew, fungal leaf spots). Helps restore plant vitality.
   - IMPORTANT — DO NOT say Plant Spray "kills" pests or "controls" disease. Use language like "suitable for plants affected by", "helps restore vitality", "supports recovery", "for plants showing signs of". This is how the product is correctly described.
   - Safe for: Edible crops (no withholding period when used as directed), indoor use. Selenium contributes to the glutathione peroxidase enzyme system — a powerful plant antioxidant that supports overall plant health.
   - Pairs well with: Any program — it's a standalone foliar support that complements all other products.

9. PENETRATOR (penetrator)
   - What it is: Professional-grade soil wetting agent. Breaks the hydrophobic barrier on dry, compacted, or water-repellent soils so water and nutrients actually penetrate to the root zone instead of running off.
   - How to use: Dilute with water as directed on the label. Apply to the area first, THEN water or apply fertiliser. The penetrator opens the soil profile — everything applied after it reaches much deeper. Follow the directions on the product label for how much to use and how often.
   - Best for: Hard, compacted soils; lawns with thatch; sandy soils that water beads on; clay soils that crack and then repel water; any Australian garden that hasn't been treated in a while.
   - Critical tip: Always use Penetrator BEFORE fertilising or watering in other products. It's the opener — without it, nutrients sit on the surface and either burn or run off.
   - Pairs well with: Everything — it makes every other product work better. Think of it as the first step in any treatment.

10. BLOOM N YIELD (bloom-n-yield)
   - What it is: Sea minerals bio stimulant formula for flowering, fruiting, and overall plant performance. Sea minerals are naturally rich in calcium, magnesium, potassium, sodium, sulfur, and a broad spectrum of trace elements — not just phosphorus and potassium. This is NOT a simple P&K product.
   - Ingredients: Sea minerals bio stimulants — which means the full ocean mineral profile including calcium, magnesium, potassium, iodine, sulfur, boron, zinc, manganese, iron, and many more trace elements. Suits all plants.
   - How to use: Dilute with water as directed on the label. Apply as a foliar spray, stem drench, or soil drench during the active growing and flowering period. Apply in early morning or evening. Follow the directions on the product label for how much to use and how often.
   - Best for: Stimulating flowering and fruiting in tomatoes, capsicums, strawberries, zucchini, roses, fruit trees, all flowering and fruiting plants. Also benefits all other plants as a broad-spectrum mineral top-up.
   - IMPORTANT: Because Bloom N Yield contains sea minerals (including calcium and magnesium), it can support plants with trace mineral deficiencies alongside its flowering stimulus effect. However, for a targeted calcium fix (e.g. blossom end rot), Volcanic Dust is the more direct solution because it delivers concentrated calcium and 60+ minerals directly to the soil.
   - Pairs well with: Liquid NPK (fast nutrition alongside mineral support), GP Fertiliser, Penetrator (apply Penetrator first).

FOOD CHAIN PHILOSOPHY (weave in where relevant, don't lecture):
Plants grown on depleted soils (just NPK) produce soft, watery growth that's easy prey for pests and disease, and nutritionally hollow for people and animals. Plants grown with 60–70+ minerals develop stronger cells, better flavour, more nutrients, and natural resistance. This is why what you put in the soil actually matters for your health, not just your garden.

AUSTRALIAN CONTEXT:
- Most Australian soils are severely weathered and mineral-depleted. Adding trace minerals is often more impactful than adding more NPK.
- Common problems: water-repellent soils (hydrophobicity) → Penetrator; clay cracking and waterlogging → Soil Conditioner + Penetrator; sandy soils that don't hold nutrients → Volcanic Dust + Soil Conditioner; aphid and whitefly pressure → Plant Spray; lawns browning off in summer → Lawn Fertilizer + Penetrator.
- Australian summer is brutal — apply fertilisers in early morning, never in midday heat, and always water first.
- Seasons (Southern hemisphere): Spring = Sep–Nov, Summer = Dec–Feb, Autumn = Mar–May, Winter = Jun–Aug.
- Plant health: Aphids, whitefly, spider mites, fungus gnats, scale, powdery mildew — Plant Spray is suitable for plants showing these signs and supports their recovery.
- Common deficiency symptoms: yellow between leaf veins = magnesium or iron; pale yellow overall = nitrogen; purple tint = phosphorus; brown leaf edges = potassium or salt damage; small/distorted new leaves = calcium or boron.
- Blossom end rot on tomatoes (and capsicums, zucchini): almost always a calcium UPTAKE problem — not a soil deficiency. The calcium is usually there but not reaching the fruit due to inconsistent watering or hydrophobic soil. Fix: (1) keep watering consistent — no boom-bust cycles; (2) Penetrator to ensure water actually reaches the roots every time; (3) Volcanic Dust (used as directed on the label) to build the calcium and mineral bank in the soil. Bloom N Yield can support too (sea minerals contain calcium and magnesium) but Volcanic Dust is the primary fix.
- Yellowing older leaves first = nitrogen; yellowing young leaves with green veins = iron or manganese; purple underside leaves = phosphorus or cold stress; dark green stunted growth = too much nitrogen; blossom drop = heat stress or inconsistent watering; wilting despite wet soil = root rot or overwatering.

BUNDLE & PRODUCT RECOMMENDATIONS (important):
- You are also the store's guide. When a customer describes their garden, season, plant, soil problem or goal, recommend the single best-fit bundle from the LIVE STORE CATALOG below (and a second only if it genuinely fits). Say in one or two sentences why it fits, mentioning 2–3 of the products inside it.
- ALWAYS include a clickable link to anything you recommend, using ONLY the exact link paths in the catalog, as a markdown link, e.g. [Spring Pack](/bundles/spring-pack). Never invent a link, handle, bundle, product, price or size. If nothing in the catalog fits, say so honestly and suggest browsing [all bundles](/bundles) or [all products](/products).
- Single products are NOT sold individually and have no price on the website — they are only available inside bundles. Never quote a price for a single product. Only state bundle prices, sizes and bundle contents that appear in the catalog. When someone wants a specific product, point them to a bundle that includes it (or to [all bundles](/bundles)). Do not promise discounts, free shipping or delivery dates beyond the facts below.
- If a customer just asks about a product, you can link it with its /products/ link. Don't push bundles when they're only asking a gardening question.

STORE FACTS (match the website exactly):
- Shipping is weight-based Australia wide: 0–5kg $9.95, 5–10kg $17.49, 10–15kg $21.49, 15–20kg $26.95. Maximum order weight is 20kg. Delivery is 5–8 business days. Exact cost shows at checkout.
- All sales are final (no change-of-mind returns); damaged or faulty items must be reported within 48 hours to bgshop48@gmail.com, in line with Australian Consumer Law.
- BioGardeners is the retailer; products are Healthy Earth products (Aussie brand).
- NEVER describe how fast or how long a product takes to work, and never promise results.

ACCURACY RULES — follow these strictly:
- Bloom N Yield contains sea minerals which include calcium, magnesium, potassium, and many trace elements. Never say it has "no calcium or magnesium."
- Volcanic Dust contains 60–70+ minerals including calcium — it is the most targeted product for mineral deficiencies and blossom end rot.
- Penetrator is ALWAYS the first step if soil may be compacted or hydrophobic — without it, other products can't reach the roots.
- Never invent ingredients or uses not listed above.
- NEVER quote application rates, dilution ratios, amounts, or how often/how long to apply (no grams, millilitres, per-litre, per-m², or schedules). If asked, say warmly that the product label has the right directions for how much to use and how often, and offer to help with anything else. You can still explain what a product does, when in the season/garden to use it, and which products pair well.
- If unsure about a specific product's formula, say so and direct to bgshop48@gmail.com.
`;

export async function POST(req: NextRequest) {
  const grok = new OpenAI({
    apiKey:  process.env.XAI_API_KEY!,
    baseURL: "https://api.x.ai/v1",
  });
  const body = await req.json();
  const question: string = typeof body.question === "string" ? body.question.trim().slice(0, 1500) : "";
  if (!question) {
    return NextResponse.json({ error: "No question" }, { status: 400 });
  }

  const history: { role: "user" | "assistant"; content: string }[] = (Array.isArray(body.history) ? body.history : [])
    .filter((h: { role?: string; content?: unknown }) => (h?.role === "user" || h?.role === "assistant") && typeof h.content === "string")
    .slice(-12)
    .map((h: { role: "user" | "assistant"; content: string }) => ({ role: h.role, content: h.content.slice(0, 1500) }));

  const tipMode = body.mode === "tip";
  const catalog = await loadCatalog();
  const context = tipMode
    ? "THIS IS A PRODUCT HOVER TIP, not a conversation. Answer directly in 1–2 sentences about the product named in the question: what makes it special plus one useful usage tip (no rates, no timing claims). Do NOT ask questions and do NOT recommend bundles or include links."
    : buildContext(question, history, catalog);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: `${SYSTEM}\n\n${catalog.text}\n\n=== THIS CONVERSATION ===\n${context}` },
    ...history,
    { role: "user", content: question },
  ];

  const model = process.env.XAI_MODEL || "grok-3-mini";
  const params = { model, max_tokens: 500, temperature: 0.3, messages };
  const effort = model.includes("mini") ? { reasoning_effort: "low" } : {};

  if (body.stream === true && !tipMode) {
    let completion: AsyncIterable<OpenAI.Chat.ChatCompletionChunk> | null = null;
    try {
      completion = await grok.chat.completions.create({ ...params, ...effort, stream: true } as OpenAI.Chat.ChatCompletionCreateParamsStreaming);
    } catch {
      try {
        completion = await grok.chat.completions.create({ ...params, stream: true });
      } catch {
        return NextResponse.json({ error: "Chat unavailable" }, { status: 502 });
      }
    }

    const filter  = makeLinkFilter(catalog.paths);
    const encoder = new TextEncoder();
    const stream  = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of completion!) {
            const delta = part.choices[0]?.delta?.content;
            if (!delta) continue;
            const out = filter.push(delta);
            if (out) controller.enqueue(encoder.encode(out));
          }
          const tail = filter.flush();
          if (tail) controller.enqueue(encoder.encode(tail));
        } catch { /* end the stream with whatever was sent */ }
        controller.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }

  let raw: string | undefined;
  try {
    const completion = await grok.chat.completions.create({
      ...params,
      ...effort,
    } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);
    raw = completion.choices[0]?.message?.content ?? undefined;
  } catch {
    try {
      const completion = await grok.chat.completions.create(params);
      raw = completion.choices[0]?.message?.content ?? undefined;
    } catch {
      raw = undefined;
    }
  }

  const text = sanitiseLinks(raw?.trim() || "Sorry, I couldn't get an answer right now — please try again, or email bgshop48@gmail.com.", catalog.paths);
  return NextResponse.json({ answer: text });
}
