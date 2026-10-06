import type { Metadata } from "next";
import { Nav }            from "@/components/nav";
import { Footer }         from "@/components/footer";
import { FrapButton }     from "@/components/frap-button";
import { ProductsClient } from "./products-client";
import { getProducts, DEMO_PRODUCTS } from "@/lib/shopify";

export const metadata: Metadata = {
  title:       "Shop the Range | BioGardeners",
  description: "Hand-picked Aussie garden fertilisers and soil care — regenerative, family and pet friendly, and easy to use. Choose your size and add to cart.",
};

export default async function ProductsPage() {
  let products;
  try {
    products = await getProducts(20);
    if (!products.length) products = DEMO_PRODUCTS;
  } catch {
    products = DEMO_PRODUCTS;
  }

  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)", paddingBottom: "5rem" }}>
        <ProductsClient products={products} />
      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
