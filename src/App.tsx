import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import MaintenancePage from "./components/MaintenancePage";
import { SiteSettingsContext, type SiteSettings } from "./lib/SiteSettingsContext";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import DevicesSection from "./components/DevicesSection";
import WhyChooseUs from "./components/WhyChooseUs";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturedBrandsSection from "./components/FeaturedBrandsSection";
import ExploreDevicesSection from "./components/ExploreDevicesSection";
import FAQSection from "./components/FAQSection";
import NewsletterSection from "./components/NewsletterSection";
import Footer from "./components/Footer";
import BookRepairTypePage from "./pages/book-repair/BookRepairTypePage";
import BookRepairBrandPage from "./pages/book-repair/BookRepairBrandPage";
import BookRepairSeriesPage from "./pages/book-repair/BookRepairSeriesPage";
import BookRepairModelPage from "./pages/book-repair/BookRepairModelPage";
import BookRepairRepairPage from "./pages/book-repair/BookRepairRepairPage";
import RepairCartPage from "./pages/RepairCartPage";
import RepairCheckoutPage from "./pages/RepairCheckoutPage";
import RepairPaymentPage from "./pages/RepairPaymentPage";
import RepairPaymentSuccessPage from "./pages/RepairPaymentSuccessPage";
import RepairPaymentFailurePage from "./pages/RepairPaymentFailurePage";
import AboutUsPage from "./pages/AboutUsPage";
import FAQsPage from "./pages/FAQsPage";
import ContactUsPage from "./pages/ContactUsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import WarrantyPage from "./pages/WarrantyPage";
import WhyChooseUsPage from "./pages/WhyChooseUsPage";
import TrackRepairPage from "./pages/TrackRepairPage";
import WhatsAppButton from "./components/WhatsAppButton";
import LocationPage from "./pages/locations/LocationPage";
import GenericLocationPage from "./pages/locations/GenericLocationPage";
import AllLocationsPage from "./pages/AllLocationsPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";

const API_BASE = import.meta.env.VITE_API_URL || "";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "AewDJ-nxcF5KKaQdU4_CmJhE2JS_ZnyXYayO9Utj6mKSiwaKs-CBiimWJe36z6nB_vui89817TsvA3sC";

const FALLBACK_LOGO = "https://res.cloudinary.com/dn2sab6qc/image/upload/v1773930131/repair-my-phone-screen-logo_jmngqv.webp";

const defaultSettings: SiteSettings = {
  general: {
    businessName:   'Repair My Phone Screen',
    tagline:        '',
    phone:          '0333 224 4018',
    email:          'info@repairmyphonescreen.co.uk',
    address:        'Fonebox, 117 Friargate, Preston, PR1 2EE',
    whatsappNumber: '447761665499',
    logoUrl:        FALLBACK_LOGO,
  },
  operations: {
    maintenanceMode:    false,
    maintenanceMessage: '',
    collectionDelivery: true,
    turnaroundTime:     '1-2 hours',
  },
};

function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) { target.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      }
      window.scrollTo({ top: 0, left: 0 });
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash, location.pathname]);
  return null;
}

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <DevicesSection />
      <WhyChooseUs />
      <HowItWorksSection />
      <FeaturedBrandsSection />
      <ExploreDevicesSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

