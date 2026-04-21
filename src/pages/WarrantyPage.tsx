import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search as SearchIcon } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getPublicBrandModels,
  getPublicBrandsWithMeta,
  submitWarrantyClaim,
  type BrandResult,
  type ModelResult,
} from "../lib/api";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

type Option = { value: string; label: string; image?: string };

function SearchableDropdown({
  label,
  placeholder,
  value,
  onChange,
  options,
  loading,
  disabled,
  required,
  emptyText = "No results",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (opt: Option) => void;
  options: Option[];
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => searchRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5 relative" ref={wrapperRef}>
      <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-between rounded-[14px] border bg-[#fafafa] px-4 py-3 text-[14px] outline-none transition ${
          open ? "border-red-400 ring-2 ring-red-100" : "border-[#e8eaed] hover:border-[#d1d5db]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        style={NAV_FONT}
      >
        <span className={`truncate text-left ${selected ? "text-[#202124]" : "text-[#adb5bd]"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#5f6368] flex-shrink-0 ml-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-[16px] border border-[#e8eaed] bg-white shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#f1f3f4]">
            <SearchIcon size={15} className="text-[#9aa0a6] flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="flex-1 bg-transparent text-[13px] text-[#202124] placeholder-[#adb5bd] outline-none"
              style={NAV_FONT}
            />
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-[#9aa0a6]">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-[13px] text-[#9aa0a6]" style={NAV_FONT}>
                {emptyText}
              </p>
            ) : (
              filtered.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-left transition ${
                      isActive ? "bg-red-50 text-red-700" : "text-[#202124] hover:bg-[#f8fafc]"
                    }`}
                    style={NAV_FONT}
                  >
                    {opt.image ? (
                      <img src={opt.image} alt="" className="h-6 w-6 rounded object-contain flex-shrink-0" />
                    ) : (
                      <span className="h-6 w-6 rounded bg-[#f1f3f4] flex-shrink-0" />
                    )}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isActive && <Check size={14} className="text-red-600 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const covered = [
  "Inherent defects with parts we install",
  "Re-occurrence of the original fault",
  "Defects in materials or workmanship",
  "Screen & component replacements",
  "Battery replacements",
  "Software repair defects",
];

const notCovered = [
  "Accidental damage",
  "Liquid & water damage post-repair",
  "Additional faults not part of original repair",
  "Damaged components not involved in repair",
  "Device change of ownership",
  "Loss or theft of the device",
];

const warrantyRows = [
  { label: "Mobile / Tablet screen & component replacements", period: "12 Months" },
  { label: "Battery replacements & refurbished device accessories", period: "12 Months" },
  { label: "Liquid damage & software repair", period: "12 Months" },
];

export default function WarrantyPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    brand: "", model: "", claim: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [brands, setBrands] = useState<BrandResult[]>([]);
  const [models, setModels] = useState<ModelResult[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("");
  const [selectedModelSlug, setSelectedModelSlug] = useState("");

  useEffect(() => {
    let cancelled = false;
    setBrandsLoading(true);
    getPublicBrandsWithMeta()
      .then((data) => { if (!cancelled) setBrands(data); })
      .catch(() => { if (!cancelled) setBrands([]); })
      .finally(() => { if (!cancelled) setBrandsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedBrandSlug) { setModels([]); return; }
    let cancelled = false;
    setModelsLoading(true);
    getPublicBrandModels(selectedBrandSlug, undefined, { limit: 200 })
      .then((res) => { if (!cancelled) setModels(res.models); })
      .catch(() => { if (!cancelled) setModels([]); })
      .finally(() => { if (!cancelled) setModelsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedBrandSlug]);

  const brandOptions: Option[] = useMemo(
    () => brands.map((b) => ({ value: b.slug, label: b.name, image: b.logoUrl || b.showcaseImageUrl })),
    [brands],
  );
  const modelOptions: Option[] = useMemo(
    () => models.map((m) => ({ value: m.slug, label: m.name, image: m.imageUrl })),
    [models],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand || !form.model) {
      setError("Please select both a device brand and model.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await submitWarrantyClaim({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        deviceBrand: form.brand,
        deviceModel: form.model,
        claimInfo: form.claim,
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main
        className="bg-white"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(156,163,175,0.28) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 md:pt-24 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600" style={NAV_FONT}>
            Legal
          </p>
          <h1 className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[48px]" style={NAV_FONT}>
            Our Warranty
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[#5f6368]" style={NAV_FONT}>
            We stand firmly behind every repair we carry out. All repairs are covered by our comprehensive 12-month warranty.
          </p>
        </section>

        {/* Warranty table */}
        <section className="mx-auto max-w-3xl px-6 pb-6">
          <div className="overflow-hidden rounded-[24px] border border-[#f3f4f6] bg-white">
            {warrantyRows.map((row, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-7 py-5 ${i < warrantyRows.length - 1 ? "border-b border-[#f3f4f6]" : ""}`}
              >
                <p className="text-[14px] text-[#202124]" style={NAV_FONT}>{row.label}</p>
                <span className="flex-shrink-0 ml-4 rounded-full bg-red-50 px-4 py-1.5 text-[13px] font-bold text-red-600" style={NAV_FONT}>
                  {row.period}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Policy note */}
        <section className="mx-auto max-w-3xl px-6 pb-6">
          <div className="rounded-[24px] border border-[#f3f4f6] bg-white px-8 py-7">
            <p className="text-[14px] leading-7 text-[#5f6368]" style={NAV_FONT}>
              The warranty is linked to a specific device identified by its unique IMEI or serial number and to a specific customer.
              It covers any re-occurrence of the original fault and the part replaced only.
              Additional faults, accidental damage, and device change of ownership are not covered.
              Use of our repair service may void your manufacturer&apos;s warranty.
            </p>
          </div>
        </section>

        {/* Covered / Not covered */}
        <section className="mx-auto max-w-3xl px-6 pb-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#f3f4f6] bg-white px-7 py-7">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-red-600 mb-4" style={NAV_FONT}>
                What IS covered
              </p>
              <ul className="flex flex-col gap-2.5">
                {covered.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] leading-6 text-[#5f6368]" style={NAV_FONT}>
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[24px] border border-[#f3f4f6] bg-white px-7 py-7">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#9ca3af] mb-4" style={NAV_FONT}>
                What is NOT covered
              </p>
              <ul className="flex flex-col gap-2.5">
                {notCovered.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] leading-6 text-[#5f6368]" style={NAV_FONT}>
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d1d5db]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Claim form */}
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-[28px] border border-[#f3f4f6] bg-white px-8 py-9">
            {submitted ? (
              <div className="flex flex-col items-center justify-center min-h-[280px] text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-[22px] font-bold text-[#202124]" style={NAV_FONT}>Claim submitted!</h3>
                <p className="text-[14px] text-[#5f6368] max-w-xs leading-7" style={NAV_FONT}>
                  We've received your warranty claim and will respond within 1 business day.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-red-600 mb-1" style={NAV_FONT}>
                  Warranty claim
                </p>
                <h2 className="text-[22px] font-bold text-[#202124] mb-6" style={NAV_FONT}>
                  Submit your claim below.
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { label: "First Name", name: "firstName", placeholder: "John" },
                      { label: "Last Name", name: "lastName", placeholder: "Smith" },
                    ].map((f) => (
                      <div key={f.name} className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
                          {f.label} <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name={f.name}
                          required
                          placeholder={f.placeholder}
                          value={form[f.name as keyof typeof form]}
                          onChange={handleChange}
                          className="rounded-[14px] border border-[#e8eaed] bg-[#fafafa] px-4 py-3 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                          style={NAV_FONT}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="rounded-[14px] border border-[#e8eaed] bg-[#fafafa] px-4 py-3 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                      style={NAV_FONT}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SearchableDropdown
                      label="Device Brand"
                      placeholder={brandsLoading ? "Loading brands..." : "Select a brand"}
                      required
                      value={selectedBrandSlug}
                      options={brandOptions}
                      loading={brandsLoading}
                      onChange={(opt) => {
                        setSelectedBrandSlug(opt.value);
                        setSelectedModelSlug("");
                        setForm((prev) => ({ ...prev, brand: opt.label, model: "" }));
                      }}
                    />
                    <SearchableDropdown
                      label="Device Model"
                      placeholder={
                        !selectedBrandSlug
                          ? "Select a brand first"
                          : modelsLoading
                          ? "Loading models..."
                          : "Select a model"
                      }
                      required
                      disabled={!selectedBrandSlug}
                      value={selectedModelSlug}
                      options={modelOptions}
                      loading={modelsLoading}
                      emptyText={selectedBrandSlug ? "No models found" : "Select a brand first"}
                      onChange={(opt) => {
                        setSelectedModelSlug(opt.value);
                        setForm((prev) => ({ ...prev, model: opt.label }));
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
                      Claim Information <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="claim"
                      rows={4}
                      required
                      placeholder="Please describe your issue in detail — what was repaired, when, and what fault has re-occurred..."
                      value={form.claim}
                      onChange={handleChange}
                      className="rounded-[14px] border border-[#e8eaed] bg-[#fafafa] px-4 py-3 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none"
                      style={NAV_FONT}
                    />
                  </div>

                  {error && <p className="text-[13px] font-medium text-red-600" style={NAV_FONT}>{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 self-start rounded-full bg-red-600 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
                    style={NAV_FONT}
                  >
                    {loading ? "Submitting..." : "Submit Warranty Claim"}
                  </button>

                  <p className="text-[12px] text-[#5f6368]" style={NAV_FONT}>
                    By submitting this form, you agree to our terms and warranty policy. We'll respond within 1 business day.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
