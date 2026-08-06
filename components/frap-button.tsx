"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useAi } from "@/lib/ai-context";
import { AI_HOVER } from "@/lib/ai-messages";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ─── Typewriter ─────────────────────────────── */
function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    function tick() { i++; setDisplayed(text.slice(0, i)); if (i < text.length) frameRef.current = setTimeout(tick, speed); }
    frameRef.current = setTimeout(tick, 260);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [text, speed]);
  return displayed;
}

/* ─── Pulse dot ──────────────────────────────── */
function PulseDot() {
  return (
    <span className="relative flex w-2 h-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--green-accent)" }} />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: "var(--green-accent)" }} />
    </span>
  );
}

/* ─── Plant character — /public/plant.png ────── */
function PlantCharacter({ active, size = 72 }: { active: boolean; size?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size, flexShrink: 0 }}
      animate={active
        ? { rotate: [-6, 6, -6], scale: [1, 1.05, 1] }
        : { rotate: [-2, 2, -2] }
      }
      transition={{ repeat: Infinity, duration: active ? 0.72 : 4.2, ease: "easeInOut" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/plant.png"
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN WIDGET
   ═══════════════════════════════════════════════ */
export function FrapButton() {
  const { hoveredProduct } = useAi();
  const [manualOpen, setManualOpen] = useState(false);
  const [wander,     setWander]     = useState({ x: 0, y: 0 });
  const wanderRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = !!(hoveredProduct || manualOpen);
  const handle = hoveredProduct?.handle ?? "";
  const title  = hoveredProduct?.title  ?? "";
  const rawMsg = AI_HOVER[handle] ?? (manualOpen ? "Hover over any product and I'll tell you all about it." : "");
  const typed  = useTypewriter(rawMsg);

  useEffect(() => { if (hoveredProduct) setManualOpen(false); }, [hoveredProduct]);

  useEffect(() => {
    if (hoveredProduct || manualOpen) {
      setWander({ x: 0, y: 0 });
      if (wanderRef.current) clearTimeout(wanderRef.current);
      return;
    }
    function drift() {
      setWander({ x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 12 });
      wanderRef.current = setTimeout(drift, 4200 + Math.random() * 2800);
    }
    wanderRef.current = setTimeout(drift, 1800);
    return () => { if (wanderRef.current) clearTimeout(wanderRef.current); };
  }, [hoveredProduct, manualOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">

      {/* ── Chat panel ──────────────────────────── */}
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
            <div className="flex items-center justify-between px-3.5 py-2.5"
              style={{ background: "var(--green-house)" }}>
              <div className="flex items-center gap-2">
                <div className="rounded-full overflow-hidden flex-shrink-0"
                  style={{ width: 36, height: 36, background: "rgba(255,255,255,0.10)" }}>
                  <PlantCharacter active={!!hoveredProduct} size={36} />
                </div>
                <span className="text-xs font-bold" style={{ color: "#fff", letterSpacing: "0.05em" }}>
                  Bio Advisor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot />
                <button onClick={() => setManualOpen(false)} aria-label="Close"
                  className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#fff" }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="px-4 pt-3.5 pb-4" style={{ background: "#fff" }}>
              {title && (
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2"
                  style={{ color: "var(--green-accent)" }}>{title}</p>
              )}
              <p className="text-[13px] leading-relaxed min-h-[48px]"
                style={{ color: "var(--text-black)", fontWeight: 500 }}>
                {typed}
                {typed.length < rawMsg.length && (
                  <span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle animate-pulse"
                    style={{ background: "var(--green-accent)" }} />
                )}
              </p>
              {handle && typed.length === rawMsg.length && rawMsg.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease }}
                  className="mt-3 pt-3" style={{ borderTop: "1px solid var(--ceramic)" }}>
                  <Link href={`/products/${handle}`}
                    className="flex items-center gap-1.5 text-xs font-bold hover:underline"
                    style={{ color: "var(--green-bio)" }}>
                    View full details <ArrowRight size={12} />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Avatar button ───────────────────────── */}
      <motion.div
        animate={hoveredProduct || manualOpen ? { x: 0, y: 0 } : { x: wander.x, y: wander.y }}
        transition={{ type: "spring", stiffness: 38, damping: 16 }}
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setManualOpen(v => !v)}
          aria-label="Bio Advisor"
          className="relative flex items-center justify-center rounded-full overflow-hidden"
          style={{
            width: 72, height: 72,
            background: "#fff",
            boxShadow: hoveredProduct
              ? "0 0 0 4px rgba(0,171,85,0.28), 0 8px 24px rgba(0,0,0,0.24)"
              : "0 4px 18px rgba(0,0,0,0.26)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <PlantCharacter active={!!hoveredProduct} size={72} />
          {hoveredProduct && (
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "var(--green-accent)", opacity: 0.22 }} />
          )}
        </motion.button>
      </motion.div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-ping, .animate-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
