import { Hero }             from "@/components/hero";
import { TrustBar }         from "@/components/trust-bar";
import { FeaturedProducts } from "@/components/featured-products";
import { HowItWorks }       from "@/components/how-it-works";
import { ScienceSection }   from "@/components/science-section";
import { Testimonials }     from "@/components/testimonials";
import { CtaBanner }        from "@/components/cta-banner";
import { Nav }              from "@/components/nav";
import { Footer }           from "@/components/footer";
import { FrapButton }       from "@/components/frap-button";
import { getProducts, DEMO_PRODUCTS } from "@/lib/shopify";

const BESTSELLER_HANDLE = "gp-fertiliser-premium-garden-lawn";

export default async function Home() {
  let allProducts;
  try {
    allProducts = await getProducts(20);
    if (!allProducts.length) allProducts = DEMO_PRODUCTS;
  } catch {
    allProducts = DEMO_PRODUCTS;
  }

  // Pin GP Fertiliser first, then fill remaining 3 slots from the rest
  const bestseller = allProducts.find((p) => p.handle === BESTSELLER_HANDLE);
  const rest       = allProducts.filter((p) => p.handle !== BESTSELLER_HANDLE);
  const featured   = bestseller ? [bestseller, ...rest].slice(0, 4) : allProducts.slice(0, 4);

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 0 }}>
        <Hero />
        <TrustBar />
        <FeaturedProducts products={featured} />
        <HowItWorks />
        <ScienceSection />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
