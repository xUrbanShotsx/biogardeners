"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { type ShopifyProduct } from "@/lib/shopify";

export function BundleAddToCart({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    if (adding) return;
    setAdding(true);
    const variant = product.variants.edges[0]?.node;
    addItem({
      id:       variant?.id ?? product.id,
      handle:   product.handle,
      title:    product.title,
      variant:  variant?.title ?? "Default",
      price:    parseFloat(product.priceRange.minVariantPrice.amount),
      imageUrl: product.images.edges[0]?.node.url,
    });
    setTimeout(() => setAdding(false), 1800);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full flex items-center justify-center gap-1.5 rounded-full py-2 md:py-3 text-xs md:text-sm font-bold transition-all active:scale-[0.97]"
      style={{
        background: adding ? "var(--green-accent)" : "var(--green-house)",
        color: "#fff",
        boxShadow: adding ? "none" : "0 2px 12px rgba(0,0,0,0.18)",
      }}
    >
      {adding ? (
        <><Check size={15} /> Added to cart!</>
      ) : (
        <><ShoppingBag size={15} /> Add to cart</>
      )}
    </button>
  );
}
