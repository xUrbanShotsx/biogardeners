"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { AI_CART } from "@/lib/ai-messages";

interface AiCartMessage {
  compliment: string;
  tip: string;
  handle: string;
  key: number;
}

export interface HoveredProduct {
  handle: string;
  title: string;
}

interface AiContextValue {
  cartMessage:       AiCartMessage | null;
  showCartMessage:   (handle: string, title: string, cartTitles?: string[]) => void;
  clearCartMessage:  () => void;
  hoveredProduct:    HoveredProduct | null;
  setHoveredProduct: (p: HoveredProduct | null) => void;
}

const AiContext = createContext<AiContextValue | null>(null);

export function AiProvider({ children }: { children: ReactNode }) {
  const [cartMessage,    setCartMessage]    = useState<AiCartMessage | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<HoveredProduct | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCartMessage = useCallback((handle: string, title: string, cartTitles: string[] = []) => {
    // Optimistically show static fallback immediately
    const fallback = AI_CART[handle];
    if (timerRef.current) clearTimeout(timerRef.current);
    setCartMessage({
      compliment: fallback?.compliment ?? "Great pick!",
      tip:        fallback?.tip        ?? "Follow label directions for best results.",
      handle,
      key: Date.now(),
    });
    timerRef.current = setTimeout(() => setCartMessage(null), 9000);

    // Then upgrade with Grok response
    fetch("/api/ai/cart-tip", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ handle, title, cartTitles }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.compliment && data.tip) {
          setCartMessage(prev =>
            prev && prev.handle === handle
              ? { ...prev, compliment: data.compliment, tip: data.tip }
              : prev
          );
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const clearCartMessage = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCartMessage(null);
  }, []);

  return (
    <AiContext.Provider value={{
      cartMessage, showCartMessage, clearCartMessage,
      hoveredProduct, setHoveredProduct,
    }}>
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error("useAi must be used inside AiProvider");
  return ctx;
}
