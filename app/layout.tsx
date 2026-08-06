import type { Metadata } from "next";
import { Nunito_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AiProvider }  from "@/lib/ai-context";
import { CartDrawer }  from "@/components/cart-drawer";

const nunitoSans = Nunito_Sans({
  subsets:  ["latin"],
  weight:   ["300", "400", "600", "700", "800"],
  variable: "--font-primary",
  display:  "swap",
});

const sourceSerif = Source_Serif_4({
  subsets:  ["latin"],
  weight:   ["300", "400", "600", "700"],
  style:    ["normal", "italic"],
  variable: "--font-serif",
  display:  "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "BioGardeners — Premium Garden Nutrition",
    template: "%s | BioGardeners",
  },
  description:
    "Precision-formulated garden soil and fertilisers for home gardeners. Australian made. Science backed.",
  keywords: ["garden fertiliser", "garden soil", "plant nutrition", "organic garden", "Australian"],
  openGraph: {
    title:       "BioGardeners — Premium Garden Nutrition",
    description: "Precision-formulated garden soil and fertilisers for home gardeners.",
    type:        "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${sourceSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--canvas)", color: "var(--text-black)" }}>
        <AiProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AiProvider>
      </body>
    </html>
  );
}
