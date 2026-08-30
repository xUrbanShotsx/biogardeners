import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname:  "cdn.shopify.com",
        pathname:  "/**",
      },
    ],
  },
};

export default nextConfig;
