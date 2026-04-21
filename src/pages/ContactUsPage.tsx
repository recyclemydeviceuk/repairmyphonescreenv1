import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { submitContactForm } from "../lib/api";
import { useSiteSettings } from "../lib/SiteSettingsContext";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};


export default function ContactUsPage() {
  const { general } = useSiteSettings();

  // Build contact cards dynamically from settings
  const waNumber = general.whatsappNumber.replace(/[\s+()-]/g, "") || "447761665499";
  const contactCards = [
    ...(general.whatsappNumber ? [{
      label: "WhatsApp",
      value: general.whatsappNumber.startsWith("+") ? general.whatsappNumber : `+${waNumber}`,
      sub: "Tap to chat now",
      href: `https://wa.me/${waNumber}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    }] : []),
    ...(general.phone ? [{
      label: "National Number",
      value: general.phone,
      sub: "Mon–Sat, 9am–6pm",
      href: `tel:${general.phone.replace(/[\s+()-]/g, "")}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
        </svg>
      ),
    }] : []),
    ...(general.email ? [{
      label: "Email Us",
      value: general.email,
      sub: "We reply within 1 hour",
      href: `mailto:${general.email}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    }] : []),
    ...(general.address ? [{
      label: "Visit Us",
      value: general.address,
      sub: "Our repair centre",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(general.address)}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    }] : []),
    {
      label: "Company Number",
      value: "13087298",
      sub: "Limited Company",
      href: null,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      ),
    },
  ];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitContactForm(form);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            Contact us
          </p>
          <h1
            className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[52px]"
            style={NAV_FONT}
          >
            We'd love to{" "}
            <span className="text-red-600">hear from you.</span>
          </h1>
          <p
            className="mt-5 mx-auto max-w-lg text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            Have a question, a repair to book, or just want to say hello? Our
            team typically responds within 1 business hour.
          </p>
        </section>

        {/* ── Form + Cards ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-2 md:items-start">

            {/* LEFT — Form */}
            <div className="rounded-[28px] border border-[#f3f4f6] bg-white px-8 py-9">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-[22px] font-bold text-[#202124]" style={NAV_FONT}>
                    Message sent!
                  </h3>
                  <p className="text-[14px] text-[#5f6368] max-w-xs leading-7" style={NAV_FONT}>
                    Thanks for reaching out. We'll get back to you within 1 business hour.
                  </p>
                </div>
              ) : (
                <>
                  <p
                    className="text-[12px] font-semibold uppercase tracking-[0.14em] text-red-600 mb-1"
                    style={NAV_FONT}
                  >
                    Your details
                  </p>
                  <h2
                    className="text-[22px] font-bold text-[#202124] mb-6"
                    style={NAV_FONT}
                  >
                    Let us know how to get back to you.
                  </h2>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="John Smith"
                          value={form.name}
                          onChange={handleChange}
                          className="rounded-[14px] border border-[#e8eaed] bg-[#fafafa] px-4 py-3 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                          style={NAV_FONT}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
                          Phone Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="07700 900000"
                          value={form.phone}
                          onChange={handleChange}
                          className="rounded-[14px] border border-[#e8eaed] bg-[#fafafa] px-4 py-3 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                          style={NAV_FONT}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="rounded-[14px] border border-[#e8eaed] bg-[#fafafa] px-4 py-3 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                        style={NAV_FONT}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-[#202124]" style={NAV_FONT}>
                        How can we help?
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Comments / Questions..."
                        value={form.message}
                        onChange={handleChange}
                        className="rounded-[14px] border border-[#e8eaed] bg-[#fafafa] px-4 py-3 text-[14px] text-[#202124] placeholder-[#adb5bd] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none"
                        style={NAV_FONT}
                      />
                    </div>

                    {error && <p className="text-[13px] font-medium text-red-600" style={NAV_FONT}>{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-1 self-start rounded-full bg-red-600 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
                      style={NAV_FONT}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>

                    <p className="text-[12px] text-[#5f6368]" style={NAV_FONT}>
                      We typically respond within 1 business hour during opening times.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* RIGHT — Contact cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contactCards.map((card) => {
                const inner = (
                  <div className="flex flex-col gap-3 h-full">
                    <span className="text-red-600">{card.icon}</span>
                    <div>
                      <p
                        className="text-[12px] font-semibold uppercase tracking-[0.13em] text-[#5f6368]"
                        style={NAV_FONT}
                      >
                        {card.label}
                      </p>
                      <p
                        className="mt-1 text-[13px] font-semibold text-[#202124] break-all leading-snug"
                        style={NAV_FONT}
                      >
                        {card.value}
                      </p>
                      <p
                        className="mt-1 text-[13px] text-[#5f6368]"
                        style={NAV_FONT}
                      >
                        {card.sub}
                      </p>
                    </div>
                  </div>
                );

                return card.href ? (
                  <a
                    key={card.label}
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="rounded-[24px] border border-[#f3f4f6] bg-white px-6 py-6 transition-shadow duration-200 hover:shadow-md"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={card.label}
                    className="rounded-[24px] border border-[#f3f4f6] bg-white px-6 py-6"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
