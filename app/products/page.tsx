import type { Metadata } from "next";
import { Nav }            from "@/components/nav";
import { Footer }         from "@/components/footer";
import { FrapButton }     from "@/components/frap-button";
import { ProductsClient } from "./products-client";
import { getProducts, DEMO_PRODUCTS } from "@/lib/shopify";

export const metadata: Metadata = {
  title:       "Shop the Range | BioGardeners",
  description: "Precision-formulated garden soil and fertilisers. Select your size and add to cart in seconds.",
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
