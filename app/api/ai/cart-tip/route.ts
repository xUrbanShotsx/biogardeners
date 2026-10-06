import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const PRODUCT_KNOWLEDGE = `
BioGardeners products and exact usage:

GP FERTILISER: Broad-spectrum granulated fertiliser for gardens and lawns. Apply 100g per m² (approximately 1 handful) around plant drip lines (not touching stems), water in well. 4–6 times per year. Always apply to moist soil, never dry.

LAWN FERTILIZER: Concentrated slow-release lawn granules. Apply 30g per m² after mowing, water in thoroughly. Feeds for up to 12 weeks — one treatment covers the lawn for a full season.

VOLCANIC DUST: 60–70+ minerals from volcanic rock. Sprinkle 50g per m² over garden beds and water in. For pots, 1–2 teaspoons. Once or twice a year is enough — slow-release mineral bank that improves cation exchange capacity and makes phosphorus stay available.

LIQUID NPK FERTILIZER: Balanced liquid NPK formula. Dilute 10ml per litre (1L makes 100L), apply as soil drench or foliar spray. Foliar spray in early morning or evening only (never midday sun). Monthly or as needed.

GLACIAL MILK: Glacial rock flour — high in silica, strengthens plant cell walls. Mix 50g per 9L watering can and apply to soil monthly. Or mix 1 tablespoon per litre into seed-raising mix. Great for frost resistance and winter maintenance.

SOIL HEALTH CONDITIONER (liquid): Liquid microbial blend. Dilute 50ml per 9L watering can. Apply to moist soil in the morning. Every 4–6 weeks for gardens. Rebuilds soil biology so plants can access existing soil nutrients.

SOIL HEALTH CONDITIONER POWDER: Dry microbial inoculant. Mix 50g per litre, drench around roots. Every 4–6 weeks. Best for veg patches and depleted soils.

PLANT SPRAY / ECOSPRAY: Selenium-rich foliar spray concentrate suitable for plants affected by insects or fungal issues. Dilute 40ml per litre (20ml for sensitive plants/glasshouses) — 1L makes up to 25L. Helps restore plant vitality and healthy foliage. Spray top AND underside of leaves, morning or evening only. Shake well before use. For plants under pressure: every 3–5 days for 3 rounds. Maintenance: fortnightly. Safe for edibles. Do NOT say it "kills" or "controls" — say it is "suitable for plants affected by" and "supports recovery".

PENETRATOR: Soil wetting agent. Mix 10ml per litre and apply BEFORE watering or fertilising — always the first step. Opens compacted and hydrophobic soils. For clay/compaction: monthly for 3–4 months.

BLOOM N YIELD: Sea minerals bio stimulant for flowering and fruiting plants. Contains calcium, magnesium, potassium, iodine, sulfur, boron, zinc, manganese, iron, and many trace elements from sea minerals — this is NOT just a phosphorus and potassium product. Dilute 20ml per litre (10ml for sensitive plants). Apply 2–3 times per season as a foliar spray, stem drench, or soil drench during the growing and flowering period, in early morning or evening. Best for tomatoes, capsicums, strawberries, roses, fruit trees, and all flowering/fruiting plants.
`;

export async function POST(req: NextRequest) {
  const grok = new OpenAI({
    apiKey:  process.env.XAI_API_KEY!,
    baseURL: "https://api.x.ai/v1",
  });
  const { handle, title, cartTitles } = await req.json();
  if (!handle) return NextResponse.json({ error: "No handle" }, { status: 400 });

  const cartContext = cartTitles?.length
    ? `The customer also has in their cart: ${cartTitles.join(", ")}.`
    : "";

  const completion = await grok.chat.completions.create({
    model:      "grok-3-mini",
    max_tokens: 140,
    messages: [
      {
        role: "system",
        content: `You are the BioGardeners Bio Advisor — a warm, knowledgeable garden expert. When a customer adds a product to cart, give a short genuine reaction to their choice, then one specific and accurate usage tip for that exact product. Use the product knowledge below to be precise.

${PRODUCT_KNOWLEDGE}

Format exactly: compliment|tip — pipe-separated, no markdown, no quotes. Keep each part to one sentence. The tip must be specific and accurate — include actual rates or timing when relevant.`,
      },
      {
        role: "user",
        content: `Product added: "${title}" (handle: ${handle}). ${cartContext} Generate a compliment and usage tip.`,
      },
    ],
  });

  const raw   = completion.choices[0]?.message?.content ?? "";
  const parts = raw.split("|");
  return NextResponse.json({
    compliment: parts[0]?.trim() ?? "Great pick!",
    tip:        parts[1]?.trim() ?? "Follow the label directions for best results.",
  });
}
