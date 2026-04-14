import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Tag, X, Truck, Search } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { formatRepairCartCurrency, useRepairCart, addRepairCartItem } from "../lib/repairCart";
import { getPublicAddons, validatePromoCode, type AddonResult } from "../lib/api";

export default function RepairCartPage() {
  const { clearCart, itemCount, items, removeItem, subtotal } = useRepairCart();
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [addons, setAddons] = useState<AddonResult[]>([]);

  // Only fetch addons when there are items in the cart
  useEffect(() => {
    if (itemCount === 0) { setAddons([]); return; }
    getPublicAddons().then(setAddons).catch(() => setAddons([]));
  }, [itemCount]);

  const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const total = subtotal - discountAmount;

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const result = await validatePromoCode(code);
      setAppliedPromo({ code: result.code, discount: result.discount, label: result.label });
      setPromoInput("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid promo code.";
      setPromoError(msg);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleAddAddon = (addon: AddonResult) => {
    addRepairCartItem({
      id: addon._id,
      brandName: "Accessory",
      brandSlug: "accessory",
      category: "accessory",
      deviceImage: addon.imageUrl || "",
      model: addon.name,
      modelSlug: addon._id,
      priceLabel: formatRepairCartCurrency(addon.price),
      repairName: addon.name,
      serviceType: "mail-in",
      tab: "phone",
      turnaround: "Ships with device",
      unitPrice: addon.price,
      warranty: "1 Year",
    });
  };

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
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-[28px] font-bold leading-tight text-[#202124]">Your Cart</h1>
              <p className="mt-1 text-[14px] text-[#5f6368]">
                {itemCount === 0 ? "No repairs selected yet" : `${itemCount} repair${itemCount > 1 ? "s" : ""} selected`}
              </p>
            </div>

            {itemCount > 0 ? (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-4 py-2 text-[13px] font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {itemCount === 0 ? (
            <div className="rounded-[28px] border border-red-100 bg-white px-8 py-14 text-center">
              <h2 className="text-[24px] font-semibold text-[#202124]">Your mail-in cart is empty</h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-7 text-[#5f6368]">
                Add a repair from any device page and it will appear here. We are supporting mail-in service only for now.
              </p>
              <Link
                to="/book-repair"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-red-600 px-7 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700"
              >
                Book a repair
              </Link>
            </div>
          ) : (
            <>
            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
              <section className="rounded-[28px] border border-red-100 bg-white p-6">
                <div className="mb-5">
                  <p className="text-[18px] font-semibold text-[#202124]">Cart Items</p>
                  <p className="mt-1 text-[13px] text-[#5f6368]">{itemCount} selected item{itemCount > 1 ? "s" : ""}</p>
                </div>

                <div className="divide-y divide-[#f3f4f6]">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-[92px] w-[92px] flex-shrink-0 items-center justify-center rounded-[24px] border border-red-100 bg-[#fff7f7] p-3">
                          <img src={item.deviceImage} alt={item.model} className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#5f6368]">{item.brandName === "Accessory" ? "Accessory" : item.model}</p>
                          <h2 className="mt-1 text-[19px] font-semibold leading-7 text-red-600">{item.repairName}</h2>
                          <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-[#5f6368]">
                            {item.category === "accessory" ? (
                              <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600">Ships with device</span>
                            ) : (
                              <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-600">Mail in</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 md:items-end">
                        <div className="flex items-center gap-4">
                          <p className="text-[22px] font-bold text-[#111827]">{formatRepairCartCurrency(item.unitPrice * item.quantity)}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center justify-center rounded-full border border-red-100 px-4 py-2 text-[13px] font-medium text-[#5f6368] transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove ${item.repairName}`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="space-y-4">
                <section className="rounded-[28px] border border-red-100 bg-white p-6">
                  <h2 className="text-[20px] font-semibold text-[#202124]">Order Summary</h2>

                  {/* Promo code */}
                  <div className="mt-5">
                    {appliedPromo ? (
                      <div className="flex items-center justify-between rounded-[16px] border border-green-200 bg-green-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Tag size={13} className="text-green-600" />
                          <div>
                            <p className="text-[12px] font-semibold text-green-700">{appliedPromo.code}</p>
                            <p className="text-[11px] text-green-600">{appliedPromo.label}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setAppliedPromo(null)}
                          className="text-green-500 hover:text-green-700 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={e => { setPromoInput(e.target.value); setPromoError(""); }}
                          onKeyDown={e => e.key === "Enter" && handleApplyPromo()}
                          placeholder="Promo code"
                          className="flex-1 rounded-[16px] border border-[#e5e7eb] bg-[#fcfcfd] px-3 py-2.5 text-[13px] text-[#202124] outline-none placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        />
                        <button
                          onClick={handleApplyPromo}
                          disabled={promoLoading}
                          className="rounded-[16px] border border-red-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {promoLoading ? "..." : "Apply"}
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="mt-2 text-[12px] font-medium text-red-600">{promoError}</p>
                    )}
                  </div>

                  <div className="mt-5 space-y-3 text-[14px]">
                    <div className="flex items-center justify-between text-[#5f6368]">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-semibold text-[#202124]">{formatRepairCartCurrency(subtotal)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center justify-between text-green-700">
                        <span className="flex items-center gap-1">
                          <Tag size={12} /> {appliedPromo.code}
                        </span>
                        <span className="font-semibold">-{formatRepairCartCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[#5f6368]">
                      <span>Mail In Service Fee</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-[#eef2f7] pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] font-semibold text-[#202124]">Total</span>
                        <span className="text-[24px] font-bold text-[#111827]">{formatRepairCartCurrency(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated delivery note */}
                  <div className="mt-4 flex items-start gap-2 rounded-[14px] border border-[#eef2f7] bg-[#f8fafc] px-3 py-3">
                    <Truck size={14} className="mt-0.5 flex-shrink-0 text-[#9aa0a6]" />
                    <p className="text-[12px] leading-5 text-[#5f6368]">
                      Most repairs are completed and returned within <span className="font-semibold text-[#202124]">2–3 working days</span> of receipt.
                    </p>
                  </div>

                  <Link
                    to="/repair-checkout"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700"
                  >
                    Proceed with Mail In
                  </Link>
                </section>

                {/* Track existing repair */}
                <Link
                  to="/track-repair"
                  className="flex items-center justify-center gap-2 rounded-[22px] border border-[#e5e7eb] bg-white px-5 py-3 text-[13px] font-medium text-[#5f6368] hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  <Search size={14} />
                  Track an existing repair
                </Link>
              </div>
            </div>

          {/* Quick Add-ons — only shown when cart has items */}
          {addons.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-[#202124]">Quick Add-ons</h2>
                <p className="mt-1 text-[13px] text-[#5f6368]">Ships together with your repair</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {addons.map((addon) => {
                  const isInCart = items.some(item => item.id === addon._id);
                  return (
                    <div key={addon._id} className="group relative w-44 rounded-2xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:border-red-100 hover:shadow-lg hover:shadow-red-500/5">
                      <div className="aspect-square mb-3 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-4 group-hover:bg-red-50/50 transition-colors duration-300">
                        <img
                          src={addon.imageUrl || `https://placehold.co/200x200/fff7f7/dc2626?text=${encodeURIComponent(addon.name)}`}
                          alt={addon.name}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/200x200/fff7f7/dc2626?text=" + encodeURIComponent(addon.name);
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <h3 className="text-[13px] font-bold text-[#202124] line-clamp-1">{addon.name}</h3>
                        {addon.description && (
                          <p className="mt-0.5 text-[11px] text-[#9aa0a6] line-clamp-1">{addon.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-bold text-red-600">
                          {formatRepairCartCurrency(addon.price)}
                        </span>
                        {isInCart ? (
                          <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
                            Added
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddAddon(addon)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white"
                            aria-label={`Add ${addon.name} to cart`}
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
