"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Leaf } from "lucide-react";

const items = [
  { icon: Truck,       label: "Free shipping",       sub: "On orders over $80"         },
  { icon: RotateCcw,   label: "30-day returns",       sub: "No questions asked"         },
  { icon: ShieldCheck, label: "Secure checkout",      sub: "SSL encrypted payments"     },
  { icon: Leaf,        label: "Australian made",      sub: "100% made in Australia"     },
];

export function TrustBar() {
  return (
    <section
      style={{ borderTop: "1px solid var(--ceramic)", borderBottom: "1px solid var(--ceramic)" }}
      aria-label="Trust signals"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {items.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              className="flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--green-xlight)" }}
              >
                <Icon size={15} style={{ color: "var(--green-accent)" }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-black)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--text-black-soft)" }}>{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
