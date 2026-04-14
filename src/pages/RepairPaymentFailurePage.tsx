import { Link, Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { formatRepairCartCurrency, readRepairCheckoutSession } from "../lib/repairCart";

export default function RepairPaymentFailurePage() {
  const session = readRepairCheckoutSession();

  if (!session || session.paymentStatus !== "failed") {
    return <Navigate to="/repair-payment" replace />;
  }

  const { items, paymentReference, total } = session;

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
          <section className="rounded-[32px] border border-amber-200 bg-white p-8 shadow-sm md:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600">Payment failed</p>
            <h1 className="mt-3 text-[28px] font-bold leading-tight text-[#202124] md:text-[30px]">We couldn’t complete your payment.</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#5f6368]">
              Your repair details are still saved. You can retry the payment or go back and review the information before trying again.
            </p>

            <div className="mt-8 space-y-3 rounded-[24px] border border-[#f3ead9] bg-[#fffaf0] p-5 md:p-6">
              <div className="rounded-[18px] bg-white px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5f6368]">Attempt reference</p>
                <p className="mt-2 break-all text-[18px] font-bold text-[#111827]">{paymentReference}</p>
              </div>
              <div className="rounded-[18px] bg-white px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5f6368]">Amount attempted</p>
                <p className="mt-2 text-[15px] font-semibold text-[#202124]">{formatRepairCartCurrency(total)}</p>
              </div>
              <div className="rounded-[18px] bg-white px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5f6368]">Outstanding total</p>
                <p className="mt-2 text-[24px] font-bold text-[#111827]">{formatRepairCartCurrency(total)}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-[#eef2f7] bg-[#fcfcfd] p-5 md:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold text-[#202124]">Order summary</h2>
                  <p className="mt-1 text-[14px] text-[#5f6368]">{items.length} item{items.length > 1 ? "s" : ""} included</p>
                </div>
                <p className="text-[22px] font-bold text-[#111827]">{formatRepairCartCurrency(total)}</p>
              </div>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 rounded-[22px] bg-white p-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[18px] border border-red-100 bg-[#fff7f7] p-2">
                      <img src={item.deviceImage} alt={item.model} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5f6368]">{item.model}</p>
                      <h3 className="mt-1 text-[16px] font-semibold text-[#202124]">{item.repairName}</h3>
                    </div>
                    <p className="text-[16px] font-bold text-[#111827]">{formatRepairCartCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link to="/repair-payment" className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700">
                Retry payment
              </Link>
              <Link to="/repair-checkout" className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-3.5 text-[14px] font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50">
                Back to checkout
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
