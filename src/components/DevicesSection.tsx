import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getPublicDeviceTypes, type DeviceTypeResult } from "../lib/api";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

/** Desired display order of tabs (anything not in this list appears afterwards) */
const SLUG_ORDER = ["iphone", "samsung", "phone", "tablet", "watch"];

function sortDeviceTypes(types: DeviceTypeResult[]): DeviceTypeResult[] {
  return [...types].sort((a, b) => {
    const ai = SLUG_ORDER.indexOf(a.slug);
    const bi = SLUG_ORDER.indexOf(b.slug);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export default function DevicesSection() {
  const [types, setTypes] = useState<DeviceTypeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    getPublicDeviceTypes()
      .then((data) => setTypes(sortDeviceTypes(data)))
      .catch(() => setTypes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollPrev(el.scrollLeft > 4);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [types.length, loading]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2
              className="text-[26px] md:text-[30px] font-bold text-[#202124] leading-tight"
              style={NAV_FONT}
            >
              Select Your Device
            </h2>
            <p
              className="text-[13px] text-[#5f6368] mt-1"
              style={NAV_FONT}
            >
              Select your device to get an instant repair price.
            </p>
          </div>

          {/* Red arrow button — outlined default, filled on hover */}
          <Link
            to="/book-repair"
            className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-red-600 bg-transparent flex items-center justify-center mt-1 transition-all duration-300 ease-in-out hover:bg-red-600 group/arrow"
            aria-label="View all devices"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-red-600 group-hover/arrow:stroke-white transition-all duration-300 ease-in-out"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-red-500" />
          </div>
        )}

        {/* Empty */}
        {!loading && types.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[14px] text-[#5f6368]" style={NAV_FONT}>
              No device types available at the moment.
            </p>
          </div>
        )}

        {/* Device cards carousel — 3 per slide on desktop, 2 on tablet, 1 on mobile */}
        {!loading && types.length > 0 && (
          <div className="relative">
            {/* Scroller */}
            <div
              ref={scrollerRef}
              className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 px-6 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {types.map((device) => {
                const img = device.imageUrl;
                const label = device.name;
                const subLabel = device.subtitle?.trim() || `${device.brandCount} brand${device.brandCount === 1 ? '' : 's'} available`;
                return (
                  <Link
                    key={device._id}
                    to={`/book-repair/${device.slug}`}
                    className="group flex flex-col items-center flex-shrink-0 snap-start w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                  >
                    {/* Card */}
                    <div className="w-full bg-gradient-to-br from-[#f0f4ff] to-[#fff0f0] rounded-[32px] overflow-hidden flex items-center justify-center p-12 md:p-16 aspect-[4/3] transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 border border-gray-100">
                      {img ? (
                        <img
                          src={img}
                          alt={label}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          style={{ imageRendering: "crisp-edges" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9aa0a6] text-2xl" style={NAV_FONT}>
                          {device.name}
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <p
                      className="mt-6 text-[22px] md:text-[24px] text-[#202124] font-bold group-hover:text-red-600 transition-colors text-center"
                      style={NAV_FONT}
                    >
                      {label}
                    </p>
                    <p
                      className="mt-1.5 text-[14px] text-[#5f6368] text-center"
                      style={NAV_FONT}
                    >
                      {subLabel}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Nav arrows — bottom right */}
            <div className="hidden md:flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={!canScrollPrev}
                aria-label="Previous devices"
                className={`w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${
                  canScrollPrev
                    ? "opacity-100 hover:bg-red-600 hover:border-red-600 hover:text-white text-[#202124]"
                    : "opacity-40 cursor-not-allowed text-[#9aa0a6]"
                }`}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={!canScrollNext}
                aria-label="Next devices"
                className={`w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${
                  canScrollNext
                    ? "opacity-100 hover:bg-red-600 hover:border-red-600 hover:text-white text-[#202124]"
                    : "opacity-40 cursor-not-allowed text-[#9aa0a6]"
                }`}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
