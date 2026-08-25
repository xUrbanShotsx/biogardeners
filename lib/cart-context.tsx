"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from "react";

export interface CartItem {
  id:       string;
  handle:   string;
  title:    string;
  variant:  string;
  price:    number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextValue {
  items:          CartItem[];
  count:          number;
  subtotal:       number;
  isOpen:         boolean;
  isFullscreen:   boolean;
  openCart:       () => void;
  closeCart:      () => void;
  expandCart:     () => void;
  collapseCart:   () => void;
  addItem:        (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem:     (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart:      () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,        setItems]        = useState<CartItem[]>([]);
  const [isOpen,       setIsOpen]       = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hydrated,     setHydrated]     = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bg-cart-v1");
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("bg-cart-v1", JSON.stringify(items)); } catch { /* ignore */ }
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = (isOpen || isFullscreen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, isFullscreen]);

  const count    = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  const addItem = useCallback((raw: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === raw.id);
      if (existing) {
        return prev.map(i =>
          i.id === raw.id ? { ...i, quantity: i.quantity + (raw.quantity ?? 1) } : i
        );
      }
      return [...prev, { ...raw, quantity: raw.quantity ?? 1 }];
    });
    setIsFullscreen(false);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) =>
    setItems(prev => prev.filter(i => i.id !== id)), []);

  const updateQuantity = useCallback((id: string, qty: number) =>
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
    ), []);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{
      items, count, subtotal, isOpen, isFullscreen,
      openCart:     () => { setIsFullscreen(false); setIsOpen(true); },
      closeCart:    () => { setIsOpen(false); setIsFullscreen(false); },
      expandCart:   () => { setIsOpen(false); setIsFullscreen(true); },
      collapseCart: () => { setIsFullscreen(false); setIsOpen(true); },
      addItem, removeItem, updateQuantity, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
