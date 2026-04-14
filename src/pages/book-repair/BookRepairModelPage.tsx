import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import BookRepairLayout from "../../components/book-repair/BookRepairLayout";
import {
  getPublicBrandModels,
  type BrandResult,
  type ModelResult,
} from "../../lib/api";

const VALID_TABS = ["phone", "tablet", "watch"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BookRepairModelPage() {
  const { tab, brandSlug, sectionSlug } = useParams();
  const [brand, setBrand] = useState<BrandResult | null>(null);
  const [models, setModels] = useState<ModelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!brandSlug) return;
    setLoading(true);

    getPublicBrandModels(brandSlug, sectionSlug)
      .then((result) => {
        setBrand(result.brand);
        setModels(result.models);
      })
      .catch(() => { setBrand(null); setModels([]); })
      .finally(() => setLoading(false));
  }, [brandSlug, sectionSlug]);

  if (!tab || !VALID_TABS.includes(tab) || !brandSlug) {
    return <Navigate to="/book-repair" replace />;
  }

  if (!loading && !brand) {
    return <Navigate to={`/book-repair/${tab}`} replace />;
  }

  const backTo = sectionSlug ? `/book-repair/${tab}/${brandSlug}` : `/book-repair/${tab}`;
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredModels = trimmedQuery
    ? models.filter((m) => m.name.toLowerCase().includes(trimmedQuery))
    : models;

  return (
    <BookRepairLayout backTo={backTo} title="Choose model">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-red-500" />
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[24px] font-semibold text-[#202124]">Choose model</h2>
            <div className="relative w-full lg:max-w-sm">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6368]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model"
                className="w-full rounded-full border border-[#e8eaed] bg-white py-3 pl-11 pr-4 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#5f6368] focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {filteredModels.map((model) => (
              <Link
                key={model._id}
                to={
                  sectionSlug
                    ? `/book-repair/${tab}/${brandSlug}/${sectionSlug}/models/${slugify(model.name)}`
                    : `/book-repair/${tab}/${brandSlug}/models/${slugify(model.name)}`
                }
                className="group w-full text-left rounded-[24px] border border-[#e8eaed] bg-white overflow-hidden hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-stretch min-h-[126px]">
                  <div className="w-[120px] sm:w-[140px] bg-[#f5f5f7] flex items-center justify-center px-4 py-4 border-r border-[#eef0f2]">
                    <img
                      src={model.imageUrl || brand?.showcaseImageUrl || ""}
                      alt={model.name}
                      className="w-[78px] h-[78px] sm:w-[88px] sm:h-[88px] object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 flex items-center px-5 sm:px-6 py-4">
                    <span className="block text-[15px] sm:text-[16px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors leading-snug">
                      {model.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {filteredModels.length === 0 && (
              <div className="lg:col-span-2 rounded-[24px] border border-[#e8eaed] bg-white px-6 py-10 text-center text-[15px] text-[#5f6368]">
                No models found.
              </div>
            )}
          </div>
        </>
      )}
    </BookRepairLayout>
  );
}
