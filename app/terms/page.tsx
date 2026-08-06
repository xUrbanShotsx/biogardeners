import type { Metadata } from "next";
import Link   from "next/link";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title:       "Terms & Conditions | BioGardeners",
  description: "Terms and conditions governing the use of the BioGardeners website and purchase of products.",
};

const SECTIONS = [
  {
    id:    "acceptance",
    title: "Acceptance of terms",
    body: [
      "By accessing or using the BioGardeners website (biogardeners.com.au) or placing an order with us, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.",
      "We reserve the right to update these terms at any time. Continued use of the website after changes are posted constitutes your acceptance of the updated terms.",
    ],
  },
  {
    id:    "eligibility",
    title: "Eligibility",
    body: [
      "You must be at least 18 years of age to place an order. By placing an order you confirm that you meet this requirement.",
      "Our products are sold for use in Australia only. We do not ship internationally at this time.",
    ],
  },
  {
    id:    "products",
    title: "Products and pricing",
    body: [
      "All product descriptions, images, and specifications on our website are provided in good faith. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without notice.",
      "Prices are displayed in Australian dollars (AUD) and include GST where applicable. Prices are subject to change without notice. The price charged for your order will be the price shown at the time of checkout.",
      "We reserve the right to limit quantities of any product, to refuse or cancel any order, and to discontinue any product at any time.",
    ],
  },
  {
    id:    "orders",
    title: "Orders and payment",
    body: [
      "An order placed through our website constitutes an offer to purchase. We reserve the right to accept or decline any order for any reason.",
      "A binding contract is formed when we send you an order confirmation email. If we are unable to fulfil your order (e.g. due to stock unavailability), we will notify you and issue a full refund.",
      "Payment must be made in full at the time of ordering. We accept major credit and debit cards, and PayPal. All payments are processed securely through Shopify Payments.",
      "We do not store your payment card details. All payment processing is handled by our payment provider in accordance with PCI DSS standards.",
    ],
  },
  {
    id:    "shipping",
    title: "Shipping and delivery",
    body: [
      "We aim to dispatch orders within 1–2 business days. Delivery timeframes are estimates only and are not guaranteed.",
      "Risk in the goods passes to you upon delivery. If a parcel is lost or damaged in transit, contact us at hello@biogardeners.com.au and we will work with the carrier to resolve the issue.",
      "We are not liable for delays caused by the carrier, customs, weather events, or other circumstances beyond our control.",
      "For full shipping details including rates and estimated delivery times by state, see our Shipping & Returns page.",
    ],
  },
  {
    id:    "returns",
    title: "Returns and refunds",
    body: [
      "We offer a 30-day satisfaction guarantee. If you are not satisfied with your purchase for any reason, contact us within 30 days of receiving your order.",
      "Unopened products in original condition are eligible for a full refund including return postage.",
      "For opened products, we will assess refund requests on a case-by-case basis under our satisfaction guarantee. We may ask for photos or additional information.",
      "Refunds are processed to the original payment method within 2–5 business days of us receiving and inspecting the return.",
      "Nothing in these terms limits your rights under the Australian Consumer Law.",
    ],
  },
  {
    id:    "acl",
    title: "Australian Consumer Law",
    body: [
      "Our products come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if they fail to be of acceptable quality and the failure does not amount to a major failure.",
    ],
  },
  {
    id:    "use",
    title: "Use of the website",
    body: [
      "You may use our website for lawful purposes only. You must not use our website in any way that causes or may cause damage to the website or impairment of the availability or accessibility of the website.",
      "You must not use our website to copy, store, host, transmit, send, use, publish, or distribute any material which consists of or is linked to any spyware, malware, or other harmful software.",
      "We reserve the right to restrict access to parts or all of the website at any time.",
    ],
  },
  {
    id:    "ip",
    title: "Intellectual property",
    body: [
      "All content on this website — including text, images, graphics, product descriptions, and branding — is owned by or licensed to BioGardeners Pty Ltd and is protected by Australian and international intellectual property laws.",
      "You may not reproduce, distribute, or use any content from this website without our prior written consent.",
    ],
  },
  {
    id:    "liability",
    title: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, BioGardeners Pty Ltd will not be liable for any indirect, incidental, special, or consequential loss or damage arising from your use of our products or website.",
      "Our total liability to you for any claim arising out of or in connection with these terms or your purchase shall not exceed the amount you paid for the relevant order.",
      "Nothing in these terms excludes or limits our liability for fraud, death or personal injury caused by our negligence, or any other liability that cannot lawfully be excluded.",
    ],
  },
  {
    id:    "privacy",
    title: "Privacy",
    body: [
      "Your personal information is handled in accordance with our Privacy Policy. By using our website and placing an order, you consent to the collection and use of your information as described in that policy.",
    ],
  },
  {
    id:    "governing",
    title: "Governing law",
    body: [
      "These Terms and Conditions are governed by the laws of New South Wales, Australia. Any disputes arising under these terms will be subject to the exclusive jurisdiction of the courts of New South Wales.",
    ],
  },
  {
    id:    "contact",
    title: "Contact",
    body: [
      "For any questions about these Terms and Conditions, please contact us:",
      "Email: hello@biogardeners.com.au",
      "BioGardeners Pty Ltd, Australia",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--canvas)", paddingTop: "var(--nav-h)" }}>

        {/* Header band */}
        <div style={{ background: "var(--green-house)" }} className="px-6 lg:px-10 py-14">
          <div className="max-w-[860px] mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              Legal
            </p>
            <h1 className="font-bold mb-3" style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "#fff", letterSpacing: "-0.02em" }}>
              Terms &amp; Conditions
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Effective date: 1 August 2026 &nbsp;·&nbsp; BioGardeners Pty Ltd (ABN pending)
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[860px] mx-auto px-6 lg:px-10 py-14">

          {/* Intro */}
          <div className="rounded-2xl p-6 mb-12" style={{ background: "var(--green-xlight)", border: "1px solid var(--green-light)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
              Please read these Terms and Conditions carefully before using the BioGardeners website or placing an order.
              These terms govern your relationship with <strong style={{ color: "var(--text-black)" }}>BioGardeners Pty Ltd</strong> and apply to all purchases made through our online store.
              Our products are also covered by the{" "}
              <strong style={{ color: "var(--text-black)" }}>Australian Consumer Law</strong>, which provides rights and remedies that cannot be excluded by these terms.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-10">
            {SECTIONS.map((sec) => (
              <section key={sec.id} aria-labelledby={`section-${sec.id}`}>
                <h2
                  id={`section-${sec.id}`}
                  className="font-bold text-xl mb-4"
                  style={{ color: "var(--green-bio)", letterSpacing: "-0.01em", paddingBottom: "0.75rem", borderBottom: "1px solid var(--ceramic)" }}
                >
                  {sec.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {sec.body.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--text-black-soft)" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer nav */}
          <div className="mt-14 pt-8 flex flex-wrap gap-4" style={{ borderTop: "1px solid var(--ceramic)" }}>
            <Link href="/privacy" className="btn btn-outline" style={{ fontSize: 13, padding: "10px 22px" }}>
              Privacy Policy
            </Link>
            <Link href="/shipping" className="btn btn-outline" style={{ fontSize: 13, padding: "10px 22px" }}>
              Shipping &amp; Returns
            </Link>
            <Link href="/faq" className="btn btn-outline" style={{ fontSize: 13, padding: "10px 22px" }}>
              FAQ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
