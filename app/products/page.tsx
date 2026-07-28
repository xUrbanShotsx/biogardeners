import type { Metadata } from "next";
import { Nav }            from "@/components/nav";
import { Footer }         from "@/components/footer";
import { FrapButton }     from "@/components/frap-button";
import { ProductsClient } from "./products-client";

export const metadata: Metadata = {
  title:       "Shop the Range | BioGardeners",
  description: "Precision-formulated garden soil and fertilisers. Select your size and add to cart in seconds.",
};

export default function ProductsPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)", paddingBottom: "5rem" }}>
        <ProductsClient />
      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
