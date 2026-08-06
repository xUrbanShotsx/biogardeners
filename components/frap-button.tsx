"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Send } from "lucide-react";
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
    frameRef.current = setTimeout(tick, 180);
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
function PlantCharacter({ size = 72 }: { size?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size, flexShrink: 0 }}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
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

/* ─── Chat message type ──────────────────────── */
type Message = { role: "user" | "advisor"; text: string };

/* ═══════════════════════════════════════════════
   MAIN WIDGET
   ═══════════════════════════════════════════════ */
export function FrapButton() {
  const { hoveredProduct } = useAi();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [wander, setWander]   = useState({ x: 0, y: 0 });
  const wanderRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Wander when idle */
  useEffect(() => {
    if (open || hoveredProduct) {
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
  }, [open, hoveredProduct]);

  /* When a product is hovered, show the panel with its tip */
  const hoverHandle = hoveredProduct?.handle ?? "";
  const hoverTitle  = hoveredProduct?.title  ?? "";
  const hoverMsg    = AI_HOVER[hoverHandle] ?? "";
  const typedHover  = useTypewriter(open ? "" : hoverMsg);

  /* Scroll to bottom on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "advisor", text: data.answer ?? "Sorry, I couldn't get an answer right now." }]);
    } catch {
      setMessages(prev => [...prev, { role: "advisor", text: "Something went wrong — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  const isOpen = open || !!hoveredProduct;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">

      {/* ── Panel ──────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 8,  scale: 0.97  }}
            transition={{ duration: 0.26, ease }}
            className="w-[300px] rounded-2xl overflow-hidden flex flex-col"
            style={{
              boxShadow: "0 12px 48px rgba(0,0,0,0.20), 0 2px 8px rgba(0,0,0,0.08)",
              maxHeight: 480,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 flex-shrink-0"
              style={{ background: "var(--green-house)" }}>
              <div className="flex items-center gap-2">
                <div className="rounded-full overflow-hidden flex-shrink-0"
                  style={{ width: 32, height: 32, background: "rgba(255,255,255,0.10)" }}>
                  <PlantCharacter size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none" style={{ color: "#fff" }}>Bio Advisor</p>
                  <p className="text-[10px] leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Ask me anything about plants</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot />
                <button
                  onClick={() => { setOpen(false); setMessages([]); }}
                  aria-label="Close"
                  className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#fff" }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body — either hovered-product tip OR chat history */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5"
              style={{ background: "#fff", minHeight: 80 }}>

              {/* Product hover tip (when no chat yet) */}
              {!open && hoveredProduct && messages.length === 0 && (
                <div>
                  {hoverTitle && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5"
                      style={{ color: "var(--green-accent)" }}>{hoverTitle}</p>
                  )}
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-black)", fontWeight: 500 }}>
                    {typedHover}
                    {typedHover.length < hoverMsg.length && (
                      <span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle animate-pulse"
                        style={{ background: "var(--green-accent)" }} />
                    )}
                  </p>
                  {hoverHandle && typedHover.length === hoverMsg.length && hoverMsg.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--ceramic)" }}>
                      <Link href={`/products/${hoverHandle}`}
                        className="flex items-center gap-1.5 text-xs font-bold hover:underline"
                        style={{ color: "var(--green-bio)" }}>
                        View full details <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Chat messages */}
              {messages.length === 0 && open && (
                <p className="text-[13px]" style={{ color: "#999" }}>
                  Ask me about soil health, fertilisers, plant care, or anything growing-related!
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="text-[13px] leading-relaxed rounded-xl px-3 py-2 max-w-[88%]"
                    style={m.role === "user"
                      ? { background: "var(--green-house)", color: "#fff", fontWeight: 500 }
                      : { background: "#f3f4f3", color: "var(--text-black)", fontWeight: 500 }
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-3 py-2.5 flex gap-1" style={{ background: "#f3f4f3" }}>
                    {[0, 0.2, 0.4].map(d => (
                      <motion.span key={d} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--green-accent)" }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: d, ease: "easeInOut" }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage}
              className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
              style={{ background: "#f9faf9", borderTop: "1px solid #e8ece8" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); if (!open) setOpen(true); }}
                onFocus={() => setOpen(true)}
                placeholder="Ask about plants or soil…"
                disabled={loading}
                className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-gray-400"
                style={{ color: "var(--text-black)" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="rounded-full p-1.5 flex-shrink-0 transition-opacity disabled:opacity-30"
                style={{ background: "var(--green-house)", color: "#fff" }}
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Avatar button ───────────────────────── */}
      <motion.div
        animate={open || hoveredProduct ? { x: 0, y: 0 } : { x: wander.x, y: wander.y }}
        transition={{ type: "spring", stiffness: 38, damping: 16 }}
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setOpen(v => !v)}
          aria-label="Bio Advisor"
          className="relative flex items-center justify-center rounded-full overflow-hidden"
          style={{
            width: 72, height: 72,
            background: "#fff",
            boxShadow: (open || hoveredProduct)
              ? "0 0 0 4px rgba(0,171,85,0.28), 0 8px 24px rgba(0,0,0,0.24)"
              : "0 4px 18px rgba(0,0,0,0.26)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <PlantCharacter size={72} />
          {hoveredProduct && !open && (
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "var(--green-accent)", opacity: 0.18 }} />
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
