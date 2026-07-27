"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Floating circular order button — BioGardeners' Frap equivalent.
 * 56px circle, Green Accent fill, layered shadow, scale(0.95) active.
 * Fixed bottom-right, always visible on shopping surfaces.
 */
export function FrapButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bottom-6 right-6 z-[200]"
    >
      <Link
        href="/products"
        aria-label="Shop all products"
        className="flex items-center justify-center rounded-full transition-all duration-200 active:scale-95"
        style={{
          width:      56,
          height:     56,
          background: "var(--green-accent)",
          boxShadow:  "0 0 6px rgba(0,0,0,0.24), 0 8px 12px rgba(0,0,0,0.14)",
          color:      "#fff",
        }}
      >
        <ShoppingBag size={22} />
      </Link>
    </motion.div>
  );
}
