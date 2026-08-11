"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isHome   = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          height:    "var(--nav-h)",
          background: transparent ? "transparent" : "#fff",
          boxShadow:  scrolled ? "0 1px 3px rgba(0,0,0,0.10),0 2px 2px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl md:text-2xl shrink-0 transition-colors duration-500"
            style={{ color: transparent ? "#fff" : "var(--green-bio)", letterSpacing: "-0.01em" }}
            aria-label="BioGardeners home"
          >
            Bio<span style={{ color: transparent ? "rgba(255,255,255,0.72)" : "var(--green-house)" }}>Gardeners</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center" aria-label="Primary navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-base font-semibold whitespace-nowrap transition-colors duration-500"
                style={{ color: transparent ? "rgba(255,255,255,0.85)" : "var(--text-black)", letterSpacing: "-0.01em" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = transparent ? "#fff" : "var(--green-accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = transparent ? "rgba(255,255,255,0.85)" : "var(--text-black)"; }}
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
              className="relative p-2 rounded-lg transition-colors duration-500"
              style={{ color: transparent ? "rgba(255,255,255,0.85)" : "var(--text-black-soft)" }}
              aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "var(--green-accent)", color: "#fff" }}
                    aria-hidden="true"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Desktop CTA button */}
            <div className="hidden md:flex items-center">
              {transparent ? (
                <Link
                  href="/products"
                  className="font-bold px-5 py-2 rounded-full transition-all hover:brightness-110"
                  style={{ background: "var(--green-accent)", color: "#fff", fontSize: 16, boxShadow: "0 2px 14px rgba(0,117,74,0.45)" }}
                >
                  Shop now
                </Link>
              ) : (
                <Link href="/products" className="btn btn-primary" style={{ padding: "7px 16px", fontSize: 16 }}>
                  Shop now
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors duration-500"
              style={{ color: transparent ? "rgba(255,255,255,0.85)" : "var(--text-black-soft)" }}
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
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[99] flex flex-col pb-10"
            style={{ background: "var(--green-house)", paddingTop: "var(--nav-h)" }}
          >
            <nav className="flex flex-col px-5 pt-4" aria-label="Mobile navigation">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-2xl font-bold"
                    style={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.10)", letterSpacing: "-0.02em" }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-5 mt-8 flex flex-col gap-3">
              <Link
                href="/products"
                className="w-full py-4 rounded-full font-bold text-sm flex items-center justify-center"
                style={{ background: "var(--green-accent)", color: "#fff" }}
                onClick={() => setMenuOpen(false)}
              >
                Shop now
              </Link>
            </div>

            <p className="mt-auto px-5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Free shipping over $80 · Ships Australia wide
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
