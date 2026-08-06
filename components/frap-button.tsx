"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useAi } from "@/lib/ai-context";
import { AI_HOVER } from "@/lib/ai-messages";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ─── Typewriter ── */
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

/* ─── Pulse dot ── */
function PulseDot() {
  return (
    <span className="relative flex w-2 h-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: "var(--green-accent)" }} />
      <span className="relative inline-flex rounded-full w-2 h-2"
        style={{ background: "var(--green-accent)" }} />
    </span>
  );
}

/* ─────────────────────────────────────────────── Plant character ── */
/*
 * Designed for a 72×72 square viewBox so it fills the circular button.
 * No legs — compact chibi style: big head + pot + arms.
 * Arms, antennas, and flower are allowed to clip at the circle edge.
 */
function PlantCharacter({ active, size = 66 }: { active: boolean; size?: number }) {
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function schedule() {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        blinkRef.current = setTimeout(() => { setBlink(false); schedule(); }, 130);
      }, 2800 + Math.random() * 4000);
    }
    schedule();
    return () => { if (blinkRef.current) clearTimeout(blinkRef.current); };
  }, []);

  return (
    /* Body sway — rotate around bottom-center, no Y jumping */
    <motion.svg
      viewBox="0 0 72 72"
      width={size}
      height={size}
      style={{ transformOrigin: "36px 72px", overflow: "visible" }}
      animate={active
        ? { rotate: [-5, 5, -5] }
        : { rotate: [-2, 2, -2] }
      }
      transition={{
        repeat: Infinity,
        duration: active ? 0.82 : 4.0,
        ease: "easeInOut",
      }}
    >

      {/* ══ POT ══ */}
      {/* Body */}
      <path d="M21 52 L18 68 L54 68 L51 52 Z" fill="#d4804e" />
      {/* Side shading */}
      <path d="M21 52 L18 68 L23 68 L25 52 Z" fill="#b86838" opacity="0.45" />
      {/* Horizontal band */}
      <line x1="19" y1="60" x2="53" y2="60" stroke="#b86838" strokeWidth="1.6" strokeLinecap="round" />
      {/* Rim */}
      <rect x="17" y="46" width="38" height="7" rx="3.5" fill="#e29060" />
      <rect x="17" y="46" width="38" height="3.5" rx="3.5" fill="#eaa878" opacity="0.55" />

      {/* ══ PLANT BODY (inside pot) ══ */}
      <ellipse cx="36" cy="42" rx="13" ry="13" fill="#52a846" />
      <path d="M36 30 L36 54"       stroke="#3a7a35" strokeWidth="1.5" fill="none" />
      <path d="M33 33 Q25 41 32 49" stroke="#3a7a35" strokeWidth="1.0" fill="none" strokeLinecap="round" />
      <path d="M39 33 Q47 41 40 49" stroke="#3a7a35" strokeWidth="1.0" fill="none" strokeLinecap="round" />

      {/* ══ LEFT ARM (gentle counter-sway) ══ */}
      <motion.g
        style={{ transformOrigin: "22px 44px" }}
        animate={active
          ? { rotate: [12, -18, 12] }
          : { rotate: [4, -10, 4] }
        }
        transition={{ repeat: Infinity, duration: active ? 0.82 : 4.0, ease: "easeInOut", delay: 0.15 }}
      >
        <path d="M22 44 Q10 48 4 56"
          stroke="#6cbf60" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="4" cy="56" r="3.5" fill="#6cbf60" />
        <path d="M2 53 Q-1 47  1 44" stroke="#6cbf60" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d="M5 51 Q3  45  6 43" stroke="#6cbf60" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d="M7 54 Q9  48 11 46" stroke="#6cbf60" strokeWidth="1.9" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* ══ RIGHT ARM (waving) ══ */}
      <motion.g
        style={{ transformOrigin: "50px 44px" }}
        animate={active
          ? { rotate: [-42, -8, -42] }
          : { rotate: [0, -44, -18, -48, -4, 0] }
        }
        transition={{ repeat: Infinity, duration: active ? 0.60 : 2.1, ease: "easeInOut" }}
      >
        <path d="M50 44 Q61 38 66 28"
          stroke="#6cbf60" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="28" r="3.5" fill="#6cbf60" />
        <path d="M64 25 Q61 19 63 16" stroke="#6cbf60" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d="M67 24 Q66 18 69 15" stroke="#6cbf60" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d="M69 26 Q71 20 74 18" stroke="#6cbf60" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        {/* Tiny flower in hand */}
        <g transform="translate(70, 14)">
          {[0, 72, 144, 216, 288].map(a => (
            <ellipse key={a} cx="0" cy="-4" rx="2.5" ry="4.5"
              fill="#b07dd4" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="3" fill="#d4a8f0" />
        </g>
      </motion.g>

      {/* ══ HEAD (counter-rotates for pendulum feel) ══ */}
      <motion.g
        style={{ transformOrigin: "36px 26px" }}
        animate={active
          ? { rotate: [4, -4, 4] }
          : { rotate: [1.5, -1.5, 1.5] }
        }
        transition={{ repeat: Infinity, duration: active ? 0.82 : 4.0, ease: "easeInOut" }}
      >

        {/* Leaf ears */}
        <path d="M15 30 Q3  16 14  5 Q22 15 19 32 Z" fill="#4d9f43" />
        <path d="M15 28 Q7  16 14  8 Q19 16 18 30 Z" fill="#68c25a" opacity="0.5" />
        <path d="M57 30 Q69 16 58  5 Q50 15 53 32 Z" fill="#4d9f43" />
        <path d="M57 28 Q65 16 58  8 Q53 16 54 30 Z" fill="#68c25a" opacity="0.5" />

        {/* Head circle */}
        <circle cx="36" cy="26" r="22" fill="#6cbf60" />
        {/* Subtle sheen */}
        <circle cx="26" cy="16" r="9"  fill="white" opacity="0.07" />

        {/* Freckle spots */}
        <circle cx="30" cy="20" r="2.3" fill="#52aa44" opacity="0.45" />
        <circle cx="44" cy="16" r="1.7" fill="#52aa44" opacity="0.45" />
        <circle cx="42" cy="36" r="1.3" fill="#52aa44" opacity="0.4" />
        <circle cx="27" cy="35" r="1.0" fill="#52aa44" opacity="0.38" />

        {/* Antennas */}
        <path d="M29 6 Q27 0 25 -4" stroke="#90d482" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="25" cy="-5" r="3" fill="#f5d44a" />
        <path d="M43 6 Q45 0 47 -4" stroke="#90d482" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="47" cy="-5" r="3" fill="#f5d44a" />

        {/* Pink flower on head — independently swaying */}
        <g transform="translate(50, 11)">
          <motion.g
            style={{ transformOrigin: "0px 0px" }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          >
            {[0, 60, 120, 180, 240, 300].map(a => (
              <ellipse key={a} cx="0" cy="-6" rx="4" ry="6.5"
                fill="#e8706a" transform={`rotate(${a})`} />
            ))}
            {[0, 60, 120, 180, 240, 300].map(a => (
              <ellipse key={`h${a}`} cx="0.8" cy="-6.5" rx="1.5" ry="2.8"
                fill="#f09090" transform={`rotate(${a})`} opacity="0.5" />
            ))}
            <circle cx="0" cy="0" r="5"   fill="#f5c540" />
            <circle cx="0" cy="0" r="3"   fill="#e8a820" />
            <circle cx="-1" cy="-1" r="1.2" fill="#fad060" opacity="0.7" />
          </motion.g>
        </g>

        {/* ── Eyes (the most important feature!) ── */}

        {/* Left eye */}
        <circle cx="27" cy="26" r="9"   fill="#f5c540" />
        <circle cx="27" cy="26" r="9"   fill="white" opacity="0.12" />
        <circle cx="27" cy="26" r="6.8" fill="#1a1020" />
        {blink ? (
          <rect x="18.5" y="24.2" width="17" height="4.2" rx="2.1" fill="#6cbf60" />
        ) : (
          <>
            <circle cx="29.5" cy="22.5" r="3.2" fill="white" />
            <circle cx="24.5" cy="29"   r="1.3" fill="white" opacity="0.4" />
          </>
        )}

        {/* Right eye */}
        <circle cx="45" cy="26" r="9"   fill="#f5c540" />
        <circle cx="45" cy="26" r="9"   fill="white" opacity="0.12" />
        <circle cx="45" cy="26" r="6.8" fill="#1a1020" />
        {blink ? (
          <rect x="36.5" y="24.2" width="17" height="4.2" rx="2.1" fill="#6cbf60" />
        ) : (
          <>
            <circle cx="47.5" cy="22.5" r="3.2" fill="white" />
            <circle cx="42.5" cy="29"   r="1.3" fill="white" opacity="0.4" />
          </>
        )}

        {/* Blush cheeks */}
        <ellipse cx="17" cy="33" rx="4.5" ry="2.8" fill="#f59898" opacity="0.3" />
        <ellipse cx="55" cy="33" rx="4.5" ry="2.8" fill="#f59898" opacity="0.3" />

        {/* Smile */}
        {active ? (
          <path d="M23 37 Q36 48 49 37"
            stroke="#1a1020" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M25 37 Q36 44 47 37"
            stroke="#1a1020" strokeWidth="2.1" fill="none" strokeLinecap="round" />
        )}
      </motion.g>

      {/* ── Excited sparkles ── */}
      {active && (
        <>
          <motion.circle cx="6" cy="32" r="3"
            fill="#f5c540"
            animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.72, delay: 0 }} />
          <motion.circle cx="12" cy="16" r="2"
            fill="#7be37a"
            animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.72, delay: 0.22 }} />
          <motion.circle cx="66" cy="14" r="2.5"
            fill="#f5c540"
            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.72, delay: 0.44 }} />
        </>
      )}
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────── Main widget ── */
export function FrapButton() {
  const { hoveredProduct } = useAi();
  const [manualOpen, setManualOpen]   = useState(false);
  const [wander,     setWander]       = useState({ x: 0, y: 0 });
  const wanderRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen  = !!(hoveredProduct || manualOpen);
  const handle  = hoveredProduct?.handle ?? "";
  const title   = hoveredProduct?.title  ?? "";
  const rawMsg  = AI_HOVER[handle] ?? (manualOpen
    ? "Hover over any product and I'll tell you all about it."
    : "");
  const typed = useTypewriter(rawMsg);

  useEffect(() => {
    if (hoveredProduct) setManualOpen(false);
  }, [hoveredProduct]);

  useEffect(() => {
    if (hoveredProduct || manualOpen) {
      setWander({ x: 0, y: 0 });
      if (wanderRef.current) clearTimeout(wanderRef.current);
      return;
    }
    function drift() {
      setWander({ x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 12 });
      wanderRef.current = setTimeout(drift, 4000 + Math.random() * 2800);
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
            <div className="flex items-center justify-between px-3.5 py-2"
              style={{ background: "var(--green-house)" }}>
              <div className="flex items-center gap-2.5">
                {/* Tiny character in header */}
                <div className="flex items-center justify-center rounded-full overflow-hidden"
                  style={{ width: 32, height: 32, background: "rgba(255,255,255,0.10)" }}>
                  <PlantCharacter active={!!hoveredProduct} size={32} />
                </div>
                <span className="text-xs font-bold"
                  style={{ color: "#fff", letterSpacing: "0.04em" }}>
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

            {/* Body */}
            <div className="px-4 pt-3.5 pb-4" style={{ background: "#fff" }}>
              {title && (
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2"
                  style={{ color: "var(--green-accent)" }}>
                  {title}
                </p>
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
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
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

      {/* ── Avatar — wanders gently when idle ── */}
      <motion.div
        animate={hoveredProduct || manualOpen
          ? { x: 0, y: 0 }
          : { x: wander.x, y: wander.y }
        }
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
            width: 66,
            height: 66,
            background: hoveredProduct ? "var(--green-accent)" : "var(--green-house)",
            boxShadow: hoveredProduct
              ? "0 0 0 4px rgba(0,171,85,0.28), 0 8px 24px rgba(0,0,0,0.22)"
              : "0 4px 18px rgba(0,0,0,0.24)",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <PlantCharacter active={!!hoveredProduct} size={66} />

          {hoveredProduct && (
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "var(--green-accent)", opacity: 0.25 }} />
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
