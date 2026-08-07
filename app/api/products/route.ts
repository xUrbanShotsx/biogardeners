import { getProducts, DEMO_PRODUCTS } from "@/lib/shopify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await getProducts(20);
    return NextResponse.json(products.length ? products : DEMO_PRODUCTS);
  } catch {
    return NextResponse.json(DEMO_PRODUCTS);
  }
}
