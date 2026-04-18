import { Link, Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  formatRepairCartCurrency,
  readRepairCheckoutSession,
  saveRepairCheckoutSession,
  type PostageType,
  type RepairCheckoutDetails,
  useRepairCart,
} from "../lib/repairCart";
import { createCheckout, type CheckoutPayload } from "../lib/api";
import { useState, type FormEvent } from "react";
import { useSiteSettings } from "../lib/SiteSettingsContext";

type CheckoutErrors = Partial<Record<keyof RepairCheckoutDetails, string>>;

const PrinterIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
    className={`h-7 w-7 transition-colors duration-200 ${active ? "stroke-red-600" : "stroke-[#6b7280]"}`}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="9" y1="21" x2="12" y2="21" />
  </svg>
);

const PackageIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
    className={`h-7 w-7 transition-colors duration-200 ${active ? "stroke-red-600" : "stroke-[#6b7280]"}`}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
    <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
  </svg>
);

const CollectionIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
    className={`h-7 w-7 transition-colors duration-200 ${active ? "stroke-red-600" : "stroke-[#6b7280]"}`}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ALL_POSTAGE_OPTIONS: { value: PostageType; title: string; description: string; flag?: "sameDayRepairs" | "collectionDelivery"; restriction?: string }[] = [
  {
    value: "print-label",
    title: "Print Our Label",
    description: "We'll email you a free prepaid label to print at home",
  },
  {
    value: "send-pack",
    title: "Send a Pack From Us",
    description: "We'll post you a free prepaid packaging kit",
  },
  {
    value: "collection",
    title: "Collection & Delivery",
    description: "We'll collect your device and deliver it back once repaired",
    flag: "collectionDelivery",
    restriction: "Preston area only",
  },
];

const defaultCheckoutDetails: RepairCheckoutDetails = {
  additionalInfo: "",
  addressLine1: "",
  city: "",
  devicePassword: "",
  email: "",
  firstName: "",
  lastName: "",
  marketingConsent: false,
  mobileNetwork: "",
  phoneNumber: "",
  postageType: "",
  postcode: "",
  termsAccepted: false,
};

const networkOptions = ["EE", "O2", "Vodafone", "Three", "Tesco Mobile", "giffgaff"];

