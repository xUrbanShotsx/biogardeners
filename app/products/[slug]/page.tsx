import { notFound }              from "next/navigation";
import { Nav }                    from "@/components/nav";
import { Footer }                 from "@/components/footer";
import { FrapButton }             from "@/components/frap-button";
import { getProductByHandle, getProducts, DEMO_PRODUCTS } from "@/lib/shopify";
import { ProductPageClient }      from "./product-page-client";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductByHandle(slug);
  } catch {
    product = DEMO_PRODUCTS.find((p) => p.handle === slug);
  }
  if (!product) notFound();

  let allProducts;
  try {
    allProducts = await getProducts(20);
    if (!allProducts.length) allProducts = DEMO_PRODUCTS;
  } catch {
    allProducts = DEMO_PRODUCTS;
  }
  const related = allProducts.filter((p) => p.handle !== slug).slice(0, 3);

  return (
    <>
      <Nav />
      <ProductPageClient product={product} related={related} slug={slug} />
      <Footer />
      <FrapButton />
    </>
  );
}
