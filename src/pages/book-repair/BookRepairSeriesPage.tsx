import { useEffect, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Navigate, Link, useParams } from "react-router-dom";
import BookRepairLayout from "../../components/book-repair/BookRepairLayout";
import {
  getPublicBrandSeries,
  getPublicBrandsWithMeta,
  type BrandResult,
  type SeriesResult,
} from "../../lib/api";

const VALID_TABS = ["iphone", "samsung", "phone", "tablet", "watch"];

export default function BookRepairSeriesPage() {
  const { tab, brandSlug } = useParams();
  const [brand, setBrand] = useState<BrandResult | null>(null);
  const [series, setSeries] = useState<SeriesResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSoloBrand, setIsSoloBrand] = useState(false);

  useEffect(() => {
    if (!brandSlug) return;
    setLoading(true);

    getPublicBrandSeries(brandSlug)
      .then((result) => {
        setBrand(result.brand);
        setSeries(result.series);
        // If no series, redirect will happen in render
      })
      .catch(() => { setBrand(null); setSeries([]); })
      .finally(() => setLoading(false));
  }, [brandSlug]);

  // Single-brand device types (e.g. iPhone, Samsung) auto-skip the brand picker,
  // so Back should jump all the way to the device-type page to avoid a redirect loop.
  useEffect(() => {
    if (!brand?.deviceTypeId) return;
    let cancelled = false;
    getPublicBrandsWithMeta(brand.deviceTypeId)
      .then((list) => { if (!cancelled) setIsSoloBrand(list.length === 1); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [brand?.deviceTypeId]);

  if (!tab || !VALID_TABS.includes(tab) || !brandSlug) {
    return <Navigate to="/book-repair" replace />;
  }

  // If loaded and no series, go directly to models
  if (!loading && series.length === 0 && brand) {
    return <Navigate to={`/book-repair/${tab}/${brandSlug}/models`} replace />;
  }

  // If loaded and brand not found
  if (!loading && !brand) {
    return <Navigate to={`/book-repair/${tab}`} replace />;
  }

  return (
    <BookRepairLayout backTo={isSoloBrand ? "/book-repair" : `/book-repair/${tab}`} title="Choose series">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-red-500" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {series.map((s) => (
            <Link
              key={s._id}
              to={`/book-repair/${tab}/${brandSlug}/${s.slug}/models`}
              className="group rounded-[24px] border border-[#e8eaed] bg-white p-6 md:p-7 hover:border-red-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center mb-5">
                {brand?.logoUrl && (
                  <img src={brand.logoUrl} alt="" className="h-5 w-auto object-contain opacity-80" />
                )}
              </div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[20px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors">
                  {s.name}
                </h2>
                <ChevronRight size={18} className="text-[#9aa0a6] group-hover:text-red-600 transition-colors mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </BookRepairLayout>
  );
}
