import { useState } from "react";
import { ChevronDown } from "lucide-react";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const faqs = [
  {
    q: "How do I send my phone to you?",
    a: "Simply book your repair online, pack your device securely, and post it to us using any courier. We recommend using a tracked service for peace of mind.",
  },
  {
    q: "How long does a mail-in repair take?",
    a: "Most repairs are completed the same day your device arrives. You'll receive it back within 1–3 working days depending on your location.",
  },
  {
    q: "What parts do you use for repairs?",
    a: "We use high-quality, rigorously tested replacement parts for all our repairs to ensure the best performance and longevity for your device.",
  },
  {
    q: "Is my repair covered by a warranty?",
    a: "All our repairs come with a 12-month warranty covering both parts and labour. If anything goes wrong, we'll fix it at no extra cost.",
  },
  {
    q: "How much does a repair cost?",
    a: "Costs vary by device and repair type. You can get an instant quote on our booking page — no hidden fees, ever.",
  },
  {
    q: "What devices do you repair?",
    a: "We repair a wide range of smartphones, tablets, and smartwatches including iPhone, Samsung, Huawei, Xiaomi, iPad, and more.",
  },
  {
    q: "Is my data safe during the repair?",
    a: "Absolutely. Our technicians only access what's needed to carry out the repair. We strongly recommend backing up your device before sending it.",
  },
  {
    q: "How do I track my repair?",
    a: "Once you book, you'll receive a unique order number you can use to track the status of your repair at any time through our website.",
  },
  {
    q: "Do you offer free return delivery?",
    a: "Yes — return delivery is completely free. We cover the cost of getting your repaired device back to you.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faqs" className="w-full bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top border */}
        <div className="border-t border-[#e8eaed] mb-10" />

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">

          {/* LEFT — FAQ label */}
          <div className="md:w-48 flex-shrink-0">
            <h2
              className="text-[22px] font-bold text-[#202124]"
              style={NAV_FONT}
            >
              FAQ
            </h2>
          </div>

          {/* RIGHT — accordion list */}
          <div className="flex-1 divide-y divide-[#e8eaed]">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between py-4 text-left group"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span
                    className="text-[14px] text-[#202124] pr-8 leading-snug"
                    style={NAV_FONT}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-[#5f6368] transition-transform duration-200 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer — smooth height transition */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: open === i ? "200px" : "0px" }}
                >
                  <div
                    className="pb-4 text-[13px] text-[#5f6368] leading-relaxed pr-10"
                    style={NAV_FONT}
                  >
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
