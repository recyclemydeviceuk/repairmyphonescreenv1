import { Link, Navigate } from "react-router-dom";
import { CheckCircle2, Mail, MapPin, Search } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { formatRepairCartCurrency, readRepairCheckoutSession } from "../lib/repairCart";

export default function RepairPaymentSuccessPage() {
  const session = readRepairCheckoutSession();

  if (!session || session.paymentStatus !== "paid") {
    return <Navigate to="/repair-payment" replace />;
  }

  const { createdAt, customerDetails, items, paymentReference, total } = session;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main
        className="min-h-[calc(100vh-64px)] bg-white"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(156, 163, 175, 0.28) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
          <section className="rounded-[32px] border border-green-100 bg-white p-8 shadow-sm md:p-10">

            {/* ── Header ─────────────────────────────── */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-green-600">Payment confirmed</p>
                <h1 className="mt-1 text-[26px] font-bold leading-tight text-[#202124] md:text-[28px]">Your repair is booked!</h1>
                <p className="mt-2 text-[14px] leading-6 text-[#5f6368]">
                  We have received your order and will be in touch shortly with next steps.
                </p>
              </div>
            </div>

            {/* ── Email confirmation notice ───────────── */}
            <div className="mt-6 flex items-start gap-3 rounded-[20px] border border-blue-100 bg-blue-50 px-5 py-4">
              <Mail size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
              <p className="text-[13px] leading-6 text-blue-800">
                A confirmation email will be sent to <span className="font-semibold">{customerDetails?.email}</span>. Please check your spam folder if you don't see it within a few minutes.
              </p>
            </div>

            {/* ── Order summary cards ─────────────────── */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Order Ref", value: paymentReference ?? "—", mono: true },
                { label: "Date", value: new Date(createdAt).toLocaleDateString("en-GB") },
                { label: "Items", value: `${items.length} repair${items.length > 1 ? "s" : ""}` },
                { label: "Total Paid", value: formatRepairCartCurrency(total), bold: true },
              ].map(card => (
                <div key={card.label} className="rounded-[18px] border border-[#eef2f7] bg-[#fcfcfd] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9aa0a6]">{card.label}</p>
                  <p className={`mt-1.5 break-all text-[14px] leading-5 text-[#111827] ${card.mono ? "font-mono font-bold" : card.bold ? "text-[17px] font-bold" : "font-semibold"}`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Delivery address ───────────────────── */}
            {customerDetails?.addressLine1 && (
              <div className="mt-5 flex items-start gap-3 rounded-[20px] border border-[#eef2f7] bg-[#fcfcfd] px-5 py-4">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[#9aa0a6]" />
                <div className="text-[13px] text-[#5f6368]">
                  <p className="font-semibold text-[#202124]">Collection / return address</p>
                  <p className="mt-1">{customerDetails.addressLine1}, {customerDetails.city}, {customerDetails.postcode.toUpperCase()}</p>
                </div>
              </div>
            )}

            {/* ── Repairs ordered ─────────────────────── */}
            <div className="mt-6 rounded-[24px] border border-[#eef2f7] bg-[#fcfcfd] p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-[#202124]">Repairs ordered</h2>
                <p className="text-[16px] font-bold text-[#111827]">{formatRepairCartCurrency(total)}</p>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 rounded-[18px] bg-white p-4 border border-[#f3f4f6]">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[16px] border border-red-100 bg-[#fff7f7] p-1.5">
                      <img src={item.deviceImage} alt={item.model} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9aa0a6]">{item.model}</p>
                      <p className="mt-0.5 text-[14px] font-semibold text-[#202124]">{item.repairName}</p>
                      <p className="mt-0.5 text-[12px] text-[#9aa0a6]">Warranty: {item.warranty} · {item.turnaround}</p>
                    </div>
                    <p className="text-[14px] font-bold text-[#111827]">{formatRepairCartCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CTAs ────────────────────────────────── */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Link
                to={`/track-repair`}
                className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700"
              >
                <Search size={15} />
                Track your repair
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-3.5 text-[14px] font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
              >
                Return home
              </Link>
              <Link
                to="/book-repair"
                className="inline-flex items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 py-3.5 text-[14px] font-semibold text-[#5f6368] transition-colors duration-200 hover:bg-gray-50"
              >
                Book another repair
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
