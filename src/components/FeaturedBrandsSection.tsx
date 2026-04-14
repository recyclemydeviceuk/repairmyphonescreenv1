import { Link } from "react-router-dom";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

export default function FeaturedBrandsSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Mosaic grid */}
        <div className="grid grid-cols-2 gap-3 h-[580px]">

          {/* LEFT — large panel, light lavender bg */}
          <Link to="/book-repair/phone/samsung/galaxy-s-series/models" className="relative rounded-2xl overflow-hidden bg-[#eceef8] flex items-end justify-center block">
            <img
              src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774679035/Samsung_S_Series-Photoroom_budlnh.png"
              alt="Samsung Galaxy S Series"
              className="absolute inset-x-4 top-4 bottom-0 w-[calc(100%-2rem)] h-[calc(100%-1rem)] object-contain object-bottom"
            />
            {/* Label */}
            <div className="absolute top-4 left-4 z-10">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#202124]/50 font-medium" style={NAV_FONT}>Samsung</p>
              <p className="text-[15px] font-semibold text-[#202124]" style={NAV_FONT}>Galaxy S Series</p>
            </div>
          </Link>

          {/* RIGHT — two stacked panels */}
          <div className="flex flex-col gap-3">

            {/* TOP — solid blue bg */}
            <Link to="/book-repair/phone/huawei/huawei-p-series/models" className="relative rounded-2xl overflow-hidden bg-red-600 flex-1 block">
              <img
                src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774679036/P_Series_mpvfhw.png"
                alt="Huawei P Series"
                className="absolute inset-x-4 top-4 bottom-0 w-[calc(100%-2rem)] h-[calc(100%-1rem)] object-contain object-bottom"
              />
              {/* Label */}
              <div className="absolute top-4 left-4 z-10">
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/60 font-medium" style={NAV_FONT}>Huawei</p>
                <p className="text-[15px] font-semibold text-white" style={NAV_FONT}>P Series</p>
              </div>
            </Link>

            {/* BOTTOM — light steel blue bg */}
            <Link to="/book-repair/phone/xiaomi/models/xiaomi-11" className="relative rounded-2xl overflow-hidden bg-[#dde3ef] flex-1 block">
              <img
                src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774679237/Xiomi_11_S-Photoroom_zi3ru4.png"
                alt="Xiaomi 11 Series"
                className="absolute inset-x-4 top-4 bottom-0 w-[calc(100%-2rem)] h-[calc(100%-1rem)] object-contain object-bottom"
              />
              {/* Label */}
              <div className="absolute top-4 left-4 z-10">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#202124]/50 font-medium" style={NAV_FONT}>Xiaomi</p>
                <p className="text-[15px] font-semibold text-[#202124]" style={NAV_FONT}>11 Series</p>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
