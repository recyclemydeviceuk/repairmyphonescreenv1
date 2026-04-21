import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Layers,
  Loader2,
  Power,
  Smartphone,
  Tablet,
  Watch,
  Wrench,
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import BookRepairLayout from "../../components/book-repair/BookRepairLayout";
import { addRepairCartItem } from "../../lib/repairCart";
import {
  getPublicModelBundle,
  type PricingRuleResult,
  type BrandResult,
  type ModelResult,
} from "../../lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

type RepairCard = {
  _id:          string;
  title:        string;
  price:        string;
  unitPrice:    number;
  originalPrice?: number;
  description:  string;
  warranty:     string;
  turnaround:   string;
  icon:         CategoryIcon;
  imageUrl?:    string;
};

type CategoryIcon = "device" | "screen" | "back" | "battery" | "camera" | "wrench" | "watch";

type RepairCategory = {
  key:      string;
  label:    string;
  icon:     CategoryIcon;
  imageUrl?: string;
  items:    RepairCard[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_UI: Record<string, { key: string; label: string; icon: CategoryIcon }> = {
  screen:        { key: "screen",  label: "Screen",             icon: "screen"  },
  back_glass:    { key: "back",    label: "Back cover",         icon: "back"    },
  battery:       { key: "battery", label: "Battery & charging", icon: "battery" },
  charging_port: { key: "battery", label: "Battery & charging", icon: "battery" },
  camera:        { key: "camera",  label: "Camera",             icon: "camera"  },
  speaker:       { key: "other",   label: "Other repairs",      icon: "wrench"  },
  other:         { key: "other",   label: "Other repairs",      icon: "wrench"  },
};

const CATEGORY_ORDER = ["screen", "back", "battery", "camera", "other"];

function getTabIcon(icon: CategoryIcon, tab: string) {
  if (icon === "screen")   return Smartphone;
  if (icon === "back")     return Layers;
  if (icon === "battery")  return Power;
  if (icon === "camera")   return Camera;
  if (icon === "wrench")   return Wrench;
  if (icon === "watch")    return Watch;
  if (tab === "tablet")    return Tablet;
  if (tab === "watch")     return Watch;
  return Smartphone;
}

/** Strip model name from repair title to avoid repetition e.g. "iPhone 11 Screen Replacement" → "Screen Replacement" */
function cleanTitle(repairName: string, modelName: string) {
  return repairName.replace(modelName, "").replace(/\s{2,}/g, " ").trim() || repairName;
}

// ── Build category list from backend pricing rules ───────────────────────────

function buildCategories(rules: PricingRuleResult[], modelName: string): RepairCategory[] {
  const map = new Map<string, RepairCategory>();

  for (const rule of rules) {
    const ui = CATEGORY_UI[rule.category] ?? CATEGORY_UI.other;
    if (!map.has(ui.key)) {
      map.set(ui.key, { key: ui.key, label: ui.label, icon: ui.icon, items: [] });
    }
    const cat = map.get(ui.key)!;

    const iconForItem: CategoryIcon =
      rule.category === "screen"   ? "screen"  :
      rule.category === "battery" || rule.category === "charging_port" ? "battery" :
      rule.category === "camera"   ? "camera"  : "wrench";

    cat.items.push({
      _id:         rule._id,
      title:       rule.repairTypeName,
      price:       `£${rule.price}`,
      unitPrice:   rule.price,
      originalPrice: rule.originalPrice,
      // Use backend values — these are stored per model+repair in the DB
      description: rule.description ?? `Professional ${rule.repairTypeName.toLowerCase()} service for your ${modelName}.`,
      warranty:    rule.warranty    ?? "12 Months",
      turnaround:  rule.turnaround  ?? "Up to 60 minutes",
      icon:        iconForItem,
      imageUrl:    rule.repairTypeImageUrl || undefined,
    });

    if (!cat.imageUrl && rule.repairTypeImageUrl) cat.imageUrl = rule.repairTypeImageUrl;
  }

  return CATEGORY_ORDER.filter(k => map.has(k)).map(k => map.get(k)!);
}

const VALID_TABS = ["iphone", "samsung", "phone", "tablet", "watch"];

// ── Component ────────────────────────────────────────────────────────────────

export default function BookRepairRepairPage() {
  const { tab, brandSlug, sectionSlug, modelSlug } = useParams();
  const navigate = useNavigate();

  const [selectedCategoryKey, setSelectedCategoryKey] = useState("screen");
  const [categories, setCategories] = useState<RepairCategory[]>([]);
  const [loading, setLoading]   = useState(true);
  const [brand, setBrand]       = useState<BrandResult | null>(null);
  const [model, setModel]       = useState<ModelResult | null>(null);
  const [toast, setToast]       = useState<{ title: string; variant: "added" | "exists" } | null>(null);
  const repairsSectionRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (key: string) => {
    setSelectedCategoryKey(key);
    // Auto-scroll to repair cards on mobile so user sees the details immediately
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      window.setTimeout(() => {
        repairsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  // ── Fetch brand info + pricing from backend ───────────────────────────────
  useEffect(() => {
    if (!brandSlug || !modelSlug || !tab || !VALID_TABS.includes(tab)) return;
    let cancelled = false;
    setLoading(true);
    setCategories([]);
    setModel(null);
    setBrand(null);

    (async () => {
      try {
        // ⚡ Single round-trip: model + brand + all active pricing rules
        const bundle = await getPublicModelBundle(modelSlug);
        if (cancelled) return;

        if (!bundle) { setLoading(false); return; }

        setBrand(bundle.brand);
        setModel({
          _id: bundle._id,
          name: bundle.name,
          slug: bundle.slug,
          brandName: bundle.brandName,
          deviceTypeName: bundle.deviceTypeName,
          imageUrl: bundle.imageUrl,
          seriesId: bundle.seriesId,
          seriesName: bundle.seriesName,
          isActive: bundle.isActive,
        });

        const rules: PricingRuleResult[] = bundle.pricing ?? [];
        if (rules.length > 0) {
          const built = buildCategories(rules, bundle.name);
          setCategories(built);
          // Default to first available category
          if (built.length > 0) setSelectedCategoryKey(built[0].key);
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [brandSlug, modelSlug, sectionSlug, tab]);

  // ── Toast auto-dismiss ────────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(id);
  }, [toast]);

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!tab || !VALID_TABS.includes(tab) || !brandSlug || !modelSlug) {
    return <Navigate to="/book-repair" replace />;
  }
  if (!loading && !brand) {
    return <Navigate to={`/book-repair/${tab}`} replace />;
  }
  if (!loading && !model) {
    return <Navigate to={sectionSlug ? `/book-repair/${tab}/${brandSlug}/${sectionSlug}/models` : `/book-repair/${tab}/${brandSlug}/models`} replace />;
  }

  const modelName  = model?.name ?? "";
  const brandName  = brand?.name ?? "";
  const brandImage = brand?.showcaseImageUrl ?? "";
  const backTo     = sectionSlug
    ? `/book-repair/${tab}/${brandSlug}/${sectionSlug}/models`
    : `/book-repair/${tab}/${brandSlug}/models`;

  const selectedCategory = categories.find(c => c.key === selectedCategoryKey) ?? categories[0];

  return (
    <>
      {/* ── Cart modal overlay ─────────────────────────────────────────── */}
      {toast && (
        <>
          {/* Backdrop — blurred + darkened */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setToast(null)}
          />

          {/* Modal card — centred */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div className="w-full max-w-sm overflow-hidden rounded-[32px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.28)]">

              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-400 to-red-300" />

              <div className="px-7 pb-7 pt-6">

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50">
                      <CheckCircle2 size={22} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600">
                        {toast.variant === "added" ? "Added to cart" : "Already in cart"}
                      </p>
                      <p className="mt-0.5 text-[16px] font-bold leading-snug text-[#111827]">
                        {toast.title}
                      </p>
                    </div>
                  </div>

                  {/* Close ✕ */}
                  <button
                    type="button"
                    onClick={() => setToast(null)}
                    aria-label="Close"
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#374151]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-5 border-t border-[#f3f4f6]" />

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/repair-cart")}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3a65.25 65.25 0 0 1 13.36 1.412.75.75 0 0 1 .58.875 48.645 48.645 0 0 1-1.618 6.2.75.75 0 0 1-.712.513H6a2.503 2.503 0 0 0-2.292 1.5H17.25a.75.75 0 0 1 0 1.5H2.76a.75.75 0 0 1-.748-.807 4.002 4.002 0 0 1 2.716-3.486L3.626 2.716a.25.25 0 0 0-.248-.216H1.75A.75.75 0 0 1 1 1.75ZM6 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    </svg>
                    Go to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setToast(null)}
                    className="flex w-full items-center justify-center rounded-full border border-[#e5e7eb] bg-white py-3.5 text-[14px] font-semibold text-[#374151] transition-colors hover:border-[#d1d5db] hover:bg-[#f9fafb]"
                  >
                    Continue browsing
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      <Header />
      <BookRepairLayout backTo={backTo} showTitleSection={false} title={`${modelName} Repairs`}>
        <div className="mx-auto max-w-5xl">

          {/* ── Model heading ──────────────────────────────────────────── */}
          <div className="mb-10 flex flex-col items-center text-center gap-4">
            {/* Trustpilot badge */}
            <a
              href="https://uk.trustpilot.com/review/repairmyphonescreen.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 hover:border-[#00b67a] transition-colors group"
            >
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
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            <p className="mx-auto max-w-2xl text-[20px] font-semibold leading-8 text-[#202124]">
              {modelName}
            </p>
          </div>

          {/* ── Loading ────────────────────────────────────────────────── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={28} className="animate-spin text-red-500" />
              <p className="text-[14px] text-[#5f6368]">Loading repair options…</p>
            </div>
          )}

          {/* ── Empty ──────────────────────────────────────────────────── */}
          {!loading && categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Wrench size={28} className="text-[#d1d5db]" />
              <p className="text-[14px] text-[#5f6368]">No repair options available for this model yet.</p>
            </div>
          )}

          {/* ── Category tabs + repair cards ───────────────────────────── */}
          {!loading && categories.length > 0 && (
            <>
              {/* Category pills — 2-col grid on mobile, horizontal row on desktop */}
              <div className="mb-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
                {categories.map(cat => {
                  const Icon     = getTabIcon(cat.icon, tab);
                  const isActive = cat.key === selectedCategory?.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleCategoryClick(cat.key)}
                      className={`group relative flex flex-col items-center justify-center gap-2 rounded-[20px] border px-3 py-4 text-center transition-all duration-200 sm:flex-row sm:justify-start sm:text-left sm:gap-3 sm:px-4 sm:min-h-[68px] sm:min-w-[180px] ${
                        isActive
                          ? "border-red-500 bg-red-50/80 text-red-600 shadow-[0_10px_30px_rgba(220,38,38,0.12)]"
                          : "border-[#d2e3fc] bg-white text-[#202124] hover:border-red-300 hover:bg-[#fff8f8]"
                      }`}
                    >
                      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl overflow-hidden transition-all duration-200 ${
                        isActive ? "bg-white text-red-600 shadow-sm" : "bg-[#f5f7fb] text-[#344054] group-hover:bg-white"
                      }`}>
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.label}
                            className="h-9 w-9 object-contain"
                          />
                        ) : (
                          <Icon size={20} className={isActive ? "text-red-600" : "text-[#344054]"} />
                        )}
                      </div>
                      <div className="min-w-0 sm:flex-1">
                        <span className={`block text-[13px] sm:text-[14px] font-semibold leading-5 ${isActive ? "text-red-600" : "text-[#202124]"}`}>
                          {cat.label}
                        </span>
                      </div>
                      <span className={`absolute bottom-0 left-4 right-4 h-[3px] rounded-full transition-all duration-200 ${
                        isActive ? "bg-red-500 opacity-100" : "bg-transparent opacity-0 group-hover:bg-red-200 group-hover:opacity-100"
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* Repair cards */}
              {selectedCategory && (
                <div ref={repairsSectionRef} className="overflow-hidden rounded-[30px] border border-red-500 bg-white scroll-mt-24">
                  {selectedCategory.items.map((item, index) => {
                    const displayTitle = cleanTitle(item.title, modelName);
                    return (
                      <div key={item._id} className={index > 0 ? "border-t border-[#f1f3f4]" : ""}>
                        <div className="grid md:grid-cols-[1.1fr_1.3fr]">

                          {/* Left: image + price + CTA */}
                          <div className="flex flex-col items-center justify-center px-8 py-10 text-center md:border-r md:border-[#f1f3f4]">
                            <img
                              src={item.imageUrl || brandImage}
                              alt={displayTitle}
                              className="h-[160px] w-[160px] md:h-[180px] md:w-[180px] object-contain drop-shadow-sm"
                            />
                            <h2 className="mt-5 max-w-[280px] text-[22px] font-semibold leading-8 text-red-600">
                              {displayTitle}
                            </h2>
                            <div className="mt-3 flex items-baseline gap-2">
                              <span className="text-[30px] font-bold leading-none text-[#111827]">
                                {item.price}
                              </span>
                              {item.originalPrice && item.originalPrice > item.unitPrice && (
                                <span className="text-[18px] font-medium text-[#9aa0a6] line-through">
                                  £{item.originalPrice}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const result = addRepairCartItem({
                                  id:          [tab, brandSlug, sectionSlug ?? "base", modelSlug, displayTitle.toLowerCase().replace(/\s+/g, "-"), "mail-in"].join(":"),
                                  brandName,
                                  brandSlug:   brandSlug!,
                                  deviceImage: model?.imageUrl || brandImage,
                                  model:       modelName,
                                  modelSlug:   modelSlug!,
                                  priceLabel:  item.price,
                                  repairName:  displayTitle,
                                  sectionSlug,
                                  serviceType: "mail-in",
                                  tab:         tab as "iphone" | "samsung" | "phone" | "tablet" | "watch",
                                  turnaround:  item.turnaround,
                                  unitPrice:   item.unitPrice,
                                  warranty:    item.warranty,
                                });
                                setToast(result.status === "added"
                                  ? { title: displayTitle, variant: "added" }
                                  : { title: displayTitle, variant: "exists" });
                              }}
                              className="mt-6 inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700"
                            >
                              Book a repair
                            </button>
                          </div>

                          {/* Right: description / warranty — ALL from backend */}
                          <div className="px-8 py-10">
                            <div className="space-y-6">
                              {item.description && (
                                <div>
                                  <p className="text-[14px] font-semibold text-[#202124]">Repair description</p>
                                  <p className="mt-2 text-[14px] leading-6 text-[#5f6368]">{item.description}</p>
                                </div>
                              )}
                              {item.warranty && (
                                <div className={item.description ? "border-t border-[#eef2f7] pt-5" : ""}>
                                  <p className="text-[14px] font-semibold text-[#202124]">Warranty</p>
                                  <p className="mt-2 text-[14px] font-medium text-red-600">
                                    {item.warranty}
                                  </p>
                                  <a
                                    href="/warranty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[#5f6368] hover:text-red-600 transition-colors"
                                  >
                                    View our warranty policy
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                      <polyline points="15 3 21 3 21 9" />
                                      <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </BookRepairLayout>
      <Footer />
    </>
  );
}
