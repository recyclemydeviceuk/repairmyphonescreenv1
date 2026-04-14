import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import BookRepairLayout from "../../components/book-repair/BookRepairLayout";
import { getPublicDeviceTypes, type DeviceTypeResult } from "../../lib/api";

// Fallback images per device type slug
const DEVICE_IMAGES: Record<string, string> = {
  phone: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638473/Untitled-design-Photoroom_diciwg.png",
  tablet: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638472/ipad-11-10-9-2025-1765262033-Photoroom_tskotk.png",
  watch: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638473/2024-FEB-PRODUCT-RANGE-1-1024x499-Photoroom_dcih9f.png",
};

export default function BookRepairTypePage() {
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicDeviceTypes()
      .then(setDeviceTypes)
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
                <img
                  src={device.imageUrl || DEVICE_IMAGES[device.slug] || ""}
                  alt={device.name}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
              <div className="px-6 py-4 border-t border-[#eef0f2]">
                <h2 className="text-[22px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors">
                  {device.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </BookRepairLayout>
  );
}