function App() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [settingsReady, setSettingsReady] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/settings`)
      .then((res) => {
        const data = res.data?.data;
        if (data) {
          const g = data.general   ?? {};
          const o = data.operations ?? {};
          setSiteSettings({
            general: {
              businessName:   g.businessName   || 'Repair My Phone Screen',
              tagline:        g.tagline        || '',
              phone:          g.phone          || '0333 224 4018',
              email:          g.email          || 'info@repairmyphonescreen.co.uk',
              address:        g.address        || 'Fonebox, 117 Friargate, Preston, PR1 2EE',
              whatsappNumber: g.whatsappNumber || '447761665499',
              logoUrl:        g.logoUrl        || FALLBACK_LOGO,
            },
            operations: {
              maintenanceMode:    o.maintenanceMode    ?? false,
              maintenanceMessage: o.maintenanceMessage ?? '',
              collectionDelivery: o.collectionDelivery ?? true,
              turnaroundTime:     o.turnaroundTime     ?? '1-2 hours',
            },
          });
        }
      })
      .catch(() => { /* backend unreachable — use safe defaults */ })
      .finally(() => setSettingsReady(true));
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    const { general } = siteSettings;

    // og:site_name
    const setMeta = (selector: string, content: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };
    setMeta('meta[property="og:site_name"]', general.businessName);
    if (general.tagline) {
      setMeta('meta[name="description"]',       general.tagline);
      setMeta('meta[property="og:description"]', general.tagline);
      setMeta('meta[name="twitter:description"]', general.tagline);
    }
    setMeta('meta[property="og:image"]', general.logoUrl);
    setMeta('meta[name="twitter:image"]', general.logoUrl);

    // Patch LocalBusiness JSON-LD (first ld+json block in <head>)
    const ldEl = document.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
    if (ldEl) {
      try {
        const ld = JSON.parse(ldEl.textContent || '{}');
        if (ld['@type'] === 'LocalBusiness') {
          ld.name      = general.businessName;
          ld.logo      = general.logoUrl;
          ld.image     = general.logoUrl;
          if (general.phone) ld.telephone = [general.phone, ...(general.whatsappNumber ? [`+${general.whatsappNumber.replace(/[\s+()-]/g, '')}`] : [])];
          if (general.email) ld.email     = general.email;
          if (general.address && ld.address) ld.address.streetAddress = general.address;
          ldEl.textContent = JSON.stringify(ld);
        }
      } catch { /* leave schema untouched if malformed */ }
    }
  }, [settingsReady, siteSettings]);

  if (!settingsReady) return null;

  if (siteSettings.operations.maintenanceMode) {
    return <MaintenancePage message={siteSettings.operations.maintenanceMessage} email={siteSettings.general.email} />;
  }

  return (
    <SiteSettingsContext.Provider value={siteSettings}>
      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "GBP", intent: "capture" }}>
        <BrowserRouter
          future={{
            v7_startTransition:    true,
            v7_relativeSplatPath:  true,
          }}
        >
          <ScrollToHash />
          <WhatsAppButton />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/repair-cart" element={<RepairCartPage />} />
            <Route path="/repair-checkout" element={<RepairCheckoutPage />} />
            <Route path="/repair-payment" element={<RepairPaymentPage />} />
            <Route path="/repair-payment/success" element={<RepairPaymentSuccessPage />} />
            <Route path="/repair-payment/failed" element={<RepairPaymentFailurePage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
            <Route path="/track-repair" element={<TrackRepairPage />} />
            <Route path="/book-repair" element={<BookRepairTypePage />} />
            <Route path="/book-repair/:tab" element={<BookRepairBrandPage />} />
            <Route path="/book-repair/:tab/:brandSlug" element={<BookRepairSeriesPage />} />
            <Route path="/book-repair/:tab/:brandSlug/models" element={<BookRepairModelPage />} />
            <Route path="/book-repair/:tab/:brandSlug/models/:modelSlug" element={<BookRepairRepairPage />} />
            <Route path="/book-repair/:tab/:brandSlug/:sectionSlug/models" element={<BookRepairModelPage />} />
            <Route path="/book-repair/:tab/:brandSlug/:sectionSlug/models/:modelSlug" element={<BookRepairRepairPage />} />

            {/* Blog pages */}
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:slug" element={<BlogPostPage />} />

            {/* Location SEO pages — matching old WordPress URLs */}
            <Route path="/locations" element={<AllLocationsPage />} />
            <Route path="/locations/:citySlug" element={<GenericLocationPage />} />
            <Route path="/:regionSlug" element={<LocationPage />} />
            <Route path="/:regionSlug/:citySlug" element={<LocationPage />} />
          </Routes>
        </BrowserRouter>
      </PayPalScriptProvider>
    </SiteSettingsContext.Provider>
  );
}

export default App;
