import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const stats = [
  { value: "10,000+", label: "Devices repaired" },
  { value: "4.9★", label: "Average rating" },
  { value: "12 Months", label: "Warranty on all repairs" },
  { value: "Same day", label: "Turnaround" },
];

const values = [
  {
    title: "Honest pricing",
    desc: "No hidden fees. You see the price before you book, and that's exactly what you pay.",
  },
  {
    title: "Quality parts",
    desc: "We only use high-quality, rigorously tested parts so your device performs exactly as it should.",
  },
  {
    title: "Backed by warranty",
    desc: "Every repair we carry out comes with a warranty because we stand behind our work.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main
        className="min-h-[calc(100vh-64px)] bg-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(156, 163, 175, 0.28) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="max-w-3xl">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              About us
            </p>
            <h1
              className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[52px]"
              style={NAV_FONT}
            >
              We fix phones.<br />
              <span className="text-red-600">Properly.</span>
            </h1>
            <p
              className="mt-6 max-w-xl text-[16px] leading-8 text-[#5f6368]"
              style={NAV_FONT}
            >
              Repair My Phone Screen is a specialist mail-in repair service based in Preston, UK.
              We've been restoring cracked, damaged and broken devices for customers across the
              country — quickly, affordably, and with a warranty on every job.
            </p>
          </div>
        </section>

        {/* ── Full-width image mosaic ───────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid h-[440px] grid-cols-3 gap-3 overflow-hidden rounded-[28px]">
            <div className="col-span-2 overflow-hidden rounded-[24px]">
              <img
                src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774457190/electronic-technician-holds-two-identical-smartphones-comparison-one-hand-broken-another-new_qbprwp.jpg"
                alt="Technician comparing repaired and broken phone"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex-1 overflow-hidden rounded-[24px]">
                <img
                  src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774457316/yung-bearded-master-looks-inside-disassembled-electronic-device-while-repairing-it-with-tools_zzec0r.jpg"
                  alt="Technician repairing a device"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden rounded-[24px]">
                <img
                  src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1774457188/repairman-uses-magnifier-tweezers-repair-damaged-smartphone-close-up-photo-disassembled-smartphone_udzuoo.jpg"
                  alt="Close-up of smartphone repair"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[24px] border border-[#f3f4f6] bg-white px-6 py-7 text-center"
              >
                <p
                  className="text-[26px] font-bold text-red-600"
                  style={NAV_FONT}
                >
                  {s.value}
                </p>
                <p
                  className="mt-1 text-[13px] text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Our values ───────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-10">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              What we stand for
            </p>
            <h2
              className="mt-3 text-[30px] font-bold text-[#202124]"
              style={NAV_FONT}
            >
              Built on trust, not just tech.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-[24px] border border-[#f3f4f6] bg-white p-7"
              >
                <h3
                  className="text-[18px] font-semibold text-[#202124]"
                  style={NAV_FONT}
                >
                  {v.title}
                </h3>
                <p
                  className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {v.desc}
                </p>
              </div>
            ))}
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
                Ready to get your device fixed?
              </h2>
              <p
                className="mt-2 text-[15px] text-white/80"
                style={NAV_FONT}
              >
                Book a mail-in repair today. Fast, simple, and covered by warranty.
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
