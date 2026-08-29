/**
 * Shopify Storefront API client.
 * Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
 * in .env.local once your Shopify store is created.
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const SHOPIFY_ENDPOINT = domain
  ? `https://${domain}/api/2024-10/graphql.json`
  : null;

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SHOPIFY_ENDPOINT || !token) {
    throw new Error("Shopify environment variables not configured. See .env.local.example");
  }

  const res = await fetch(SHOPIFY_ENDPOINT, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json() as { data: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

/* ─── Types ─── */
export interface ShopifyProduct {
  id:          string;
  handle:      string;
  title:       string;
  description: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: { id: string; title: string; price: { amount: string } } }[] };
  tags: string[];
}

export interface ShopifyCart {
  id:         string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: {
        id:       string;
        quantity: number;
        merchandise: {
          id:    string;
          title: string;
          product: { title: string; handle: string };
          price: { amount: string; currencyCode: string };
        };
      };
    }[];
  };
  cost: { totalAmount: { amount: string; currencyCode: string } };
}

/* ─── Queries ─── */
const PRODUCT_FRAGMENT = `
  id handle title description tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 3) { edges { node { url altText } } }
  variants(first: 10) { edges { node { id title price { amount } } } }
`;

export async function getProducts(first = 12) {
  const query = `{
    products(first: ${first}, sortKey: CREATED_AT, reverse: true) {
      edges { node { ${PRODUCT_FRAGMENT} } }
    }
  }`;

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>(query);
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle: string) {
  const query = `{
    productByHandle(handle: "${handle}") { ${PRODUCT_FRAGMENT} }
  }`;

  const data = await shopifyFetch<{ productByHandle: ShopifyProduct }>(query);
  return data.productByHandle;
}

export async function createCart() {
  const mutation = `
    mutation { cartCreate { cart { id checkoutUrl } } }
  `;
  const data = await shopifyFetch<{ cartCreate: { cart: { id: string; checkoutUrl: string } } }>(mutation);
  return data.cartCreate.cart;
}

export async function createCartWithItems(
  lines: { variantId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id checkoutUrl
          cost { totalAmount { amount currencyCode } }
          lines(first: 100) {
            edges {
              node {
                id quantity
                merchandise {
                  ... on ProductVariant {
                    id title
                    price { amount currencyCode }
                    product { title handle }
                  }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart | null; userErrors: { field: string[]; message: string }[] }
  }>(mutation, {
    input: { lines: lines.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity })) },
  });
  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors.map(e => e.message).join(". "));
  }
  if (!data.cartCreate.cart) {
    throw new Error("Shopify did not return a cart — please try again.");
  }
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  const mutation = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl cost { totalAmount { amount currencyCode } } }
      }
    }
  `;
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(mutation, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return data.cartLinesAdd.cart;
}

/* ─── Demo products (mirrors real Shopify catalog — used as fallback) ─── */
export const DEMO_PRODUCTS = [
  {
    id:          "demo-1",
    handle:      "gp-fertiliser-premium-garden-lawn",
    title:       "GP Fertiliser Premium Garden / Lawn",
    description: "One fertiliser for your entire garden. Perfect for lawns, fruit trees, vegetables, flowers, pot plants and native plants. Made with natural volcanic minerals, meat and bone meal, and essential trace elements. 100% Australian owned and made.",
    tags:        ["Bestseller", "Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "17.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-1a", title: "5KG",  price: { amount: "17.00" } } },
      { node: { id: "v-1b", title: "12KG", price: { amount: "36.00" } } },
      { node: { id: "v-1c", title: "20KG", price: { amount: "50.00" } } },
    ]},
  },
  {
    id:          "demo-2",
    handle:      "lawn-fertilizer-premium-granulated-concentrated",
    title:       "Lawn Fertilizer Premium Granulated Concentrated",
    description: "Concentrated granulated fertiliser for lawns. Slow-release nutrients feed your lawn for months, promoting thick green growth and deep root systems. Easy to spread with no unpleasant smells.",
    tags:        ["Popular", "Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "35.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-2a", title: "1 Pack", price: { amount: "35.00" } } },
      { node: { id: "v-2b", title: "2 Pack", price: { amount: "60.00" } } },
    ]},
  },
  {
    id:          "demo-3",
    handle:      "volcanic-dust-trace-elements",
    title:       "Volcanic Dust Trace Elements",
    description: "Premium volcanic dust packed with over 60 naturally occurring trace elements and minerals. Remineralises depleted soils, improves microbial activity, and provides slow-release essential nutrients.",
    tags:        ["New", "Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "25.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-3a", title: "Standard", price: { amount: "25.00" } } },
    ]},
  },
  {
    id:          "demo-4",
    handle:      "soil-health-conditioner-powder",
    title:       "Soil Health Conditioner Powder",
    description: "Powdered soil conditioner that improves soil structure, increases microbial diversity, and enhances nutrient uptake. Ideal for all soil types and garden applications.",
    tags:        ["Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "29.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-4a", title: "Standard", price: { amount: "29.00" } } },
    ]},
  },
  {
    id:          "demo-5",
    handle:      "liquid-npk-fertilizer",
    title:       "Liquid NPK Fertilizer",
    description: "Fast-acting liquid NPK fertiliser for rapid uptake through roots and leaves. Delivers balanced nitrogen, phosphorus, and potassium for lush, vigorous growth across all plants.",
    tags:        ["Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "32.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-5a", title: "Standard", price: { amount: "32.00" } } },
    ]},
  },
  {
    id:          "demo-6",
    handle:      "plant-spray",
    title:       "Plant Spray",
    description: "Ready-to-use plant spray for disease prevention and control. Protects against fungal diseases, pests, and environmental stress. Safe for edibles when used as directed.",
    tags:        ["Disease Control"],
    priceRange:  { minVariantPrice: { amount: "22.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-6a", title: "Standard", price: { amount: "22.00" } } },
    ]},
  },
  {
    id:          "demo-7",
    handle:      "glacial-milk",
    title:       "Glacial Milk",
    description: "Ultra-fine glacial rock flour rich in silica and trace minerals. Strengthens plant cell walls, improves drought resistance, and remineralises soils for long-term fertility.",
    tags:        ["Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "28.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-7a", title: "Standard", price: { amount: "28.00" } } },
    ]},
  },
  {
    id:          "demo-8",
    handle:      "soil-health-conditioner",
    title:       "Soil Health Conditioner",
    description: "Liquid soil health conditioner that feeds beneficial soil microbes, improves water retention, and breaks up compacted soils. Works synergistically with all fertilisers.",
    tags:        ["Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "34.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-8a", title: "Standard", price: { amount: "34.00" } } },
    ]},
  },
  {
    id:          "demo-9",
    handle:      "penetrator",
    title:       "Penetrator",
    description: "Soil wetting and penetrating agent that breaks through hydrophobic soils and improves water and nutrient infiltration. A must-have for dry or compacted Australian soils.",
    tags:        ["Supplements"],
    priceRange:  { minVariantPrice: { amount: "26.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "v-9a", title: "Standard", price: { amount: "26.00" } } },
    ]},
  },
] satisfies ShopifyProduct[];
