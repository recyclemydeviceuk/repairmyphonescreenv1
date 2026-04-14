import { useState } from "react";
import { Smartphone, Watch, Tablet } from "lucide-react";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const tabData = {
  phone: [
    {
      name: "Apple",
      img: "https://zennara-storage.s3.ap-south-1.amazonaws.com/devices/1772119627084_a0230a04-68dd-4534-aa03-7819d13508bd.webp",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944712/purepng.com-apple-logologobrand-logoiconslogos-251519938788qhgdl_xqyc0y.png",
    },
    {
      name: "Samsung",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683028/samsung-galaxy-a26-Photoroom_ylusuo.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944773/530-5309308_samsung-logo-70kb-samsung-india-logo-png-transparent-removebg-preview_mhzbxf.png",
    },
    {
      name: "Huawei",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683094/huawei-p50-1-Photoroom_zhahe0.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944714/Huawei_Standard_logo.svg_b4lrzq.png",
    },
    {
      name: "Xiaomi",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683169/Xiomi_11_rs8lgy.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683310/Mi-logo-01_dqbplx.png",
    },
    {
      name: "OnePlus",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683241/71YzJwmRFCL._AC_UF1000_1000_QL80_-Photoroom_fdwvix.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774681526/OnePlus-Logo.wine_brmn8o.png",
    },
    {
      name: "Oppo",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683405/71bJPEYX-XL._AC_UF1000_1000_QL80__i5p3fk.jpg",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774681430/oppo-logo_ncyq5n.png",
    },
    {
      name: "Google Pixel",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883533/Google_Phones_lid7bn.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883781/Google-pixel-wordmark-logo_wmlecz-Photoroom_pxidor.png",
    },
    {
      name: "Motorola",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883533/Motorola_Phone_uzd4zq.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883715/Motorola_new_logo_pzvxpx.svg",
    },
    {
      name: "Sony",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883534/Sony_Phones_aj7b7a.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883709/2012-xperia-logo_fqulcx.png",
    },
    {
      name: "Honor",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883534/Honor_Phones_kbuagk.png",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774883710/Honor-Logo-2011_x8ufhf.png",
    },
  ],
  watch: [
    {
      name: "Apple Watch",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774882276/iphone-repairs-300x300-1_xignqv.webp",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944712/purepng.com-apple-logologobrand-logoiconslogos-251519938788qhgdl_xqyc0y.png",
    },
    {
      name: "Samsung Watch",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774882276/samsung-repairs-300x300-1_egdhdq.webp",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944773/530-5309308_samsung-logo-70kb-samsung-india-logo-png-transparent-removebg-preview_mhzbxf.png",
    },
  ],
  tablet: [
    {
      name: "iPad",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774882276/iphone-repairs-300x300-1_xignqv.webp",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944712/purepng.com-apple-logologobrand-logoiconslogos-251519938788qhgdl_xqyc0y.png",
    },
    {
      name: "Samsung Tab",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774882276/samsung-repairs-300x300-1_egdhdq.webp",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944773/530-5309308_samsung-logo-70kb-samsung-india-logo-png-transparent-removebg-preview_mhzbxf.png",
    },
    {
      name: "Huawei Tab",
      img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774882276/huawei-repair-300x300-1_i89kxr.webp",
      brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944714/Huawei_Standard_logo.svg_b4lrzq.png",
    },
  ],
};

const tabs = [
  { key: "phone", label: "Phone", icon: Smartphone },
  { key: "watch", label: "Watch", icon: Watch },
  { key: "tablet", label: "Tablet", icon: Tablet },
] as const;

type TabKey = keyof typeof tabData;

export default function BookRepair() {
  const [activeTab, setActiveTab] = useState<TabKey>("phone");
  return (
    <div
      className="min-h-screen bg-white"
      style={{
        ...NAV_FONT,
        backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >

      {/* Header bar */}
      <div className="border-b border-[#e8eaed] bg-white/80 backdrop-blur-sm px-6 py-3 flex items-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8eaed] text-[13px] font-medium text-[#202124] hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          style={NAV_FONT}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Book a Repair
        </a>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Heading */}
        <div className="mb-12 text-center">
          <h1
            className="text-[32px] md:text-[40px] font-bold text-[#202124] leading-tight"
            style={NAV_FONT}
          >
            Find your brand for <span className="text-red-600">repair</span>
          </h1>
          <p className="mt-3 text-[15px] text-[#5f6368]" style={NAV_FONT}>
            Select your device brand to get started
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

        {/* Brand grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tabData[activeTab].map((brand) => (
            <button
              key={brand.name}
              className="group flex flex-col items-center gap-4 rounded-2xl p-6 border border-[#e8eaed] hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer bg-[#f5f5f7]"
            >
              <img
                src={brand.img}
                alt={brand.name}
                className="w-[100px] h-[100px] object-contain group-hover:scale-105 transition-transform duration-200"
              />
              <div className="flex items-center justify-between w-full px-1 gap-2">
                <span
                  className="text-[13px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors truncate"
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
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
