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

/* ─── Demo products (mirrors real Shopify catalog — used as fallback) ─── */
export const DEMO_PRODUCTS = [
  {
    id:          "demo-1",
    handle:      "gp-fertiliser-premium-garden-lawn",
    title:       "GP Fertiliser Premium Garden / Lawn",
    description: "One fertiliser for your entire garden. Perfect for lawns, fruit trees, vegetables, flowers, pot plants and native plants. Improves soil health, encourages strong healthy growth and delivers fast results. Made with natural volcanic minerals, meat and bone meal, essential nutrients and trace elements. 100% Australian owned and made.",
    tags:        ["Bestseller", "Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "17.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "variant-1a", title: "5KG",  price: { amount: "17.00" } } },
      { node: { id: "variant-1b", title: "12KG", price: { amount: "36.00" } } },
      { node: { id: "variant-1c", title: "20KG", price: { amount: "50.00" } } },
    ]},
  },
  {
    id:          "demo-2",
    handle:      "lawn-fertilizer-premium-granulated-concentrated",
    title:       "Lawn Fertilizer Premium Granulated Concentrated",
    description: "A concentrated granulated fertiliser formulated specifically for lawns. Slow-release nutrients feed your lawn for months, promoting thick green growth and deep root systems. Easy to spread with no unpleasant smells. 100% Australian made.",
    tags:        ["Popular", "Fertiliser"],
    priceRange:  { minVariantPrice: { amount: "35.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "variant-2a", title: "1 Pack", price: { amount: "35.00" } } },
      { node: { id: "variant-2b", title: "2 Pack", price: { amount: "60.00" } } },
    ]},
  },
  {
    id:          "demo-3",
    handle:      "volcanic-dust-trace-elements",
    title:       "Volcanic Dust Trace Elements",
    description: "Premium volcanic dust packed with over 60 naturally occurring trace elements and minerals. Remineralises depleted soils, improves microbial activity, and provides a slow-release source of essential nutrients for plants, lawns and vegetables. 100% natural and Australian made.",
    tags:        ["New", "Minerals"],
    priceRange:  { minVariantPrice: { amount: "25.00", currencyCode: "AUD" } },
    images:      { edges: [] },
    variants:    { edges: [
      { node: { id: "variant-3a", title: "Standard", price: { amount: "25.00" } } },
    ]},
  },
] satisfies ShopifyProduct[];
