"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/products",       label: "Products"       },
  { href: "/#science",       label: "Science"        },
  { href: "/growing-guides", label: "Growing Guides" },
  { href: "/contact",        label: "Contact"        },
];

export function Nav() {
  const { count: cartCount, openCart } = useCart();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] bg-white transition-shadow duration-300",
          scrolled ? "shadow-[0_1px_3px_rgba(0,0,0,0.10),0_2px_2px_rgba(0,0,0,0.06)]" : ""
        )}
        style={{ height: "var(--nav-h)" }}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-lg md:text-xl shrink-0"
            style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            aria-label="BioGardeners home"
          >
            Bio<span style={{ color: "var(--green-house)" }}>Gardeners</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center" aria-label="Primary navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold transition-colors duration-200 hover:text-[--green-accent] whitespace-nowrap"
                style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right group */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-alt)]"
              style={{ color: "var(--text-black-soft)" }}
              aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "var(--green-accent)" }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Desktop-only buttons — wrapped in a div so .btn class doesn't fight Tailwind hidden */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/account" className="btn btn-outline" style={{ padding: "7px 16px", fontSize: 14 }}>
                Sign in
              </Link>
              <Link href="/products" className="btn btn-primary" style={{ padding: "7px 16px", fontSize: 14 }}>
                Shop now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-alt)]"
              style={{ color: "var(--text-black-soft)" }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="fixed inset-0 z-[99] flex flex-col pb-10"
            style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}
          >
            {/* Close strip — tapping the nav area area closes */}
            <nav className="flex flex-col px-5 pt-6" aria-label="Mobile navigation">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-2xl font-bold"
                    style={{
                      color: "var(--green-house)",
                      borderBottom: "1px solid var(--ceramic)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-5 mt-8 flex flex-col gap-3">
              <Link href="/products" className="btn btn-primary w-full" style={{ fontSize: 15, padding: "13px 24px" }} onClick={() => setMenuOpen(false)}>
                Shop now
              </Link>
              <Link href="/account" className="btn btn-outline w-full" style={{ fontSize: 15, padding: "13px 24px" }} onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            </div>

            <p className="mt-auto px-5 text-sm" style={{ color: "var(--text-black-soft)" }}>
              Free shipping over $80 · Ships Australia wide
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
