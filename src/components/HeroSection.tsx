import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Check } from "lucide-react";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const BULLETS = [
  "Same-day repair once received",
  "Fully tracked & insured return delivery",
  "12-month warranty on all repairs",
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      navigate(`/book-repair?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/book-repair`);
    }
  };

  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Gaussian blur decorative orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-red-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-red-200/40 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[260px] h-[260px] rounded-full bg-red-100/50 blur-[90px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* LEFT — Text content */}
        <div className="flex-1 flex flex-col items-start">
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
            className="text-[42px] md:text-[58px] leading-[1.1] font-bold text-[#202124] mb-5"
            style={NAV_FONT}
          >
            Fast Postal Phone &amp;<br />
            <span className="text-red-600">Tablet Repairs</span> Across the UK
          </h1>

          {/* Subheading */}
          <p
            className="text-[16px] md:text-[17px] leading-8 text-[#5f6368] mb-6 max-w-xl"
            style={NAV_FONT}
          >
            Send your phone to us today — we repair it the same day we receive it and return it within 24–48 hours.
          </p>

          {/* Bullet points */}
          <ul className="flex flex-col gap-2.5 mb-7">
            {BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-[14px] text-[#202124]"
                style={NAV_FONT}
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Check size={12} className="text-red-600" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="w-full max-w-md mb-5">
            <div className="flex items-center w-full rounded-full border border-gray-200 bg-white shadow-sm focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition">
              <Search size={18} className="ml-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your device model (e.g. iPhone 15 Pro)…"
                aria-label="Search for your device"
                className="flex-1 px-3 py-3 text-[14px] bg-transparent outline-none placeholder-gray-400"
                style={NAV_FONT}
              />
              <button
                type="submit"
                className="m-1 rounded-full bg-red-600 text-white px-5 py-2 text-[13px] font-semibold hover:bg-red-700 transition-colors"
                style={NAV_FONT}
              >
                Search
              </button>
            </div>
          </form>

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
        <div className="flex-1 w-full flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774457186/smiling-african-male-technician-repairing-phone_nxa3zt.jpg"
            alt="Technician repairing a phone"
            className="w-full h-auto object-cover rounded-2xl max-h-[540px]"
            onError={(e) => {
              // graceful fallback if cloudinary alt image missing
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=900&q=80";
            }}
          />
        </div>

      </div>
    </section>
  );
}
