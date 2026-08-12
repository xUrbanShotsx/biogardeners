import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const grok = new OpenAI({
  apiKey:  process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const ALL_PRODUCTS = [
  { handle: "gp-fertiliser-premium-garden-lawn",             title: "GP Fertiliser"          },
  { handle: "lawn-fertilizer-premium-granulated-concentrated", title: "Lawn Fertilizer"       },
  { handle: "volcanic-dust-trace-elements",                  title: "Volcanic Dust"           },
  { handle: "soil-health-conditioner-powder",                title: "Soil Conditioner Powder" },
  { handle: "liquid-npk-fertilizer",                         title: "Liquid NPK Fertilizer"  },
  { handle: "glacial-milk",                                   title: "Glacial Milk"           },
  { handle: "soil-health-conditioner",                        title: "Soil Conditioner"       },
  { handle: "plant-spray",                                    title: "Plant Spray"            },
  { handle: "penetrator",                                     title: "Penetrator"             },
];

export async function POST(req: NextRequest) {
  const { currentHandle, cartHandles = [] } = await req.json();

  const exclude   = new Set([currentHandle, ...cartHandles]);
  const available = ALL_PRODUCTS.filter(p => !exclude.has(p.handle));
  if (!available.length) return NextResponse.json({ handles: [] });

  const current = ALL_PRODUCTS.find(p => p.handle === currentHandle)?.title ?? currentHandle;
  const cart    = cartHandles.map((h: string) => ALL_PRODUCTS.find(p => p.handle === h)?.title ?? h);

  const completion = await grok.chat.completions.create({
    model:      "grok-3-mini",
    max_tokens: 80,
    messages: [
      {
        role: "system",
        content:
          "You are a BioGardeners product expert. Given what a customer is viewing or has in their cart, " +
          "pick the 2 best complementary products from the available list. " +
          "Reply with exactly 2 product handles separated by a comma, nothing else.",
      },
      {
        role: "user",
        content:
          `Currently viewing: ${current}. ` +
          (cart.length ? `Cart: ${cart.join(", ")}. ` : "") +
          `Available products: ${available.map(p => `${p.title} (${p.handle})`).join(", ")}. ` +
          `Pick the 2 best complementary handles.`,
      },
    ],
  });

  const raw     = completion.choices[0]?.message?.content ?? "";
  const handles = raw.split(",").map((s: string) => s.trim()).filter((h: string) => ALL_PRODUCTS.some(p => p.handle === h));
  return NextResponse.json({ handles: handles.slice(0, 2) });
}
