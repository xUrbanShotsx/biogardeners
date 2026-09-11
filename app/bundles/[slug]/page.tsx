import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Lightbulb, BookOpen, Package } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FrapButton } from "@/components/frap-button";
import { BundleAddToCart } from "../bundle-add-to-cart";
import { getBundleMeta } from "../bundle-meta";
import { getProductByHandle } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductByHandle(slug);
    return {
      title: `${product.title} | BioGardeners`,
      description: product.description,
    };
  } catch {
    return { title: "Bundle | BioGardeners" };
  }
}

export default async function BundleSlugPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductByHandle(slug);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const meta      = getBundleMeta(product.title);
  const Icon      = meta.icon;
  const bundleAmt = parseFloat(product.priceRange.minVariantPrice.amount);
  const saving    = meta.fullPrice > 0 ? +(meta.fullPrice - bundleAmt).toFixed(2) : 0;

  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Back */}
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-6">
          <Link
            href="/bundles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: "var(--text-black-soft)" }}
          >
            <ArrowLeft size={15} /> Back to all bundles
          </Link>
        </div>

        {/* Hero */}
        <section className="max-w-[1100px] mx-auto px-5 md:px-10 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10 md:gap-14 items-start">

            {/* Left — info */}
            <div>
              {/* Tag + icon */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: meta.color + "18" }}
                >
                  <Icon size={24} style={{ color: meta.color }} />
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: meta.color + "15", color: meta.color }}
                >
                  {meta.tag}
                </span>
              </div>

              <h1
                className="font-bold mb-4"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--text-black)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
              >
                {product.title}
              </h1>

              {product.description && (
                <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-black-soft)", maxWidth: "60ch" }}>
                  {product.description}
                </p>
              )}

              {/* Ideal for */}
              {meta.idealFor.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-black)" }}>
                    Works well for
                  </p>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: meta.color + "0d", border: `1px solid ${meta.color}20` }}
                  >
                    <ul className="flex flex-col gap-2">
                      {meta.idealFor.map((item, i) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-black)" }}>
                          <span
                            className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                            style={{ background: meta.color, color: "#fff" }}
                          >
                            {i + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Use cases */}
              {meta.useCases.length > 0 && (
                <div
                  className="rounded-2xl p-6 mb-6"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={16} style={{ color: meta.color }} />
                    <p className="text-sm font-bold" style={{ color: "var(--text-black)" }}>Why use this pack?</p>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {meta.useCases.map((uc) => (
                      <li key={uc} className="flex items-start gap-3">
                        <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: meta.color }} />
                        <span className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{uc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to use */}
              {meta.howToUse.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={16} style={{ color: meta.color }} />
                    <p className="text-sm font-bold" style={{ color: "var(--text-black)" }}>How to use</p>
                  </div>
                  <ol className="flex flex-col gap-4">
                    {meta.howToUse.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                          style={{ background: meta.color, color: "#fff" }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold mb-0.5" style={{ color: "var(--text-black)" }}>{step.step}</p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>{step.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Right — sticky purchase card */}
            <div className="md:sticky md:top-[calc(var(--nav-h)+24px)]">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.10)", background: "#fff" }}
              >
                {/* Price header */}
                <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid var(--ceramic)" }}>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-bold text-3xl" style={{ color: "var(--green-bio)" }}>
                          ${bundleAmt.toFixed(2)}
                        </span>
                        {meta.fullPrice > 0 && (
                          <span className="text-base line-through" style={{ color: "var(--text-black-soft)" }}>
                            ${meta.fullPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {saving > 0 && (
                        <p className="text-sm font-semibold mt-1" style={{ color: "#15803d" }}>
                          You save ${saving.toFixed(2)} (10% off)
                        </p>
                      )}
                    </div>
                    {saving > 0 && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "#dcfce7", color: "#15803d" }}
                      >
                        Save ${saving.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Includes */}
                {meta.includes.length > 0 && (
                  <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--ceramic)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Package size={14} style={{ color: "var(--text-black-soft)" }} />
                      <p className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-black-soft)" }}>
                        What's included
                      </p>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {meta.includes.map((item) => (
                        <li key={item.name}>
                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: meta.color }} />
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "var(--text-black)" }}>{item.name}</p>
                              <p className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--text-black-soft)" }}>{item.why}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="px-6 py-5">
                  <BundleAddToCart product={product} />
                  <p className="text-xs text-center mt-3" style={{ color: "var(--text-black-soft)" }}>
                    $15.95 flat rate shipping · Australia wide
                  </p>
                </div>
              </div>

              {/* Note */}
              <div
                className="mt-4 rounded-xl px-4 py-3 text-xs leading-relaxed"
                style={{ background: "var(--green-xlight)", color: "var(--green-bio)", border: "1px solid var(--green-light)" }}
              >
                <strong>Note:</strong> Packs are minimum sizes for delivery economy. Need larger quantities? Order individual products and add to cart.
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <FrapButton />
    </>
  );
}
