import { useRef } from "react";
import { Link } from "react-router-dom";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const devices = [
  {
    model: "iPhone 16",
    brand: "Apple",
    img: "https://zennara-storage.s3.ap-south-1.amazonaws.com/devices/1772119627084_a0230a04-68dd-4534-aa03-7819d13508bd.webp",
    brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944712/purepng.com-apple-logologobrand-logoiconslogos-251519938788qhgdl_xqyc0y.png",
    imgSize: "w-[155px] h-[200px]",
    to: "/book-repair/phone/apple/models/iphone-16",
  },
  {
    model: "Galaxy A26 5G",
    brand: "Samsung",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683028/samsung-galaxy-a26-Photoroom_ylusuo.png",
    brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944773/530-5309308_samsung-logo-70kb-samsung-india-logo-png-transparent-removebg-preview_mhzbxf.png",
    to: "/book-repair/phone/samsung/galaxy-a-series/models/galaxy-a26-5g",
  },
  {
    model: "P50",
    brand: "Huawei",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683094/huawei-p50-1-Photoroom_zhahe0.png",
    brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773944714/Huawei_Standard_logo.svg_b4lrzq.png",
    to: "/book-repair/phone/huawei/huawei-p-series/models/p50",
  },
  {
    model: "Xiaomi 15",
    brand: "Xiaomi",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683169/Xiomi_11_rs8lgy.png",
    brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683310/Mi-logo-01_dqbplx.png",
    to: "/book-repair/phone/xiaomi/models/xiaomi-15",
  },
  {
    model: "OnePlus 12",
    brand: "OnePlus",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683241/71YzJwmRFCL._AC_UF1000_1000_QL80_-Photoroom_fdwvix.png",
    brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774681526/OnePlus-Logo.wine_brmn8o.png",
    to: "/book-repair/phone/oneplus/oneplus-number-series/models/oneplus-12",
  },
  {
    model: "Reno 13 Pro",
    brand: "Oppo",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774683405/71bJPEYX-XL._AC_UF1000_1000_QL80__i5p3fk.jpg",
    brandLogo: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774681430/oppo-logo_ncyq5n.png",
    to: "/book-repair/phone/oppo/oppo-reno-series/models/reno-13-pro",
  },
];

export default function ExploreDevicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-14 md:py-18">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-[24px] md:text-[28px] font-bold text-[#202124]"
            style={NAV_FONT}
          >
            Explore Devices
          </h2>

          {/* Arrow nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-[#dadce0] flex items-center justify-center hover:border-red-600 hover:text-red-600 text-[#5f6368] transition-colors"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-[#dadce0] flex items-center justify-center hover:border-red-600 hover:text-red-600 text-[#5f6368] transition-colors"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {devices.map((device) => (
            <Link
              key={device.model}
              to={device.to}
              className="flex-shrink-0 w-[200px] flex flex-col group"
            >
              {/* Image card */}
              <div className="w-full h-[220px] bg-[#f5f5f7] rounded-xl flex items-center justify-center p-4 mb-3 transition-shadow duration-200 group-hover:shadow-md">
                <img
                  src={device.img}
                  alt={device.model}
                  className={`${device.imgSize ?? "w-[120px] h-[180px]"} object-contain`}
                />
              </div>

              {/* Name + brand logo */}
              <div className="flex items-center justify-between mb-1 px-0.5">
                <p
                  className="text-[14px] font-semibold text-[#202124]"
                  style={NAV_FONT}
                >
                  {device.model}
                </p>
                <img src={device.brandLogo} alt={device.brand} className="h-5 w-auto object-contain" />
              </div>

              {/* Repair label */}
              <span
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-red-600 px-0.5"
                style={NAV_FONT}
              >
                Repair
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="10 8 14 12 10 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
