"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useAi } from "@/lib/ai-context";
import { AI_HOVER } from "@/lib/ai-messages";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ─────────────────────────────────── Typewriter ── */
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
    frameRef.current = setTimeout(tick, 260);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [text, speed]);

  return displayed;
}

/* ─────────────────────────────────── Pulse dot ── */
function PulseDot() {
  return (
    <span className="relative flex w-2 h-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: "var(--green-accent)" }}
      />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: "var(--green-accent)" }} />
    </span>
  );
}

/* ─────────────────────────────────── Plant character ── */
function PlantCharacter({ active, size = 38 }: { active: boolean; size?: number }) {
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Irregular blink schedule
  useEffect(() => {
    function schedule() {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        blinkRef.current = setTimeout(() => { setBlink(false); schedule(); }, 130);
      }, 2800 + Math.random() * 4200);
    }
    schedule();
    return () => { if (blinkRef.current) clearTimeout(blinkRef.current); };
  }, []);

  const h = size * (48 / 40); // maintain 40:48 aspect
  const eyeRy = blink ? 0.55 : active ? 3.4 : 3.0;

  return (
    <motion.div
      style={{ width: size, height: h, overflow: "visible" }}
      animate={
        active
          ? { y: [0, -11, 2, -7, 0], rotate: [0, -9, 9, -6, 0], scale: [1, 1.13, 0.97, 1.07, 1] }
          : { y: [0, -5, 0], rotate: [0, -3, 3, -3, 0] }
      }
      transition={
        active
          ? { repeat: Infinity, duration: 0.7, ease: "easeInOut" }
          : { repeat: Infinity, duration: 3.4, ease: "easeInOut" }
      }
    >
      <svg viewBox="0 0 40 48" width={size} height={h} style={{ overflow: "visible" }}>

        {/* ── Pot ── */}
        <path d="M12.5 36 L27.5 36 L25.5 46.5 L14.5 46.5 Z" fill="#b5714a" />
        <rect x="9" y="33" width="22" height="4.5" rx="2.25" fill="#c98054" />
        {/* Pot rim highlight */}
        <rect x="9" y="33" width="22" height="2" rx="2" fill="#d9936b" opacity="0.6" />
        {/* Soil */}
        <ellipse cx="20" cy="35.2" rx="10" ry="2.7" fill="#3a2010" />
        <ellipse cx="17" cy="35" rx="3" ry="1.2" fill="#4d2c15" opacity="0.5" />

        {/* ── Stem ── */}
        <path d="M20 35 Q19.2 27 20 20" stroke="#3d7a35" strokeWidth="2.6" strokeLinecap="round" fill="none" />

        {/* ── Left leaf ── */}
        <motion.g
          style={{ transformOrigin: "20px 23px" }}
          animate={active ? { rotate: [-32, -52, -32] } : { rotate: [-26, -34, -26] }}
          transition={{ repeat: Infinity, duration: active ? 0.52 : 2.6, ease: "easeInOut" }}
        >
          <ellipse cx="10" cy="24.5" rx="11" ry="4.8" fill="#4d9f43" transform="rotate(-34 10 24.5)" />
          <ellipse cx="10" cy="24.5" rx="5.5" ry="2.2" fill="#68c15c" transform="rotate(-34 10 24.5)" opacity="0.55" />
        </motion.g>

        {/* ── Right leaf ── */}
        <motion.g
          style={{ transformOrigin: "20px 23px" }}
          animate={active ? { rotate: [32, 52, 32] } : { rotate: [26, 34, 26] }}
          transition={{ repeat: Infinity, duration: active ? 0.52 : 2.6, ease: "easeInOut", delay: 0.18 }}
        >
          <ellipse cx="30" cy="24.5" rx="11" ry="4.8" fill="#4d9f43" transform="rotate(34 30 24.5)" />
          <ellipse cx="30" cy="24.5" rx="5.5" ry="2.2" fill="#68c15c" transform="rotate(34 30 24.5)" opacity="0.55" />
        </motion.g>

        {/* ── Head ── */}
        <circle cx="20" cy="13.5" r="12.8" fill="#52a846" />
        {/* Sheen — small white overlay, no duplicate gradient id */}
        <circle cx="16" cy="9.5" r="5.5" fill="white" opacity="0.1" />

        {/* ── Eyes ── */}
        <ellipse cx="15" cy="13" rx="2.6" ry={eyeRy} fill="#1a3d16" />
        <ellipse cx="25" cy="13" rx="2.6" ry={eyeRy} fill="#1a3d16" />
        {!blink && (
          <>
            <circle cx="16.3" cy="11.2" r="1.05" fill="white" opacity="0.9" />
            <circle cx="26.3" cy="11.2" r="1.05" fill="white" opacity="0.9" />
          </>
        )}

        {/* ── Cheeks ── */}
        <ellipse cx="10.5" cy="17.5" rx="3.8" ry="2.2" fill="white" opacity="0.12" />
        <ellipse cx="29.5" cy="17.5" rx="3.8" ry="2.2" fill="white" opacity="0.12" />

        {/* ── Mouth ── */}
        {active ? (
          <path d="M13.5 18.5 Q20 25.5 26.5 18.5" stroke="#1a3d16" strokeWidth="1.9" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M15.5 18.5 Q20 22.5 24.5 18.5" stroke="#1a3d16" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        )}

        {/* ── Excited sparkle particles ── */}
        {active && (
          <>
            <motion.circle cx="36" cy="4" r="2.2" fill="#7be37a"
              animate={{ scale: [0, 1.3, 0], opacity: [0, 0.9, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, delay: 0 }}
            />
            <motion.circle cx="39" cy="11" r="1.6" fill="#5adb59"
              animate={{ scale: [0, 1.3, 0], opacity: [0, 0.9, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, delay: 0.22 }}
            />
            <motion.circle cx="4" cy="7" r="1.8" fill="#7be37a"
              animate={{ scale: [0, 1.3, 0], opacity: [0, 0.9, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, delay: 0.44 }}
            />
            <motion.circle cx="34" cy="20" r="1.3" fill="#5adb59"
              animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, delay: 0.33 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────── Main widget ── */
export function FrapButton() {
  const { hoveredProduct } = useAi();
  const [manualOpen, setManualOpen]   = useState(false);
  const [wander,     setWander]       = useState({ x: 0, y: 0 });
  const wanderRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen  = !!(hoveredProduct || manualOpen);
  const handle  = hoveredProduct?.handle ?? "";
  const title   = hoveredProduct?.title  ?? "";
  const rawMsg  = AI_HOVER[handle] ?? (manualOpen ? "Hover over any product and I'll tell you all about it." : "");
  const typed   = useTypewriter(rawMsg);

  // Close manual panel when a product is hovered
  useEffect(() => {
    if (hoveredProduct) setManualOpen(false);
  }, [hoveredProduct]);

  // Wander — character drifts lazily when idle, snaps home when panel opens
  useEffect(() => {
    if (hoveredProduct || manualOpen) {
      setWander({ x: 0, y: 0 });
      if (wanderRef.current) clearTimeout(wanderRef.current);
      return;
    }

    function drift() {
      setWander({
        x: (Math.random() - 0.5) * 22,
        y: (Math.random() - 0.5) * 16,
      });
      wanderRef.current = setTimeout(drift, 4200 + Math.random() * 2800);
    }
    wanderRef.current = setTimeout(drift, 1800);
    return () => { if (wanderRef.current) clearTimeout(wanderRef.current); };
  }, [hoveredProduct, manualOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">

      {/* ── Chat panel ── */}
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
            <div
              className="flex items-center justify-between px-3.5 py-2"
              style={{ background: "var(--green-house)" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-end justify-center" style={{ width: 32, height: 32 }}>
                  <PlantCharacter active={!!hoveredProduct} size={22} />
                </div>
                <span className="text-xs font-bold" style={{ color: "#fff", letterSpacing: "0.04em" }}>
                  Bio Advisor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot />
                <button
                  onClick={() => setManualOpen(false)}
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
              {title && (
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--green-accent)" }}>
                  {title}
                </p>
              )}
              <p className="text-[13px] leading-relaxed min-h-[48px]" style={{ color: "var(--text-black)", fontWeight: 500 }}>
                {typed}
                {typed.length < rawMsg.length && (
                  <span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle animate-pulse" style={{ background: "var(--green-accent)" }} />
                )}
              </p>
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

      {/* ── Avatar button — wanders when idle ── */}
      <motion.div
        animate={hoveredProduct || manualOpen ? { x: 0, y: 0 } : { x: wander.x, y: wander.y }}
        transition={{ type: "spring", stiffness: 38, damping: 16 }}
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setManualOpen(v => !v)}
          aria-label="Bio Advisor"
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 62,
            height: 62,
            background: hoveredProduct ? "var(--green-accent)" : "var(--green-house)",
            boxShadow: hoveredProduct
              ? "0 0 0 4px rgba(0,171,85,0.25), 0 8px 24px rgba(0,0,0,0.20)"
              : "0 4px 16px rgba(0,0,0,0.22)",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <div style={{ marginTop: 6 }}>
            <PlantCharacter active={!!hoveredProduct} size={40} />
          </div>

          {/* Pulse ring when product is hovered */}
          {hoveredProduct && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "var(--green-accent)", opacity: 0.28 }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Reduced-motion fallback */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-ping { animation: none !important; }
          .animate-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
