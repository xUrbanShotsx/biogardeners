"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Maximize2, Minimize2, ShoppingBag, ArrowRight, Leaf, Sparkles, Truck } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { useAi } from "@/lib/ai-context";
import { cartCheckoutMessage } from "@/lib/ai-messages";

const SHIPPING = 17.95;

/* ─── Per-product visual colours ─── */
const PRODUCT_BG: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":              "linear-gradient(140deg,#d4e9e2,#a8cfc0)",
  "lawn-fertilizer-premium-granulated-concentrated": "linear-gradient(140deg,#fdebc8,#f2d49a)",
  "volcanic-dust-trace-elements":                   "linear-gradient(140deg,#e8e4df,#cec8c0)",
  "soil-health-conditioner-powder":                 "linear-gradient(140deg,#ede0d0,#d4c0a8)",
  "liquid-npk-fertilizer":                          "linear-gradient(140deg,#cce4f0,#9ecde6)",
  "glacial-milk":                                   "linear-gradient(140deg,#e8f4f8,#c8e4f0)",
  "soil-health-conditioner":                        "linear-gradient(140deg,#dde8d8,#b8d4b0)",
  "plant-spray":                                    "linear-gradient(140deg,#d8edd4,#aed4a8)",
  "penetrator":                                     "linear-gradient(140deg,#d8d4e8,#b4aed4)",
};
const PRODUCT_LABEL: Record<string, { l1: string; l2: string }> = {
  "gp-fertiliser-premium-garden-lawn":              { l1: "GP Fertiliser",  l2: "Garden / Lawn"  },
  "lawn-fertilizer-premium-granulated-concentrated": { l1: "Lawn Fertilizer", l2: "Concentrated"   },
  "volcanic-dust-trace-elements":                   { l1: "Volcanic Dust",  l2: "Trace Elements" },
  "soil-health-conditioner-powder":                 { l1: "Soil Health",    l2: "Conditioner"    },
  "liquid-npk-fertilizer":                          { l1: "Liquid NPK",     l2: "Fertilizer"     },
  "glacial-milk":                                   { l1: "Glacial Milk",   l2: "Rock Flour"     },
  "soil-health-conditioner":                        { l1: "Soil Health",    l2: "Conditioner"    },
  "plant-spray":                                    { l1: "Plant Spray",    l2: "Disease Control"},
  "penetrator":                                     { l1: "Penetrator",     l2: "Soil Wetter"    },
};

function MiniProduct({ handle, imageUrl }: { handle: string; imageUrl?: string }) {
  const bg = PRODUCT_BG[handle] ?? "linear-gradient(140deg,#d4e9e2,#b0d0c4)";
  return (
    <div className="w-16 h-16 rounded-xl shrink-0 overflow-hidden" style={{ background: bg }}>
      {imageUrl ? (
        <div className="relative w-full h-full">
          <Image src={imageUrl} alt={handle} fill sizes="64px" className="object-contain p-1.5" />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="w-9 h-auto drop-shadow" aria-hidden="true">
            <rect x="10" y="18" width="60" height="74" rx="5" fill="#1E3932" />
            <rect x="18" y="32" width="44" height="48" rx="3" fill="white" opacity="0.96" />
            <ellipse cx="40" cy="94" rx="22" ry="3" fill="rgba(0,0,0,0.07)" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Single item row ─── */
function CartItemRow({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { updateQuantity, removeItem } = useCart();
  return (
    <div className={`flex items-start gap-3 ${compact ? "py-3" : "py-4"}`} style={{ borderBottom: "1px solid var(--ceramic)" }}>
      <MiniProduct handle={item.handle} imageUrl={item.imageUrl} />
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

/* ─── AI advisor bubble ─── */
function AiBubble({ compliment, tip, onDismiss }: { compliment: string; tip: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden shrink-0"
      style={{ borderBottom: "1px solid var(--ceramic)" }}
    >
      <div className="px-5 py-3" style={{ background: "var(--green-xlight)" }}>
        <div className="flex gap-2.5 items-start">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "var(--green-accent)" }}
          >
            <Sparkles size={13} color="#fff" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "var(--green-accent)" }}>
              Bio Advisor
            </p>
            <p className="text-xs font-semibold mb-0.5 leading-snug" style={{ color: "var(--green-house)" }}>
              {compliment}
            </p>
            <p className="text-[11px] leading-snug" style={{ color: "var(--text-black-soft)" }}>
              {tip}
            </p>
          </div>
          <button onClick={onDismiss} aria-label="Dismiss" className="p-0.5 mt-0.5 shrink-0" style={{ color: "var(--text-black-soft)" }}>
            <X size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Drawer panel (slide-in from right) ─── */
function DrawerPanel() {
  const { items, subtotal, count, closeCart, expandCart } = useCart();
  const { cartMessage, clearCartMessage } = useAi();

  return (
    <motion.div
      key="drawer"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 300 }}
      className="fixed top-0 right-0 bottom-0 z-[200] flex flex-col"
      style={{ width: "min(440px, 100vw)", background: "#fff", boxShadow: "-4px 0 40px rgba(0,0,0,0.14)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
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

      {/* AI message — appears when item is added */}
      <AnimatePresence>
        {cartMessage && count > 0 && (
          <AiBubble
            key={cartMessage.key}
            compliment={cartMessage.compliment}
            tip={cartMessage.tip}
            onDismiss={clearCartMessage}
          />
        )}
      </AnimatePresence>

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
          <p className="text-[10px] mb-4" style={{ color: "var(--text-black-soft)" }}>$15.95 flat rate shipping · Australia wide</p>

          {/* AI checkout encouragement */}
          <div className="flex gap-2.5 items-start mb-4 p-3 rounded-xl" style={{ background: "var(--green-xlight)" }}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "var(--green-accent)" }}
            >
              <Sparkles size={11} color="#fff" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "var(--green-accent)" }}>Bio Advisor</p>
              <p className="text-[11px] leading-snug" style={{ color: "var(--green-bio)" }}>
                {cartCheckoutMessage(count, items.map(i => i.title))}
              </p>
            </div>
          </div>

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
            <p className="text-[10px]" style={{ color: "var(--text-black-soft)" }}>All sales final · Secure checkout</p>
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
        style={{ background: "var(--green-accent)" }}
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
                          <MiniProduct handle={item.handle} imageUrl={item.imageUrl} />
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
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: "var(--text-black-soft)" }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: "var(--text-black)" }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-5">
                    <span style={{ color: "var(--text-black-soft)" }}>Shipping</span>
                    <span className="font-semibold" style={{ color: "var(--text-black-soft)" }}>Calculated at checkout</span>
                  </div>

                  <div
                    className="flex justify-between text-base font-bold mb-6 pt-4"
                    style={{ borderTop: "1px solid var(--ceramic)" }}
                  >
                    <span style={{ color: "var(--text-black)" }}>Subtotal</span>
                    <span style={{ color: "var(--green-bio)" }}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* AI checkout encouragement */}
                  <div className="flex gap-3 items-start mb-4 p-3 rounded-xl" style={{ background: "var(--green-xlight)" }}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--green-accent)" }}
                    >
                      <Sparkles size={13} color="#fff" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "var(--green-accent)" }}>Bio Advisor</p>
                      <p className="text-xs leading-snug" style={{ color: "var(--green-bio)" }}>
                        {cartCheckoutMessage(count, items.map(i => i.title))}
                      </p>
                    </div>
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
                    {["Secure checkout — SSL encrypted", "All sales final · no change-of-mind returns", "Australian made & owned"].map(t => (
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
