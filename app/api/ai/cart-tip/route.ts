import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

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
    max_tokens: 120,
    messages: [
      {
        role: "system",
        content:
          "You are BioGardeners' garden expert. When a customer adds a product to cart, " +
          "give a warm 1-sentence compliment on their choice, then a practical 1-sentence usage tip specific to that product. " +
          "Format: compliment|tip — pipe-separated, no markdown, no quotation marks.",
      },
      {
        role: "user",
        content: `Product added: "${title}" (handle: ${handle}). ${cartContext} Generate a compliment and tip.`,
      },
    ],
  });

  const raw  = completion.choices[0]?.message?.content ?? "";
  const parts = raw.split("|");
  return NextResponse.json({
    compliment: parts[0]?.trim() ?? "Great pick!",
    tip:        parts[1]?.trim() ?? "Follow the label directions for best results.",
  });
}