export default function RepairCheckoutPage() {
  const navigate = useNavigate();
  const { itemCount, items, subtotal } = useRepairCart();
  const { operations: { sameDayRepairs, collectionDelivery } } = useSiteSettings();

  // Build the available postage options based on admin settings
  const postageOptions = ALL_POSTAGE_OPTIONS.filter(opt => {
    if (opt.flag === "collectionDelivery") return collectionDelivery;
    if (opt.flag === "sameDayRepairs")     return sameDayRepairs;
    return true;
  });
  const existingSession = readRepairCheckoutSession();
  const [formData, setFormData] = useState<RepairCheckoutDetails>(defaultCheckoutDetails);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const total = subtotal;

  if (itemCount === 0) {
    return <Navigate to="/repair-cart" replace />;
  }

  function clearFieldError(field: keyof RepairCheckoutDetails) {
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function updateField<K extends keyof RepairCheckoutDetails>(field: K, value: RepairCheckoutDetails[K]) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
    clearFieldError(field);
  }

  function validateForm() {
    const nextErrors: CheckoutErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    }

    if (!formData.addressLine1.trim()) {
      nextErrors.addressLine1 = "Address line 1 is required.";
    }

    if (!formData.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!formData.postcode.trim()) {
      nextErrors.postcode = "Postcode is required.";
    }

    if (!formData.postageType) {
      nextErrors.postageType = "Please select a postage option.";
    }

    // Collection & Delivery is Preston-area only — enforce PR postcode
    if (formData.postageType === "collection" && formData.postcode.trim()) {
      const pc = formData.postcode.trim().toUpperCase().replace(/\s+/g, "");
      const isPreston = /^PR([1-9]|25|26)[A-Z0-9]+$/.test(pc);
      if (!isPreston) {
        nextErrors.postcode =
          "Collection & Delivery is only available for Preston area (PR) postcodes. Please choose another postage option or use a PR postcode.";
      }
    }

    if (!formData.termsAccepted) {
      nextErrors.termsAccepted = "You must agree to the Terms & Conditions.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // Split cart into repairs vs accessory add-ons so the backend can
      // validate them with their respective pipelines (PricingRule vs Addon).
      const repairItems    = items.filter(i => i.category !== "accessory");
      const accessoryItems = items.filter(i => i.category === "accessory");

      // Guard: any accessory with a colour palette must have a colour chosen
      const missingColor = accessoryItems.find(
        i => i.addonColors && i.addonColors.length > 0 && !i.selectedColor,
      );
      if (missingColor) {
        setSubmitError(`Please choose a colour for "${missingColor.model}" before continuing.`);
        setSubmitting(false);
        return;
      }

      const primaryRepair = repairItems[0] ?? items[0];

      // Create order on the backend
      const payload: CheckoutPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phoneNumber,
        device: primaryRepair?.tab ?? "phone",
        brand: primaryRepair?.brandName ?? "",
        model: primaryRepair?.model ?? "",
        repairType: primaryRepair?.repairName ?? "",
        postageType: formData.postageType,
        ...(formData.postageType === "collection"
          ? {
              collectionAddress: [formData.addressLine1, formData.city].filter(Boolean).join(", "),
              collectionPostcode: formData.postcode,
            }
          : {}),
        items: repairItems.map((item) => ({
          repairTypeId: item.id,
          repairTypeName: item.repairName,
          modelId: item.modelSlug,
          modelName: item.model,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        addons: accessoryItems.map((item) => ({
          addonId: item.addonId ?? item.id,
          name: item.model,
          price: item.unitPrice,
          ...(item.selectedColor
            ? { selectedColor: { name: item.selectedColor.name, hex: item.selectedColor.hex } }
            : {}),
        })),
      };

      const result = await createCheckout(payload);

      // Save session with the real order data from the backend
      saveRepairCheckoutSession({
        createdAt: existingSession?.createdAt ?? new Date().toISOString(),
        customerDetails: formData,
        items,
        paymentStatus: "pending",
        subtotal,
        total,
        paymentReference: result.orderNumber,
        orderId: result.orderId,
      });

      navigate("/repair-payment");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

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
              <Link to="/repair-cart" className="inline-flex items-center text-[13px] font-medium text-red-600 hover:text-red-700">
                Back to cart
              </Link>
              <h1 className="mt-3 text-[28px] font-bold leading-tight text-[#202124]">Please confirm your details!</h1>
              <p className="mt-1 text-[14px] text-[#5f6368]">Make sure everything is correct before continuing to payment.</p>
            </div>

            <div className="rounded-[24px] border border-red-100 bg-white px-5 py-4 text-right shadow-sm">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-red-600">Ready for payment</p>
              <p className="mt-1 text-[22px] font-bold text-[#111827]">{formatRepairCartCurrency(total)}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
            <form onSubmit={handleSubmit} autoComplete="off" className="rounded-[28px] border border-red-100 bg-white p-6 md:p-8">
              <div>
                <h2 className="text-[22px] font-semibold text-[#202124]">Your Details</h2>
                <p className="mt-1 text-[14px] text-[#5f6368]">We will use these details for your repair order and payment.</p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div>
                  <input
                    id="firstName"
                    type="text"
                    aria-label="First Name"
                    autoComplete="off"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.firstName ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.firstName}</p> : null}
                </div>

                <div>
                  <input
                    id="lastName"
                    type="text"
                    aria-label="Last Name"
                    autoComplete="off"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.lastName ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.lastName}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <input
                    id="email"
                    type="email"
                    aria-label="Email Address"
                    autoComplete="off"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.email ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.email}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <input
                    id="phoneNumber"
                    type="tel"
                    aria-label="Phone Number"
                    autoComplete="off"
                    placeholder="Phone Number *"
                    value={formData.phoneNumber}
                    onChange={(event) => updateField("phoneNumber", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.phoneNumber ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.phoneNumber}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <input
                    id="addressLine1"
                    type="text"
                    aria-label="Address Line 1"
                    autoComplete="off"
                    placeholder="Address Line 1 *"
                    value={formData.addressLine1}
                    onChange={(event) => updateField("addressLine1", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.addressLine1 ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.addressLine1}</p> : null}
                </div>

                <div>
                  <input
                    id="city"
                    type="text"
                    aria-label="City"
                    autoComplete="off"
                    placeholder="City *"
                    value={formData.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.city ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.city}</p> : null}
                </div>

                <div>
                  <input
                    id="postcode"
                    type="text"
                    aria-label="Postcode"
                    autoComplete="off"
                    placeholder="Postcode *"
                    value={formData.postcode}
                    onChange={(event) => updateField("postcode", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] uppercase text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.postcode ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.postcode}</p> : null}
                </div>

                <div>
                  <input
                    id="devicePassword"
                    type="password"
                    aria-label="Device Password"
                    autoComplete="new-password"
                    placeholder="Device Password (Optional)"
                    value={formData.devicePassword}
                    onChange={(event) => updateField("devicePassword", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                  {errors.devicePassword ? <p className="mt-2 text-[12px] font-medium text-red-600">{errors.devicePassword}</p> : null}
                </div>

                <div>
                  <select
                    id="mobileNetwork"
                    aria-label="Mobile Network"
                    autoComplete="off"
                    value={formData.mobileNetwork}
                    onChange={(event) => updateField("mobileNetwork", event.target.value)}
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  >
                    <option value="">Mobile Network</option>
                    {networkOptions.map((network) => (
                      <option key={network} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <textarea
                    id="additionalInfo"
                    rows={4}
                    aria-label="Additional Info"
                    autoComplete="off"
                    value={formData.additionalInfo}
                    onChange={(event) => updateField("additionalInfo", event.target.value)}
                    placeholder="Any Additional Info? (Optional)"
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-[14px] text-[#202124] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-[16px] font-semibold text-[#202124]">How would you like to send your device?</h3>
                <p className="mt-1 text-[13px] text-[#5f6368]">Choose your preferred postage option — both are completely free.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {postageOptions.map((option) => {
                    const isSelected = formData.postageType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField("postageType", option.value)}
                        className={`flex flex-col gap-3 rounded-[20px] border-2 p-5 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-red-500 bg-red-50 shadow-[0_4px_16px_rgba(220,38,38,0.12)]"
                            : errors.postageType
                              ? "border-red-200 bg-white hover:border-red-300"
                              : "border-[#e5e7eb] bg-white hover:border-red-200 hover:bg-[#fff7f7]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] transition-colors duration-200 ${isSelected ? "bg-red-100" : "bg-[#f3f4f6]"}`}>
                            {option.value === "print-label" && <PrinterIcon active={isSelected} />}
                            {option.value === "send-pack"   && <PackageIcon active={isSelected} />}
                            {option.value === "collection"  && <CollectionIcon active={isSelected} />}
                          </div>
                          <div
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                              isSelected ? "border-red-600 bg-red-600" : "border-[#d1d5db] bg-white"
                            }`}
                          >
                            {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div>
                          <p className={`text-[14px] font-semibold ${isSelected ? "text-red-700" : "text-[#202124]"}`}>
                            {option.title}
                          </p>
                          <p className="mt-0.5 text-[12px] leading-[1.5] text-[#5f6368]">{option.description}</p>
                          {option.restriction && (
                            <div className="mt-2.5 flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 w-fit border border-red-200">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 stroke-red-700">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span className="text-[11px] font-bold text-red-700 tracking-wide">
                                {option.restriction}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.postageType && <p className="mt-2 text-[12px] font-medium text-red-600">{errors.postageType}</p>}
              </div>

              <div className="mt-8 rounded-[24px] border border-[#fee2e2] bg-[#fff7f7] p-5">
                <p className="text-[14px] leading-7 text-[#5f6368]">
                  To provide further peace of mind, we would love to send our loyal customers special offers, promotions & useful advice.
                </p>

                <div className="mt-5 space-y-4">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-[18px] border px-4 py-3 text-[14px] text-[#202124] transition-all duration-200 ${
                      formData.marketingConsent
                        ? "border-red-200 bg-white shadow-sm"
                        : "border-transparent bg-white/80 hover:border-red-100 hover:bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(event) => updateField("marketingConsent", event.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                        formData.marketingConsent
                          ? "border-red-600 bg-red-600 shadow-[0_8px_20px_rgba(220,38,38,0.24)]"
                          : "border-[#d1d5db] bg-white"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${formData.marketingConsent ? "bg-white" : "bg-transparent"}`} />
                    </span>
                    <span className="leading-6">I’d like to receive special offers, promotions and useful advice by email or SMS.</span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-[18px] border px-4 py-3 text-[14px] text-[#202124] transition-all duration-200 ${
                      formData.termsAccepted
                        ? "border-red-200 bg-white shadow-sm"
                        : errors.termsAccepted
                          ? "border-red-200 bg-white"
                          : "border-transparent bg-white/80 hover:border-red-100 hover:bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(event) => updateField("termsAccepted", event.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                        formData.termsAccepted
                          ? "border-red-600 bg-red-600 shadow-[0_8px_20px_rgba(220,38,38,0.24)]"
                          : errors.termsAccepted
                            ? "border-red-300 bg-red-50"
                            : "border-[#d1d5db] bg-white"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${formData.termsAccepted ? "bg-white" : "bg-transparent"}`} />
                    </span>
                    <span className="leading-6">I agree to the Terms & Conditions. *</span>
                  </label>

                  {errors.termsAccepted ? <p className="text-[12px] font-medium text-red-600">{errors.termsAccepted}</p> : null}
                </div>
              </div>

              {submitError && (
                <div className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-[13px] font-medium text-red-700">{submitError}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/repair-cart"
                  className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-3 text-[14px] font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
                >
                  Back to cart
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating order..." : "Continue to payment"}
                </button>
              </div>
            </form>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-red-100 bg-white p-6">
                <h2 className="text-[20px] font-semibold text-[#202124]">Order Summary</h2>
                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 rounded-[22px] border border-[#f3f4f6] p-4">
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

                <div className="mt-6 space-y-4 border-t border-[#eef2f7] pt-5 text-[14px]">
                  <div className="flex items-center justify-between text-[#5f6368]">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-[#202124]">{formatRepairCartCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5f6368]">
                    <span>Mail In Service Fee</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#eef2f7] pt-4">
                    <span className="text-[15px] font-semibold text-[#202124]">Total</span>
                    <span className="text-[24px] font-bold text-[#111827]">{formatRepairCartCurrency(total)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
