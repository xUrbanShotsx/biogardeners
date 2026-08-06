"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { AI_CART } from "@/lib/ai-messages";

interface AiCartMessage {
  compliment: string;
  tip: string;
  handle: string;
  key: number;
}

interface AiContextValue {
  cartMessage: AiCartMessage | null;
  showCartMessage: (handle: string) => void;
  clearCartMessage: () => void;
}

const AiContext = createContext<AiContextValue | null>(null);

export function AiProvider({ children }: { children: ReactNode }) {
  const [cartMessage, setCartMessage] = useState<AiCartMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCartMessage = useCallback((handle: string) => {
    const msgs = AI_CART[handle];
    if (!msgs) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setCartMessage({ ...msgs, handle, key: Date.now() });
    timerRef.current = setTimeout(() => setCartMessage(null), 7000);
  }, []);

  const clearCartMessage = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCartMessage(null);
  }, []);

  return (
    <AiContext.Provider value={{ cartMessage, showCartMessage, clearCartMessage }}>
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error("useAi must be used inside AiProvider");
  return ctx;
}
