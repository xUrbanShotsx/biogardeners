export const AI_HOVER: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":
    "Packed with volcanic minerals and organic meal — feeds soil biology and delivers visible results in 2 weeks. Our #1 seller.",
  "lawn-fertilizer-premium-granulated-concentrated":
    "Concentrated slow-release granules that keep feeding your lawn for up to 12 weeks. One bag goes a very long way.",
  "volcanic-dust-trace-elements":
    "60+ trace elements from volcanic rock — remineralises depleted Aussie soils and improves long-term plant health.",
  "soil-health-conditioner-powder":
    "Boosts soil microbial life so nutrients actually reach your roots. Great for veg patches and garden beds of all sizes.",
  "liquid-npk-fertilizer":
    "Fast-acting liquid formula with balanced NPK — plants show a visible response in days, not weeks.",
  "glacial-milk":
    "Glacial rock flour rich in silica and trace minerals — strengthens plant cell walls and improves stress resistance.",
  "soil-health-conditioner":
    "Liquid microbial blend that supercharges water retention and breaks down organic matter faster for healthier roots.",
  "plant-spray":
    "Ready-to-use spray that tackles fungal disease and pest pressure — safe around bees and edible gardens.",
  "penetrator":
    "Makes water and nutrients soak in instead of running off. Essential for hard, hydrophobic Aussie soils.",
};

export const AI_CART: Record<string, { compliment: string; tip: string }> = {
  "gp-fertiliser-premium-garden-lawn": {
    compliment: "Great pick — GP Fertiliser is our most-loved formula!",
    tip: "Sprinkle around the drip line of plants and water in well. You'll see stronger colour within 2 weeks.",
  },
  "lawn-fertilizer-premium-granulated-concentrated": {
    compliment: "Solid choice — this one transforms lawns fast.",
    tip: "Apply at 30g per m² after mowing and water in thoroughly. One treatment feeds for up to 12 weeks.",
  },
  "volcanic-dust-trace-elements": {
    compliment: "Nice pick — volcanic dust is one of our most underrated products.",
    tip: "Broadcast over soil and mulch, or mix into potting mix at 10% by volume for a long-term mineral boost.",
  },
  "soil-health-conditioner-powder": {
    compliment: "Smart move — healthy soil biology is the foundation of everything.",
    tip: "Mix 50g per litre of water and drench around root zones. Apply every 4–6 weeks for best results.",
  },
  "liquid-npk-fertilizer": {
    compliment: "You're going to love the speed on this one!",
    tip: "Dilute 5ml per litre and apply fortnightly during the growing season. Works great as a foliar spray too.",
  },
  "glacial-milk": {
    compliment: "Excellent — this one is a hidden gem in our range.",
    tip: "Mix 1 tablespoon per litre of water and apply to soil or leaves. Use monthly as a long-term soil conditioner.",
  },
  "soil-health-conditioner": {
    compliment: "Perfect — your soil will be loving life with this.",
    tip: "Dilute 10ml per litre and drench soil around plants. Works best when applied in the morning.",
  },
  "plant-spray": {
    compliment: "Wise choice — prevention is always better than cure in the garden.",
    tip: "Spray leaves until wet, top and underside. Apply weekly as prevention or every 3 days for active issues.",
  },
  "penetrator": {
    compliment: "This one changes everything if your soil is water-repellent!",
    tip: "Mix 5ml per 9 litres of water and apply before watering or fertilising for much better absorption.",
  },
};

export function cartCheckoutMessage(count: number, titles: string[]): string {
  if (count === 1) {
    return `Excellent choice! ${titles[0]} will make a real difference in your garden. You're one step away from greener days.`;
  }
  if (count === 2) {
    return `A brilliant combination! These two products work beautifully together for a complete nutrition program. Ready to check out?`;
  }
  return `You've put together a powerhouse garden kit with ${count} products. Your plants are going to thrive — excellent eye for quality.`;
}
