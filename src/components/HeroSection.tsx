import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const BULLETS = [
  "Same-day repair once received",
  "Fully tracked & insured return delivery",
  "12-month warranty on all repairs",
];

export default function HeroSection() {
  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Gaussian blur decorative orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-red-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-red-200/40 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[260px] h-[260px] rounded-full bg-red-100/50 blur-[90px]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-0 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12">

        {/* LEFT — Text content */}
        <div className="flex-1 flex flex-col items-start md:pb-16">
          {/* Trustpilot badge with score */}
          <a
            href="https://uk.trustpilot.com/review/repairmyphonescreen.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 mb-5 hover:border-[#00b67a] transition-colors group"
            style={NAV_FONT}
          >
            {/* Trustpilot green star icon */}
            <span className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#00b67a">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </span>
            <span className="text-[12px] text-[#5f6368] group-hover:text-[#00b67a] transition-colors">
              <strong className="text-[#202124]">4.9 / 5</strong> — Rated <strong className="text-[#202124]">Excellent</strong> on Trustpilot
            </span>
            {/* External link arrow */}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          {/* Headline */}
          <h1
            className="text-[44px] md:text-[64px] leading-[1.05] font-extrabold text-[#202124] mb-5 tracking-tight"
            style={NAV_FONT}
          >
            Fast{" "}
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
              Postal Repairs
            </span>
            <br />
            Across the{" "}
            <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
              UK
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-[16px] md:text-[17px] leading-8 text-[#5f6368] mb-7 max-w-xl"
            style={NAV_FONT}
          >
            Send your phone to us today — we repair it the same day we receive it and return it within 24–48 hours.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/book-repair"
              className="inline-flex items-center px-6 py-3 rounded-full bg-red-600 text-white text-[14px] font-medium hover:bg-red-700 transition-colors"
              style={NAV_FONT}
            >
              Get Your Repair Quote
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center px-6 py-3 rounded-full border border-gray-300 text-[#202124] text-[14px] font-medium hover:border-red-600 hover:text-red-600 transition-colors"
              style={NAV_FONT}
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* RIGHT — Hero image */}
        <div className="flex-1 w-full flex items-end justify-center">
          <img
            src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1776544115/RMPS_HEro_lwcwbg.png"
            alt="Repair My Phone Screen hero"
            className="w-full h-auto object-contain max-h-[640px] md:max-h-[720px] object-bottom"
          />
        </div>

      </div>

      {/* ── USP strip — attached to the bottom of the hero so the image visually rests on it ── */}
      <div className="relative max-w-7xl mx-auto px-6 pb-12 md:pb-16">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <ul className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 px-6 py-4 text-[14px] md:text-[15px] text-[#202124]"
                style={NAV_FONT}
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Check size={16} className="text-red-600" strokeWidth={3} />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
