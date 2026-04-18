import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BRANDS, GENERIC_LOCATIONS, type Brand, type Region } from "../data/locations";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const DOT_BG: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, rgba(156, 163, 175, 0.28) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function getRegionUrlSlug(brand: Brand, region: Region): string {
  if (region.slug === "") return brand.baseSlug;
  return `${brand.baseSlug}-${region.slug}`;
}

/* ── Compute page totals ──────────────────────────────────────── */
function getTotalPages() {
  let regionPages = 0;
  let cityPages = 0;
  for (const brand of BRANDS) {
    for (const region of brand.regions) {
      regionPages++;
      cityPages += region.cities.length;
    }
  }
  return { regionPages, cityPages, generic: GENERIC_LOCATIONS.length, total: regionPages + cityPages + GENERIC_LOCATIONS.length };
}

/* ── Brand → Region accordion ─────────────────────────────────── */
function BrandSection({ brand, search }: { brand: Brand; search: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const q = search.toLowerCase().trim();

  const filteredRegions = useMemo(() => {
    if (!q) return brand.regions;
    return brand.regions
      .map((r) => ({
        ...r,
        cities: r.cities.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q)
        ),
      }))
      .filter((r) => r.cities.length > 0 || r.name.toLowerCase().includes(q));
  }, [brand.regions, q]);

  if (filteredRegions.length === 0) return null;

  const totalCities = filteredRegions.reduce((s, r) => s + r.cities.length, 0);

  return (
    <div className="rounded-[24px] border border-[#f0f1f3] bg-white overflow-hidden">
      {/* Brand header */}
      <div className="border-b border-[#f0f1f3] bg-gradient-to-r from-red-50/60 to-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#202124]" style={NAV_FONT}>
            {brand.name} Repairs
          </h2>
          <p className="text-[12px] text-[#5f6368] mt-0.5" style={NAV_FONT}>
            {filteredRegions.length} regions · {totalCities} locations
          </p>
        </div>
        <Link
          to={brand.bookRepairPath}
          className="hidden sm:inline-flex items-center gap-1 rounded-full bg-red-50 px-4 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-100 transition-colors"
          style={NAV_FONT}
        >
          Book {brand.name} Repair
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Regions */}
      <div className="divide-y divide-[#f5f6f8]">
        {filteredRegions.map((region) => {
          const regionSlug = getRegionUrlSlug(brand, region);
          const isOpen = expanded === regionSlug || !!q;

          return (
            <div key={regionSlug}>
              {/* Region row */}
              <button
                onClick={() => setExpanded(isOpen && !q ? null : regionSlug)}
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-[#fafbfc] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 flex-shrink-0">
                    <MapPin size={14} className="text-red-500" />
                  </div>
                  <div>
                    <Link
                      to={`/${regionSlug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[14px] font-semibold text-[#202124] hover:text-red-600 transition-colors"
                      style={NAV_FONT}
                    >
                      {region.name}
                    </Link>
                    <p className="text-[11px] text-[#9aa0a6]" style={NAV_FONT}>
                      {region.cities.length} locations
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[#9aa0a6] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Cities grid */}
              {isOpen && (
                <div className="px-6 pb-4 pt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {region.cities.map((city) => (
                      <Link
                        key={city.slug}
                        to={`/${regionSlug}/${city.slug}`}
                        className="group flex items-center gap-2 rounded-xl border border-[#f0f1f3] bg-[#fafbfc] px-3 py-2.5 hover:border-red-200 hover:bg-red-50/50 transition-all"
                      >
                        <span
                          className="text-[12px] font-medium text-[#5f6368] group-hover:text-red-600 transition-colors truncate"
                          style={NAV_FONT}
                        >
                          {city.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function AllLocationsPage() {
  const [search, setSearch] = useState("");
  const totals = useMemo(() => getTotalPages(), []);

  useEffect(() => {
    document.title =
      "All Repair Locations Across the UK | Repair My Phone Screen";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      `Browse all ${totals.total}+ phone, tablet & screen repair locations across the UK. Free postal service, 12-month warranty. iPhone, Samsung, iPad, Huawei, Google Pixel, Nokia & Sony Xperia repairs.`
    );
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      "https://repairmyphonescreen.co.uk/locations"
    );
    return () => {
      document.title = "Repair My Phone Screen";
    };
  }, [totals.total]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="bg-white" style={DOT_BG}>
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 text-center">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            UK-Wide Coverage
          </p>
          <h1
            className="mt-3 text-[36px] font-bold leading-tight text-[#202124] md:text-[48px]"
            style={NAV_FONT}
          >
            All Repair{" "}
            <span className="text-red-600">Locations</span>
          </h1>
          <p
            className="mt-5 mx-auto max-w-2xl text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            We offer free postal phone and tablet repairs across the entire UK.
            Browse our {totals.total.toLocaleString()}+ service locations below — find your
            nearest city and book a repair today.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { label: "Brands Covered", value: BRANDS.length.toString() },
              { label: "Regions", value: totals.regionPages.toString() },
              { label: "Locations", value: totals.cityPages.toLocaleString() },
              { label: "12-Month Warranty", value: "✓" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#f0f1f3] bg-white px-6 py-4 min-w-[140px]"
              >
                <p
                  className="text-[24px] font-bold text-red-600"
                  style={NAV_FONT}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[12px] text-[#5f6368] mt-0.5"
                  style={NAV_FONT}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Search ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="relative max-w-md mx-auto">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa0a6]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city or region..."
              className="w-full rounded-2xl border border-[#e8eaed] bg-white pl-11 pr-4 py-3.5 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              style={NAV_FONT}
            />
          </div>
        </section>

        {/* ── Brand sections ─────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-10 space-y-6">
          {BRANDS.map((brand) => (
            <BrandSection key={brand.baseSlug} brand={brand} search={search} />
          ))}

          {/* Generic location pages */}
          {(!search || "screen repairs".includes(search.toLowerCase())) && (
            <div className="rounded-[24px] border border-[#f0f1f3] bg-white overflow-hidden">
              <div className="border-b border-[#f0f1f3] bg-gradient-to-r from-slate-50/60 to-white px-6 py-4">
                <h2
                  className="text-[18px] font-bold text-[#202124]"
                  style={NAV_FONT}
                >
                  General Screen Repairs
                </h2>
                <p
                  className="text-[12px] text-[#5f6368] mt-0.5"
                  style={NAV_FONT}
                >
                  All brands — popular cities
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {GENERIC_LOCATIONS.map((loc) => (
                    <Link
                      key={loc.slug}
                      to={`/locations/${loc.slug}`}
                      className="group flex items-center gap-2 rounded-xl border border-[#f0f1f3] bg-[#fafbfc] px-4 py-3 hover:border-red-200 hover:bg-red-50/50 transition-all"
                    >
                      <MapPin
                        size={14}
                        className="text-[#9aa0a6] group-hover:text-red-500 flex-shrink-0"
                      />
                      <span
                        className="text-[13px] font-medium text-[#5f6368] group-hover:text-red-600 transition-colors"
                        style={NAV_FONT}
                      >
                        Screen Repairs {loc.city}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {search &&
            BRANDS.every((b) => {
              const q = search.toLowerCase().trim();
              return b.regions.every(
                (r) =>
                  !r.name.toLowerCase().includes(q) &&
                  r.cities.every((c) => !c.name.toLowerCase().includes(q))
              );
            }) && (
              <div className="rounded-[24px] border border-[#f0f1f3] bg-white px-8 py-14 text-center">
                <p
                  className="text-[18px] font-semibold text-[#202124]"
                  style={NAV_FONT}
                >
                  No locations found for "{search}"
                </p>
                <p
                  className="mt-2 text-[14px] text-[#5f6368]"
                  style={NAV_FONT}
                >
                  We offer free postal repairs across the entire UK — {" "}
                  <Link
                    to="/book-repair"
                    className="text-red-600 font-semibold hover:underline"
                  >
                    book a repair online
                  </Link>{" "}
                  and we'll send you a prepaid postage pack.
                </p>
              </div>
            )}
        </section>

        {/* ── CTA Banner ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-[28px] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-8 py-14 text-center md:px-16">
            <h2
              className="text-[28px] md:text-[34px] font-bold text-white leading-tight"
              style={NAV_FONT}
            >
              Can't find your city?
            </h2>
            <p
              className="mt-4 mx-auto max-w-xl text-[15px] leading-7 text-white/70"
              style={NAV_FONT}
            >
              No worries — we cover the entire UK with our free postal repair
              service. Simply book online, we'll send you a prepaid box, and
              your repaired device will be back within 1–3 working days.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/book-repair"
                className="rounded-full bg-red-600 px-8 py-3.5 text-[14px] font-semibold text-white hover:bg-red-700 transition-colors"
                style={NAV_FONT}
              >
                Get Your Repair Quote
              </Link>
              <Link
                to="/how-it-works"
                className="rounded-full border border-white/20 px-8 py-3.5 text-[14px] font-semibold text-white hover:bg-white/10 transition-colors"
                style={NAV_FONT}
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
