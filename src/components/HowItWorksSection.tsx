import { CreditCard, PackageOpen, Wrench } from "lucide-react";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const steps = [
  {
    icon: <CreditCard size={22} strokeWidth={2} className="text-red-600" />,
    title: "Book Online",
    desc: "Pay online and receive a unique order number to track your repair.",
  },
  {
    icon: <PackageOpen size={22} strokeWidth={2} className="text-red-600" />,
    title: "Post Your Device",
    desc: "Pack securely and post to our repair centre — we start work the moment it arrives.",
  },
  {
    icon: <Wrench size={22} strokeWidth={2} className="text-red-600" />,
    title: "Repair and Return",
    desc: "We will repair your device and send it to your address.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#f7f8fc] pt-16 md:pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top label + heading */}
        <p
          className="text-[13px] text-[#5f6368] mb-2"
          style={NAV_FONT}
        >
          Three steps to a fixed phone.
        </p>
        <h2
          className="text-[28px] md:text-[38px] font-bold text-[#202124] mb-12 leading-tight"
          style={NAV_FONT}
        >
          Mail-In your phone for&nbsp; repair
        </h2>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row items-end gap-10 md:gap-16">

          {/* LEFT — image pinned to bottom */}
          <div className="flex-1 w-full flex items-end justify-center self-end">
            <img
              src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774639983/3_steps_image_oe5egt.png"
              alt="Mail-in phone repair process"
              className="w-full max-w-[600px] h-auto object-contain object-bottom"
            />
          </div>

          {/* RIGHT — steps */}
          <div className="flex-1 w-full flex flex-col gap-9">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-5">
                {/* Step icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  {step.icon}
                </div>

                {/* Text */}
                <div>
                  <p
                    className="text-[16px] font-bold text-[#202124] mb-1"
                    style={NAV_FONT}
                  >
                    {step.title}
                  </p>
                  <p
                    className="text-[14px] text-[#5f6368] leading-relaxed max-w-xs"
                    style={NAV_FONT}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
