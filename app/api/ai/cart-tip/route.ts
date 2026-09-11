import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const PRODUCT_KNOWLEDGE = `
BioGardeners products and exact usage:

GP FERTILISER: Broad-spectrum granulated fertiliser for gardens and lawns. Apply 30g per m² around plant drip lines (not touching stems), water in well. Every 6–8 weeks in growing season. Always apply to moist soil, never dry.

LAWN FERTILIZER: Concentrated slow-release lawn granules. Apply 30g per m² after mowing, water in thoroughly. Feeds for up to 12 weeks — one treatment covers the lawn for a full season.

VOLCANIC DUST: 60–70+ minerals from volcanic rock. Broadcast 100–200g per m² and water in, or mix into potting mix at 10% by volume. Once or twice a year is enough — slow-release mineral bank that improves cation exchange capacity and makes phosphorus stay available.

LIQUID NPK FERTILIZER: Fast-acting balanced liquid. Dilute 10ml per litre, apply as soil drench or foliar spray. Foliar spray in early morning or evening only (never midday sun). Every 2 weeks during active growth. Visible response within 3–5 days.

GLACIAL MILK: Glacial rock flour — high in silica, strengthens plant cell walls. Mix 50g per 9L watering can and apply to soil monthly. Or mix 1 tablespoon per litre into seed-raising mix. Great for frost resistance and winter maintenance.

SOIL HEALTH CONDITIONER (liquid): Liquid microbial blend. Dilute 50ml per 9L watering can. Apply to moist soil in the morning. Every 4–6 weeks for gardens. Rebuilds soil biology so plants can access existing soil nutrients.

SOIL HEALTH CONDITIONER POWDER: Dry microbial inoculant. Mix 50g per litre, drench around roots. Every 4–6 weeks. Best for veg patches and depleted soils.

PLANT SPRAY / ECOSPRAY: Selenium-based pest and disease spray. Spray top AND underside of leaves, morning or evening only. Active infestation: every 3–5 days for 3 rounds. Prevention: fortnightly. Controls aphids, whitefly, spider mites, fungus gnats, powdery mildew. Safe for edibles.

PENETRATOR: Soil wetting agent. Mix 10ml per litre and apply BEFORE watering or fertilising — always the first step. Opens compacted and hydrophobic soils. For clay/compaction: monthly for 3–4 months.
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
