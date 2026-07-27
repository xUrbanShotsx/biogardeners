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

/* ─── Demo products (used when Shopify is not yet connected) ─── */
export const DEMO_PRODUCTS = [
  {
    id:          "demo-1",
    handle:      "bio-bloom-fertiliser",
    title:       "Bio Bloom Fertiliser",
    description: "A precision-balanced NPK formula designed for flowering plants, vegetables, and herbs. Our Bio Bloom blend delivers slow-release nitrogen with fast-acting phosphorus for visible results in 7–10 days.",
    tags:        ["Bestseller", "Flowering"],
    priceRange:  { minVariantPrice: { amount: "34.95", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [{ node: { id: "variant-1", title: "1kg", price: { amount: "34.95" } } }] },
  },
  {
    id:          "demo-2",
    handle:      "terra-pro-soil-mix",
    title:       "Terra Pro Soil Mix",
    description: "Our premium potting mix engineered with volcanic basalt, coconut coir, and composted pine bark. Optimised pH 6.2–6.8. Exceptional drainage and aeration for root systems that thrive.",
    tags:        ["New", "Soil"],
    priceRange:  { minVariantPrice: { amount: "28.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [{ node: { id: "variant-2", title: "10L", price: { amount: "28.00" } } }] },
  },
  {
    id:          "demo-3",
    handle:      "deep-root-tonic",
    title:       "Deep Root Tonic",
    description: "Mycorrhizal fungi concentrate combined with humic acid and seaweed extract. Supports aggressive root expansion and nutrient uptake — the foundation of every high-performing garden.",
    tags:        ["Popular", "Root Care"],
    priceRange:  { minVariantPrice: { amount: "42.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [{ node: { id: "variant-3", title: "500ml", price: { amount: "42.00" } } }] },
  },
  {
    id:          "demo-4",
    handle:      "season-starter-kit",
    title:       "Season Starter Kit",
    description: "Everything to kickstart a productive garden season. Includes Bio Bloom Fertiliser, Terra Pro Soil Mix, and Deep Root Tonic — the complete BioGardeners foundation system.",
    tags:        ["Bundle", "Value"],
    priceRange:  { minVariantPrice: { amount: "89.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [{ node: { id: "variant-4", title: "Bundle", price: { amount: "89.00" } } }] },
  },
] satisfies ShopifyProduct[];
