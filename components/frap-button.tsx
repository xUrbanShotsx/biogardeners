"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Send, MessageCircle, Sprout } from "lucide-react";
import { useAi, type SimpleRect } from "@/lib/ai-context";
import { AI_HOVER } from "@/lib/ai-messages";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Message     = { role: "user" | "advisor"; text: string; apiMsg?: ChatMessage };

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const PANEL_W = 304;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ─── Panel position relative to card rect ──── */
function calcPanelStyle(rect: SimpleRect | null): React.CSSProperties {
  if (!rect || typeof window === "undefined") {
    return { bottom: "104px", right: "24px" };
  }
  const vw     = window.innerWidth;
  const vh     = window.innerHeight;
  const margin = 14;
  const approxH = 640;

  // Prefer right of card, flip left if needed
  let left = rect.right + margin;
  if (left + PANEL_W > vw - 8) left = rect.left - PANEL_W - margin;
  if (left < 8) left = Math.max(8, (vw - PANEL_W) / 2);

  let top = rect.top;
  top = Math.max(8, Math.min(top, vh - approxH - 8));

  return { top, left };
}

/* ─── Typewriter ─────────────────────────────── */
function useTypewriter(text: string, speed = 16) {
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
    frameRef.current = setTimeout(tick, 120);
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


/* ═══════════════════════════════════════════════
   MAIN WIDGET
   ═══════════════════════════════════════════════ */
export function FrapButton() {
  const { hoveredProduct, hoveredRect } = useAi();
  const isMobile = useIsMobile();

  const [open, setOpen]             = useState(false);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [wander, setWander]         = useState({ x: 0, y: 0 });
  const [dynamicHover, setDynamicHover]     = useState("");
  // Latched product — persists after hover-off; cleared only by X or new hover while in chat
  const [latchedProduct, setLatchedProduct] = useState<{ handle: string; title: string } | null>(null);
  // Product context pinned inside chat (brief stays visible while messaging)
  const [productContext, setProductContext] = useState<{ handle: string; title: string; brief: string } | null>(null);
  // Rect captured at hover time — used to position the panel
  const [panelRect, setPanelRect] = useState<SimpleRect | null>(null);

  const wanderRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverReqRef = useRef<AbortController | null>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);

  function closeAll() {
    setOpen(false);
    setMessages([]);
    setLatchedProduct(null);
    setProductContext(null);
    setDynamicHover("");
    setPanelRect(null);
  }

  /* Wander when idle */
  useEffect(() => {
    if (open || latchedProduct) {
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
  }, [open, latchedProduct]);

  /* Fetch dynamic tip from Grok */
  const fetchHoverTip = useCallback(async (handle: string, title: string) => {
    setDynamicHover(AI_HOVER[handle] ?? "");
    if (hoverReqRef.current) hoverReqRef.current.abort();
    const ctrl = new AbortController();
    hoverReqRef.current = ctrl;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Give me a 1-2 sentence expert insight about "${title}" — what makes it special and one key usage tip for Australian gardens. Be specific, warm, and concise.`,
        }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      if (data.answer) setDynamicHover(data.answer);
    } catch { /* keep static */ }
  }, []);

  /* Latch product on hover — ignore hover-off (product goes null) */
  useEffect(() => {
    if (!hoveredProduct || open) return;
    const isNew = hoveredProduct.handle !== latchedProduct?.handle;
    if (isNew) {
      setLatchedProduct(hoveredProduct);
      setPanelRect(hoveredRect);
      fetchHoverTip(hoveredProduct.handle, hoveredProduct.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredProduct?.handle]);

  /* When chat opens from a latched product, pin context + clear hover state */
  function openChatWithContext() {
    if (latchedProduct) {
      setProductContext({ ...latchedProduct, brief: dynamicHover || AI_HOVER[latchedProduct.handle] || "" });
    }
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 150);
  }

  /* Focus input when chat opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  /* Lock body scroll when mobile fullscreen is open */
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMobile, open]);

  /* Scroll to bottom on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput("");

    const newUserMsg: Message = { role: "user", text: q, apiMsg: { role: "user", content: q } };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // Seed history with product context if this is the first message
      const baseHistory: ChatMessage[] = productContext && messages.length === 0
        ? [
            { role: "user",      content: `Tell me about ${productContext.title}` },
            { role: "assistant", content: productContext.brief },
          ]
        : [];
      const history: ChatMessage[] = [
        ...baseHistory,
        ...messages.filter(m => m.apiMsg).map(m => m.apiMsg as ChatMessage),
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data   = await res.json();
      const answer = data.answer ?? "Sorry, I couldn't get an answer right now.";
      setMessages(prev => [...prev, {
        role: "advisor",
        text: answer,
        apiMsg: { role: "assistant", content: answer },
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "advisor", text: "Something went wrong — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  /* Display values for hover-tip mode */
  const hoverHandle = latchedProduct?.handle ?? "";
  const hoverTitle  = latchedProduct?.title  ?? "";
  const hoverMsg    = dynamicHover || AI_HOVER[hoverHandle] || "";
  const typedHover  = useTypewriter(open ? "" : hoverMsg);

  const showPanel  = open || !!latchedProduct;
  const panelStyle = (isMobile && open)
    ? { inset: 0, width: "100%", height: "100dvh", borderRadius: 0, maxHeight: "100dvh" }
    : open
      ? { ...calcPanelStyle(null), height: "calc(100vh - 140px)", maxHeight: "calc(100vh - 140px)" }
      : { ...calcPanelStyle(panelRect), maxHeight: "calc(100vh - 140px)" };

  return (
    <>
      {/* ── Floating panel (positioned near card or above avatar) ── */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            key="panel"
            initial={isMobile && open ? { y: "100%" } : { opacity: 0, scale: 0.94, y: 10 }}
            animate={isMobile && open ? { y: 0 }      : { opacity: 1, scale: 1,    y: 0  }}
            exit={   isMobile && open ? { y: "100%" } : { opacity: 0, scale: 0.96, y: 6  }}
            transition={isMobile && open
              ? { duration: 0.32, ease: [0.32, 0.72, 0, 1] }
              : { duration: 0.22, ease }}
            className="fixed z-[199] flex flex-col overflow-hidden"
            style={{
              width: isMobile && open ? undefined : PANEL_W,
              borderRadius: isMobile && open ? 0 : 16,
              boxShadow: isMobile && open
                ? "none"
                : "0 16px 56px rgba(0,0,0,0.22), 0 2px 10px rgba(0,0,0,0.10)",
              ...panelStyle,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between flex-shrink-0"
              style={{
                background: "var(--green-accent)",
                padding: isMobile && open
                  ? "calc(env(safe-area-inset-top, 0px) + 14px) 20px 14px"
                  : "10px 14px",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: isMobile && open ? 38 : 30,
                    height: isMobile && open ? 38 : 30,
                    background: "rgba(255,255,255,0.15)",
                  }}>
                  <Sprout size={isMobile && open ? 20 : 15} color="#fff" />
                </div>
                <div>
                  <p className={`font-bold leading-none ${isMobile && open ? "text-base" : "text-xs"}`} style={{ color: "#fff" }}>Bio Advisor</p>
                  <p className="text-[11px] leading-none mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {open ? "Ask me anything" : "Hover insight"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PulseDot />
                <button onClick={closeAll} aria-label="Close"
                  className="flex items-center justify-center rounded-full transition-opacity"
                  style={{
                    width: isMobile && open ? 36 : 24,
                    height: isMobile && open ? 36 : 24,
                    background: isMobile && open ? "rgba(255,255,255,0.18)" : "transparent",
                    color: "#fff",
                    opacity: isMobile && open ? 1 : 0.7,
                  }}>
                  <X size={isMobile && open ? 18 : 14} />
                </button>
              </div>
            </div>

            {/* Product context strip — pinned in chat mode */}
            {open && productContext && (
              <div className="px-4 py-2.5 flex-shrink-0" style={{ background: "#f0f7f4", borderBottom: "1px solid #d4e8df" }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.07em] mb-1" style={{ color: "var(--green-accent)" }}>
                  {productContext.title}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-black)", fontWeight: 500 }}>
                  {productContext.brief}
                </p>
                <Link href={`/products/${productContext.handle}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold mt-1.5 hover:underline"
                  style={{ color: "var(--green-bio)" }}>
                  View product <ArrowRight size={10} />
                </Link>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5"
              style={{ background: "#fff", minHeight: 80 }}>

              {/* Hover-tip mode */}
              {!open && latchedProduct && (
                <div>
                  {hoverTitle && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.07em] mb-1.5"
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
                    <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid var(--ceramic)" }}>
                      <Link href={`/products/${hoverHandle}`}
                        className="flex items-center gap-1.5 text-xs font-bold hover:underline mb-2"
                        style={{ color: "var(--green-bio)" }}>
                        View full details <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Chat empty state */}
              {messages.length === 0 && open && !productContext && (
                <p className="text-[13px]" style={{ color: "#999" }}>
                  Ask me about soil health, fertilisers, plant care, or anything growing-related!
                </p>
              )}
              {messages.length === 0 && open && productContext && (
                <p className="text-[13px]" style={{ color: "#999" }}>
                  Ask me anything about {productContext.title} or any other gardening question!
                </p>
              )}

              {/* Chat messages */}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="text-[13px] leading-relaxed rounded-xl px-3 py-2 max-w-[88%]"
                    style={m.role === "user"
                      ? { background: "var(--green-accent)", color: "#fff", fontWeight: 500 }
                      : { background: "#f3f4f3", color: "var(--text-black)", fontWeight: 500 }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
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

            {/* Input — shown in chat mode; in hover mode shows "Ask a question" button */}
            {open ? (
              <form onSubmit={sendMessage}
                className="flex-shrink-0"
                style={{
                  background: "#f9faf9",
                  borderTop: "1px solid #e8ece8",
                  padding: isMobile
                    ? `12px 16px max(16px, env(safe-area-inset-bottom, 16px))`
                    : "10px 12px",
                }}>
                <div className="flex items-center gap-2"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #d0d9d5",
                    borderRadius: 999,
                    padding: isMobile ? "10px 10px 10px 16px" : "6px 6px 6px 12px",
                  }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about plants or soil…"
                    disabled={loading}
                    className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                    style={{ color: "var(--text-black)", fontSize: 16 }}
                  />
                  <button type="submit" disabled={!input.trim() || loading}
                    className="rounded-full flex-shrink-0 flex items-center justify-center transition-opacity disabled:opacity-30"
                    style={{
                      background: "var(--green-accent)",
                      color: "#fff",
                      width: isMobile ? 40 : 28,
                      height: isMobile ? 40 : 28,
                    }}>
                    <Send size={isMobile ? 16 : 13} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="px-3 py-2.5 flex-shrink-0" style={{ background: "#f9faf9", borderTop: "1px solid #e8ece8" }}>
                <button
                  onClick={openChatWithContext}
                  className="w-full flex items-center justify-center gap-2 rounded-full py-2 text-[13px] font-semibold transition-all hover:brightness-110"
                  style={{ background: "var(--green-accent)", color: "#fff" }}
                >
                  <MessageCircle size={13} />
                  Ask a question
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Avatar — hidden on mobile when fullscreen panel is open ── */}
      <div className="fixed bottom-6 right-6 z-[200]"
        style={{ display: isMobile && open ? "none" : undefined }}>
        <motion.div
          animate={open || latchedProduct ? { x: 0, y: 0 } : { x: wander.x, y: wander.y }}
          transition={{ type: "spring", stiffness: 38, damping: 16 }}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, ease }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => {
              if (open) { closeAll(); }
              else { openChatWithContext(); }
            }}
            aria-label="Bio Advisor"
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 56, height: 56,
              background: "var(--green-accent)",
              boxShadow: (open || latchedProduct)
                ? "0 0 0 4px rgba(0,171,85,0.28), 0 8px 24px rgba(0,0,0,0.24)"
                : "0 4px 18px rgba(0,0,0,0.26)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <Sprout size={26} color="#fff" />
            {latchedProduct && !open && (
              <span className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "var(--green-accent)", opacity: 0.18 }} />
            )}
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-ping, .animate-pulse { animation: none !important; }
        }
        /* 16px prevents iOS auto-zoom on focus — must be CSS, not JS, to apply before first paint */
        .bio-advisor-input { font-size: 16px; }
        @media (min-width: 768px) {
          .bio-advisor-input { font-size: 13px; }
        }
      `}</style>
    </>
  );
}
