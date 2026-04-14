import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSiteSettings } from "../../lib/SiteSettingsContext";
import {
  findBrandAndRegion,
  findCity,
  BRANDS,
  type Brand,
  type Region,
  type City,
} from "../../data/locations";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const DOT_BG: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, rgba(156, 163, 175, 0.28) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

/* ================================================================
   404 fallback
   ================================================================ */
function NotFoundFallback() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-white" style={DOT_BG}>
        <section className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1
            className="text-[42px] font-bold text-[#202124]"
            style={NAV_FONT}
          >
            Page not found
          </h1>
          <p
            className="mt-4 text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            Sorry, we couldn't find the repair location you were looking for.
            The page may have been moved or the URL might be incorrect.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-red-700"
              style={NAV_FONT}
            >
              Back to homepage
            </Link>
            <Link
              to="/book-repair"
              className="inline-flex items-center justify-center rounded-full border border-red-600 px-7 py-3.5 text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50"
              style={NAV_FONT}
            >
              Book a repair
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ================================================================
   REGIONAL HUB PAGE
   ================================================================ */
function RegionalHubPage({
  brand,
  region,
}: {
  brand: Brand;
  region: Region;
}) {
  const settings = useSiteSettings();
  const regionSlug = `${region.slug}`;

  const seoTitle = `${brand.name} Repairs in ${region.name} | Free Postage & Lifetime Warranty | Repair My Phone Screen`;
  const description = `Professional ${brand.name} screen repair service across ${region.name}. Free postage both ways, lifetime warranty on all repairs. Mail your device from any ${region.name} location.`;
  const canonicalPath = `/${regionSlug}`;

  useEffect(() => {
    document.title = seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      `https://repairmyphonescreen.co.uk${canonicalPath}`
    );

    return () => {
      document.title = "Repair My Phone Screen";
    };
  }, [seoTitle, description, canonicalPath]);

  const otherRegions = brand.regions.filter((r) => r.slug !== region.slug);

  const otherBrandsSameRegion = useMemo(() => {
    return BRANDS.filter((b) => b.baseSlug !== brand.baseSlug)
      .map((b) => {
        const match = b.regions.find(
          (r) =>
            r.name.toLowerCase() === region.name.toLowerCase()
        );
        return match ? { brand: b, region: match } : null;
      })
      .filter(Boolean) as { brand: Brand; region: Region }[];
  }, [brand.baseSlug, region.name]);

  const trustSignals = [
    {
      title: "Free Postage Both Ways",
      desc: `We send you a prepaid, padded envelope to safely post your ${brand.name} from anywhere in ${region.name}. Once repaired, we ship it straight back at no extra cost.`,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
          <rect x="1" y="6" width="22" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      title: "Lifetime Warranty",
      desc: `Every ${brand.name} screen repair we carry out is backed by a lifetime warranty on parts and workmanship. If anything goes wrong with the repair, we'll fix it free of charge.`,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Fast Turnaround",
      desc: `Most ${brand.name} repairs are completed within 1-3 working days of receiving your device. We'll keep you updated by text and email at every stage.`,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Book Your Repair Online",
      desc: `Select your ${brand.name} model, choose the repair you need, and complete payment securely online. It takes less than two minutes.`,
    },
    {
      step: "02",
      title: "Post Your Device to Us",
      desc: `We'll send you a prepaid, padded shipping envelope. Pack your ${brand.name} securely and drop it at any post box or Post Office in ${region.name}.`,
    },
    {
      step: "03",
      title: "We Repair & Return",
      desc: `Our certified technicians repair your device using high-quality parts, fully test it, and dispatch it back to you within 1-3 working days.`,
    },
  ];

  const faqs = [
    {
      q: `How do I send my ${brand.name} for repair from ${region.name}?`,
      a: `Simply book your repair online and we'll post you a prepaid, padded envelope. Place your ${brand.name} inside, seal it, and drop it at any Royal Mail post box or Post Office across ${region.name}. We'll take care of the rest.`,
    },
    {
      q: `How long does a ${brand.name} screen repair take?`,
      a: `Once we receive your device at our repair centre, most ${brand.name} screen replacements are completed within 1-3 working days. We'll send you tracking updates by text and email so you always know the status.`,
    },
    {
      q: `Is there a warranty on ${brand.name} repairs?`,
      a: `Yes. Every ${brand.name} repair we carry out is covered by a lifetime warranty on parts and workmanship. If the repair develops a fault, simply contact us and we'll fix it at no extra cost.`,
    },
    {
      q: `Do I have to pay for postage?`,
      a: `No. Postage is completely free both ways. We cover the cost of sending you the prepaid envelope and the cost of returning your repaired ${brand.name} to your ${region.name} address.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-white" style={DOT_BG}>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav
              className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-[#5f6368]"
              style={NAV_FONT}
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#202124] font-medium">
                {brand.name} Repairs
              </span>
              <span>/</span>
              <span className="text-[#202124] font-medium">
                {region.name}
              </span>
            </nav>

            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              {brand.name} repairs &mdash; {region.name}
            </p>
            <h1
              className="mt-3 text-[34px] font-bold leading-tight text-[#202124] md:text-[48px]"
              style={NAV_FONT}
            >
              {brand.name} Screen Repair Service in{" "}
              <span className="text-red-600">{region.name}</span>
            </h1>
            <p
              className="mt-6 max-w-2xl text-[16px] leading-8 text-[#5f6368]"
              style={NAV_FONT}
            >
              Looking for a trusted {brand.name} screen repair service in{" "}
              {region.name}? Repair My Phone Screen offers a fast, affordable
              mail-in repair service available to customers across{" "}
              {region.name}. Whether you have a cracked screen, an unresponsive
              display, or any other {brand.name} issue, our expert technicians
              will have your device looking and working like new. We offer free
              postage both ways, a lifetime warranty on all screen repairs, and
              a typical turnaround of just 1-3 working days.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={brand.bookRepairPath}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-red-700"
                style={NAV_FONT}
              >
                Book your {brand.name} repair
              </Link>
              <a
                href={`tel:${settings.general.phone}`}
                className="inline-flex items-center justify-center rounded-full border border-red-600 px-7 py-3.5 text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                style={NAV_FONT}
              >
                Call {settings.general.phone}
              </a>
            </div>
          </div>
        </section>

        {/* ── Trust signals ────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Why choose us
          </p>
          <h2
            className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            The UK's trusted mail-in {brand.name} repair service
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {trustSignals.map((s) => (
              <div
                key={s.title}
                className="rounded-[28px] border border-[#f3f4f6] bg-white p-7"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                  {s.icon}
                </div>
                <h3
                  className="text-[18px] font-semibold text-[#202124]"
                  style={NAV_FONT}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            How it works
          </p>
          <h2
            className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            Three simple steps to a repaired {brand.name}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {howItWorks.map((s) => (
              <div
                key={s.step}
                className="rounded-[28px] border border-[#f3f4f6] bg-white p-7"
              >
                <span
                  className="text-[42px] font-black leading-none text-[#f3f4f6]"
                  style={NAV_FONT}
                >
                  {s.step}
                </span>
                <h3
                  className="mt-2 text-[18px] font-semibold text-[#202124]"
                  style={NAV_FONT}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cities grid ──────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Locations we serve
          </p>
          <h2
            className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            {brand.name} repair available across {region.name}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {region.cities.map((city) => (
              <Link
                key={city.slug}
                to={`/${regionSlug}/${city.slug}`}
                className="group rounded-[28px] border border-[#f3f4f6] bg-white px-6 py-5 transition-shadow hover:shadow-md"
              >
                <h3
                  className="text-[15px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                  style={NAV_FONT}
                >
                  {city.name}
                </h3>
                <p
                  className="mt-1 text-[13px] text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {brand.name} repair &rarr;
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Other regions for this brand ──────────────────── */}
        {otherRegions.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              Other regions
            </p>
            <h2
              className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
              style={NAV_FONT}
            >
              {brand.name} repairs across the UK
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {otherRegions.map((r) => (
                <Link
                  key={r.slug}
                  to={`/${r.slug}`}
                  className="group rounded-[28px] border border-[#f3f4f6] bg-white px-6 py-5 transition-shadow hover:shadow-md"
                >
                  <h3
                    className="text-[15px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                    style={NAV_FONT}
                  >
                    {r.name}
                  </h3>
                  <p
                    className="mt-1 text-[13px] text-[#5f6368]"
                    style={NAV_FONT}
                  >
                    {brand.name} repair &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Other brands in same region ───────────────────── */}
        {otherBrandsSameRegion.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              Other repair services
            </p>
            <h2
              className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
              style={NAV_FONT}
            >
              More repair services in {region.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {otherBrandsSameRegion.map(({ brand: otherBrand, region: otherRegion }) => (
                <Link
                  key={otherBrand.baseSlug}
                  to={`/${otherRegion.slug}`}
                  className="group rounded-[28px] border border-[#f3f4f6] bg-white px-6 py-5 transition-shadow hover:shadow-md"
                >
                  <h3
                    className="text-[15px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                    style={NAV_FONT}
                  >
                    {otherBrand.name} Repairs
                  </h3>
                  <p
                    className="mt-1 text-[13px] text-[#5f6368]"
                    style={NAV_FONT}
                  >
                    {region.name} &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQs ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Frequently asked questions
          </p>
          <h2
            className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            {brand.name} repair FAQs for {region.name}
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[28px] border border-[#f3f4f6] bg-white"
              >
                <summary
                  className="cursor-pointer list-none px-7 py-5 text-[16px] font-semibold text-[#202124] [&::-webkit-details-marker]:hidden"
                  style={NAV_FONT}
                >
                  <span className="flex items-center justify-between">
                    {faq.q}
                    <span className="ml-4 flex-shrink-0 text-red-600 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p
                  className="px-7 pb-6 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA banner ───────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-red-600 px-8 py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <h2
                className="text-[26px] font-bold leading-tight text-white md:text-[30px]"
                style={NAV_FONT}
              >
                Get your {brand.name} repaired today
              </h2>
              <p
                className="mt-2 text-[15px] text-white/80"
                style={NAV_FONT}
              >
                Free postage, lifetime warranty, and fast turnaround from
                anywhere in {region.name}.
              </p>
            </div>
            <Link
              to={brand.bookRepairPath}
              className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
              style={NAV_FONT}
            >
              Book a repair
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ================================================================
   CITY PAGE
   ================================================================ */
function CityPage({
  brand,
  region,
  city,
}: {
  brand: Brand;
  region: Region;
  city: City;
}) {
  const settings = useSiteSettings();
  const regionSlug = `${region.slug}`;

  const seoTitle = `${brand.name} Repair in ${city.name} | Free Postal Repair Service | Repair My Phone Screen`;
  const description = `Need your ${brand.name} screen repaired in ${city.name}? Free postal service — we'll send you a prepaid box. Lifetime warranty. Fast 1-3 day turnaround.`;
  const canonicalPath = `/${regionSlug}/${city.slug}`;

  useEffect(() => {
    document.title = seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      `https://repairmyphonescreen.co.uk${canonicalPath}`
    );

    return () => {
      document.title = "Repair My Phone Screen";
    };
  }, [seoTitle, description, canonicalPath]);

  const siblingCities = region.cities.filter((c) => c.slug !== city.slug);

  /* Other brands offering repair in same city */
  const otherBrandsInCity = useMemo(() => {
    return BRANDS.filter((b) => b.baseSlug !== brand.baseSlug)
      .map((b) => {
        for (const r of b.regions) {
          const match = r.cities.find(
            (c) => c.name.toLowerCase() === city.name.toLowerCase()
          );
          if (match) return { brand: b, region: r, city: match };
        }
        return null;
      })
      .filter(Boolean) as { brand: Brand; region: Region; city: City }[];
  }, [brand.baseSlug, city.name]);

  const repairSteps = [
    {
      step: "01",
      title: "Book Online",
      desc: `Visit our website, select your ${brand.name} model and the repair you need. Pay securely online and receive instant confirmation with a tracking number.`,
    },
    {
      step: "02",
      title: "Receive Your Prepaid Box",
      desc: `We'll post a prepaid, padded envelope directly to your ${city.name} address. Everything you need to safely send your device is included.`,
    },
    {
      step: "03",
      title: "Mail Your Device",
      desc: `Place your ${brand.name} in the envelope, seal it, and drop it at any post box or Post Office near you in ${city.name}. It's fully tracked and insured.`,
    },
    {
      step: "04",
      title: "Get It Back Repaired",
      desc: `Our technicians repair your device using premium parts, test it thoroughly, and dispatch it back to your ${city.name} address within 1-3 working days.`,
    },
  ];

  const services = [
    {
      title: "Screen Replacement",
      desc: `Cracked, shattered, or unresponsive ${brand.name} screen? We replace it with a high-quality display that restores full touch sensitivity and crystal-clear visuals.`,
    },
    {
      title: "Battery Replacement",
      desc: `Is your ${brand.name} draining fast or shutting down unexpectedly? We fit a new premium battery to restore all-day performance.`,
    },
    {
      title: "Charging Port Repair",
      desc: `If your ${brand.name} won't charge or only charges at certain angles, our technicians will replace the charging port with a brand-new unit.`,
    },
    {
      title: "Back Glass Repair",
      desc: `Smashed the back of your ${brand.name}? We carefully replace the rear glass panel, restoring the look and structural integrity of your device.`,
    },
  ];

  const trustSignals = [
    { title: "Free Postage", desc: "Both ways, fully tracked and insured." },
    { title: "Lifetime Warranty", desc: "On all screen repairs we carry out." },
    { title: "1-3 Day Turnaround", desc: "From receipt to dispatch." },
    { title: "Certified Technicians", desc: "Experienced, qualified professionals." },
  ];

  const faqs = [
    {
      q: `Where do I send my ${brand.name} from ${city.name}?`,
      a: `You don't need to visit a shop. Simply book online and we'll post a prepaid envelope to your ${city.name} address. Drop your packaged device at any Royal Mail post box or Post Office and we'll handle everything from there.`,
    },
    {
      q: `How much does a ${brand.name} screen repair cost in ${city.name}?`,
      a: `Prices vary by model. You can see the exact price for your specific ${brand.name} model on our booking page before you commit. There are no hidden fees — postage is free both ways and the price you see is the price you pay.`,
    },
    {
      q: `Is my ${brand.name} insured during shipping?`,
      a: `Yes. When you use our prepaid envelope, your device is covered by Royal Mail's tracked and insured service from the moment you post it in ${city.name} until it's delivered back to you after repair.`,
    },
    {
      q: `Do you use genuine parts for ${brand.name} repairs?`,
      a: `We use high-quality OEM-grade parts for all ${brand.name} repairs. Every replacement screen, battery, and component is rigorously tested to ensure it meets our quality standards before being fitted to your device.`,
    },
    {
      q: `Can I track my ${brand.name} repair?`,
      a: `Absolutely. You'll receive a unique order reference when you book. We send text and email updates at every stage — when your device arrives, when the repair begins, and when your repaired ${brand.name} is on its way back to ${city.name}.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Repair My Phone Screen - ${city.name}`,
    description: `Professional ${brand.name} repair service in ${city.name}`,
    url: `https://repairmyphonescreen.co.uk/${regionSlug}/${city.slug}`,
    telephone: settings.general.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: region.name,
      ...(city.postcode ? { postalCode: city.postcode } : {}),
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    serviceType: [
      "Phone Screen Repair",
      "Battery Replacement",
      "Charging Port Repair",
    ],
    priceRange: "££",
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-white" style={DOT_BG}>
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav
              className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-[#5f6368]"
              style={NAV_FONT}
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                to={`/${regionSlug}`}
                className="hover:text-red-600 transition-colors"
              >
                {brand.name} Repairs
              </Link>
              <span>/</span>
              <Link
                to={`/${regionSlug}`}
                className="hover:text-red-600 transition-colors"
              >
                {region.name}
              </Link>
              <span>/</span>
              <span className="text-[#202124] font-medium">{city.name}</span>
            </nav>

            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              {brand.name} repair &mdash; {city.name}
            </p>
            <h1
              className="mt-3 text-[34px] font-bold leading-tight text-[#202124] md:text-[48px]"
              style={NAV_FONT}
            >
              {brand.name} Screen Repair in{" "}
              <span className="text-red-600">{city.name}</span>
            </h1>
            <p
              className="mt-6 max-w-2xl text-[16px] leading-8 text-[#5f6368]"
              style={NAV_FONT}
            >
              Need your {brand.name} screen repaired in {city.name}? You don't
              need to visit a high-street repair shop. Repair My Phone Screen
              offers a professional mail-in service that's available to every{" "}
              {city.name} resident. We'll send a prepaid envelope directly to
              your door, repair your device at our specialist centre, and
              return it within 1-3 working days. Every repair is backed by a
              lifetime warranty and postage is completely free both ways.
              {city.county &&
                ` We serve customers throughout ${city.county} and the wider ${region.name} area.`}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={brand.bookRepairPath}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-red-700"
                style={NAV_FONT}
              >
                Book your {brand.name} repair
              </Link>
              <a
                href={`tel:${settings.general.phone}`}
                className="inline-flex items-center justify-center rounded-full border border-red-600 px-7 py-3.5 text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                style={NAV_FONT}
              >
                Call {settings.general.phone}
              </a>
            </div>
          </div>
        </section>

        {/* ── Repair process ───────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            How it works
          </p>
          <h2
            className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            Our {city.name} repair process
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {repairSteps.map((s) => (
              <div
                key={s.step}
                className="rounded-[28px] border border-[#f3f4f6] bg-white p-7"
              >
                <span
                  className="text-[42px] font-black leading-none text-[#f3f4f6]"
                  style={NAV_FONT}
                >
                  {s.step}
                </span>
                <h3
                  className="mt-2 text-[16px] font-semibold text-[#202124]"
                  style={NAV_FONT}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Services grid ────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Our services
          </p>
          <h2
            className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            {brand.name} repair services for {city.name}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-[28px] border border-[#f3f4f6] bg-white p-7"
              >
                <h3
                  className="text-[18px] font-semibold text-[#202124]"
                  style={NAV_FONT}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {s.desc}
                </p>
                <Link
                  to={brand.bookRepairPath}
                  className="mt-4 inline-block text-[14px] font-semibold text-red-600 hover:underline"
                  style={NAV_FONT}
                >
                  Book this repair &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trust signals ────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustSignals.map((s) => (
              <div
                key={s.title}
                className="rounded-[24px] border border-[#f3f4f6] bg-white px-6 py-7 text-center"
              >
                <p
                  className="text-[18px] font-bold text-red-600"
                  style={NAV_FONT}
                >
                  {s.title}
                </p>
                <p
                  className="mt-1 text-[13px] text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sibling cities ───────────────────────────────── */}
        {siblingCities.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              Nearby locations
            </p>
            <h2
              className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
              style={NAV_FONT}
            >
              Other {brand.name} repair locations in {region.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {siblingCities.map((c) => (
                <Link
                  key={c.slug}
                  to={`/${regionSlug}/${c.slug}`}
                  className="group rounded-[28px] border border-[#f3f4f6] bg-white px-6 py-5 transition-shadow hover:shadow-md"
                >
                  <h3
                    className="text-[15px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                    style={NAV_FONT}
                  >
                    {c.name}
                  </h3>
                  <p
                    className="mt-1 text-[13px] text-[#5f6368]"
                    style={NAV_FONT}
                  >
                    {brand.name} repair &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Other brands in this city ─────────────────────── */}
        {otherBrandsInCity.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              More services
            </p>
            <h2
              className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
              style={NAV_FONT}
            >
              Other repair services in {city.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {otherBrandsInCity.map(({ brand: ob, region: or_, city: oc }) => (
                <Link
                  key={ob.baseSlug}
                  to={`/${or_.slug}/${oc.slug}`}
                  className="group rounded-[28px] border border-[#f3f4f6] bg-white px-6 py-5 transition-shadow hover:shadow-md"
                >
                  <h3
                    className="text-[15px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                    style={NAV_FONT}
                  >
                    {ob.name} Repair
                  </h3>
                  <p
                    className="mt-1 text-[13px] text-[#5f6368]"
                    style={NAV_FONT}
                  >
                    {city.name} &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQs ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Frequently asked questions
          </p>
          <h2
            className="mt-3 mb-8 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            {brand.name} repair in {city.name} &mdash; FAQs
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[28px] border border-[#f3f4f6] bg-white"
              >
                <summary
                  className="cursor-pointer list-none px-7 py-5 text-[16px] font-semibold text-[#202124] [&::-webkit-details-marker]:hidden"
                  style={NAV_FONT}
                >
                  <span className="flex items-center justify-between">
                    {faq.q}
                    <span className="ml-4 flex-shrink-0 text-red-600 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p
                  className="px-7 pb-6 text-[14px] leading-7 text-[#5f6368]"
                  style={NAV_FONT}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA banner ───────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-red-600 px-8 py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <h2
                className="text-[26px] font-bold leading-tight text-white md:text-[30px]"
                style={NAV_FONT}
              >
                Ready to fix your {brand.name} in {city.name}?
              </h2>
              <p
                className="mt-2 text-[15px] text-white/80"
                style={NAV_FONT}
              >
                Book online now. Free postage, lifetime warranty, and your
                device back within days.
              </p>
            </div>
            <Link
              to={brand.bookRepairPath}
              className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
              style={NAV_FONT}
            >
              Book a repair
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ================================================================
   MAIN EXPORT — route dispatcher
   ================================================================ */
export default function LocationPage() {
  const { regionSlug, citySlug } = useParams<{
    regionSlug: string;
    citySlug: string;
  }>();

  if (!regionSlug) return <NotFoundFallback />;

  /* City page */
  if (citySlug) {
    const result = findCity(regionSlug, citySlug);
    if (!result) return <NotFoundFallback />;
    return (
      <CityPage brand={result.brand} region={result.region} city={result.city} />
    );
  }

  /* Regional hub page */
  const result = findBrandAndRegion(regionSlug);
  if (!result) return <NotFoundFallback />;
  return <RegionalHubPage brand={result.brand} region={result.region} />;
}
