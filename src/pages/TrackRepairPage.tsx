import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, CheckCircle2, Clock, RefreshCw, CreditCard,
  Package, XCircle, AlertCircle, Mail, Phone, User,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatRepairCartCurrency } from "../lib/repairCart";
import { trackRepair as trackRepairApi, type TrackResult } from "../lib/api";

type TrackStatus = "pending" | "paid" | "processing" | "completed" | "failed" | "cancelled";

const STATUS_CONFIG: Record<
  TrackStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode; description: string }
> = {
  pending:    { label: "Pending",     color: "text-yellow-700", bg: "bg-yellow-50",  border: "border-yellow-200", icon: <Clock size={20} />,        description: "Your order has been received and is awaiting payment." },
  paid:       { label: "Paid",        color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   icon: <CreditCard size={20} />,   description: "Payment confirmed. Your device repair is being scheduled." },
  processing: { label: "In Progress", color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-200", icon: <RefreshCw size={20} />,    description: "Your device is currently being repaired by our technicians." },
  completed:  { label: "Completed",   color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200",  icon: <CheckCircle2 size={20} />, description: "Your repair is complete! Your device is ready for collection." },
  failed:     { label: "Failed",      color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200",    icon: <XCircle size={20} />,      description: "There was an issue with your order. Please contact us for assistance." },
  cancelled:  { label: "Cancelled",   color: "text-gray-600",   bg: "bg-gray-50",    border: "border-gray-200",   icon: <XCircle size={20} />,      description: "This order has been cancelled." },
};

const TIMELINE_STEPS: { key: TrackStatus; label: string; icon: React.ReactNode }[] = [
  { key: "pending",    label: "Order Placed",      icon: <Package size={14} /> },
  { key: "paid",       label: "Payment Confirmed", icon: <CreditCard size={14} /> },
  { key: "processing", label: "Repair In Progress",icon: <RefreshCw size={14} /> },
  { key: "completed",  label: "Ready",             icon: <CheckCircle2 size={14} /> },
];

const STATUS_STEP_INDEX: Record<TrackStatus, number> = {
  pending: 0, paid: 1, processing: 2, completed: 3,
  failed: -1, cancelled: -1,
};

export default function TrackRepairPage() {
  const [query,    setQuery]    = useState("");
  const [result,   setResult]   = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const data = await trackRepairApi(trimmed);
      setResult(data);
      setNotFound(false);
    } catch {
      setResult(null);
      setNotFound(true);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const status    = (result?.status ?? "pending") as TrackStatus;
  const statusCfg = result ? STATUS_CONFIG[status] ?? STATUS_CONFIG.pending : null;
  const stepIndex = result ? (STATUS_STEP_INDEX[status] ?? 0) : -1;
  const isTerminal = status === "failed" || status === "cancelled";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main
        className="min-h-[calc(100vh-64px)]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(156,163,175,0.28) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
        }}
      >
        <div className="mx-auto max-w-2xl px-6 py-14 md:py-20">

          {/* ── Hero ─────────────────────────────────────── */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <Package size={24} className="text-red-600" />
            </div>
            <h1 className="text-[28px] font-bold text-[#202124] md:text-[32px]">Track Your Repair</h1>
            <p className="mt-2 text-[15px] text-[#5f6368]">
              Enter your order reference number to check the status of your repair.
            </p>
          </div>

          {/* ── Search ───────────────────────────────────── */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa0a6]" />
              <input
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSearched(false);
                  setNotFound(false);
                  setResult(null);
                }}
                placeholder="e.g. RPMS-2026-001"
                className="w-full rounded-[18px] border border-[#e5e7eb] bg-white py-3.5 pl-11 pr-4 text-[14px] text-[#202124] shadow-sm outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-[18px] bg-red-600 px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
            >
              {loading ? "Searching…" : "Track"}
            </button>
          </form>

          {/* ── Not found ────────────────────────────────── */}
          {notFound && (
            <div className="mt-8 flex items-start gap-4 rounded-[24px] border border-red-100 bg-red-50 p-6">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-semibold text-[#202124]">Order not found</p>
                <p className="mt-1 text-[14px] text-[#5f6368]">
                  We couldn't find an order with reference <span className="font-mono font-bold text-[#202124]">{query.trim().toUpperCase()}</span>.
                  Please double-check the number or{" "}
                  <Link to="/contact-us" className="text-red-600 hover:underline">contact us</Link> for help.
                </p>
              </div>
            </div>
          )}

          {/* ── Result ───────────────────────────────────── */}
          {result && statusCfg && (
            <div className="mt-8 space-y-5">

              {/* Status card */}
              <div className={`rounded-[28px] border ${statusCfg.border} ${statusCfg.bg} px-7 py-6`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${statusCfg.color}`}>
                    {statusCfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9aa0a6]">Order Status</p>
                    <p className={`mt-1 text-[22px] font-bold leading-none ${statusCfg.color}`}>{statusCfg.label}</p>
                    <p className="mt-2 text-[14px] leading-6 text-[#5f6368]">{statusCfg.description}</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/60 pt-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px]">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9aa0a6]">Order Reference</p>
                      <p className="mt-0.5 font-mono font-bold text-[#202124]">{result.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9aa0a6]">Order Date</p>
                      <p className="mt-0.5 font-semibold text-[#202124]">
                        {new Date(result.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9aa0a6]">Device</p>
                      <p className="mt-0.5 font-semibold text-[#202124]">{result.brand} {result.model}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9aa0a6]">Total Paid</p>
                      <p className="mt-0.5 font-bold text-[#202124]">{formatRepairCartCurrency(result.total)}</p>
                    </div>
                    {result.customerName && (
                      <div className="col-span-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#9aa0a6]">Customer</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <User size={13} className="text-[#9aa0a6]" />
                          <p className="font-semibold text-[#202124]">{result.customerName}</p>
                        </div>
                      </div>
                    )}
                    {result.completedAt && (
                      <div className="col-span-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#9aa0a6]">Completed On</p>
                        <p className="mt-0.5 font-semibold text-green-700">
                          {new Date(result.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {!isTerminal && (
                <div className="rounded-[24px] border border-[#f1f3f4] bg-white p-6">
                  <p className="mb-5 text-[13px] font-semibold text-[#202124]">Repair Progress</p>
                  <div className="flex items-center gap-0">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const done    = stepIndex > idx;
                      const current = stepIndex === idx;
                      const last    = idx === TIMELINE_STEPS.length - 1;
                      return (
                        <div key={step.key} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                              done    ? "border-green-500 bg-green-500 text-white" :
                              current ? "border-red-500 bg-red-50 text-red-600" :
                                        "border-gray-200 bg-white text-[#9aa0a6]"
                            }`}>
                              {step.icon}
                            </div>
                            <span className={`text-[9px] font-semibold text-center leading-tight max-w-[54px] ${
                              done ? "text-green-600" : current ? "text-red-600" : "text-[#9aa0a6]"
                            }`}>{step.label}</span>
                          </div>
                          {!last && (
                            <div className={`flex-1 h-0.5 mx-1 mb-4 ${done ? "bg-green-400" : "bg-gray-200"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Repair items */}
              <div className="rounded-[24px] border border-[#f1f3f4] bg-white p-6">
                <p className="mb-4 text-[13px] font-semibold text-[#202124]">Repairs Ordered</p>
                <div className="space-y-2">
                  {result.items.length > 0 ? (
                    result.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-[14px] bg-[#f8f9fa] px-4 py-3">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-[13px] font-medium text-[#202124] truncate">{item.description || `${item.deviceModel} — ${item.repairType}`}</p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-[#9aa0a6]">Qty: {item.quantity}</p>
                          )}
                        </div>
                        <span className="text-[13px] font-bold text-[#202124] flex-shrink-0">
                          {formatRepairCartCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between rounded-[14px] bg-[#f8f9fa] px-4 py-3">
                      <span className="text-[13px] font-medium text-[#202124]">{result.repairType}</span>
                      <span className="text-[13px] font-bold text-[#202124]">{formatRepairCartCurrency(result.total)}</span>
                    </div>
                  )}
                </div>

                {/* Subtotal / Discount / Total */}
                <div className="mt-4 space-y-2 border-t border-[#f1f3f4] pt-4">
                  {result.discount > 0 && (
                    <>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-[#5f6368]">Subtotal</span>
                        <span className="text-[#202124]">{formatRepairCartCurrency(result.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-green-600">Discount</span>
                        <span className="text-green-600">−{formatRepairCartCurrency(result.discount)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[#202124]">Total</span>
                    <span className="text-[18px] font-bold text-[#111827]">{formatRepairCartCurrency(result.total)}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-[24px] border border-[#f1f3f4] bg-white p-6">
                <p className="mb-4 text-[13px] font-semibold text-[#202124]">Need Help?</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:hello@repairmyphonescreen.co.uk"
                    className="flex flex-1 items-center gap-3 rounded-[18px] border border-[#e5e7eb] px-4 py-3 text-[13px] text-[#5f6368] hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Mail size={15} className="flex-shrink-0" />
                    hello@repairmyphonescreen.co.uk
                  </a>
                  <a
                    href="tel:08001234567"
                    className="flex flex-1 items-center gap-3 rounded-[18px] border border-[#e5e7eb] px-4 py-3 text-[13px] text-[#5f6368] hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Phone size={15} className="flex-shrink-0" />
                    0800 123 456
                  </a>
                </div>
              </div>

              <Link
                to="/"
                className="block text-center text-[13px] font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                ← Return to home
              </Link>
            </div>
          )}

          {/* ── No search yet ─────────────────────────────── */}
          {!searched && !result && (
            <div className="mt-10 rounded-[24px] border border-[#f1f3f4] bg-white p-6 text-center">
              <p className="text-[13px] font-semibold text-[#202124]">Where to find your order reference</p>
              <p className="mt-2 text-[13px] text-[#5f6368] leading-6">
                Your order reference number was sent to your email address after booking.{" "}
                It starts with <span className="font-mono font-semibold text-red-600">RPMS-</span> followed by the year and order number.
              </p>
              <p className="mt-1 text-[12px] text-[#9aa0a6]">Example: <span className="font-mono font-semibold">RPMS-2026-001</span></p>
              <p className="mt-3 text-[13px] text-[#5f6368]">
                Can't find it?{" "}
                <Link to="/contact-us" className="text-red-600 hover:underline">Contact our support team</Link>.
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
