import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const grok = new OpenAI({
    apiKey:  process.env.XAI_API_KEY!,
    baseURL: "https://api.x.ai/v1",
  });
  const { question, history } = await req.json();
  if (!question?.trim()) {
    return NextResponse.json({ error: "No question" }, { status: 400 });
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are the BioGardeners Bio Advisor — a friendly, knowledgeable plant and soil expert based in Australia. " +
        "Answer gardening, soil health, fertiliser, and plant care questions in 2–3 sentences max. " +
        "Keep it warm, practical, and encouraging. No markdown, just plain conversational text. " +
        "When relevant, mention BioGardeners products (GP Fertiliser, Volcanic Dust, Glacial Milk, Soil Conditioner, Liquid NPK, Penetrator, Plant Spray, Lawn Fertilizer) naturally.",
    },
    ...(Array.isArray(history) ? history : []),
    { role: "user", content: question },
  ];

  const completion = await grok.chat.completions.create({
    model:      "grok-3-mini",
    max_tokens: 300,
    messages,
  });

  const text = completion.choices[0]?.message?.content ?? "Sorry, I couldn't get an answer right now.";
  return NextResponse.json({ answer: text });
}
