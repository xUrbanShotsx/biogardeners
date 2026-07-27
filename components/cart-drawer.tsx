"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Maximize2, Minimize2, ShoppingBag, ArrowRight, Leaf } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";

/* ─── Per-product visual colours ─── */
const PRODUCT_BG: Record<string, string> = {
  "bio-bloom-fertiliser": "linear-gradient(140deg,#d4e9e2,#b0d0c4)",
  "terra-pro-soil-mix":   "linear-gradient(140deg,#fdebc8,#f2d49a)",
  "deep-root-tonic":      "linear-gradient(140deg,#dde8e0,#bcd5c8)",
  "season-starter-kit":   "linear-gradient(140deg,#faf6ee,#ede4d0)",
};
const PRODUCT_LABEL: Record<string, { l1: string; l2: string }> = {
  "bio-bloom-fertiliser": { l1: "Bio Bloom",      l2: "Fertiliser" },
  "terra-pro-soil-mix":   { l1: "Terra Pro",      l2: "Soil Mix"   },
  "deep-root-tonic":      { l1: "Deep Root",      l2: "Tonic"      },
  "season-starter-kit":   { l1: "Season Starter", l2: "Kit"        },
};

function MiniProduct({ handle }: { handle: string }) {
  const bg  = PRODUCT_BG[handle]  ?? "linear-gradient(140deg,#d4e9e2,#b0d0c4)";
  const lbl = PRODUCT_LABEL[handle] ?? { l1: "BioGardeners", l2: "Product" };
  return (
    <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center overflow-hidden" style={{ background: bg }}>
      <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-9 h-auto drop-shadow" aria-hidden="true">
        <rect x="10" y="18" width="60" height="74" rx="5" fill="#1E3932" />
        <rect x="18" y="32" width="44" height="48" rx="3" fill="white" opacity="0.96" />
        <text x="40" y="54" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="6.5" fill="#1E3932">{lbl.l1}</text>
        <text x="40" y="64" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="6.5" fill="#1E3932">{lbl.l2}</text>
        <ellipse cx="40" cy="94" rx="22" ry="3" fill="rgba(0,0,0,0.07)" />
      </svg>
    </div>
  );
}

