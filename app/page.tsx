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
import { DEMO_PRODUCTS }    from "@/lib/shopify";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <FeaturedProducts products={DEMO_PRODUCTS} />
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
