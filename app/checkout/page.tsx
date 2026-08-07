"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Lock, ChevronRight, Minus, Plus, X, ShieldCheck, Truck, Leaf, ArrowLeft, Sparkles, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { DEMO_PRODUCTS } from "@/lib/shopify";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);
}

/* ── Impulse-buy card ─────────────────────────── */
function ImpulseCard({
  product,
  inCart,
  onAdd,
}: {
  product: (typeof DEMO_PRODUCTS)[number];
  inCart: boolean;
  onAdd: () => void;
}) {
  const firstVariant = product.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const badge = product.tags[0];

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#fff", boxShadow: "var(--shadow-card)" }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
      transition={{ duration: 0.18, ease }}
    >
      {/* Image area */}
      <div className="relative flex items-center justify-center h-24"
        style={{ background: "var(--green-xlight)" }}>
        <Leaf size={32} style={{ color: "var(--green-bio)", opacity: 0.5 }} />
        {badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "var(--gold)", color: "#fff" }}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2 p-3">
        <p className="text-xs font-bold leading-snug line-clamp-2" style={{ color: "var(--green-house)" }}>
          {product.title}
        </p>
        <p className="text-xs font-semibold" style={{ color: "var(--green-bio)" }}>
          from {formatPrice(price)}
        </p>
        <button
          onClick={onAdd}
          disabled={inCart}
          className="mt-auto w-full flex items-center justify-center gap-1.5 py-2 rounded-full text-[11px] font-bold transition-all disabled:cursor-default"
          style={inCart
            ? { background: "var(--green-xlight)", color: "var(--green-bio)" }
            : { background: "var(--green-bio)", color: "#fff" }
          }
        >
          {inCart ? (
            <><Check size={11} /> Added</>
          ) : (
            <><Plus size={11} /> Add to order</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, addItem } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const shipping = subtotal >= 80 ? 0 : 8.95;
  const total = subtotal + shipping;

  /* Products not already in cart — show up to 5 */
  const cartHandles = new Set(items.map(i => i.handle));
  const suggestions = DEMO_PRODUCTS.filter(p => !cartHandles.has(p.handle)).slice(0, 5);

  async function handleCheckout() {
    if (!items.length) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: items.map(item => ({ variantId: item.id, quantity: item.quantity })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "demo") {
          setErrorMsg("This store is in demo mode — connect your Shopify store to enable real checkout.");
        } else {
          setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        }
        setStatus("error");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  function handleImpulseAdd(product: (typeof DEMO_PRODUCTS)[number]) {
    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) return;
    addItem({
      id: firstVariant.id,
      handle: product.handle,
      title: product.title,
      variant: firstVariant.title,
      price: parseFloat(firstVariant.price.amount),
    });
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: "var(--surface-alt)", paddingTop: "var(--nav-h)" }}>
        <div className="text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4"
            style={{ background: "var(--ceramic)" }}>
            <ShoppingBag size={36} style={{ color: "var(--green-bio)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--green-house)" }}>Your cart is empty</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-black-soft)" }}>
            Add some products before checking out.
          </p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--green-bio)" }}>
            Shop Products <ChevronRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--surface-alt)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* Page heading */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/"
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: "var(--green-bio)" }}>
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
          <span style={{ color: "var(--ceramic)" }}>|</span>
          <div className="flex items-center gap-2">
            <Lock size={14} style={{ color: "var(--green-accent)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--text-black-soft)" }}>Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* ── Left column ────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Order Summary */}
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--green-house)", fontFamily: "var(--font-serif)" }}>
                Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
              </h2>

              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", boxShadow: "var(--shadow-card)" }}>
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease }}
                      className="overflow-hidden"
                    >
                      <div
                        className="flex items-center gap-4 px-5 py-4"
                        style={{ borderBottom: idx < items.length - 1 ? "1px solid var(--ceramic)" : "none" }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: "var(--green-xlight)" }}>
                          <Leaf size={20} style={{ color: "var(--green-bio)" }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-tight truncate" style={{ color: "var(--green-house)" }}>
                            {item.title}
                          </p>
                          {item.variant && item.variant !== "Default Title" && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-black-soft)" }}>{item.variant}</p>
                          )}
                          <p className="text-sm font-bold mt-1 md:hidden" style={{ color: "var(--green-bio)" }}>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--green-light)]"
                            style={{ border: "1px solid var(--input-border)" }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} style={{ color: "var(--green-house)" }} />
                          </button>
                          <span className="w-5 text-center text-sm font-bold" style={{ color: "var(--text-black)" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--green-light)]"
                            style={{ border: "1px solid var(--input-border)" }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} style={{ color: "var(--green-house)" }} />
                          </button>
                        </div>

                        <p className="w-20 text-right text-sm font-bold flex-shrink-0 hidden md:block"
                          style={{ color: "var(--green-bio)" }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="flex-shrink-0 p-1 rounded-full transition-colors hover:bg-[var(--red-light)]"
                          style={{ color: "var(--text-black-soft)" }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Totals */}
                <div className="px-5 py-4" style={{ borderTop: "2px solid var(--ceramic)" }}>
                  <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-black-soft)" }}>
                    <span>Subtotal</span>
                    <span className="font-semibold" style={{ color: "var(--text-black)" }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4" style={{ color: "var(--text-black-soft)" }}>
                    <span>Shipping</span>
                    <span className="font-semibold" style={{ color: shipping === 0 ? "var(--green-accent)" : "var(--text-black)" }}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  {subtotal < 80 && (
                    <div className="mb-4 px-3 py-2.5 rounded-xl text-xs font-semibold"
                      style={{ background: "var(--green-xlight)", color: "var(--green-bio)" }}>
                      Add {formatPrice(80 - subtotal)} more to unlock <strong>FREE shipping</strong>!
                    </div>
                  )}
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold" style={{ color: "var(--green-house)" }}>Total</span>
                    <span className="text-xl font-bold" style={{ color: "var(--green-house)", fontFamily: "var(--font-serif)" }}>
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Impulse buy ──────────────────────── */}
            {suggestions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={15} style={{ color: "var(--gold)" }} />
                  <h3 className="text-sm font-bold" style={{ color: "var(--green-house)" }}>
                    Complete your garden
                  </h3>
                </div>

                <div
                  className="flex gap-3 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {suggestions.map(product => (
                    <ImpulseCard
                      key={product.id}
                      product={product}
                      inCart={cartHandles.has(product.handle)}
                      onAdd={() => handleImpulseAdd(product)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right column: Checkout Panel ───────── */}
          <aside className="flex flex-col gap-4">

            {/* CTA card */}
            <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: "var(--shadow-card)" }}>
              <div className="mb-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-black-soft)" }}>
                  Order Total
                </p>
                <p className="text-3xl font-bold" style={{ color: "var(--green-house)", fontFamily: "var(--font-serif)" }}>
                  {formatPrice(total)}
                </p>
                {shipping === 0 && (
                  <p className="text-xs mt-1 font-semibold" style={{ color: "var(--green-accent)" }}>
                    Free shipping included
                  </p>
                )}
              </div>

              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 px-3 py-2.5 rounded-xl text-xs font-semibold"
                    style={{ background: "var(--red-light)", color: "var(--red)" }}
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleCheckout}
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full text-sm font-bold text-white transition-all disabled:opacity-70"
                style={{ background: "var(--green-bio)", boxShadow: "0 4px 16px rgba(0,98,65,0.32)" }}
              >
                {status === "loading" ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white inline-block"
                    />
                    Preparing your order…
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Proceed to Secure Checkout
                    <ChevronRight size={14} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] mt-3" style={{ color: "var(--text-black-soft)" }}>
                You'll be taken to Shopify's secure payment page
              </p>
            </div>

            {/* Trust badges */}
            <div className="rounded-2xl p-5" style={{ background: "#fff", boxShadow: "var(--shadow-card)" }}>
              <div className="flex flex-col gap-3.5">
                {[
                  { icon: ShieldCheck, label: "SSL Encrypted", sub: "256-bit secure connection" },
                  { icon: Lock, label: "Safe Payments", sub: "Visa, Mastercard, Apple Pay & more" },
                  { icon: Truck, label: "Fast Dispatch", sub: "Orders ship within 1–2 business days" },
                  { icon: Leaf, label: "100% Australian", sub: "Owned, made, and tested locally" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--green-xlight)" }}>
                      <Icon size={15} style={{ color: "var(--green-bio)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none" style={{ color: "var(--green-house)" }}>{label}</p>
                      <p className="text-[11px] mt-0.5 leading-none" style={{ color: "var(--text-black-soft)" }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.back()}
              className="text-center text-xs font-semibold py-2 transition-opacity hover:opacity-70"
              style={{ color: "var(--green-bio)" }}>
              ← Back to cart
            </button>
          </aside>
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
