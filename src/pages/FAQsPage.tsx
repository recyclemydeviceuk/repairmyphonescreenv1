import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const categories = [
  {
    label: "Sending your device",
    faqs: [
      {
        q: "How do I send my phone to you?",
        a: "Simply book your repair online, pack your device securely, and post it to us using any courier. We recommend using a tracked service for peace of mind.",
      },
      {
        q: "Do I need to include anything with my device?",
        a: "Just your device — no chargers, cases or accessories are needed. If your device has a passcode or screen lock, please include it in the notes when booking.",
      },
      {
        q: "How should I pack my phone?",
        a: "Wrap your device in bubble wrap or similar protective material and place it in a sturdy box. Avoid using padded envelopes as they offer limited protection in transit.",
      },
    ],
  },
  {
    label: "Repairs & turnaround",
    faqs: [
      {
        q: "How long does a mail-in repair take?",
        a: "Most repairs are completed the same day your device arrives. You'll receive it back within 1–3 working days depending on your location.",
      },
      {
        q: "Do you use genuine parts?",
        a: "Yes. We use high-quality OEM and genuine manufacturer parts for all repairs to ensure the best performance and longevity.",
      },
      {
        q: "What devices do you repair?",
        a: "We repair a wide range of smartphones, tablets, and smartwatches including iPhone, Samsung, Huawei, Xiaomi, iPad, and more.",
      },
    ],
  },
  {
    label: "Pricing & warranty",
    faqs: [
      {
        q: "How much does a repair cost?",
        a: "Costs vary by device and repair type. You can get an instant quote on our booking page — no hidden fees, ever.",
      },
      {
        q: "Is my repair covered by a warranty?",
        a: "All our repairs come with a 6-month warranty covering both parts and labour. If anything goes wrong, we'll fix it at no extra cost.",
      },
      {
        q: "Do you offer free return delivery?",
        a: "Yes — return delivery is completely free. We cover the cost of getting your repaired device back to you.",
      },
    ],
  },
  {
    label: "Data & security",
    faqs: [
      {
        q: "Is my data safe during the repair?",
        a: "Absolutely. Our technicians only access what's needed to carry out the repair. We strongly recommend backing up your device before sending it.",
      },
      {
        q: "How do I track my repair?",
        a: "Once you book, you'll receive a unique order number you can use to track the status of your repair at any time through our website.",
      },
    ],
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#f3f4f6] last:border-0">
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={onToggle}
      >
        <span
          className="pr-8 text-[15px] font-medium leading-snug text-[#202124]"
          style={NAV_FONT}
        >
          {q}
        </span>
        <span
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
            isOpen ? "bg-red-600" : "bg-[#f3f4f6]"
          }`}
        >
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180 text-white" : "text-[#5f6368]"
            }`}
          />
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "240px" : "0px" }}
      >
        <p
          className="pb-5 pr-12 text-[14px] leading-7 text-[#5f6368]"
          style={NAV_FONT}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQsPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main
        className="bg-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(156, 163, 175, 0.28) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 text-center">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Help centre
          </p>
          <h1
            className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[52px]"
            style={NAV_FONT}
          >
            Got a question?<br />
            <span className="text-red-600">We've got answers.</span>
          </h1>
          <p
            className="mt-5 mx-auto max-w-xl text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            Everything you need to know about our mail-in repair service, pricing,
            turnaround times, and more.
          </p>
        </section>

        {/* ── FAQ categories ───────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="rounded-[28px] border border-[#f3f4f6] bg-white px-7 py-6"
              >
                <p
                  className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-red-600"
                  style={NAV_FONT}
                >
                  {cat.label}
                </p>
                {cat.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openKey === `${cat.label}-${i}`}
                    onToggle={() => toggle(`${cat.label}-${i}`)}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Still have questions CTA ─────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-red-600 px-8 py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <h2
                className="text-[26px] font-bold leading-tight text-white md:text-[30px]"
                style={NAV_FONT}
              >
                Still have questions?
              </h2>
              <p
                className="mt-2 text-[15px] text-white/80"
                style={NAV_FONT}
              >
                Our team is happy to help. Drop us an email any time.
              </p>
            </div>
            <a
              href="mailto:info@repairmyphonescreen.co.uk"
              className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
              style={NAV_FONT}
            >
              Email us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
