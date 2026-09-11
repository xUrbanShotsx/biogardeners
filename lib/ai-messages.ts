// Static fallback messages used before the AI response loads.
// Keep accurate — these are the first thing customers read.

export const AI_HOVER: Record<string, string> = {
  "gp-fertiliser-premium-garden-lawn":
    "Our most versatile product — 30g per m² every 6–8 weeks covers most gardens. Pairs brilliantly with Penetrator if your soil is at all compacted.",
  "lawn-fertilizer-premium-granulated-concentrated":
    "One application every 12 weeks is all your lawn needs. Apply after mowing and water in well — concentrated formula so a bag goes further than you'd expect.",
  "volcanic-dust-trace-elements":
    "Most Australian soils are starved of trace minerals. Broadcast 100–200g per m² once or twice a year and it quietly does more for long-term plant health than most fertilisers.",
  "soil-health-conditioner-powder":
    "Healthy soil biology is what converts fertiliser into plant food. Mix 50g per litre and drench the root zone every 4–6 weeks — especially useful in veg patches.",
  "liquid-npk-fertilizer":
    "Fast results — dilute 10ml per litre and you'll see a visible response within a few days, either as a soil drench or foliar spray. Morning or evening application only.",
  "glacial-milk":
    "High silica content from glacial rock flour that physically strengthens plant cells — more frost-resistant, harder for insects to penetrate. Mix 50g per 9L and apply monthly.",
  "soil-health-conditioner":
    "Liquid microbial blend that gets soil biology working again. 50ml per 9L watering can every 4–6 weeks. Often the missing piece when plants aren't responding to fertiliser.",
  "plant-spray":
    "Selenium-based spray that handles aphids, whitefly, spider mites, and powdery mildew without toxic chemicals. Always spray top and underside of leaves, morning or evening.",
  "penetrator":
    "Apply this first before anything else — 10ml per litre and it opens the soil profile so water and nutrients actually reach the roots instead of running off.",
};

export const AI_CART: Record<string, { compliment: string; tip: string }> = {
  "gp-fertiliser-premium-garden-lawn": {
    compliment: "Good choice — this is the one most of our customers come back for.",
    tip:        "Sprinkle 30g per m² around the drip line of plants (not the stem), water it in well, and you'll see stronger colour within 2 weeks.",
  },
  "lawn-fertilizer-premium-granulated-concentrated": {
    compliment: "Your lawn's going to love this — it's a proper slow-release, not a quick hit.",
    tip:        "Apply 30g per m² after your next mow, water it in thoroughly, and one application will feed for up to 12 weeks.",
  },
  "volcanic-dust-trace-elements": {
    compliment: "This is one of the most underrated things you can do for Australian soil.",
    tip:        "Broadcast 100–200g per m² over your garden beds and water in — or mix it into potting mix at about 10% by volume for a long-term mineral base.",
  },
  "soil-health-conditioner-powder": {
    compliment: "Smart move — soil biology is where it all starts.",
    tip:        "Mix 50g per litre of water and drench around your root zones every 4–6 weeks. Works best applied to moist soil in the morning.",
  },
  "liquid-npk-fertilizer": {
    compliment: "This one works fast — you'll notice a difference within days.",
    tip:        "Dilute 10ml per litre and apply as a soil drench or foliar spray (morning or evening only). Fortnightly during active growth is the sweet spot.",
  },
  "glacial-milk": {
    compliment: "Good find — this one's doing quiet work that most people don't notice until they're not doing it.",
    tip:        "Mix 50g per 9L watering can and apply to soil monthly. If you're starting seeds, mix a tablespoon into each litre of seed-raising mix.",
  },
  "soil-health-conditioner": {
    compliment: "If plants aren't responding to fertiliser, this is usually the reason — the biology isn't there to process it.",
    tip:        "Dilute 50ml per 9L watering can and apply to moist soil every 4–6 weeks. For pots, 25ml per 9L every couple of months keeps potting mix alive.",
  },
  "plant-spray": {
    compliment: "Good thinking — easier to prevent than to fix once an infestation takes hold.",
    tip:        "Spray top AND underside of leaves in the early morning or evening. For active pests, every 3–5 days for 3 rounds usually clears it.",
  },
  "penetrator": {
    compliment: "This changes everything if your soil is at all hydrophobic — and most Australian soil is.",
    tip:        "Mix 10ml per litre and apply it first, before any watering or fertilising. That's the key — it opens the soil profile so everything else actually reaches the roots.",
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
