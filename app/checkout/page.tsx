"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Lock, ChevronRight, Minus, Plus, X,
  ShieldCheck, Truck, Leaf, ArrowLeft, Sparkles, Check,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { type ShopifyProduct, DEMO_PRODUCTS } from "@/lib/shopify";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);
}

/* ── Shared checkout header ─────────────────────── */
function CheckoutHeader() {
  return (
    <header
      className="flex items-center justify-between px-6 md:px-10 flex-shrink-0"
      style={{
        background: "#fff",
        borderBottom: "1px solid var(--ceramic)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
        height: 64,
      }}
    >
      <Link href="/" aria-label="BioGardeners home">
        <img src="/logo.svg" alt="BioGardeners" style={{ height: 30, width: "auto" }} />
      </Link>
      <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
        <span className="px-2.5 py-1 rounded-full" style={{ background: "var(--green-accent)", color: "#fff" }}>
          1 · Review
        </span>
        <span style={{ color: "var(--ceramic)" }}>›</span>
        <span style={{ color: "var(--text-black-soft)" }}>2 · Payment</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--text-black-soft)" }}>
        <Lock size={12} style={{ color: "var(--green-accent)" }} />
        Secure Checkout
      </div>
    </header>
  );
}

/* ── Impulse card ───────────────────────────────── */
function ImpulseCard({
  product,
  inCart,
  onAdd,
}: {
  product: ShopifyProduct;
  inCart: boolean;
  onAdd: () => void;
}) {
  const firstVariant = product.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const imgUrl = product.images.edges[0]?.node.url;

  return (
    <motion.div
      className="flex-shrink-0 w-40 rounded-xl overflow-hidden flex flex-col border"
      style={{ background: "#fff", borderColor: "var(--ceramic)" }}
      whileHover={{ y: -3, borderColor: "var(--green-accent)" }}
      transition={{ duration: 0.16, ease }}
    >
      <div className="relative flex items-center justify-center h-24 overflow-hidden"
        style={{ background: "var(--surface-alt)" }}>
        {imgUrl ? (
          <img src={imgUrl} alt={product.title} className="w-full h-full object-contain p-2" />
        ) : (
          <Leaf size={28} style={{ color: "var(--green-bio)", opacity: 0.35 }} />
        )}
      </div>
      <div className="p-2.5 flex flex-col flex-1 gap-1.5">
        <p className="text-[11px] font-bold leading-snug line-clamp-2" style={{ color: "var(--green-house)" }}>
          {product.title}
        </p>
        <p className="text-[11px] font-semibold" style={{ color: "var(--green-bio)" }}>
          from {formatPrice(price)}
        </p>
        <button
          onClick={onAdd}
          disabled={inCart}
          className="mt-auto w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
          style={inCart
            ? { background: "var(--surface-alt)", color: "var(--green-bio)" }
            : { background: "var(--green-accent)", color: "#fff" }
          }
        >
          {inCart ? <><Check size={9} /> Added</> : <><Plus size={9} /> Add</>}
        </button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, addItem } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>(DEMO_PRODUCTS);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then((data: ShopifyProduct[]) => { if (data?.length) setAllProducts(data); })
      .catch(() => {});
  }, []);

  const total = subtotal;
  const cartHandles = new Set(items.map(i => i.handle));
  const suggestions = allProducts.filter(p => !cartHandles.has(p.handle)).slice(0, 5);

  async function handleCheckout() {
    if (!items.length) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: items.map(i => ({ variantId: i.id, quantity: i.quantity })) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error === "demo"
          ? "Store is in demo mode — connect Shopify to enable real checkout."
          : (data.error ?? "Something went wrong. Please try again."));
        setStatus("error");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  function handleImpulseAdd(product: ShopifyProduct) {
    const v = product.variants.edges[0]?.node;
    if (!v) return;
    addItem({
      id: v.id,
      handle: product.handle,
      title: product.title,
      variant: v.title,
      price: parseFloat(v.price.amount),
      imageUrl: product.images.edges[0]?.node.url,
    });
  }

  if (!mounted) return null;

  /* ── Empty cart ─────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--surface-alt)" }}>
        <CheckoutHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)" }}>
            <ShoppingBag size={32} style={{ color: "var(--green-accent)" }} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--green-house)" }}>Your cart is empty</h1>
            <p className="text-sm" style={{ color: "var(--text-black-soft)" }}>Add some products before checking out.</p>
          </div>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white"
            style={{ background: "var(--green-accent)", boxShadow: "0 4px 18px rgba(0,98,65,0.30)" }}>
            Browse products <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--surface-alt)" }}>
      <CheckoutHeader />

      {/* ── Main content ────────────────────────── */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ── Left column ─────────────────────── */}
        <div className="flex flex-col gap-5 min-w-0">

          {/* Back */}
          <button onClick={() => router.back()}
            className="self-start flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-60"
            style={{ color: "var(--green-bio)" }}>
            <ArrowLeft size={14} /> Back
          </button>

          {/* Order items card */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.06)" }}>

            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--ceramic)" }}>
              <h2 className="text-sm font-bold" style={{ color: "var(--green-house)" }}>Order Summary</h2>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ background: "var(--surface-alt)", color: "var(--green-bio)", border: "1px solid var(--ceramic)" }}>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Line items */}
            <AnimatePresence initial={false}>
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-4 px-5 py-4"
                    style={{ borderBottom: idx < items.length - 1 ? "1px solid var(--ceramic)" : "none" }}>

                    {/* Product image */}
                    <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-1.5" />
                      ) : (
                        <Leaf size={20} style={{ color: "var(--green-bio)", opacity: 0.5 }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-snug" style={{ color: "var(--green-house)" }}>
                        {item.title}
                      </p>
                      {item.variant && item.variant !== "Default Title" && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-black-soft)" }}>{item.variant}</p>
                      )}
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5 flex-shrink-0"
                      style={{ background: "var(--surface-alt)", borderRadius: 999, padding: "4px 8px", border: "1px solid var(--ceramic)" }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:bg-white">
                        <Minus size={9} style={{ color: "var(--green-house)" }} />
                      </button>
                      <span className="w-5 text-center text-xs font-bold" style={{ color: "var(--text-black)" }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:bg-white">
                        <Plus size={9} style={{ color: "var(--green-house)" }} />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="w-16 text-right text-sm font-bold flex-shrink-0"
                      style={{ color: "var(--green-bio)" }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    {/* Remove */}
                    <button onClick={() => removeItem(item.id)} aria-label="Remove"
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-red-50"
                      style={{ color: "var(--ceramic)" }}>
                      <X size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Totals footer */}
            <div className="px-5 py-4 space-y-2.5"
              style={{ borderTop: "1px solid var(--ceramic)", background: "var(--surface-alt)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-black-soft)" }}>Subtotal</span>
                <span className="font-semibold" style={{ color: "var(--text-black)" }}>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-black-soft)" }}>Shipping</span>
                <span className="font-semibold" style={{ color: "var(--green-bio)" }}>$15.95 flat rate</span>
              </div>
              <div className="flex justify-between items-center pt-2.5" style={{ borderTop: "1px solid var(--ceramic)" }}>
                <span className="text-sm font-bold" style={{ color: "var(--green-house)" }}>Total</span>
                <span className="text-xl font-bold" style={{ color: "var(--green-house)" }}>
                  {formatPrice(total + 15.95)}
                </span>
              </div>
            </div>
          </div>

          {/* Impulse buys */}
          {suggestions.length > 0 && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--ceramic)" }}>
                <Sparkles size={13} style={{ color: "var(--gold)" }} />
                <h3 className="text-sm font-bold" style={{ color: "var(--green-house)" }}>You might also like</h3>
              </div>
              <div className="p-4">
                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {suggestions.map((product) => (
                    <ImpulseCard
                      key={product.id}
                      product={product}
                      inCart={cartHandles.has(product.handle)}
                      onAdd={() => handleImpulseAdd(product)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: sticky panel ──────────────── */}
        <div className="lg:sticky lg:top-6 flex flex-col gap-4">

          {/* CTA card */}
          <div className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.12)" }}>

            {/* Dark header */}
            <div className="px-6 py-6" style={{ background: "var(--green-house)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.40)", letterSpacing: "0.12em" }}>
                Order total
              </p>
              <p className="text-4xl font-bold leading-none mb-1" style={{ color: "#fff" }}>
                {formatPrice(total + 15.95)}
              </p>
              <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.40)" }}>
                Includes $15.95 flat rate shipping
              </p>
            </div>

            {/* CTA body */}
            <div className="px-6 py-5" style={{ background: "#fff" }}>
              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="px-3.5 py-3 rounded-xl text-xs font-semibold"
                      style={{ background: "#fff0f0", color: "#c0392b", border: "1px solid #fcc" }}>
                      {errorMsg}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleCheckout}
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-70"
                style={{ background: "var(--green-accent)", boxShadow: "0 4px 18px rgba(0,98,65,0.30)" }}
              >
                {status === "loading" ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white inline-block"
                    />
                    Preparing your order…
                  </>
                ) : (
                  <>
                    <Lock size={13} />
                    Proceed to Payment
                    <ChevronRight size={14} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] mt-3" style={{ color: "var(--text-black-soft)" }}>
                Secured by Shopify · 256-bit SSL
              </p>
            </div>
          </div>

          {/* Trust list */}
          <div className="rounded-2xl px-5 py-4 flex flex-col gap-3.5"
            style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.05)" }}>
            {[
              { icon: ShieldCheck, label: "SSL Encrypted",    sub: "256-bit secure"          },
              { icon: Lock,        label: "Safe Payments",    sub: "Visa · MC · Apple Pay"   },
              { icon: Truck,       label: "$15.95 Flat Rate", sub: "Australia wide"           },
              { icon: Leaf,        label: "100% Australian",  sub: "Owned & made locally"    },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--ceramic)" }}>
                  <Icon size={14} style={{ color: "var(--green-bio)" }} />
                </div>
                <div>
                  <span className="text-xs font-bold" style={{ color: "var(--green-house)" }}>{label}</span>
                  <span className="text-[11px]" style={{ color: "var(--text-black-soft)" }}> · {sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
