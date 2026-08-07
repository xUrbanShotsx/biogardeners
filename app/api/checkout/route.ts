import { createCartWithItems } from "@/lib/shopify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { lines } = await req.json() as {
      lines: { variantId: string; quantity: number }[];
    };

    if (!lines?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const hasDemo = lines.some(l => l.variantId.startsWith("v-"));
    if (hasDemo) {
      return NextResponse.json({ error: "demo" }, { status: 400 });
    }

    const cart = await createCartWithItems(lines);
    return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
