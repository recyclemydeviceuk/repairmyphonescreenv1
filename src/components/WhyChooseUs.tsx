const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const reasons = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "SAME-DAY REPAIR",
    desc: "Repaired the same day we receive your device — straight back to you.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "UK-WIDE POSTAL SERVICE",
    desc: "Send your device from anywhere in the UK — we cover the return delivery too.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "FULLY TRACKED & INSURED",
    desc: "Special tracked delivery with full insurance — your device is safe with us.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    title: "12-MONTH WARRANTY",
    desc: "Every repair is backed by a 12-month warranty on parts and labour.",
  },
  {
    icon: (
      <span className="text-white text-[22px] font-bold leading-none" style={{ fontFamily: "Georgia, serif" }}>£</span>
    ),
    title: "NO FIX, NO FEE",
    desc: "If we can't repair your device, you won't pay a penny — our promise to you.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about-us" className="w-full bg-red-600 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <h2
          className="text-center text-[28px] md:text-[38px] font-bold text-white uppercase tracking-wide mb-14"
          style={NAV_FONT}
        >
          Why Choose Us?
        </h2>

        {/* 5-column feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center ${
                i < reasons.length - 1
                  ? "md:border-r md:border-white/20"
                  : ""
              } px-4`}
            >
              {/* Icon */}
              <div className="mb-4 opacity-90">{r.icon}</div>

              {/* Title */}
              <p
                className="text-white text-[12px] font-bold uppercase tracking-widest mb-2"
                style={NAV_FONT}
              >
                {r.title}
              </p>

              {/* Description */}
              <p
                className="text-white/75 text-[13px] leading-relaxed"
                style={NAV_FONT}
              >
                {r.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
