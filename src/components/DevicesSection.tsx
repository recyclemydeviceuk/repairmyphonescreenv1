import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getPublicDeviceTypes, type DeviceTypeResult } from "../lib/api";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

/**
 * Sublabel map keyed by DeviceType.slug — purely cosmetic helper text
 * rendered under the name. Images come straight from the backend
 * (DeviceType.imageUrl) so the homepage and Book-a-Repair flow always
 * stay in sync.
 */
const SUBLABELS: Record<string, string> = {
  iphone:  "All iPhone models",
  samsung: "All Galaxy models",
  phone:   "Huawei, Pixel, Xiaomi & more",
  tablet:  "iPad, Galaxy Tab & more",
  watch:   "All Apple Watch models",
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

/** "Phone" → "Phone Repairs", but leave labels that already end in "Repairs" alone */
function toLabel(name: string): string {
  if (/repairs?$/i.test(name)) return name;
  return `${name} Repairs`;
}

export default function DevicesSection() {
  const [types, setTypes] = useState<DeviceTypeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicDeviceTypes()
      .then((data) => setTypes(sortDeviceTypes(data)))
      .catch(() => setTypes([]))
      .finally(() => setLoading(false));
  }, []);

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

        {/* Device cards grid */}
        {!loading && types.length > 0 && (
          <div
            className={`grid gap-4 md:gap-5 ${
              types.length >= 5
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                : types.length === 4
                ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
                : types.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {types.map((device) => {
              const subLabel = SUBLABELS[device.slug] ?? `${device.brandCount} brand${device.brandCount === 1 ? '' : 's'} available`;
              const img = device.imageUrl;
              const label = toLabel(device.name);
              return (
                <Link
                  key={device._id}
                  to={`/book-repair/${device.slug}`}
                  className="group flex flex-col items-center"
                >
                  {/* Card */}
                  <div className="w-full bg-gradient-to-br from-[#f0f4ff] to-[#fff0f0] rounded-3xl overflow-hidden flex items-center justify-center p-8 aspect-[4/3] transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-gray-100">
                    {img ? (
                      <img
                        src={img}
                        alt={label}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        style={{ imageRendering: "crisp-edges" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9aa0a6]" style={NAV_FONT}>
                        {device.name}
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className="mt-4 text-[18px] text-[#202124] font-bold group-hover:text-red-600 transition-colors text-center"
                    style={NAV_FONT}
                  >
                    {label}
                  </p>
                  <p
                    className="mt-1 text-[12px] text-[#5f6368] text-center"
                    style={NAV_FONT}
                  >
                    {subLabel}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
