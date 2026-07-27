"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/products",  label: "Products" },
  { href: "/#science",  label: "Science"  },
  { href: "/#about",    label: "About"    },
  { href: "/contact",   label: "Contact"  },
];

export function Nav({ cartCount = 0 }: { cartCount?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          scrolled ? "shadow-[0_1px_3px_rgba(0,0,0,0.10),0_2px_2px_rgba(0,0,0,0.06),0_0_2px_rgba(0,0,0,0.07)]" : ""
        )}
        style={{ height: 99 }}
      >
        <div
          className="max-w-[1440px] mx-auto px-10 h-full flex items-center justify-between"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl tracking-[-0.01em]"
            style={{ color: "var(--green-bio)", letterSpacing: "-0.01em" }}
            aria-label="BioGardeners home"
          >
            Bio<span style={{ color: "var(--green-house)" }}>Gardeners</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[0.875rem] font-semibold transition-colors duration-200 hover:text-[--green-accent]"
                style={{ color: "var(--text-black)", letterSpacing: "-0.01em" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right: cart + sign in + join */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 transition-colors duration-200"
              style={{ color: "var(--text-black-soft)" }}
              aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "var(--green-accent)" }}
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <Link
              href="/account"
              className="btn btn-outline hidden sm:inline-flex text-sm"
              style={{ padding: "7px 16px", fontSize: 14 }}
            >
              Sign in
            </Link>

            <Link
              href="/products"
              className="btn btn-primary hidden sm:inline-flex text-sm"
              style={{ padding: "7px 16px", fontSize: 14 }}
            >
              Shop now
            </Link>

            <button
              className="md:hidden p-2 transition-colors duration-200"
              style={{ color: "var(--text-black-soft)" }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="fixed inset-0 z-[90] flex flex-col pt-28 px-6 pb-10"
            style={{ background: "var(--canvas)" }}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-3xl font-bold border-b"
                    style={{ color: "var(--text-black)", borderColor: "var(--ceramic)", letterSpacing: "-0.01em" }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Link href="/products" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>
                Shop now
              </Link>
              <Link href="/account" className="btn btn-outline w-full" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            </div>

            <p className="mt-auto text-sm" style={{ color: "var(--text-black-soft)" }}>
              Free shipping on orders over $80 · Australia wide
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
