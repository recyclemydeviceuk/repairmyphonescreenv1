import { Link } from "react-router-dom";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const devices = [
  {
    label: "iPhone Repairs",
    subLabel: "All iPhone models",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638473/Untitled-design-Photoroom_diciwg.png",
    alt: "iPhone repairs",
    to: "/book-repair/iphone",
  },
  {
    label: "Samsung Repairs",
    subLabel: "All Galaxy models",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638473/Untitled-design-Photoroom_diciwg.png",
    alt: "Samsung repairs",
    to: "/book-repair/samsung",
  },
  {
    label: "Other Smartphones",
    subLabel: "Huawei, Pixel, Xiaomi & more",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638473/Untitled-design-Photoroom_diciwg.png",
    alt: "Other smartphone repairs",
    to: "/book-repair/phone",
  },
  {
    label: "iPad & Tablet Repairs",
    subLabel: "iPad, Galaxy Tab & more",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638472/ipad-11-10-9-2025-1765262033-Photoroom_tskotk.png",
    alt: "iPad and tablet repairs",
    to: "/book-repair/tablet",
  },
  {
    label: "iWatch Repairs",
    subLabel: "All Apple Watch models",
    img: "https://res.cloudinary.com/dn2sab6qc/image/upload/v1774638473/2024-FEB-PRODUCT-RANGE-1-1024x499-Photoroom_dcih9f.png",
    alt: "iWatch repairs",
    to: "/book-repair/watch",
  },
];

export default function DevicesSection() {
  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2
              className="text-[26px] md:text-[30px] font-bold text-[#202124] leading-tight"
              style={NAV_FONT}
            >
              Select Your Device
            </h2>
            <p
              className="text-[13px] text-[#5f6368] mt-1"
              style={NAV_FONT}
            >
              Select your device to get an instant repair price.
            </p>
          </div>

          {/* Red arrow button — outlined default, filled on hover */}
          <Link
            to="/book-repair"
            className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-red-600 bg-transparent flex items-center justify-center mt-1 transition-all duration-300 ease-in-out hover:bg-red-600 group/arrow"
            aria-label="View all devices"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-red-600 group-hover/arrow:stroke-white transition-all duration-300 ease-in-out"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>

        {/* Device cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {devices.map((device) => (
            <Link
              key={device.label}
              to={device.to}
              className="group flex flex-col items-center"
            >
              {/* Card */}
              <div className="w-full bg-gradient-to-br from-[#f0f4ff] to-[#fff0f0] rounded-3xl overflow-hidden flex items-center justify-center p-8 aspect-[4/3] transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-gray-100">
                <img
                  src={device.img}
                  alt={device.alt}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </div>

              {/* Label */}
              <p
                className="mt-4 text-[18px] text-[#202124] font-bold group-hover:text-red-600 transition-colors"
                style={NAV_FONT}
              >
                {device.label}
              </p>
              <p
                className="mt-1 text-[12px] text-[#5f6368]"
                style={NAV_FONT}
              >
                {device.subLabel}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
