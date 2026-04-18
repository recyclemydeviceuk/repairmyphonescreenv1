import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Truck, Shield, CheckCircle2, BadgePoundSterling } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const reasons = [
  {
    icon: <Clock size={26} strokeWidth={1.8} className="text-red-600" />,
    title: "Same-day repair once received",
    desc: "As soon as your device arrives at our Preston workshop, we get to work. Most repairs are finished the same day and dispatched back to you immediately.",
  },
  {
    icon: <Truck size={26} strokeWidth={1.8} className="text-red-600" />,
    title: "UK-wide postal service",
    desc: "Send your device from anywhere in the UK. Our postal repair service covers England, Scotland, Wales and Northern Ireland — no need to leave your home.",
  },
  {
    icon: <Shield size={26} strokeWidth={1.8} className="text-red-600" />,
    title: "Fully tracked & insured delivery",
    desc: "We use special tracked, fully insured delivery for every device — both ways. You'll be able to track your device every step of the way.",
  },
  {
    icon: <CheckCircle2 size={26} strokeWidth={1.8} className="text-red-600" />,
    title: "12-month warranty on all repairs",
    desc: "Every repair we carry out is backed by a 12-month warranty on both parts and labour. If anything goes wrong, we'll put it right — no questions asked.",
  },
  {
    icon: <BadgePoundSterling size={26} strokeWidth={1.8} className="text-red-600" />,
    title: "No Fix, No Fee guarantee",
    desc: "If we can't repair your device, you won't pay a penny. Simple as that — it's our promise to you.",
  },
];

export default function WhyChooseUsPage() {
  useEffect(() => {
    document.title = "Why Choose Us | Repair My Phone Screen";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Why choose Repair My Phone Screen — same-day repair, UK-wide postal service, fully tracked delivery, 12-month warranty, and our No Fix No Fee guarantee.",
      );
    }
  }, []);

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
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 md:pt-24 text-center">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Why Choose Us
          </p>
          <h1
            className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[52px]"
            style={NAV_FONT}
          >
            Trusted by thousands across the UK
          </h1>
          <p
            className="mt-5 mx-auto max-w-xl text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            We've built our reputation on fast, honest, fully-backed repairs. Here's why customers across the UK choose us for their phone and tablet repairs.
          </p>
        </section>

        {/* Reasons grid */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="grid gap-5 md:grid-cols-2">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="rounded-[24px] border border-[#f3f4f6] bg-white p-7 hover:border-red-200 hover:shadow-md transition-all duration-200"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                  {r.icon}
                </div>
                <h2
                  className="text-[18px] font-bold text-[#202124]"
                  style={NAV_FONT}
                >
                  {r.title}
                </h2>
                <p
                  className="mt-2 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Guarantee callout */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="rounded-[28px] bg-red-50 border border-red-100 px-8 py-8 md:px-12 md:py-10 text-center">
            <h2
              className="text-[22px] md:text-[26px] font-bold text-[#202124]"
              style={NAV_FONT}
            >
              Most repairs are completed the same day we receive your device
            </h2>
            <p
              className="mt-3 mx-auto max-w-xl text-[14px] leading-7 text-[#5f6368]"
              style={NAV_FONT}
            >
              Fast turnaround, fully tracked return delivery, and a 12-month warranty — that's the Repair My Phone Screen standard.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-red-600 px-8 py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <h2
                className="text-[26px] font-bold leading-tight text-white md:text-[30px]"
                style={NAV_FONT}
              >
                Ready to get started?
              </h2>
              <p className="mt-2 text-[15px] text-white/80" style={NAV_FONT}>
                Book your repair in minutes — no technical knowledge needed.
              </p>
            </div>
            <Link
              to="/book-repair"
              className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
              style={NAV_FONT}
            >
              Get Your Repair Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
