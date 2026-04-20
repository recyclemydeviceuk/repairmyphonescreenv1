import { useEffect, useState } from "react";
import { Navigate, Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import BookRepairLayout from "../../components/book-repair/BookRepairLayout";
import {
  getPublicDeviceTypes,
  getPublicBrandsWithMeta,
  type BrandResult,
  type DeviceTypeResult,
} from "../../lib/api";

const VALID_TABS = ["iphone", "samsung", "phone", "tablet", "watch"];

export default function BookRepairBrandPage() {
  const { tab } = useParams();
  const [brands, setBrands] = useState<BrandResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tab || !VALID_TABS.includes(tab)) return;

    let cancelled = false;
    setLoading(true);

    // ⚡ Before: 1 (device types) + 1 (brands) + 13 (series probes) = 15 requests
    //    After:  1 (device types, cached) + 1 (brands-with-meta)    =  2 requests
    getPublicDeviceTypes()
      .then(async (types: DeviceTypeResult[]) => {
        const deviceType = types.find((t) => t.slug === tab);
        if (!deviceType) {
          if (!cancelled) setBrands([]);
          return;
        }
        const brandList = await getPublicBrandsWithMeta(deviceType._id);
        if (!cancelled) setBrands(brandList);
      })
      .catch(() => { if (!cancelled) setBrands([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [tab]);

  if (!tab || !VALID_TABS.includes(tab)) {
    return <Navigate to="/book-repair" replace />;
  }

  return (
    <BookRepairLayout backTo="/book-repair" title="Choose brand">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-red-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {brands.map((brand) => {
            const hasSeries = brand.hasSeries ?? false;
            const target = hasSeries
              ? `/book-repair/${tab}/${brand.slug}`
              : `/book-repair/${tab}/${brand.slug}/models`;

            return (
              <Link
                key={brand.slug}
                to={target}
                className="group flex flex-col rounded-[24px] border border-[#e8eaed] bg-white hover:border-red-500 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="h-[190px] bg-[#f5f5f7] flex items-center justify-center px-5 pt-5">
                  <img
                    src={brand.showcaseImageUrl || ""}
                    alt={brand.name}
                    loading="lazy"
                    className="w-[120px] h-[120px] object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4 border-t border-[#eef0f2] flex items-center justify-between gap-3">
                  <span className="text-[14px] md:text-[15px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors">
                    {brand.name}
                  </span>
                  {brand.logoUrl && (
                    <img
                      src={brand.logoUrl}
                      alt=""
                      loading="lazy"
                      className="h-4 w-auto object-contain flex-shrink-0 opacity-70"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </BookRepairLayout>
  );
}
