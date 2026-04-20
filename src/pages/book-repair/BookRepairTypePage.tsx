import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import BookRepairLayout from "../../components/book-repair/BookRepairLayout";
import { getPublicDeviceTypes, type DeviceTypeResult } from "../../lib/api";

/** Desired display order — anything not listed here appears afterwards */
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

export default function BookRepairTypePage() {
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicDeviceTypes()
      .then((d) => setDeviceTypes(sortDeviceTypes(d)))
      .catch(() => setDeviceTypes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <BookRepairLayout backTo="/" title="Choose device">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-red-500" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {deviceTypes.map((device) => (
            <Link
              key={device.slug}
              to={`/book-repair/${device.slug}`}
              className="group rounded-[26px] border border-[#e8eaed] bg-white overflow-hidden hover:border-red-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="aspect-[4/3] bg-[#f5f5f7] flex items-center justify-center px-5 py-5">
                {device.imageUrl ? (
                  <img
                    src={device.imageUrl}
                    alt={device.name}
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
                  />
                ) : (
                  <div className="text-[14px] text-[#9aa0a6] text-center">
                    {device.name}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-[#eef0f2]">
                <h2 className="text-[22px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors">
                  {device.name}
                </h2>
                {device.subtitle && (
                  <p className="mt-1 text-[13px] text-[#5f6368]">
                    {device.subtitle}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </BookRepairLayout>
  );
}
