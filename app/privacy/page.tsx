import type { Metadata } from "next";
import Link   from "next/link";
import { Nav }    from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title:       "Privacy Policy | BioGardeners",
  description: "How BioGardeners collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    id:    "collection",
    title: "Information we collect",
    body: [
      "When you place an order we collect your name, email address, delivery address, phone number, and payment details. Payment information is processed securely by Shopify Payments and is never stored on our servers.",
      "When you browse our website we may collect non-personal data such as your IP address, browser type, pages visited, and time spent on site. This is collected through cookies and analytics tools to help us improve the website.",
      "If you contact us by email or through our contact form, we collect the information you provide in that message.",
    ],
  },
  {
    id:    "use",
    title: "How we use your information",
    body: [
      "To process and fulfil your orders, including sending order confirmations, shipping updates, and invoices.",
      "To communicate with you about your order or any enquiries you submit.",
      "To improve our website, products, and customer experience using aggregated, anonymised analytics data.",
      "To send you marketing emails if you have opted in. You can unsubscribe at any time using the link in any marketing email.",
      "We do not sell, rent, or trade your personal information to third parties for their marketing purposes.",
    ],
  },
  {
    id:    "sharing",
    title: "Who we share your information with",
    body: [
      "Shopify — our e-commerce platform, which processes payments and stores order data. Shopify is PCI DSS compliant.",
      "Australia Post or our nominated freight carrier — your name, address, and phone number are shared to fulfil delivery.",
      "Email service providers — used to send transactional and marketing emails. These providers process your email address only.",
      "We may disclose your information if required by law, court order, or Australian government authority.",
    ],
  },
  {
    id:    "cookies",
    title: "Cookies",
    body: [
      "Our website uses cookies to maintain your shopping cart session, remember your preferences, and collect anonymised analytics data.",
      "You can disable cookies in your browser settings. Doing so may affect the functionality of the website, including the shopping cart.",
      "We do not use cookies to track your activity across other websites.",
    ],
  },
  {
    id:    "security",
    title: "Security",
    body: [
      "We take reasonable steps to protect your personal information from misuse, loss, and unauthorised access. Our website uses SSL encryption and all payment data is handled by Shopify's PCI-compliant infrastructure.",
      "No method of transmission over the internet is 100% secure. While we do our best to protect your information, we cannot guarantee absolute security.",
    ],
  },
  {
    id:    "access",
    title: "Access and correction",
    body: [
      "Under the Australian Privacy Act 1988, you have the right to access the personal information we hold about you, and to request corrections if it is inaccurate or out of date.",
      "To make an access or correction request, email us at hello@biogardeners.com.au. We will respond within 30 days.",
    ],
  },
  {
    id:    "retention",
    title: "Data retention",
    body: [
      "We retain your order and account data for as long as necessary to fulfil orders, comply with legal obligations, resolve disputes, and enforce our agreements — typically up to 7 years for financial records as required by Australian law.",
      "You may request deletion of your personal data by contacting us, subject to our legal retention obligations.",
    ],
  },
  {
    id:    "thirdparty",
    title: "Third-party links",
    body: [
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies before providing any personal information.",
    ],
  },
  {
    id:    "changes",
    title: "Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our website after changes are posted constitutes acceptance of the updated policy.",
    ],
  },
  {
    id:    "contact",
    title: "Contact us",
    body: [
      "If you have questions or concerns about this Privacy Policy or how we handle your personal information, please contact us:",
      "Email: hello@biogardeners.com.au",
      "We aim to respond to all privacy enquiries within 5 business days.",
    ],
  },
];

export default function PrivacyPage() {
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
              Privacy Policy
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
              BioGardeners Pty Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy in accordance with the{" "}
              <strong style={{ color: "var(--text-black)" }}>Australian Privacy Act 1988</strong> and the Australian Privacy Principles (APPs).
              This policy explains what personal information we collect, how we use it, and your rights in relation to it.
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
            <Link href="/terms" className="btn btn-outline" style={{ fontSize: 13, padding: "10px 22px" }}>
              Terms &amp; Conditions
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
