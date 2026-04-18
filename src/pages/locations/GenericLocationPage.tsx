import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSiteSettings } from "../../lib/SiteSettingsContext";
import {
  BRANDS,
  GENERIC_LOCATIONS,
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

/** Strip "screen-repairs-" prefix and capitalise each word. */
function parseCityName(slug: string): string {
  const raw = slug.replace(/^screen-repairs-/, "");
  return raw
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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
            Location not found
          </h1>
          <p
            className="mt-4 text-[16px] leading-8 text-[#5f6368]"
            style={NAV_FONT}
          >
            Sorry, we couldn't find a repair page for that location. The page
            may have been moved or the URL might be incorrect.
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
              Get Your Repair Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function GenericLocationPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const settings = useSiteSettings();

  /* Validate slug exists in the generic locations list */
  const locationEntry = useMemo(
    () => GENERIC_LOCATIONS.find((l) => l.slug === citySlug),
    [citySlug]
  );

  const cityName = locationEntry
    ? locationEntry.city
    : citySlug
    ? parseCityName(citySlug)
    : "";

  /* Find all brand-specific pages that include this city */
  const brandLinks = useMemo(() => {
    if (!cityName) return [];
    const results: { brand: Brand; region: Region; city: City }[] = [];
    for (const brand of BRANDS) {
      for (const region of brand.regions) {
        const match = region.cities.find(
          (c) => c.name.toLowerCase() === cityName.toLowerCase()
        );
        if (match) {
          results.push({ brand, region, city: match });
          break; // one match per brand is enough
        }
      }
    }
    return results;
  }, [cityName]);

  const seoTitle = `Phone Screen Repairs in ${cityName} | All Brands | Free Postal Service | Repair My Phone Screen`;
  const description = `Professional phone screen repair service in ${cityName} for all major brands including iPhone, Samsung, iPad, and more. Free postage both ways, 12-month warranty, and fast 1-3 day turnaround.`;
  const canonicalPath = `/locations/${citySlug}`;

  useEffect(() => {
    if (!cityName) return;

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
  }, [seoTitle, description, canonicalPath, cityName]);

  if (!citySlug || !cityName) return <NotFoundFallback />;

  const trustSignals = [
    {
      value: "Free Postage",
      label: "Both ways, fully tracked",
    },
    {
      value: "All Brands",
      label: "iPhone, Samsung, iPad & more",
    },
    {
      value: "12-Month Warranty",
      label: "On every screen repair",
    },
    {
      value: "1-3 Days",
      label: "Average turnaround time",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Device",
      desc: `Select your phone or tablet brand and model from our online booking system. We repair all major brands including Apple, Samsung, Huawei, Google, and more.`,
    },
    {
      step: "02",
      title: "Receive a Prepaid Envelope",
      desc: `We'll post a padded, prepaid envelope directly to your ${cityName} address. Everything you need to safely send your device is included.`,
    },
    {
      step: "03",
      title: "Post Your Device",
      desc: `Place your phone or tablet in the envelope and drop it at any Royal Mail post box or Post Office near you in ${cityName}. It's fully tracked and insured.`,
    },
    {
      step: "04",
      title: "Get It Back Repaired",
      desc: `Our expert technicians repair your device using premium parts, test it thoroughly, and return it to your ${cityName} address within 1-3 working days.`,
    },
  ];

  const faqs = [
    {
      q: `What phone brands do you repair in ${cityName}?`,
      a: `We repair all major phone and tablet brands including Apple iPhone, Samsung Galaxy, iPad, Huawei, Google Pixel, OnePlus, and many more. Visit our booking page to see the full list of supported devices and models.`,
    },
    {
      q: `How does your postal repair service work for ${cityName} customers?`,
      a: `It's simple. Book your repair online and we'll send a prepaid, padded envelope to your ${cityName} address. Pop your device inside, seal it up, and drop it at any post box or Post Office. We repair it within 1-3 working days and return it free of charge.`,
    },
    {
      q: `Is there a physical repair shop in ${cityName}?`,
      a: `Our specialist repair centre is based in Preston, Lancashire. We serve ${cityName} customers through our convenient postal repair service. This means you get access to our full team of expert technicians without needing to leave your home.`,
    },
    {
      q: `How much does a phone screen repair cost?`,
      a: `Prices depend on your device brand and model. You can see the exact price on our booking page before committing to anything. There are no hidden fees — postage is free both ways and the quoted price is the final price.`,
    },
    {
      q: `What warranty do you offer on screen repairs?`,
      a: `Every screen repair comes with a 12-month warranty on parts and workmanship. If the replacement screen develops a fault related to our repair, we'll fix it free of charge — no questions asked.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Repair My Phone Screen - ${cityName}`,
    description: `Professional phone screen repair service in ${cityName} for all brands`,
    url: `https://repairmyphonescreen.co.uk${canonicalPath}`,
    telephone: settings.general.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    serviceType: [
      "Phone Screen Repair",
      "Tablet Screen Repair",
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
              <span className="text-[#202124] font-medium">
                Screen Repairs in {cityName}
              </span>
            </nav>

            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
              style={NAV_FONT}
            >
              Phone &amp; tablet repairs &mdash; {cityName}
            </p>
            <h1
              className="mt-3 text-[34px] font-bold leading-tight text-[#202124] md:text-[48px]"
              style={NAV_FONT}
            >
              Phone Screen Repairs in{" "}
              <span className="text-red-600">{cityName}</span>
            </h1>
            <p
              className="mt-6 max-w-2xl text-[16px] leading-8 text-[#5f6368]"
              style={NAV_FONT}
            >
              Looking for a reliable phone screen repair service in {cityName}?
              Repair My Phone Screen fixes all major brands including iPhone,
              Samsung, iPad, Huawei, Google Pixel, and more. Our convenient
              mail-in service means you don't need to visit a shop — we send
              you a prepaid envelope, repair your device at our specialist
              centre, and return it to your {cityName} address within 1-3
              working days. Every screen repair comes with a 12-month warranty
              and postage is free both ways.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/book-repair"
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-red-700"
                style={NAV_FONT}
              >
                Book your repair
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustSignals.map((s) => (
              <div
                key={s.value}
                className="rounded-[24px] border border-[#f3f4f6] bg-white px-6 py-7 text-center"
              >
                <p
                  className="text-[20px] font-bold text-red-600"
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
            Get your phone repaired from {cityName} in four easy steps
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
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

        {/* ── Brand-specific pages ─────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600"
            style={NAV_FONT}
          >
            Repair by brand
          </p>
          <h2
            className="mt-3 mb-3 text-[28px] font-bold text-[#202124] md:text-[32px]"
            style={NAV_FONT}
          >
            Choose your device brand for {cityName} repairs
          </h2>
          <p
            className="mb-8 max-w-2xl text-[15px] leading-7 text-[#5f6368]"
            style={NAV_FONT}
          >
            We offer specialist repair services for all major phone and tablet
            brands. Select your brand below to see pricing, turnaround times,
            and to book your repair.
          </p>

          {brandLinks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {brandLinks.map(({ brand, region, city }) => (
                <Link
                  key={brand.baseSlug}
                  to={`/${region.slug}/${city.slug}`}
                  className="group rounded-[28px] border border-[#f3f4f6] bg-white px-6 py-6 transition-shadow hover:shadow-md"
                >
                  <h3
                    className="text-[17px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                    style={NAV_FONT}
                  >
                    {brand.name} Repair
                  </h3>
                  <p
                    className="mt-2 text-[13px] leading-6 text-[#5f6368]"
                    style={NAV_FONT}
                  >
                    Professional {brand.name} screen repair service for{" "}
                    {cityName} residents. Free postage &amp; 12-month warranty.
                  </p>
                  <span
                    className="mt-3 inline-block text-[14px] font-semibold text-red-600"
                    style={NAV_FONT}
                  >
                    View {brand.name} repairs &rarr;
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            /* Fallback: link to each brand's booking page */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.baseSlug}
                  to={brand.bookRepairPath}
                  className="group rounded-[28px] border border-[#f3f4f6] bg-white px-6 py-6 transition-shadow hover:shadow-md"
                >
                  <h3
                    className="text-[17px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors"
                    style={NAV_FONT}
                  >
                    {brand.name} Repair
                  </h3>
                  <p
                    className="mt-2 text-[13px] leading-6 text-[#5f6368]"
                    style={NAV_FONT}
                  >
                    Professional {brand.name} screen repair with free postage
                    and 12-month warranty.
                  </p>
                  <span
                    className="mt-3 inline-block text-[14px] font-semibold text-red-600"
                    style={NAV_FONT}
                  >
                    Book {brand.name} repair &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Why choose us (expanded) ─────────────────────── */}
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
            The UK's trusted phone repair service, available in {cityName}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[28px] border border-[#f3f4f6] bg-white p-7">
              <h3
                className="text-[18px] font-semibold text-[#202124]"
                style={NAV_FONT}
              >
                Expert Technicians
              </h3>
              <p
                className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                style={NAV_FONT}
              >
                Our certified repair technicians have years of experience
                working on every major phone and tablet brand. Whether it's a
                cracked iPhone screen or a faulty Samsung charging port, your
                device is in expert hands.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#f3f4f6] bg-white p-7">
              <h3
                className="text-[18px] font-semibold text-[#202124]"
                style={NAV_FONT}
              >
                Premium Quality Parts
              </h3>
              <p
                className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                style={NAV_FONT}
              >
                We only use high-quality OEM-grade replacement parts. Every
                screen, battery, and component is rigorously tested before
                installation to ensure your device looks and performs like new
                after repair.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#f3f4f6] bg-white p-7">
              <h3
                className="text-[18px] font-semibold text-[#202124]"
                style={NAV_FONT}
              >
                Hassle-Free From {cityName}
              </h3>
              <p
                className="mt-3 text-[14px] leading-7 text-[#5f6368]"
                style={NAV_FONT}
              >
                No need to find a local repair shop or wait around in a store.
                Book online from {cityName}, use our prepaid envelope, and
                we'll handle everything. You'll have your repaired device back
                within days.
              </p>
            </div>
          </div>
        </section>

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
            Phone repairs in {cityName} &mdash; FAQs
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
                Get your phone fixed from {cityName}
              </h2>
              <p
                className="mt-2 text-[15px] text-white/80"
                style={NAV_FONT}
              >
                All brands. Free postage. 12-month warranty. Book your repair
                online in minutes.
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
