// Static fallback messages used before the AI response loads.
// Keep accurate — these are the first thing customers read.

export const AI_HOVER: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":
    "Our most versatile product — a go-to for most gardens. Pairs brilliantly with Penetrator if your soil is at all compacted.",
  "lawn-fertilizer-premium-granulated-concentrated":
    "Apply after mowing and water in well — a concentrated formula, so a bag goes further than you'd expect. Follow the label directions.",
  "volcanic-dust-trace-elements":
    "Most Australian soils are starved of trace minerals. Broadcast it over your beds and it quietly does more for long-term plant health than most fertilisers.",
  "soil-health-conditioner-powder":
    "Healthy soil biology is what converts fertiliser into plant food. Mix with water and drench the root zone — especially useful in veg patches.",
  "liquid-npk-fertilizer":
    "Balanced liquid NPK — dilute as directed on the label and apply as a soil drench or foliar spray. Morning or evening application only for best uptake.",
  "glacial-milk":
    "High silica content from glacial rock flour that physically strengthens plant cells — more frost-resistant, harder for insects to penetrate. Mix with water as directed on the label and apply to soil.",
  "soil-health-conditioner":
    "Liquid microbial blend that gets soil biology working again. Dilute in a watering can as directed on the label. Often the missing piece when plants aren't responding to fertiliser.",
  "plant-spray":
    "Selenium-rich foliar spray suitable for plants affected by common insects and fungal issues. Supports plant vitality and healthy foliage — spray top and underside of leaves, morning or evening.",
  "eco-spray":
    "Selenium-rich foliar spray suitable for plants affected by common insects and fungal issues. Supports plant vitality and healthy foliage — spray top and underside of leaves, morning or evening.",
  "penetrator":
    "Apply this first before anything else — dilute as directed and it opens the soil profile so water and nutrients actually reach the roots instead of running off.",
  "bloom-n-yield":
    "Sea minerals bio stimulant for flowering and fruiting plants. Rich in calcium, magnesium, potassium, and trace elements — apply as a foliar spray, stem drench, or soil drench during the growing season, following the label directions.",
};

export const AI_CART: Record<string, { compliment: string; tip: string }> = {
  "gp-fertiliser-premium-garden-lawn": {
    compliment: "Good choice — this is the one most of our customers come back for.",
    tip:        "Sprinkle around the drip line of plants (not the stem) and water it in well. Apply to moist soil, never dry, and follow the directions on the product label.",
  },
  "lawn-fertilizer-premium-granulated-concentrated": {
    compliment: "Your lawn's going to love this — it's a proper slow-release, not a quick hit.",
    tip:        "Apply after your next mow and water it in thoroughly. Follow the directions on the product label for how much to use and how often.",
  },
  "volcanic-dust-trace-elements": {
    compliment: "This is one of the most underrated things you can do for Australian soil.",
    tip:        "Broadcast it over your garden beds and water in — or mix it into potting mix for a long-term mineral base. Follow the directions on the product label.",
  },
  "soil-health-conditioner-powder": {
    compliment: "Smart move — soil biology is where it all starts.",
    tip:        "Mix with water and drench around your root zones, following the directions on the product label. Works best applied to moist soil in the morning.",
  },
  "liquid-npk-fertilizer": {
    compliment: "Good choice — one of our most versatile liquid formulas.",
    tip:        "Dilute as directed on the label and apply as a soil drench or foliar spray (morning or evening only).",
  },
  "glacial-milk": {
    compliment: "Good find — this one's doing quiet work that most people don't notice until they're not doing it.",
    tip:        "Mix with water and apply to soil, following the directions on the product label. Starting seeds? It can be mixed into seed-raising mix too.",
  },
  "soil-health-conditioner": {
    compliment: "If plants aren't responding to fertiliser, this is usually the reason — the biology isn't there to process it.",
    tip:        "Dilute in a watering can and apply to moist soil, following the directions on the product label. Great for potted plants too.",
  },
  "plant-spray": {
    compliment: "Good thinking — applying before problems take hold is always the smarter play.",
    tip:        "Spray top AND underside of leaves in the early morning or evening. For plants showing signs of pest or disease pressure, follow the directions on the product label to help restore healthy foliage.",
  },
  "eco-spray": {
    compliment: "Good thinking — applying before problems take hold is always the smarter play.",
    tip:        "Spray top AND underside of leaves in the early morning or evening. For plants showing signs of pest or disease pressure, follow the directions on the product label to help restore healthy foliage.",
  },
  "penetrator": {
    compliment: "This changes everything if your soil is at all hydrophobic — and most Australian soil is.",
    tip:        "Dilute as directed and apply it first, before any watering or fertilising. That's the key — it opens the soil profile so everything else actually reaches the roots.",
  },
  "bloom-n-yield": {
    compliment: "Great pick for getting more out of your flowering and fruiting plants.",
    tip:        "Dilute as directed on the label and apply as a foliar spray, stem drench, or soil drench. Works best in the morning or evening — sea minerals deliver calcium, magnesium, and trace elements straight to where the plant needs them.",
  },
};

export function cartCheckoutMessage(count: number, titles: string[]): string {
  if (count === 1) {
    return `${titles[0]} is a solid place to start — you're on the right track. Ready when you are.`;
  }
  if (count === 2) {
    return `Good combination — these two work well together. Your soil's going to be in much better shape.`;
  }
  if (count >= 3) {
    return `You've put together a genuinely solid program here. ${count} products covering soil, nutrition, and plant health — that's the full picture.`;
  }
  return `Looking good — your garden's in good hands.`;
}
