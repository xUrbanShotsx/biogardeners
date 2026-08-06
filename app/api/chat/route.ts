import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question?.trim()) {
    return NextResponse.json({ error: "No question" }, { status: 400 });
  }

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system:
      "You are the BioGardeners Bio Advisor — a friendly, knowledgeable plant and soil expert. " +
      "Answer gardening, soil health, fertiliser, and plant care questions in 2–3 sentences max. " +
      "Keep it warm, practical, and encouraging. No markdown, just plain conversational text.",
    messages: [{ role: "user", content: question }],
  });

  const text = (msg.content[0] as { type: string; text: string }).text;
  return NextResponse.json({ answer: text });
}
