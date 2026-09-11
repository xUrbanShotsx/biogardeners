import {
  Leaf, Sun, Sprout, Snowflake, RefreshCcw,
  Shovel, Wheat, Home, Shield, Layers, Flower2,
} from "lucide-react";

export type BundleMeta = {
  icon:       React.ElementType;
  color:      string;
  tag:        string;
  blurb:      string;
  fullPrice:  number;
  includes:   { name: string; why: string }[];
  idealFor:   string[];
  useCases:   string[];
  howToUse:   { step: string; detail: string }[];
};

export function getBundleMeta(title: string): BundleMeta {
  const t = title.toLowerCase();

  if (t.includes("spring"))
    return {
      icon: Sprout, color: "#00A856", tag: "Seasonal", fullPrice: 98.00,
      blurb: "Everything your garden needs to wake up after winter. Liquid feed, granular minerals, and a wetting agent to get roots moving fast.",
      includes: [
        { name: "1L NPK Liquid Fertiliser",   why: "Fast-acting liquid feed to kickstart root activity after dormancy." },
        { name: "1L Bloom N Yield",            why: "Boosts early flowering signals and sets up strong cell structure." },
        { name: "1L EcoSpray",                 why: "Selenium-based foliar spray that builds pest resistance from the first flush of growth." },
        { name: "5kg Premium GP Fertiliser",   why: "Broad-spectrum granular base delivering 60+ minerals to the root zone." },
        { name: "1L Penetrator",               why: "Wetting agent that opens compacted soil so every product reaches the roots." },
      ],
      idealFor: ["Lawns starting to green up", "Veggie patches coming out of winter", "Garden beds with new season plantings", "Fruit trees before blossom"],
      useCases: [
        "Breaking soil dormancy after winter and triggering new root growth",
        "Setting up the mineral bank before the main growing season",
        "Protecting new soft growth from early-season pests and aphids",
        "Improving water infiltration in soils dried out over winter",
      ],
      howToUse: [
        { step: "Apply GP Fertiliser",   detail: "Spread 5kg granules evenly across your garden beds or lawn. Water in well." },
        { step: "Add Penetrator",        detail: "Mix 10ml per litre of water and drench the soil. Do this first to open the soil profile." },
        { step: "Water with NPK",        detail: "Dilute 10ml per litre and apply as a soil drench weekly for the first 4 weeks." },
        { step: "Foliar spray EcoSpray", detail: "Spray undiluted on leaves in the early morning or evening. Repeat fortnightly." },
        { step: "Bloom N Yield",         detail: "Apply every 2 weeks as a soil or foliar feed once flower buds appear." },
      ],
    };

  if (t.includes("summer"))
    return {
      icon: Sun, color: "#D4911E", tag: "Seasonal", fullPrice: 79.50,
      blurb: "Built for heat and drought. Keeps plants hydrated, productive, and pest-resistant through Australia's toughest growing months.",
      includes: [
        { name: "5kg Premium GP Fertiliser",  why: "Supplies the minerals that raise plant sugar concentration — the key to heat and drought tolerance." },
        { name: "1L EcoSpray",                why: "Provides silicon and selenium which thicken leaf cuticles and reduce water loss through transpiration." },
        { name: "1L NPK Liquid Fertiliser",   why: "Fast liquid feed to replace nutrients lost through high summer watering frequency." },
        { name: "1L Bloom N Yield",           why: "Supports fruiting and continued flowering through the stress of heat." },
      ],
      idealFor: ["Gardens in hot, dry climates", "Lawns prone to browning off", "Veggie patches growing tomatoes, cucumbers, zucchini", "Container plants that dry out quickly"],
      useCases: [
        "Protecting plants from heat stress and wilting during heatwaves",
        "Improving drought resistance without increasing watering frequency",
        "Keeping fruiting vegetables productive through extreme summer heat",
        "Preventing soil from becoming hydrophobic in dry conditions",
      ],
      howToUse: [
        { step: "Apply GP Fertiliser",  detail: "Spread early morning before temperatures rise. Water in immediately." },
        { step: "Water with NPK",       detail: "Dilute 10ml per litre and apply twice weekly during peak summer heat." },
        { step: "Foliar spray EcoSpray",detail: "Apply in early morning or evening — never in direct midday sun. Fortnightly." },
        { step: "Bloom N Yield",        detail: "Apply weekly to flowering and fruiting plants to maintain productivity under heat stress." },
      ],
    };

  if (t.includes("autumn"))
    return {
      icon: Leaf, color: "#b35c1e", tag: "Seasonal", fullPrice: 47.00,
      blurb: "Remineralise and replenish before the cold sets in. Feeds soil biology over winter so your garden hits spring with full reserves.",
      includes: [
        { name: "1L NPK Liquid Fertiliser",  why: "Delivers a final burst of balanced nutrition before plant activity slows." },
        { name: "100g Glacial Milk",         why: "Ultra-fine rock flour that feeds soil microbes over winter, building reserves for spring." },
        { name: "5kg Premium GP Fertiliser", why: "Remineralises the soil profile while microbes are still active enough to process it." },
      ],
      idealFor: ["All gardens heading into winter", "Soil that looks depleted after a long growing season", "Lawns thinning out", "Garden beds post-harvest"],
      useCases: [
        "Rebuilding the mineral bank before winter so your garden hits spring with full reserves",
        "Feeding soil biology while it's still active — microbes do the work over winter",
        "Recovering soil health after a heavy fruiting or flowering season",
        "Preparing lawn for winter dormancy without pushing soft growth",
      ],
      howToUse: [
        { step: "Apply GP Fertiliser",    detail: "Spread across garden beds and lawn. Autumn rain will work it in naturally." },
        { step: "Water in Glacial Milk",  detail: "Mix 50g per 9L watering can and apply to soil. Focus on garden beds." },
        { step: "Liquid NPK feed",        detail: "Apply every 3 weeks through autumn as a light soil drench — don't push heavy growth." },
      ],
    };

  if (t.includes("winter"))
    return {
      icon: Snowflake, color: "#4a8fa8", tag: "Seasonal", fullPrice: 42.50,
      blurb: "Low-rate maintenance feeding for cold months. Keeps soil biology alive and builds frost resistance without pushing vulnerable new growth.",
      includes: [
        { name: "1L NPK Liquid Fertiliser",    why: "Low-rate liquid feeding keeps soil biology ticking through cold months without stimulating frost-vulnerable growth." },
        { name: "1L Liquid Soil Conditioner",  why: "Feeds beneficial soil microbes that process winter-applied minerals into plant-available form." },
        { name: "100g Glacial Milk",           why: "High silica content strengthens plant cell walls — the same mechanism that prevents cell water from freezing." },
      ],
      idealFor: ["Gardens in frost-prone regions", "Evergreen plants that need winter nutrition", "Soils prone to compaction from winter rain", "Potted plants outdoors in winter"],
      useCases: [
        "Increasing plant frost resistance through higher mineral and sugar concentration",
        "Keeping soil biology alive through winter so spring establishment is faster",
        "Preventing waterlogging and compaction from heavy winter rainfall",
        "Supporting evergreen plants through the low-light months",
      ],
      howToUse: [
        { step: "Apply Glacial Milk",        detail: "Mix 50g per 9L and apply to soil monthly through winter." },
        { step: "Soil Conditioner drench",   detail: "Apply monthly — it feeds the microbes that will be critical in spring." },
        { step: "Low-rate NPK",              detail: "Quarter-strength dose every 3–4 weeks. No heavy feeding — just maintenance." },
      ],
    };

  if (t.includes("regenerative"))
    return {
      icon: RefreshCcw, color: "#007845", tag: "Treatment", fullPrice: 77.00,
      blurb: "Full soil restoration for depleted, chemically exhausted, or lifeless ground. Reintroduces biology, restocks minerals, and stabilises struggling plants.",
      includes: [
        { name: "5kg Premium GP Fertiliser",  why: "Delivers the full mineral spectrum to restock depleted soil chemistry." },
        { name: "1L NPK Liquid Fertiliser",   why: "Fast-acting nutrition to stabilise struggling plants while the soil recovers." },
        { name: "1L Liquid Soil Conditioner", why: "Reintroduces microbial diversity to dead or chemically exhausted soil." },
        { name: "1L EcoSpray",               why: "Supports weakened plants from the outside in while roots re-establish." },
      ],
      idealFor: ["Gardens that have been heavily chemically treated", "Soil that is compacted, grey, or lifeless", "Plants that are stunted, yellowing, or failing to thrive", "Post-construction fill soils", "Rented properties with neglected gardens"],
      useCases: [
        "Full soil restoration after chemical fertiliser or herbicide damage",
        "Reviving potted plants that have become root-bound or nutrient depleted",
        "Recovering gardens after drought, flood, or neglect",
        "Breaking chemical dependency — transitioning soil back to biological health",
      ],
      howToUse: [
        { step: "Penetrating drench first", detail: "If soil is hard and compacted, start with a Penetrator drench (sold separately) to open the profile before applying anything else." },
        { step: "Apply GP Fertiliser",      detail: "Spread 5kg across the affected area and water in well." },
        { step: "Soil Conditioner",         detail: "Apply 50ml per 9L watering can weekly for 4 weeks to re-establish microbial life." },
        { step: "NPK liquid feed",          detail: "Apply every 2 weeks to support plant recovery while soil biology rebuilds." },
        { step: "EcoSpray foliar",          detail: "Spray on leaves fortnightly to support the plant from the outside while roots strengthen." },
      ],
    };

  if (t.includes("planting") && !t.includes("seed"))
    return {
      icon: Shovel, color: "#00A856", tag: "Planting", fullPrice: 47.00,
      blurb: "Everything you need the day you plant. Mineralises the hole, reduces transplant shock, and connects new roots to soil biology from day one.",
      includes: [
        { name: "5kg Premium GP Fertiliser",  why: "Mixed into the planting hole, it gives roots a full mineral environment from day one." },
        { name: "1L Liquid Soil Conditioner", why: "Populates the root zone with beneficial microbes that form partnerships with new roots." },
        { name: "1L Liquid NPK Fertiliser",   why: "Gives the plant an immediate liquid feed to reduce transplant shock." },
      ],
      idealFor: ["Planting new trees and shrubs", "Establishing vegetable seedlings", "Installing native gardens", "Transplanting from pots to ground"],
      useCases: [
        "Reducing transplant shock and improving establishment survival rates",
        "Setting up the mineral environment in the planting hole before backfilling",
        "Helping new roots find beneficial microbes immediately on contact",
        "Speeding up establishment so plants reach productive size faster",
      ],
      howToUse: [
        { step: "Prepare the hole",      detail: "Dig planting hole 2× the size of the root ball." },
        { step: "Add GP Fertiliser",     detail: "Mix 100–200g of GP Fertiliser into the backfill soil before planting." },
        { step: "Drench with Conditioner", detail: "Mix 50ml Soil Conditioner per 9L water and drench the hole before placing the plant." },
        { step: "Plant and backfill",    detail: "Place the plant, backfill with the GP-enriched soil, and firm gently." },
        { step: "Water with NPK",        detail: "Dilute 10ml NPK per litre and water in thoroughly. Repeat weekly for first month." },
      ],
    };

  if (t.includes("seed"))
    return {
      icon: Wheat, color: "#D4911E", tag: "Seeds", fullPrice: 45.00,
      blurb: "Mineral-rich seed-raising support. Boosts germination rates and gives seedlings the trace elements they need before their first feed.",
      includes: [
        { name: "1L NPK Liquid Fertiliser", why: "Diluted mineral solution that soaks into germinating seeds and supports early root formation." },
        { name: "1L Bloom N Yield",         why: "Supports the early hormonal signals that trigger germination and first leaf emergence." },
        { name: "100g Glacial Milk",        why: "Mixed into seed-raising mix, it provides the full trace element profile seedlings need before first feed." },
      ],
      idealFor: ["Starting seeds indoors or in trays", "Preparing veggie patch beds before direct sowing", "Potting up seedlings", "Reviving old or slow-germinating seeds"],
      useCases: [
        "Maximising germination rates with a mineralised growing medium",
        "Supporting seedlings through their most vulnerable stage — first two weeks",
        "Building strong cell structure from the very first cell division",
        "Reducing leggy, weak seedlings by ensuring full mineral availability",
      ],
      howToUse: [
        { step: "Prepare growing mix",   detail: "Mix 1 tablespoon Glacial Milk per litre of seed-raising mix before filling trays." },
        { step: "Moisten with NPK",      detail: "Dilute 5ml NPK per litre water and use this to moisten the seed-raising mix before sowing." },
        { step: "Sow seeds",             detail: "Sow as normal and cover lightly." },
        { step: "Bloom N Yield mist",    detail: "Dilute 5ml per litre and mist seedlings once first leaves appear. Repeat weekly." },
        { step: "Transplant feed",       detail: "At transplanting, water in with full-strength NPK (10ml per litre) to reduce shock." },
      ],
    };

  if (t.includes("indoor"))
    return {
      icon: Home, color: "#00A856", tag: "Indoor", fullPrice: 72.50,
      blurb: "Keeps indoor and container plants thriving year-round. Replaces the trace elements that flush out with every watering and controls common pests without toxic sprays.",
      includes: [
        { name: "1L Liquid NPK Fertiliser",   why: "Clean, odour-free liquid feed safe for indoor use — no soil-smell or residue." },
        { name: "1L Liquid Soil Conditioner", why: "Refreshes the microbial life in potting mix that depletes over time in pots." },
        { name: "100g Glacial Milk",          why: "Provides the 60+ trace elements that commercial potting mixes lack." },
        { name: "1L EcoSpray",               why: "Controls common indoor pests (fungus gnats, spider mites, scale) without toxic chemicals." },
      ],
      idealFor: ["Indoor houseplants", "Balcony and terrace container gardens", "Office plants", "Ferns, tropicals, succulents, and pothos-type plants"],
      useCases: [
        "Reviving indoor plants that are yellowing, dropping leaves, or stagnating",
        "Replacing the trace elements that flush out of pots with every watering",
        "Controlling fungus gnats and spider mites without toxic sprays indoors",
        "Refreshing old potting mix without the cost and mess of repotting",
      ],
      howToUse: [
        { step: "Monthly NPK watering",       detail: "Replace one regular watering per month with NPK diluted at 10ml per litre." },
        { step: "Soil Conditioner refresh",   detail: "Every 2 months, apply 25ml Soil Conditioner per 9L water to reactivate potting mix biology." },
        { step: "Glacial Milk top-dress",     detail: "Sprinkle a pinch (5g) on top of pot soil monthly and water in." },
        { step: "EcoSpray for pests",         detail: "At first sign of pests, spray leaves top and bottom. Repeat every 5 days for 3 applications." },
      ],
    };

  if (t.includes("insect") || t.includes("fungus"))
    return {
      icon: Shield, color: "#007845", tag: "Protection", fullPrice: 30.00,
      blurb: "Controls aphids, whitefly, mites, and fungal disease without toxic chemicals. Safe for edibles and safe to use around kids and pets.",
      includes: [
        { name: "1L EcoSpray", why: "Selenium-rich foliar spray toxic to soft-bodied insects at the leaf surface, with anti-fungal properties from natural plant extracts." },
      ],
      idealFor: ["Plants showing aphid or whitefly infestations", "Powdery mildew on roses, cucurbits, or tomatoes", "Fungal spots on leaves", "Gardens near bush or lawn areas prone to insect pressure"],
      useCases: [
        "Controlling aphids, whitefly, spider mites, and scale insects",
        "Treating powdery mildew, downy mildew, and fungal leaf spots",
        "Building systemic resistance — selenium makes leaves harder for insects to feed on",
        "Safe for edibles — no withholding period when used as directed",
      ],
      howToUse: [
        { step: "Spray affected plants",   detail: "Apply EcoSpray directly to affected leaves, covering top and underside surfaces." },
        { step: "Time your application",   detail: "Always spray in early morning or evening — never in direct sun as this can cause leaf burn." },
        { step: "Repeat treatment",        detail: "For active infestations, repeat every 3–5 days for 3 applications. For prevention, spray fortnightly." },
        { step: "Whole-plant coverage",    detail: "Include stems and the underside of leaves where insects hide and lay eggs." },
      ],
    };

  if (t.includes("clay") || t.includes("heavy"))
    return {
      icon: Layers, color: "#7c5c3a", tag: "Soil", fullPrice: 33.50,
      blurb: "Opens compacted clay soils so water, air, and roots can actually penetrate. Penetrator first, then Conditioner — results visible in the first application.",
      includes: [
        { name: "1L Soil Health Conditioner", why: "Introduces microbial strains that break down clay particle bonds and improve soil aggregation." },
        { name: "1L Penetrator",              why: "Wetting agent that forces water through the clay profile, carrying conditioner to depth." },
      ],
      idealFor: ["Heavy clay soils that crack in summer and waterlog in winter", "Compacted lawn areas", "Garden beds where water pools after rain", "Soils that dry rock-hard between watering"],
      useCases: [
        "Opening compacted clay soils to allow water and air penetration",
        "Reducing waterlogging and improving drainage in heavy soils",
        "Creating the conditions for root growth in soils that currently repel roots",
        "Improving water infiltration so watering is more efficient",
      ],
      howToUse: [
        { step: "Apply Penetrator first",    detail: "Dilute 10ml per litre and drench the area. This opens the clay profile for what follows." },
        { step: "Follow with Conditioner",   detail: "Within 30 minutes, apply Soil Conditioner at 50ml per 9L watering can across the same area." },
        { step: "Repeat monthly",            detail: "For heavily compacted clay, repeat monthly for 3–4 months. You'll notice improved drainage within the first 2 applications." },
        { step: "Don't dig clay",            detail: "Avoid tilling or digging clay soils when wet — it destroys soil structure. Let the biology do the work." },
      ],
    };

  if (t.includes("flower"))
    return {
      icon: Flower2, color: "#c0527a", tag: "Flowering", fullPrice: 45.00,
      blurb: "More flowers, bigger blooms, longer season. Phosphorus-rich feeding paired with trace minerals to maximise bud formation and fruit set.",
      includes: [
        { name: "1L Bloom N Yield",         why: "Specifically formulated to stimulate and sustain flowering — higher in phosphorus and potassium to support bud development." },
        { name: "1L Liquid NPK Fertiliser", why: "Balanced base nutrition to keep foliage healthy while energy is directed into flowering." },
        { name: "100g Glacial Milk",        why: "Trace elements including boron and molybdenum that are critical for flower formation and fruit set." },
      ],
      idealFor: ["Roses and flowering shrubs", "Fruiting vegetables (tomatoes, capsicums, strawberries)", "Orchids and flowering tropicals", "Fruit trees at flowering time"],
      useCases: [
        "Maximising flower size, number, and duration",
        "Improving fruit set after flowering — more flowers become fruit",
        "Supporting continuous-flowering plants through the whole season",
        "Recovering plants that have stopped flowering due to nutrient deficiency",
      ],
      howToUse: [
        { step: "Apply Glacial Milk",    detail: "At the start of the season, mix 50g per 9L and water into the root zone." },
        { step: "NPK base feed",         detail: "Apply NPK at 10ml per litre fortnightly as a soil drench throughout the growing season." },
        { step: "Bloom N Yield weekly",  detail: "Once buds start forming, apply Bloom N Yield at 10ml per litre weekly. Continue until flowering finishes." },
        { step: "Foliar option",         detail: "Bloom N Yield can also be sprayed as a foliar feed — dilute to 5ml per litre and apply to leaves in the morning." },
      ],
    };

  return {
    icon: Sprout, color: "#00A856", tag: "Bundle", blurb: "", fullPrice: 0,
    includes: [], idealFor: [], useCases: [], howToUse: [],
  };
}
