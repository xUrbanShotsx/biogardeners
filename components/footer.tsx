import Link from "next/link";

const links = {
  Shop: [
    { href: "/products",                                       label: "All Products"          },
    { href: "/products/gp-fertiliser-premium-garden-lawn",     label: "GP Fertiliser"         },
    { href: "/products/lawn-fertilizer-premium-granulated-concentrated", label: "Lawn Fertilizer" },
    { href: "/products/volcanic-dust-trace-elements",          label: "Volcanic Dust"         },
    { href: "/products/penetrator",                            label: "Penetrator"            },
  ],
  Company: [
    { href: "/#about",   label: "About"       },
    { href: "/#science", label: "The Science" },
    { href: "/contact",  label: "Contact"     },
  ],
  Support: [
    { href: "/contact",        label: "Contact Us"       },
    { href: "/faq",            label: "FAQ"              },
    { href: "/shipping",       label: "Shipping & Returns"},
    { href: "/growing-guides", label: "Growing Guides"   },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{ background: "var(--green-house)", color: "rgba(255,255,255,0.70)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-14 pb-10">

        {/* Top: brand + links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="font-bold text-xl"
              style={{ color: "var(--green-light)", letterSpacing: "-0.01em" }}
              aria-label="BioGardeners home"
            >
              BioGardeners
            </Link>
            <p className="text-sm mt-4 max-w-[240px] leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
              Precision-formulated garden nutrition for Australian home growers.
              Science in every granule.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[
                {
                  label: "Instagram",
                  href:  "https://instagram.com",
                  icon:  (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1.5"/>
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  href:  "https://facebook.com",
                  icon:  (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`BioGardeners on ${s.label}`}
                  className="p-2 rounded transition-colors duration-200 footer-social-link"
                  style={{ color: "rgba(255,255,255,0.70)", border: "1px solid rgba(255,255,255,0.20)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <nav key={group} aria-label={`${group} links`}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#fff" }}>{group}</p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: "rgba(255,255,255,0.70)" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
            &copy; {year} BioGardeners Pty Ltd · ABN 00 000 000 000 · All rights reserved
          </p>
          <div className="flex gap-5">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms",   label: "Terms"   },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
