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
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--green-accent)" }} />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: "var(--green-accent)" }} />
    </span>
  );
}

/* ─────────────────────────── Cute plant character ── */
function PlantCharacter({ active, size = 48 }: { active: boolean; size?: number }) {
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function schedule() {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        blinkRef.current = setTimeout(() => { setBlink(false); schedule(); }, 140);
      }, 2600 + Math.random() * 4000);
    }
    schedule();
    return () => { if (blinkRef.current) clearTimeout(blinkRef.current); };
  }, []);

  const w = size;
  const h = size * (160 / 90); // aspect ratio

  return (
    /* Root container — lean / sway (no y-jumping) */
    <motion.div
      style={{ width: w, height: h, transformOrigin: "center bottom" }}
      animate={active
        ? { rotate: [-4, 4, -4] }
        : { rotate: [-1.8, 1.8, -1.8] }
      }
      transition={{
        repeat: Infinity,
        duration: active ? 0.85 : 4.2,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 90 160" width={w} height={h} style={{ overflow: "visible" }}>

        {/* ── Feet ── */}
        <ellipse cx="29" cy="152" rx="12" ry="6" fill="#7a4a6b"/>
        <ellipse cx="61" cy="152" rx="12" ry="6" fill="#7a4a6b"/>
        {/* shoe sheen */}
        <ellipse cx="26" cy="149" rx="5" ry="2.5" fill="white" opacity="0.18"/>
        <ellipse cx="58" cy="149" rx="5" ry="2.5" fill="white" opacity="0.18"/>

        {/* ── Legs ── */}
        <path d="M35 120 Q31 133 29 148" stroke="#6cbf60" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <path d="M55 120 Q59 133 61 148" stroke="#6cbf60" strokeWidth="4.5" strokeLinecap="round" fill="none"/>

        {/* ── Pot body (trapezoid) ── */}
        <path d="M21 100 L17 120 L73 120 L69 100 Z" fill="#d4804e"/>
        {/* Pot shadow side */}
        <path d="M17 120 L21 100 L27 100 L23 120 Z" fill="#b86838" opacity="0.5"/>
        <path d="M69 100 L73 120 L67 120 L63 100 Z" fill="#b86838" opacity="0.35"/>
        {/* Pot band detail */}
        <line x1="18" y1="110" x2="72" y2="110" stroke="#b86838" strokeWidth="1.8" strokeLinecap="round"/>

        {/* ── Pot rim ── */}
        <rect x="17" y="93" width="56" height="8.5" rx="4.25" fill="#e29060"/>
        <rect x="17" y="93" width="56" height="4" rx="4.25" fill="#eaa878" opacity="0.6"/>

        {/* ── Plant body inside pot ── */}
        <ellipse cx="45" cy="85" rx="18" ry="20" fill="#52a846"/>
        {/* Leaf body vein details */}
        <path d="M45 66 L45 98" stroke="#3a7a35" strokeWidth="1.8" fill="none"/>
        <path d="M42 70 Q32 79 39 89" stroke="#3a7a35" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        <path d="M48 70 Q58 79 51 89" stroke="#3a7a35" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        <path d="M40 75 Q28 83 36 93" stroke="#3a7a35" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        <path d="M50 75 Q62 83 54 93" stroke="#3a7a35" strokeWidth="0.9" fill="none" strokeLinecap="round"/>

        {/* ── Left arm (gentle counter-sway) ── */}
        <motion.g
          style={{ transformOrigin: "28px 78px" }}
          animate={active
            ? { rotate: [10, -20, 10] }
            : { rotate: [0, 12, -4, 8, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: active ? 0.85 : 4.0,
            ease: "easeInOut",
            delay: 0.1,
          }}
        >
          <path d="M28 78 Q14 85 6 98" stroke="#6cbf60" strokeWidth="4.2" strokeLinecap="round" fill="none"/>
          {/* Palm */}
          <circle cx="6" cy="98" r="4" fill="#6cbf60"/>
          {/* Fingers */}
          <path d="M4 94 Q0 88 2 85" stroke="#6cbf60" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M7 93 Q5 86 8 83" stroke="#6cbf60" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M10 94 Q11 87 14 85" stroke="#6cbf60" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M3 97 Q-1 93 0 90" stroke="#6cbf60" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </motion.g>

        {/* ── Right arm (waving!) ── */}
        <motion.g
          style={{ transformOrigin: "62px 78px" }}
          animate={active
            ? { rotate: [-50, -15, -50] }
            : { rotate: [0, -48, -20, -52, -8, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: active ? 0.65 : 2.2,
            ease: "easeInOut",
          }}
        >
          <path d="M62 78 Q74 68 80 55" stroke="#6cbf60" strokeWidth="4.2" strokeLinecap="round" fill="none"/>
          {/* Palm */}
          <circle cx="80" cy="55" r="4" fill="#6cbf60"/>
          {/* Fingers (fanned for waving) */}
          <path d="M78 51 Q74 44 76 41" stroke="#6cbf60" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M81 50 Q79 43 83 40" stroke="#6cbf60" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M83 52 Q85 45 88 43" stroke="#6cbf60" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M76 54 Q72 50 72 46" stroke="#6cbf60" strokeWidth="2" strokeLinecap="round" fill="none"/>
          {/* Small flower in right hand */}
          <g transform="translate(86, 39)">
            {[0, 72, 144, 216, 288].map(a => (
              <ellipse key={a} cx="0" cy="-5" rx="3" ry="5.5"
                fill="#9b6dbf" transform={`rotate(${a})`} />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#c490e8"/>
            <circle cx="0" cy="0" r="1.8" fill="#d8b0f0"/>
          </g>
        </motion.g>

        {/* ── HEAD GROUP (counter-rotation for pendulum physics) ── */}
        <motion.g
          style={{ transformOrigin: "45px 42px" }}
          animate={active
            ? { rotate: [3.5, -3.5, 3.5] }
            : { rotate: [1.2, -1.2, 1.2] }
          }
          transition={{
            repeat: Infinity,
            duration: active ? 0.85 : 4.2,
            ease: "easeInOut",
          }}
        >
          {/* Ear leaves */}
          <path d="M20 50 Q4 30 17 14 Q27 26 23 50 Z" fill="#4d9f43"/>
          <path d="M20 50 Q8 32 17 18 Q24 28 22 50 Z" fill="#68c25a" opacity="0.5"/>
          <path d="M70 50 Q86 30 73 14 Q63 26 67 50 Z" fill="#4d9f43"/>
          <path d="M70 50 Q82 32 73 18 Q66 28 68 50 Z" fill="#68c25a" opacity="0.5"/>

          {/* Head circle */}
          <circle cx="45" cy="42" r="28" fill="#6cbf60"/>
          {/* Head sheen */}
          <circle cx="34" cy="30" r="11" fill="white" opacity="0.07"/>

          {/* Spots on head (like reference) */}
          <circle cx="37" cy="36" r="2.8" fill="#52aa44" opacity="0.5"/>
          <circle cx="54" cy="31" r="2.2" fill="#52aa44" opacity="0.5"/>
          <circle cx="50" cy="54" r="1.8" fill="#52aa44" opacity="0.5"/>
          <circle cx="31" cy="50" r="1.4" fill="#52aa44" opacity="0.5"/>

          {/* Antennas */}
          <path d="M37 16 Q34 8 31 3" stroke="#90d482" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <circle cx="31" cy="2.5" r="3.5" fill="#f5d44a"/>
          <circle cx="31" cy="2.5" r="1.8" fill="#f0c830"/>
          <path d="M53 16 Q56 8 59 3" stroke="#90d482" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <circle cx="59" cy="2.5" r="3.5" fill="#f5d44a"/>
          <circle cx="59" cy="2.5" r="1.8" fill="#f0c830"/>

          {/* Flower on head (swaying independently) */}
          <g transform="translate(55, 17)">
            <motion.g
              style={{ transformOrigin: "0px 0px" }}
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >
              {[0, 60, 120, 180, 240, 300].map(a => (
                <ellipse key={a} cx="0" cy="-7" rx="4.5" ry="7.5"
                  fill="#e8706a" transform={`rotate(${a})`} />
              ))}
              {/* Petal highlights */}
              {[0, 60, 120, 180, 240, 300].map(a => (
                <ellipse key={`h${a}`} cx="0.8" cy="-8" rx="1.8" ry="3"
                  fill="#f09090" transform={`rotate(${a})`} opacity="0.5" />
              ))}
              <circle cx="0" cy="0" r="5.5" fill="#f5c540"/>
              <circle cx="0" cy="0" r="3.5" fill="#e8a820"/>
              <circle cx="-1" cy="-1" r="1.5" fill="#fad060" opacity="0.6"/>
            </motion.g>
          </g>

          {/* ── Eyes (most important part!) ── */}
          {/* Left eye — golden ring, dark iris, white shine */}
          <circle cx="33" cy="43" r="10" fill="#f5c540"/>
          <circle cx="33" cy="43" r="10" fill="white" opacity="0.15"/>
          <circle cx="33" cy="43" r="7.5" fill="#1a1020"/>
          {blink ? (
            <rect x="23.5" y="41" width="19" height="4.5" rx="2.25" fill="#6cbf60"/>
          ) : (
            <>
              <circle cx="36" cy="39.5" r="3.5" fill="white"/>
              <circle cx="31" cy="46" r="1.4" fill="white" opacity="0.45"/>
            </>
          )}

          {/* Right eye */}
          <circle cx="57" cy="43" r="10" fill="#f5c540"/>
          <circle cx="57" cy="43" r="10" fill="white" opacity="0.15"/>
          <circle cx="57" cy="43" r="7.5" fill="#1a1020"/>
          {blink ? (
            <rect x="47.5" y="41" width="19" height="4.5" rx="2.25" fill="#6cbf60"/>
          ) : (
            <>
              <circle cx="60" cy="39.5" r="3.5" fill="white"/>
              <circle cx="55" cy="46" r="1.4" fill="white" opacity="0.45"/>
            </>
          )}

          {/* Blush cheeks */}
          <ellipse cx="22" cy="52" rx="5" ry="3" fill="#f59898" opacity="0.28"/>
          <ellipse cx="68" cy="52" rx="5" ry="3" fill="#f59898" opacity="0.28"/>

          {/* Smile */}
          {active ? (
            <path d="M30 57 Q45 68 60 57" stroke="#1a1020" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          ) : (
            <path d="M32 57 Q45 65 58 57" stroke="#1a1020" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          )}
        </motion.g>

        {/* Excited sparkles */}
        {active && (
          <>
            <motion.circle cx="10" cy="55" r="3.5" fill="#f5c540"
              animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.72, delay: 0 }}
            />
            <motion.circle cx="16" cy="38" r="2.5" fill="#7be37a"
              animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.72, delay: 0.22 }}
            />
            <motion.circle cx="80" cy="28" r="3" fill="#f5c540"
              animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.72, delay: 0.44 }}
            />
            <motion.circle cx="74" cy="48" r="2" fill="#f59898"
              animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.72, delay: 0.33 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────── Main widget ── */
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

  useEffect(() => {
    if (hoveredProduct) setManualOpen(false);
  }, [hoveredProduct]);

  // Gentle wander when idle
  useEffect(() => {
    if (hoveredProduct || manualOpen) {
      setWander({ x: 0, y: 0 });
      if (wanderRef.current) clearTimeout(wanderRef.current);
      return;
    }
    function drift() {
      setWander({ x: (Math.random() - 0.5) * 22, y: (Math.random() - 0.5) * 14 });
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
            <div className="flex items-center justify-between px-3.5 py-2" style={{ background: "var(--green-house)" }}>
              <div className="flex items-center gap-2.5">
                <div className="flex items-end justify-center overflow-hidden rounded-full" style={{ width: 34, height: 34, background: "rgba(255,255,255,0.10)" }}>
                  <PlantCharacter active={!!hoveredProduct} size={26} />
                </div>
                <span className="text-xs font-bold" style={{ color: "#fff", letterSpacing: "0.04em" }}>Bio Advisor</span>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot />
                <button onClick={() => setManualOpen(false)} aria-label="Close"
                  className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity" style={{ color: "#fff" }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 pt-3.5 pb-4" style={{ background: "#fff" }}>
              {title && (
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--green-accent)" }}>{title}</p>
              )}
              <p className="text-[13px] leading-relaxed min-h-[48px]" style={{ color: "var(--text-black)", fontWeight: 500 }}>
                {typed}
                {typed.length < rawMsg.length && (
                  <span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle animate-pulse" style={{ background: "var(--green-accent)" }} />
                )}
              </p>
              {handle && typed.length === rawMsg.length && rawMsg.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease }}
                  className="mt-3 pt-3" style={{ borderTop: "1px solid var(--ceramic)" }}>
                  <Link href={`/products/${handle}`}
                    className="flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
                    style={{ color: "var(--green-bio)" }}>
                    View full details <ArrowRight size={12} />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Avatar button — character peeks out ── */}
      <motion.div
        animate={hoveredProduct || manualOpen ? { x: 0, y: 0 } : { x: wander.x, y: wander.y }}
        transition={{ type: "spring", stiffness: 38, damping: 16 }}
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setManualOpen(v => !v)}
          aria-label="Bio Advisor"
          className="relative flex items-end justify-center rounded-full overflow-hidden"
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
          {/* Character sits at bottom of circle, head visible */}
          <div style={{ marginBottom: -2 }}>
            <PlantCharacter active={!!hoveredProduct} size={52} />
          </div>

          {/* Pulse ring */}
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
