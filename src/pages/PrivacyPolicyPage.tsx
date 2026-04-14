import Header from "../components/Header";
import Footer from "../components/Footer";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const sections = [
  {
    title: "1. What Information We Collect",
    items: [
      "Identity data: first name, last name, username or similar identifier.",
      "Contact data: billing address, delivery address, email address and telephone numbers.",
      "Device data: information about your device including its IMEI or serial number.",
      "Transaction data: details about payments and services you have purchased.",
      "Technical data: IP address, login data, browser type and version.",
      "Marketing data: your preferences in receiving marketing from us.",
    ],
    note: "We do not collect any Special Categories of Personal Data about you.",
  },
  {
    title: "2. How We Use Your Data",
    items: [
      "To process and deliver your repair order, including managing payments.",
      "To manage our relationship with you, including notifying you about changes to our terms.",
      "To administer and protect our business and website.",
      "To deliver relevant website content and advertisements to you.",
      "To use data analytics to improve our website, products, and services.",
      "To make suggestions and recommendations about goods or services that may interest you.",
    ],
  },
  {
    title: "3. Who We Share Your Data With",
    items: [
      "Courier and logistics providers who handle postal repairs.",
      "Payment processors who handle card transactions securely.",
      "IT and system administration service providers.",
      "Analytics providers such as Google Analytics.",
    ],
    note: "We do not allow our third-party service providers to use your personal data for their own purposes.",
  },
  {
    title: "4. Data Security",
    body: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way. We limit access to your personal data to those with a business need to know. We have procedures to deal with any suspected personal data breach and will notify you and any applicable regulator where legally required.",
  },
  {
    title: "5. Your Legal Rights",
    items: [
      "Request access to your personal data.",
      "Request correction of the personal data we hold about you.",
      "Request erasure of your personal data.",
      "Object to processing of your personal data.",
      "Request restriction of processing your personal data.",
      "Request transfer of your personal data.",
      "Right to withdraw consent at any time.",
    ],
    note: "You will not have to pay a fee to exercise any of these rights. Please contact us to do so.",
  },
  {
    title: "6. Cookies",
    body: "Our website uses cookies to distinguish you from other users. We use strictly necessary, analytical, functionality, and targeting cookies. You can block cookies by adjusting your browser settings.",
  },
  {
    title: "7. Marketing",
    body: "You will receive marketing from us only if you have requested it or purchased our services and have not opted out. To unsubscribe at any time, email info@repairmyphonescreen.co.uk with subject line \"UNSUBSCRIBE\".",
  },
  {
    title: "8. Contact Us",
    body: "Email: info@repairmyphonescreen.co.uk\nPhone: 0333 224 4018\nAddress: Fonebox, 117 Friargate, Preston, PR1 2EE\n\nYou have the right to make a complaint to the ICO (www.ico.org.uk).",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main
        className="bg-white"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(156,163,175,0.28) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 md:pt-24 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-red-600" style={NAV_FONT}>
            Legal
          </p>
          <h1 className="mt-3 text-[38px] font-bold leading-tight text-[#202124] md:text-[48px]" style={NAV_FONT}>
            Privacy Policy
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[#5f6368]" style={NAV_FONT}>
            We are committed to protecting your privacy and ensuring your personal data is handled with care and transparency.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-[12px] font-medium text-red-600" style={NAV_FONT}>GDPR Compliant · UK Data Protection Act 2018</span>
          </div>
        </section>

        {/* Sections */}
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div className="flex flex-col gap-5">
            {sections.map((s) => (
              <div key={s.title} className="rounded-[24px] border border-[#f3f4f6] bg-white px-8 py-7">
                <h2 className="text-[17px] font-bold text-[#202124] mb-4" style={NAV_FONT}>{s.title}</h2>
                {s.body && (
                  <p className="text-[14px] leading-7 text-[#5f6368] whitespace-pre-line" style={NAV_FONT}>{s.body}</p>
                )}
                {s.items && (
                  <ul className="flex flex-col gap-2">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[14px] leading-7 text-[#5f6368]" style={NAV_FONT}>
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {s.note && (
                  <p className="mt-4 text-[13px] text-[#9ca3af] italic" style={NAV_FONT}>{s.note}</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[13px] text-[#9ca3af]" style={NAV_FONT}>Last updated: March 2026</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
