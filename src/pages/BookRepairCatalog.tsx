import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Smartphone, Tablet, Watch } from "lucide-react";
import { Link } from "react-router-dom";
import {
  brandCardsByTab,
  brandDetails,
  type CatalogTab,
} from "../data/bookRepairCatalog";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const tabs = [
  { key: "phone", label: "Phone", icon: Smartphone },
  { key: "watch", label: "Watch", icon: Watch },
  { key: "tablet", label: "Tablet", icon: Tablet },
] as const;

export default function BookRepairCatalog() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("phone");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(null);

  const brandCards = brandCardsByTab[activeTab];
  const selectedBrand = useMemo(
    () => brandDetails.find((brand) => brand.slug === selectedBrandSlug && brand.tab === activeTab) ?? null,
    [activeTab, selectedBrandSlug]
  );

  const handleTabChange = (tab: CatalogTab) => {
    setActiveTab(tab);
    setSelectedBrandSlug(null);
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        ...NAV_FONT,
        backgroundImage: "radial-gradient(circle, rgba(156, 163, 175, 0.32) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="border-b border-[#e8eaed] bg-white/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8eaed] text-[13px] font-medium text-[#202124] hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          style={NAV_FONT}
        >
          <ArrowLeft size={15} />
          Book a Repair
        </Link>

        {selectedBrand && (
          <button
            onClick={() => setSelectedBrandSlug(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8eaed] bg-white text-[13px] font-medium text-[#202124] hover:border-red-500 hover:text-red-600 transition-all duration-200 cursor-pointer"
            style={NAV_FONT}
          >
            <ArrowLeft size={14} />
            Choose another brand
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
        <div className="mb-12 text-center">
          <h1
            className="text-[32px] md:text-[42px] font-bold text-[#202124] leading-tight"
            style={NAV_FONT}
          >
            Find your brand for <span className="text-red-600">repair</span>
          </h1>
          <p className="mt-3 text-[15px] text-[#5f6368]" style={NAV_FONT}>
            Browse by device type, then choose your brand and exact model.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                    : "bg-white text-[#5f6368] border-[#e8eaed] hover:border-red-400 hover:text-red-600"
                }`}
                style={NAV_FONT}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {!selectedBrand ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#e8eaed] px-4 py-2 text-[13px] text-[#5f6368] shadow-sm">
                <span className="text-red-600 font-semibold">{brandCards.length}</span>
                brands available in {activeTab}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {brandCards.map((brand) => (
                <button
                  key={brand.slug}
                  onClick={() => setSelectedBrandSlug(brand.slug)}
                  className="group flex flex-col rounded-[24px] border border-[#e8eaed] bg-white hover:border-red-500 hover:shadow-lg transition-all duration-200 cursor-pointer text-left overflow-hidden"
                >
                  <div className="h-[190px] bg-[#f5f5f7] flex items-center justify-center px-5 pt-5">
                    <img
                      src={brand.img}
                      alt={brand.name}
                      className="w-[120px] h-[120px] object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4 border-t border-[#eef0f2]">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span
                        className="text-[14px] md:text-[15px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                        style={NAV_FONT}
                      >
                        {brand.name}
                      </span>
                      <img
                        src={brand.brandLogo}
                        alt=""
                        className="h-4 w-auto object-contain flex-shrink-0 opacity-70"
                      />
                    </div>
                    <div className="inline-flex items-center gap-1 text-[12px] text-[#5f6368] group-hover:text-red-600 transition-colors">
                      Explore models
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-[28px] border border-[#e8eaed] bg-white shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-0">
                <div className="p-7 md:p-9">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 text-[12px] font-medium mb-5">
                    {activeTab} repair catalogue
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={selectedBrand.brandLogo}
                      alt=""
                      className="h-7 w-auto object-contain"
                    />
                    <h2 className="text-[28px] md:text-[34px] font-bold text-[#202124]" style={NAV_FONT}>
                      {selectedBrand.name}
                    </h2>
                  </div>

                  <p className="text-[15px] leading-7 text-[#5f6368] max-w-2xl" style={NAV_FONT}>
                    {selectedBrand.intro}
                  </p>
                </div>

                <div className="bg-[#f5f5f7] flex items-center justify-center min-h-[260px] px-6 py-8">
                  <img
                    src={selectedBrand.heroImage}
                    alt={selectedBrand.name}
                    className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] object-contain"
                  />
                </div>
              </div>
            </div>

            {selectedBrand.sections ? (
              <div className="space-y-6">
                {selectedBrand.sections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-[24px] border border-[#e8eaed] bg-white p-6 md:p-7 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-[22px] font-bold text-[#202124]" style={NAV_FONT}>
                          {section.title}
                        </h3>
                        <p className="mt-1 text-[13px] text-[#5f6368]" style={NAV_FONT}>
                          {section.models.length} models in this range
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.models.map((model) => (
                        <button
                          key={model}
                          className="group w-full text-left rounded-[22px] border border-[#e8eaed] bg-white overflow-hidden hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer"
                          style={NAV_FONT}
                        >
                          <div className="h-[130px] bg-[#f5f5f7] flex items-center justify-center px-5 py-4">
                            <img
                              src={selectedBrand.heroImage}
                              alt={model}
                              className="w-[88px] h-[88px] object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="px-4 py-3 border-t border-[#eef0f2]">
                            <span className="block text-[14px] font-medium text-[#202124] group-hover:text-red-600 transition-colors">
                              {model}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-[#e8eaed] bg-white p-6 md:p-7 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-[22px] font-bold text-[#202124]" style={NAV_FONT}>
                      All models
                    </h3>
                    <p className="mt-1 text-[13px] text-[#5f6368]" style={NAV_FONT}>
                      Latest models first for a faster selection flow
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedBrand.models?.map((model) => (
                    <button
                      key={model}
                      className="group w-full text-left rounded-[22px] border border-[#e8eaed] bg-white overflow-hidden hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer"
                      style={NAV_FONT}
                    >
                      <div className="h-[130px] bg-[#f5f5f7] flex items-center justify-center px-5 py-4">
                        <img
                          src={selectedBrand.heroImage}
                          alt={model}
                          className="w-[88px] h-[88px] object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="px-4 py-3 border-t border-[#eef0f2]">
                        <span className="block text-[14px] font-medium text-[#202124] group-hover:text-red-600 transition-colors">
                          {model}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
