import { Link } from "react-router-dom";
import { CreditCard, PackageOpen, Wrench, Shield, Clock, Truck, Lock, Award, ThumbsUp } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const steps = [
  {
    number: "01",
    title: "Book Online",
    desc: "Choose your device, select your repair type, and pay securely online. You'll receive a unique order number instantly so you can track every step.",
    icon: <CreditCard size={24} strokeWidth={1.8} className="text-red-600" />,
    bg: "bg-[#fff0f0]",
    illustration: (
      <svg width="180" height="180" viewBox="0 0 120 120" fill="none">
        <rect x="18" y="30" width="84" height="56" rx="8" fill="#fee2e2" />
        <rect x="18" y="30" width="84" height="56" rx="8" stroke="#ef4444" strokeWidth="3" />
        <rect x="18" y="30" width="84" height="18" rx="8" fill="#ef4444" />
        <rect x="18" y="40" width="84" height="8" fill="#ef4444" />
        <rect x="30" y="60" width="24" height="4" rx="2" fill="#ef4444" />
        <rect x="30" y="70" width="40" height="4" rx="2" fill="#fca5a5" />
        <rect x="75" y="57" width="16" height="10" rx="3" fill="#ef4444" />
        <circle cx="88" cy="22" r="14" fill="#ef4444" />
        <path d="M83 22l3.5 3.5L93 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Post Your Device",
    desc: "Pack your device securely and post it to our Preston repair centre using special tracked delivery. We start work the moment it arrives — usually the same day.",
    icon: <PackageOpen size={24} strokeWidth={1.8} className="text-red-600" />,
    bg: "bg-[#fff5f5]",
    illustration: (
      <svg width="180" height="180" viewBox="0 0 120 120" fill="none">
        <rect x="22" y="42" width="76" height="52" rx="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" />
        <path d="M22 58h76" stroke="#ef4444" strokeWidth="2.5" />
        <path d="M60 42v16" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 3" />
        <path d="M44 30l16-10 16 10v12H44V30z" fill="#ef4444" />
        <path d="M52 30l8 5 8-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="85" cy="80" r="10" fill="#ef4444" />
        <path d="M80 80l3.5 3.5L90 74" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "We Repair & Return",
    desc: "Our technicians carry out your repair using high-quality parts. Once done, we test it thoroughly and send it straight back to you via special tracked delivery — free of charge. Most repairs are completed the same day we receive your device.",
    icon: <Wrench size={24} strokeWidth={1.8} className="text-red-600" />,
    bg: "bg-[#fff0f0]",
    illustration: (
      <svg width="180" height="180" viewBox="0 0 120 120" fill="none">
        <rect x="30" y="22" width="60" height="76" rx="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" />
        <rect x="42" y="35" width="36" height="28" rx="4" fill="white" stroke="#fca5a5" strokeWidth="1.5" />
        <circle cx="60" cy="49" r="8" fill="#ef4444" />
        <path d="M57 49l2.5 2.5L65 45" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="42" y="72" width="14" height="4" rx="2" fill="#fca5a5" />
        <rect x="60" y="72" width="18" height="4" rx="2" fill="#ef4444" />
        <rect x="42" y="80" width="36" height="4" rx="2" fill="#fca5a5" />
        <path d="M90 35 Q100 48 90 61" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" fill="none" markerEnd="url(#arr)" />
        <path d="M88 59l4 3-1-5" fill="#ef4444" />
      </svg>
    ),
  },
];

const promises = [
  {
    icon: <Shield size={22} strokeWidth={1.8} className="text-red-600" />,
    title: "12-month warranty",
    desc: "Every repair is backed by a 12-month warranty on parts and labour.",
  },
  {
    icon: <Clock size={22} strokeWidth={1.8} className="text-red-600" />,
    title: "Same-day turnaround",
    desc: "We fix your device the same day it arrives and dispatch it straight back.",
  },
  {
    icon: <Truck size={22} strokeWidth={1.8} className="text-red-600" />,
    title: "Free return delivery",
    desc: "We cover the full cost of returning your repaired device to you.",
  },
];

const postalReassurance = [
  {
    icon: <Truck size={22} strokeWidth={1.8} className="text-red-600" />,
    title: "Fully tracked & insured return delivery",
    desc: "Every device is returned using special tracked, fully insured delivery — you can track it every step of the way.",
  },
  {
    icon: <Award size={22} strokeWidth={1.8} className="text-red-600" />,
    title: "Devices handled by experienced technicians",
    desc: "Your device is only touched by qualified technicians with years of repair experience.",
  },
  {
    icon: <Lock size={22} strokeWidth={1.8} className="text-red-600" />,
    title: "Secure workshop environment",
    desc: "Your device is kept safe in our secure Preston workshop with full CCTV monitoring at all times.",
  },
  {
    icon: <ThumbsUp size={22} strokeWidth={1.8} className="text-red-600" />,
    title: "Hundreds of successful repairs completed",
    desc: "Thousands of satisfied customers across the UK trust us with their devices every month.",
  },
];

export default function HowItWorksPage() {
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
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 md:pt-24 text-center">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            How it works
          </p>
          <h1
            className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[52px]"
            style={NAV_FONT}
          >
            Three steps to a{" "}
            <span className="text-red-600">fixed phone.</span>
          </h1>
          <p
            className="mt-5 mx-auto max-w-lg text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            Our mail-in repair service is simple, fast, and completely trackable
            from the moment you book.
          </p>
        </section>

        {/* ── Steps ────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-col gap-6">
            {steps.map((step, i) => {
              const isEven = i % 2 === 1;
              return (
                <div
                  key={step.number}
                  className={`flex flex-col gap-0 overflow-hidden rounded-[32px] border border-[#f3f4f6] bg-white md:flex-row ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Illustration panel */}
                  <div className={`h-[260px] md:h-auto md:w-[45%] flex-shrink-0 flex items-center justify-center ${step.bg}`}>
                    {step.illustration}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center px-8 py-10 md:px-12 md:py-12">
                    <span
                      className="text-[48px] font-black leading-none text-[#f3f4f6]"
                      style={NAV_FONT}
                    >
                      {step.number}
                    </span>
                    <h2
                      className="mt-3 text-[24px] font-bold text-[#202124]"
                      style={NAV_FONT}
                    >
                      {step.title}
                    </h2>
                    <p
                      className="mt-4 max-w-sm text-[15px] leading-8 text-[#5f6368]"
                      style={NAV_FONT}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Our promises ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-4 md:grid-cols-3">
            {promises.map((p) => (
              <div
                key={p.title}
                className="rounded-[24px] border border-[#f3f4f6] bg-white px-7 py-7"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50">
                  {p.icon}
                </div>
                <h3
                  className="text-[16px] font-bold text-[#202124]"
                  style={NAV_FONT}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-2 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Postal reassurance ──────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-[28px] border border-[#f3f4f6] bg-[#fafafa] px-8 py-9 md:px-12 md:py-10">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              Your device is in safe hands
            </p>
            <h2
              className="mt-3 text-[24px] md:text-[28px] font-bold text-[#202124]"
              style={NAV_FONT}
            >
              Peace of mind with every postal repair
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {postalReassurance.map((r) => (
                <div
                  key={r.title}
                  className="flex items-start gap-4 rounded-[20px] border border-[#f3f4f6] bg-white px-6 py-5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50">
                    {r.icon}
                  </div>
                  <div>
                    <h3
                      className="text-[15px] font-bold text-[#202124]"
                      style={NAV_FONT}
                    >
                      {r.title}
                    </h3>
                    <p
                      className="mt-1 text-[13px] leading-6 text-[#5f6368]"
                      style={NAV_FONT}
                    >
                      {r.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-red-600 px-8 py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <h2
                className="text-[26px] font-bold leading-tight text-white md:text-[30px]"
                style={NAV_FONT}
              >
                Ready to get started?
              </h2>
              <p className="mt-2 text-[15px] text-white/80" style={NAV_FONT}>
                Most repairs are completed the same day we receive your device.
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
