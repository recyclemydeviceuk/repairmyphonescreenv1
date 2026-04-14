import { Link } from "react-router-dom";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

export default function HeroSection() {
  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Gaussian blur decorative orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-red-100/60 blur-[100px]" />
      <div className="pointer-events-none absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-red-200/40 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[260px] h-[260px] rounded-full bg-red-100/50 blur-[90px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* LEFT — Text content */}
        <div className="flex-1 flex flex-col items-start">
          {/* Trustpilot badge */}
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
              Rated <strong className="text-[#202124]">Excellent</strong> on Trustpilot
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
            className="text-[52px] md:text-[68px] leading-[1.1] font-bold text-[#202124] mb-6"
            style={NAV_FONT}
          >
            Fast. Reliable.<br />
            Trusted Repairs.
          </h1>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/book-repair"
              className="inline-flex items-center px-6 py-3 rounded-full bg-red-600 text-white text-[14px] font-medium hover:bg-red-700 transition-colors"
              style={NAV_FONT}
            >
              Book a Repair
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center px-6 py-3 rounded-full border border-gray-300 text-[#202124] text-[14px] font-medium hover:border-red-600 hover:text-red-600 transition-colors"
              style={NAV_FONT}
            >
              How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 pt-8 border-t border-gray-100 w-full">
            {[
              { value: "4.9★", label: "Trustpilot Rating" },
              { value: "50k+", label: "Repairs Done" },
              { value: "30k+", label: "Happy Customers" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="text-[22px] font-bold text-[#202124]"
                  style={NAV_FONT}
                >
                  {s.value}
                </p>
                <p
                  className="text-[12px] text-[#5f6368] mt-0.5"
                  style={NAV_FONT}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Hero image */}
        <div className="flex-1 w-full flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774457186/pleased-carefree-woman-cute-red-dress_akqisk.jpg"
            alt="Happy customer with repaired phone"
            className="w-full h-auto object-contain rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}
