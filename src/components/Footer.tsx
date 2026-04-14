import { Link } from "react-router-dom";
import { useSiteSettings } from "../lib/SiteSettingsContext";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Book a Repair", to: "/book-repair" },
      { label: "Track Your Repair", to: "/track-repair" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "About Us", to: "/about-us" },
      { label: "Contact Us", to: "/contact-us" },
      { label: "All Locations", to: "/locations" },
    ],
  },
  {
    heading: "Our Services",
    links: [
      { label: "iPhone Repairs", to: "/iphone-repairs" },
      { label: "Samsung Repairs", to: "/samsung-repairs-north-west" },
      { label: "iPad Repairs", to: "/ipad-repairs-north-west" },
      { label: "Google Pixel Repairs", to: "/google-pixel-repairs-north-west" },
      { label: "Huawei Repairs", to: "/huawei-repairs-north-west" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Our Warranty", to: "/warranty" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
];

const socialLinks = [
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

// Format phone to tel: href (strip spaces/+)
function toTelHref(phone: string) {
  return "tel:" + phone.replace(/[\s+()-]/g, "");
}

// Format WhatsApp number to wa.me link
function toWhatsAppHref(number: string) {
  const clean = number.replace(/[\s+()-]/g, "");
  return `https://wa.me/${clean}`;
}

export default function Footer() {
  const { general } = useSiteSettings();

  return (
    <footer id="contact-us" className="w-full bg-white border-t border-[#e8eaed]">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="mb-16">
          <Link to="/">
            <img
              src={general.logoUrl}
              alt={general.businessName}
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[13px] font-semibold text-[#202124] mb-4" style={NAV_FONT}>
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-[#5f6368] hover:text-red-600 transition-colors"
                      style={NAV_FONT}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[13px] font-semibold text-[#202124] mb-4" style={NAV_FONT}>
              Contact Us
            </p>
            <ul className="space-y-3">
              {general.address && (
                <li>
                  <p className="text-[13px] text-[#5f6368] leading-relaxed" style={NAV_FONT}>
                    {general.address}
                  </p>
                </li>
              )}
              {general.phone && (
                <li>
                  <a href={toTelHref(general.phone)} className="text-[13px] text-[#5f6368] hover:text-red-600 transition-colors" style={NAV_FONT}>
                    {general.phone}
                  </a>
                </li>
              )}
              {general.whatsappNumber && (
                <li>
                  <a href={toWhatsAppHref(general.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#5f6368] hover:text-green-600 transition-colors" style={NAV_FONT}>
                    WhatsApp Us
                  </a>
                </li>
              )}
              {general.email && (
                <li>
                  <a href={`mailto:${general.email}`} className="text-[13px] text-[#5f6368] hover:text-red-600 transition-colors" style={NAV_FONT}>
                    {general.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e8eaed] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[12px] text-[#5f6368]" style={NAV_FONT}>
              © {new Date().getFullYear()} {general.businessName}. All rights reserved.
            </span>
            <span className="text-[12px] text-[#5f6368]" style={NAV_FONT}>
              A subsidiary of Fonebox Ltd
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-[#5f6368] hover:text-red-600 transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
