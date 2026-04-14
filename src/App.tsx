import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
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
import TrackRepairPage from "./pages/TrackRepairPage";
import WhatsAppButton from "./components/WhatsAppButton";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
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

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "AewDJ-nxcF5KKaQdU4_CmJhE2JS_ZnyXYayO9Utj6mKSiwaKs-CBiimWJe36z6nB_vui89817TsvA3sC";

function App() {
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "GBP", intent: "capture" }}>
    <BrowserRouter>
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
        <Route path="/track-repair" element={<TrackRepairPage />} />
        <Route path="/book-repair" element={<BookRepairTypePage />} />
        <Route path="/book-repair/:tab" element={<BookRepairBrandPage />} />
        <Route path="/book-repair/:tab/:brandSlug" element={<BookRepairSeriesPage />} />
        <Route path="/book-repair/:tab/:brandSlug/models" element={<BookRepairModelPage />} />
        <Route path="/book-repair/:tab/:brandSlug/models/:modelSlug" element={<BookRepairRepairPage />} />
        <Route path="/book-repair/:tab/:brandSlug/:sectionSlug/models" element={<BookRepairModelPage />} />
        <Route path="/book-repair/:tab/:brandSlug/:sectionSlug/models/:modelSlug" element={<BookRepairRepairPage />} />
      </Routes>
    </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
