"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useAi } from "@/lib/ai-context";
import { AI_HOVER } from "@/lib/ai-messages";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ── Typewriter hook ── */
function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed("");
    if (!text) return;

    let i = 0;
    function tick() {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) frameRef.current = setTimeout(tick, speed);
    }
    // brief pause before typing starts
    frameRef.current = setTimeout(tick, 260);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [text, speed]);

  return displayed;
}

/* ── Pulsing dot ── */
function PulseDot() {
  return (
    <span className="relative flex w-2 h-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: "var(--green-accent)" }}
      />
      <span
        className="relative inline-flex rounded-full w-2 h-2"
        style={{ background: "var(--green-accent)" }}
      />
    </span>
  );
}

/* ── Main widget ── */
export function FrapButton() {
  const { hoveredProduct } = useAi();
  const [manualOpen, setManualOpen] = useState(false);

  const isOpen = !!(hoveredProduct || manualOpen);
  const handle  = hoveredProduct?.handle ?? "";
  const title   = hoveredProduct?.title  ?? "";
  const rawMsg  = AI_HOVER[handle] ?? (manualOpen ? "Hover over any product and I'll tell you all about it." : "");

  const typed = useTypewriter(rawMsg);

  // close manual panel when a product is hovered
  useEffect(() => {
    if (hoveredProduct) setManualOpen(false);
  }, [hoveredProduct]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={handle || "manual"}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 8,  scale: 0.97  }}
            transition={{ duration: 0.28, ease }}
            className="w-[288px] rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.20), 0 2px 8px rgba(0,0,0,0.08)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--green-house)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <Sparkles size={14} color="#fff" />
                </div>
                <span className="text-xs font-bold" style={{ color: "#fff", letterSpacing: "0.04em" }}>Bio Advisor</span>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot />
                <button
                  onClick={() => { setManualOpen(false); }}
                  aria-label="Close"
                  className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#fff" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 pt-3.5 pb-4" style={{ background: "#fff" }}>
              {/* Product label */}
              {title && (
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--green-accent)" }}>
                  {title}
                </p>
              )}

              {/* Typewriter message */}
              <p className="text-[13px] leading-relaxed min-h-[48px]" style={{ color: "var(--text-black)", fontWeight: 500 }}>
                {typed}
                {/* blinking cursor while typing */}
                {typed.length < rawMsg.length && (
                  <span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle animate-pulse" style={{ background: "var(--green-accent)" }} />
                )}
              </p>

              {/* View product link */}
              {handle && typed.length === rawMsg.length && rawMsg.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease }}
                  className="mt-3 pt-3"
                  style={{ borderTop: "1px solid var(--ceramic)" }}
                >
                  <Link
                    href={`/products/${handle}`}
                    className="flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
                    style={{ color: "var(--green-bio)" }}
                  >
                    View full details
                    <ArrowRight size={12} />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4, ease }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setManualOpen(v => !v)}
        aria-label="Bio Advisor"
        className="relative flex items-center justify-center rounded-full transition-shadow"
        style={{
          width:      56,
          height:     56,
          background: hoveredProduct ? "var(--green-accent)" : "var(--green-house)",
          boxShadow:  hoveredProduct
            ? "0 0 0 4px rgba(0,171,85,0.25), 0 8px 20px rgba(0,0,0,0.18)"
            : "0 4px 16px rgba(0,0,0,0.20)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <Sparkles size={22} color="#fff" />

        {/* Pulse ring when a product is hovered */}
        {hoveredProduct && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "var(--green-accent)", opacity: 0.3 }}
          />
        )}
      </motion.button>
    </div>
  );
}
