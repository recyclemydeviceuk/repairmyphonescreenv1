import { Link, Navigate, useNavigate } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  clearRepairCart,
  formatRepairCartCurrency,
  readRepairCheckoutSession,
  updateRepairCheckoutPaymentStatus,
} from "../lib/repairCart";
import { initiatePayment, capturePayment } from "../lib/api";

export default function RepairPaymentPage() {
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();
  const [error, setError] = useState("");
  const session = readRepairCheckoutSession();

  if (!session || session.items.length === 0) {
    return <Navigate to="/repair-checkout" replace />;
  }

  const { items, total } = session;
  // orderId and orderNumber were stored by checkout page
  const orderId = session.orderId;
  const orderNumber = session.paymentReference;

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
          <div className="mx-auto max-w-2xl">
            <Link to="/repair-checkout" className="inline-flex items-center text-[13px] font-medium text-red-600 hover:text-red-700">
              Back to checkout
            </Link>
            <h1 className="mt-3 text-[34px] font-bold leading-tight text-[#202124]">Complete Payment</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-7 text-[#5f6368]">
              Please complete your payment securely via PayPal to confirm your repair booking.
            </p>
          </div>

          <section className="mx-auto mt-10 max-w-2xl rounded-[32px] border border-red-100 bg-white p-6 shadow-sm md:p-8">
            {/* Amount */}
            <div className="border-b border-[#f3f4f6] pb-6 text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-red-600">Amount to pay</p>
              <p className="mt-3 text-[40px] font-bold leading-none text-[#111827]">{formatRepairCartCurrency(total)}</p>
              {orderNumber && (
                <p className="mt-2 text-[13px] font-mono text-[#5f6368]">Order: {orderNumber}</p>
              )}
            </div>

            {/* Order summary */}
            <div className="mt-6 rounded-[24px] border border-[#f3f4f6] bg-[#fcfcfd] p-5 md:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold text-[#202124]">Order Summary</h2>
                  <p className="mt-1 text-[14px] text-[#5f6368]">{items.length} item{items.length > 1 ? "s" : ""} selected</p>
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

            {/* Error message */}
            {error && (
              <div className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-[13px] font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* PayPal Buttons */}
            <div className="mt-8">
              {isPending && (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
                  <span className="ml-3 text-[14px] text-[#5f6368]">Loading payment options...</span>
                </div>
              )}

              <PayPalButtons
                style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 50 }}
                createOrder={async () => {
                  try {
                    setError("");
                    // If we have a backend orderId, use our API to create the PayPal order
                    if (orderId) {
                      const result = await initiatePayment({
                        orderId,
                        amount: total,
                        currency: "GBP",
                        returnUrl: `${window.location.origin}/repair-payment/success`,
                        cancelUrl: `${window.location.origin}/repair-payment/failed`,
                      });
                      return result.paypalOrderId;
                    }
                    // Fallback: shouldn't happen if checkout was done properly
                    throw new Error("No order ID found. Please go back to checkout.");
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : "Failed to create payment. Please try again.";
                    setError(msg);
                    throw err;
                  }
                }}
                onApprove={async (data) => {
                  try {
                    setError("");
                    // Capture the payment on the backend
                    const result = await capturePayment(data.orderID, orderId!);

                    if (result.status === "COMPLETED") {
                      updateRepairCheckoutPaymentStatus("paid", orderNumber);
                      clearRepairCart();
                      navigate("/repair-payment/success");
                    } else {
                      setError("Payment was not completed. Please try again.");
                    }
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : "Payment capture failed. Please contact support.";
                    setError(msg);
                  }
                }}
                onCancel={() => {
                  setError("Payment was cancelled. You can try again when you're ready.");
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  setError("An error occurred with PayPal. Please try again or contact support.");
                }}
              />
            </div>

            {/* Secure payment note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#9aa0a6]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Secured by PayPal. Your payment details are encrypted end-to-end.</span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
