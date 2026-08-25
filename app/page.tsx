import { Hero }             from "@/components/hero";
import { TrustBar }         from "@/components/trust-bar";
import { FeaturedProducts } from "@/components/featured-products";
import { ResultsShowcase }  from "@/components/results-showcase";
import { ScienceSection }   from "@/components/science-section";
import { Testimonials }     from "@/components/testimonials";
import { CtaBanner }        from "@/components/cta-banner";
import { Nav }              from "@/components/nav";
import { Footer }           from "@/components/footer";
import { FrapButton }       from "@/components/frap-button";
import { getProducts, DEMO_PRODUCTS } from "@/lib/shopify";

const FEATURED_HANDLES = [
  "gp-fertiliser-premium-garden-lawn",
  "lawn-fertilizer-premium-granulated-concentrated",
  "penetrator",
  "plant-spray",
];

export default async function Home() {
  let allProducts;
  try {
    allProducts = await getProducts(20);
    if (!allProducts.length) allProducts = DEMO_PRODUCTS;
  } catch {
    allProducts = DEMO_PRODUCTS;
  }

  // Show exactly these 4 products in order, regardless of Shopify sort
  const byHandle = Object.fromEntries(allProducts.map((p) => [p.handle, p]));
  const featured = FEATURED_HANDLES.map((h) => byHandle[h]).filter(Boolean);

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 0 }}>
        <Hero />
        <TrustBar />
        <FeaturedProducts products={featured} />
        <ResultsShowcase />
        <ScienceSection />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