/* ─── Single item row ─── */
function CartItemRow({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { updateQuantity, removeItem } = useCart();
  return (
    <div className={`flex items-start gap-3 ${compact ? "py-3" : "py-4"}`} style={{ borderBottom: "1px solid var(--ceramic)" }}>
      <MiniProduct handle={item.handle} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold leading-tight mb-0.5 ${compact ? "text-sm" : "text-base"}`} style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>
          {item.title}
        </p>
        <p className="text-xs mb-2" style={{ color: "var(--text-black-soft)" }}>{item.variant}</p>
        <div className="flex items-center gap-3">
          {/* Qty stepper */}
          <div className="flex items-center rounded-full overflow-hidden" style={{ border: "1px solid var(--ceramic)" }}>
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center transition-colors hover:bg-[var(--surface-alt)]"
              aria-label="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <span className="w-6 text-center text-xs font-bold" style={{ color: "var(--text-black)" }}>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center transition-colors hover:bg-[var(--surface-alt)]"
              aria-label="Increase quantity"
            >
              <Plus size={11} />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 rounded transition-colors hover:text-red-500"
            style={{ color: "var(--text-black-soft)" }}
            aria-label="Remove item"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <p className="text-sm font-bold shrink-0 mt-0.5" style={{ color: "var(--green-bio)" }}>
        ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "var(--green-xlight)" }}>
        <ShoppingBag size={24} style={{ color: "var(--green-accent)" }} />
      </div>
      <p className="font-bold text-lg mb-1" style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}>Your cart is empty</p>
      <p className="text-sm mb-6" style={{ color: "var(--text-black-soft)" }}>Add a product to get started.</p>
      <button
        onClick={onClose}
        className="btn btn-primary"
        style={{ fontSize: 14, padding: "10px 24px" }}
      >
        Shop now
      </button>
    </div>
  );
}

/* ─── Drawer panel (slide-in from right) ─── */
function DrawerPanel() {
  const { items, subtotal, count, closeCart, expandCart } = useCart();
  const freeShippingLeft = Math.max(0, 80 - subtotal);
  const freeShippingPct  = Math.min(100, (subtotal / 80) * 100);

  return (
    <motion.div
      key="drawer"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 300 }}
      className="fixed top-0 right-0 bottom-0 z-[200] flex flex-col"
      style={{ width: "min(440px, 100vw)", background: "#fff", boxShadow: "-4px 0 40px rgba(0,0,0,0.14)" }}
      role="dialog"
      aria-label="Shopping cart"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--ceramic)" }}>
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} style={{ color: "var(--green-house)" }} />
          <h2 className="font-bold text-base" style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}>
            Your Cart
            {count > 0 && (
              <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: "var(--green-xlight)", color: "var(--green-bio)" }}>
                {count}
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {items.length > 0 && (
            <button
              onClick={expandCart}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-alt)]"
              style={{ color: "var(--text-black-soft)" }}
              aria-label="Expand cart to full screen"
              title="Expand"
            >
              <Maximize2 size={16} />
            </button>
          )}
          <button
            onClick={closeCart}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-alt)]"
            style={{ color: "var(--text-black-soft)" }}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Free shipping bar */}
      {count > 0 && (
        <div className="px-5 py-3 shrink-0" style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--ceramic)" }}>
          {freeShippingLeft > 0 ? (
            <p className="text-xs mb-1.5" style={{ color: "var(--text-black-soft)" }}>
              Add <span className="font-bold" style={{ color: "var(--green-bio)" }}>${freeShippingLeft.toFixed(2)}</span> more for free shipping
            </p>
          ) : (
            <p className="text-xs mb-1.5 font-semibold" style={{ color: "var(--green-bio)" }}>
              ✓ You qualify for free shipping!
            </p>
          )}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--ceramic)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--green-accent)" }}
              initial={{ width: 0 }}
              animate={{ width: `${freeShippingPct}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5">
        {items.length === 0 ? (
          <EmptyCart onClose={closeCart} />
        ) : (
          <AnimatePresence initial={false}>
            {items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <CartItemRow item={item} compact />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="shrink-0 px-5 py-4" style={{ borderTop: "1px solid var(--ceramic)" }}>
          {/* Subtotal */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold" style={{ color: "var(--text-black-soft)" }}>Subtotal</span>
            <span className="text-lg font-bold" style={{ color: "var(--green-bio)" }}>${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-[10px] mb-4" style={{ color: "var(--text-black-soft)" }}>Taxes and shipping calculated at checkout</p>

          {/* CTA row */}
          <div className="flex gap-2">
            <button
              onClick={expandCart}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors border"
              style={{ borderColor: "var(--input-border)", color: "var(--text-black-soft)", background: "transparent" }}
              title="View full cart"
            >
              <Maximize2 size={13} />
              Full cart
            </button>
            <a
              href="/checkout"
              className="btn btn-primary flex-1 text-center justify-center gap-1.5"
              style={{ fontSize: 14, padding: "10px 16px" }}
            >
              Checkout
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-1 mt-3">
            <Leaf size={10} style={{ color: "var(--green-accent)" }} />
            <p className="text-[10px]" style={{ color: "var(--text-black-soft)" }}>30-day returns · Secure checkout</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Full-screen cart ─── */
function FullscreenCart() {
  const { items, subtotal, count, closeCart, collapseCart, updateQuantity, removeItem } = useCart();
  const freeShippingLeft = Math.max(0, 80 - subtotal);

  return (
    <motion.div
      key="fullscreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ background: "var(--canvas)" }}
      role="dialog"
      aria-label="Full cart"
      aria-modal="true"
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 lg:px-10 py-4"
        style={{ background: "var(--green-house)" }}
      >
        <div className="flex items-center gap-3">
          <ShoppingBag size={18} color="#fff" />
          <h1 className="font-bold text-base text-white" style={{ letterSpacing: "-0.01em" }}>
            Your Cart — {count} item{count !== 1 ? "s" : ""}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={collapseCart}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.7)" }}
            aria-label="Collapse to drawer"
            title="Collapse"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.7)" }}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-10">
        {items.length === 0 ? (
          <EmptyCart onClose={closeCart} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">

            {/* Items */}
            <div>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ceramic)", background: "#fff" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--ceramic)", background: "var(--surface-alt)" }}>
                  <p className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-black-soft)" }}>Items</p>
                </div>
                <div className="px-6">
                  <AnimatePresence initial={false}>
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        {/* Fullscreen item row — bigger */}
                        <div className="flex items-center gap-4 py-5" style={{ borderBottom: "1px solid var(--ceramic)" }}>
                          <MiniProduct handle={item.handle} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base mb-0.5" style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}>
                              {item.title}
                            </p>
                            <p className="text-xs mb-3" style={{ color: "var(--text-black-soft)" }}>{item.variant}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center rounded-full overflow-hidden" style={{ border: "1px solid var(--ceramic)" }}>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[var(--surface-alt)]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-8 text-center text-sm font-bold" style={{ color: "var(--text-black)" }}>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[var(--surface-alt)]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-xs flex items-center gap-1 transition-colors hover:text-red-500"
                                style={{ color: "var(--text-black-soft)" }}
                              >
                                <Trash2 size={12} />
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-base" style={{ color: "var(--green-bio)" }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ceramic)", background: "#fff" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--ceramic)", background: "var(--surface-alt)" }}>
                  <p className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-black-soft)" }}>Order summary</p>
                </div>
                <div className="px-6 py-5">
                  {/* Free shipping progress */}
                  <div className="mb-5 p-3 rounded-xl" style={{ background: "var(--green-xlight)" }}>
                    {freeShippingLeft > 0 ? (
                      <p className="text-xs mb-1.5" style={{ color: "var(--green-bio)" }}>
                        <span className="font-bold">${freeShippingLeft.toFixed(2)}</span> away from free shipping
                      </p>
                    ) : (
                      <p className="text-xs mb-1.5 font-bold" style={{ color: "var(--green-bio)" }}>✓ Free shipping unlocked!</p>
                    )}
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--green-accent)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (subtotal / 80) * 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: "var(--text-black-soft)" }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: "var(--text-black)" }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-5">
                    <span style={{ color: "var(--text-black-soft)" }}>Shipping</span>
                    <span className="font-semibold" style={{ color: freeShippingLeft <= 0 ? "var(--green-bio)" : "var(--text-black)" }}>
                      {freeShippingLeft <= 0 ? "Free" : "$8.95"}
                    </span>
                  </div>

                  <div
                    className="flex justify-between text-base font-bold mb-6 pt-4"
                    style={{ borderTop: "1px solid var(--ceramic)" }}
                  >
                    <span style={{ color: "var(--text-black)" }}>Estimated total</span>
                    <span style={{ color: "var(--green-bio)" }}>
                      ${(subtotal + (freeShippingLeft <= 0 ? 0 : 8.95)).toFixed(2)}
                    </span>
                  </div>

                  <a
                    href="/checkout"
                    className="btn btn-primary w-full justify-center gap-2 mb-3"
                    style={{ fontSize: 15, padding: "13px 24px" }}
                  >
                    Proceed to Checkout
                    <ArrowRight size={15} />
                  </a>

                  <button
                    onClick={collapseCart}
                    className="w-full text-center text-sm transition-colors"
                    style={{ color: "var(--text-black-soft)" }}
                  >
                    ← Continue shopping
                  </button>

                  {/* Trust badges */}
                  <div className="mt-5 pt-4 flex flex-col gap-1.5" style={{ borderTop: "1px solid var(--ceramic)" }}>
                    {["Secure checkout — SSL encrypted", "30-day satisfaction guarantee", "Australian made & owned"].map(t => (
                      <div key={t} className="flex items-center gap-2">
                        <Leaf size={10} style={{ color: "var(--green-accent)", flexShrink: 0 }} />
                        <p className="text-[11px]" style={{ color: "var(--text-black-soft)" }}>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Backdrop ─── */
function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[199]"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

/* ─── Root export — mount once in layout ─── */
export function CartDrawer() {
  const { isOpen, isFullscreen, closeCart } = useCart();
  const open = isOpen || isFullscreen;

  return (
    <AnimatePresence>
      {open && (
        <>
          {!isFullscreen && <Backdrop onClick={closeCart} />}
          {isFullscreen ? <FullscreenCart /> : <DrawerPanel />}
        </>
      )}
    </AnimatePresence>
  );
}
