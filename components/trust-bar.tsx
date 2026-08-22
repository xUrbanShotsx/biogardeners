"use client";

import { Truck, RotateCcw, ShieldCheck, Leaf, Star, Clock } from "lucide-react";

const ITEMS = [
  { Icon: Star,        text: "4.9★ — 380+ verified reviews" },
  { Icon: Truck,       text: "$17.95 flat rate · Australia wide" },
  { Icon: RotateCcw,   text: "30-day money-back guarantee" },
  { Icon: Leaf,        text: "100% Australian made" },
  { Icon: ShieldCheck, text: "SSL encrypted checkout" },
  { Icon: Clock,       text: "Visible results in 10 days" },
];

// Duplicate for seamless infinite loop
const DOUBLED = [...ITEMS, ...ITEMS];

export function TrustBar() {
  return (
    <div
      className="overflow-hidden"
      style={{ background: "var(--green-accent)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      aria-label="Trust signals"
    >
      <div
        className="flex items-center"
        style={{
          animation:  "ticker-scroll 28s linear infinite",
          width:      "max-content",
          willChange: "transform",
        }}
      >
        {DOUBLED.map(({ Icon, text }, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 py-3 px-8 shrink-0"
            style={{ whiteSpace: "nowrap" }}
          >
            <Icon size={13} style={{ color: "rgba(255,255,255,0.65)", flexShrink: 0 }} aria-hidden="true" />
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>{text}</span>
            <span
              className="ml-5 w-1 h-1 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.22)", display: "inline-block" }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="ticker-scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
