import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const ALL_PRODUCTS = [
  { handle: "gp-fertiliser-premium-garden-lawn",              title: "GP Fertiliser",            role: "Broad-spectrum granulated fertiliser for gardens and lawns. The core feeding product." },
  { handle: "lawn-fertilizer-premium-granulated-concentrated", title: "Lawn Fertilizer",           role: "Concentrated slow-release lawn granules — feeds for 12 weeks. Lawn-specific." },
  { handle: "volcanic-dust-trace-elements",                   title: "Volcanic Dust",              role: "60-70+ trace minerals. Remineralises depleted soils, improves cation exchange. Use 1-2x/year." },
  { handle: "soil-health-conditioner-powder",                 title: "Soil Conditioner Powder",    role: "Dry microbial inoculant — rebuilds soil biology in veg patches and garden beds." },
  { handle: "liquid-npk-fertilizer",                          title: "Liquid NPK Fertilizer",      role: "Fast-acting liquid NPK with trace elements. Foliar or soil drench, visible in 3-5 days." },
  { handle: "glacial-milk",                                   title: "Glacial Milk",               role: "Glacial rock flour high in silica. Strengthens cell walls, frost resistance, seed support." },
  { handle: "soil-health-conditioner",                        title: "Soil Health Conditioner",    role: "Liquid microbial blend. Rebuilds soil biology, improves water retention and nutrient uptake." },
  { handle: "plant-spray",                                    title: "Plant Spray",                role: "Selenium-based foliar spray. Controls aphids, whitefly, spider mites, powdery mildew. Safe for edibles." },
  { handle: "penetrator",                                     title: "Penetrator",                 role: "Soil wetting agent. Always apply FIRST — opens compacted/hydrophobic soils so everything else works." },
];

// Pairing logic: which products naturally complement each other
const PAIRING_RULES = `
Natural product pairings and why:
- Penetrator + anything: Penetrator always pairs with any soil-applied product because it ensures nutrients actually reach the roots. If someone is buying a fertiliser or conditioner, Penetrator makes it dramatically more effective.
- GP Fertiliser + Volcanic Dust: GP provides the NPK backbone; Volcanic Dust adds the 60+ trace minerals. Together they cover the full mineral spectrum.
- GP Fertiliser + Soil Health Conditioner (liquid or powder): Fertiliser feeds the plants; conditioner feeds the soil biology that converts those nutrients.
- Liquid NPK + Plant Spray: Fast-acting foliar pairing — liquid NPK boosts growth, Plant Spray handles pests and disease. Often used together on fruiting veg.
- Glacial Milk + anything: Glacial Milk is a trace mineral supplement that complements every feeding program — suggest it when someone buys any fertiliser.
- Plant Spray as standalone: Suggest it whenever the customer is viewing products — pest and disease pressure is universal in Australian gardens.
- Lawn Fertilizer + Penetrator: Lawn products work far better when the soil isn't compacted. Penetrator + Lawn Fertilizer is the standard lawn program.
- Soil Health Conditioner + Volcanic Dust: Biology needs minerals to work with. These two together rebuild dead soils from the ground up.
`;

export async function POST(req: NextRequest) {
  const grok = new OpenAI({
    apiKey:  process.env.XAI_API_KEY!,
    baseURL: "https://api.x.ai/v1",
  });
  const { currentHandle, cartHandles = [] } = await req.json();

  const exclude   = new Set([currentHandle, ...cartHandles]);
  const available = ALL_PRODUCTS.filter(p => !exclude.has(p.handle));
  if (!available.length) return NextResponse.json({ handles: [] });

  const current = ALL_PRODUCTS.find(p => p.handle === currentHandle)?.title ?? currentHandle;
  const cart    = cartHandles.map((h: string) => ALL_PRODUCTS.find(p => p.handle === h)?.title ?? h);

  const completion = await grok.chat.completions.create({
    model:      "grok-3-mini",
    max_tokens: 60,
    messages: [
      {
        role: "system",
        content: `You are a BioGardeners expert. Use the pairing logic below to pick the 2 best complementary products from the available list. Prioritise practical compatibility — what would actually make sense to use together. Reply with exactly 2 product handles separated by a comma, nothing else.

${PAIRING_RULES}`,
      },
      {
        role: "user",
        content:
          `Currently viewing: ${current}. ` +
          (cart.length ? `Already in cart: ${cart.join(", ")}. ` : "") +
          `Available products:\n${available.map(p => `${p.title} (${p.handle}) — ${p.role}`).join("\n")}\n\nPick the 2 best complementary handles.`,
      },
    ],
  });

  const raw     = completion.choices[0]?.message?.content ?? "";
  const handles = raw.split(",").map((s: string) => s.trim()).filter((h: string) => ALL_PRODUCTS.some(p => p.handle === h));
  return NextResponse.json({ handles: handles.slice(0, 2) });
}
