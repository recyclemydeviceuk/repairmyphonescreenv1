import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

const summaryPoints = [
  "Use of our repair service may void your manufacturer's warranty.",
  "Back up your device before sending — we are not responsible for data loss.",
  "We are not responsible for progression of liquid damage once a device is opened.",
  "We offer a 1-month warranty for liquid damage repairs.",
  "We are not responsible for damage progression on devices previously repaired elsewhere.",
  "Turnaround times are estimates only and cannot always be guaranteed.",
  "The warranty covers the repaired/replaced part only, not additional accidental or liquid damage.",
];

const sections = [
  {
    title: "1. Agreement for Repair",
    body: "These Conditions of Repair apply to the service we provide to repair your smartphone, tablet, or accessories. References to 'us', 'we', and 'our' refer to Fone Box (Retail) Ltd. References to 'you' and 'your' refer to the Customer.",
  },
  {
    title: "2. All Repairs",
    items: [
      "This agreement commences from the date you book your repair and continues until we return your device and receive payment.",
      "We shall make reasonable efforts to repair your device subject to parts availability.",
      "We use high quality compatible parts for all repairs.",
      "We require your device passcode to test before and after the service.",
      "Time estimates are not obligations — Board Level (Level 3) repairs may take at least 5 working days.",
      "We will notify you when your device is ready. Uncollected devices may be recycled after 56 days.",
      "If we cannot complete the repair, we will notify you and return your device unrepaired.",
      "Use of our service may void your manufacturer's warranty.",
      "Our warranty covers the repaired or replaced part only, not accidental or liquid damage.",
    ],
  },
  {
    title: "3. Liability",
    items: [
      "Our liability is limited to re-supplying the service, paying for the cost of re-supply, or refunding your payment.",
      "If your device is damaged beyond economical repair as a direct result of our service, you are entitled to a replacement device of equal value.",
      "Any data stored on your device is your sole responsibility. We highly recommend backing up before sending.",
      "We are not liable for indirect, special, or consequential loss of any nature.",
      "Central Workshop repairs carry a 1-month warranty. We cannot guarantee a fix on component-level repairs.",
    ],
  },
  {
    title: "4. Data Protection",
    body: "We use your personal information to notify you when your device is repaired and to provide after-sales service. We may send updates about new services. You may opt out at any time by contacting us.",
  },
  {
    title: "5. General",
    body: "This agreement is governed by the laws of England and Wales. If any part of this agreement is found void or unenforceable, the remainder shall remain valid. Nothing in this agreement confers rights on any third party.",
  },
  {
    title: "6. Website Terms",
    body: "By using this website you agree to comply with our terms. The content is for general information only and subject to change. All material on this site is owned by or licensed to Fone Box (Retail) Ltd. Unauthorised use may give rise to a claim for damages.",
  },
];

export default function TermsAndConditionsPage() {
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
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-[#5f6368]" style={NAV_FONT}>
            Please read these terms carefully before using our services. By engaging with Repair My Phone Screen, you agree to be bound by these terms.
          </p>
        </section>

        {/* Summary box */}
        <section className="mx-auto max-w-3xl px-6 pb-6">
          <div className="rounded-[24px] bg-red-600 px-8 py-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/70 mb-4" style={NAV_FONT}>
              Key things to know
            </p>
            <ul className="flex flex-col gap-3">
              {summaryPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] leading-6 text-white/90" style={NAV_FONT}>
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/60" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sections */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="flex flex-col gap-5">
            {sections.map((s) => (
              <div key={s.title} className="rounded-[24px] border border-[#f3f4f6] bg-white px-8 py-7">
                <h2 className="text-[17px] font-bold text-[#202124] mb-4" style={NAV_FONT}>{s.title}</h2>
                {s.body && (
                  <p className="text-[14px] leading-7 text-[#5f6368]" style={NAV_FONT}>{s.body}</p>
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
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[28px] border border-[#f3f4f6] bg-white px-8 py-7 md:flex-row md:items-center">
            <div>
              <p className="text-[15px] font-semibold text-[#202124]" style={NAV_FONT}>Have questions?</p>
              <p className="mt-1 text-[13px] text-[#5f6368]" style={NAV_FONT}>Last updated: March 2026</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:03332244018"
                className="rounded-full border border-[#e8eaed] px-5 py-2.5 text-[13px] font-medium text-[#202124] hover:border-red-200 transition-colors"
                style={NAV_FONT}
              >
                Call 0333 224 4018
              </a>
              <Link
                to="/contact-us"
                className="rounded-full bg-red-600 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-red-700 transition-colors"
                style={NAV_FONT}
              >
                Email us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
