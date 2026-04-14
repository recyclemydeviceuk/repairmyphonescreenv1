import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ── Checkout ──────────────────────────────────────────────────
export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  device: string;
  brand: string;
  model: string;
  repairType: string;
  postageType: string;
  items: {
    repairTypeId: string;
    repairTypeName: string;
    modelId: string;
    modelName: string;
    quantity: number;
    unitPrice: number;
  }[];
  addons?: { addonId: string; name: string; price: number }[];
}

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  total: number;
}

export async function createCheckout(data: CheckoutPayload): Promise<CheckoutResult> {
  const res = await api.post<{ data: CheckoutResult }>("/checkout", data);
  return res.data.data;
}

// ── Payment ───────────────────────────────────────────────────
export interface InitiatePaymentPayload {
  orderId: string;
  amount: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
}

export async function initiatePayment(data: InitiatePaymentPayload) {
  const res = await api.post<{ data: { paypalOrderId: string; approveUrl?: string } }>("/payment/initiate", data);
  return res.data.data;
}

export async function capturePayment(paypalOrderId: string, orderId: string) {
  const res = await api.post<{ data: { status: string; orderId: string } }>("/payment/capture", { paypalOrderId, orderId });
  return res.data.data;
}

export async function getPaymentStatus(orderId: string) {
  const res = await api.get<{ data: { status: string; paymentStatus: string; orderNumber: string; total: number } }>(`/payment/status/${orderId}`);
  return res.data.data;
}

// ── Track Repair ──────────────────────────────────────────────
export interface TrackResult {
  orderNumber:   string;
  status:        string;
  customerName:  string;
  customerEmail: string;
  customerPhone: string;
  device:        string;
  brand:         string;
  model:         string;
  repairType:    string;
  items: {
    repairType:  string;
    deviceModel: string;
    description?: string;
    quantity:    number;
    unitPrice:   number;
    totalPrice:  number;
  }[];
  subtotal:    number;
  discount:    number;
  total:       number;
  createdAt:   string;
  completedAt?: string;
}

export async function trackRepair(orderNumber: string): Promise<TrackResult> {
  const res = await api.get<{ data: TrackResult }>(`/track/${orderNumber}`);
  return res.data.data;
}

// ── Forms: Newsletter ─────────────────────────────────────────
export async function subscribeNewsletter(email: string, source: string = "footer") {
  const res = await api.post("/forms/newsletter", { email, source });
  return res.data;
}

// ── Forms: Contact ────────────────────────────────────────────
export async function submitContactForm(data: { name: string; phone: string; email: string; message: string }) {
  const res = await api.post("/forms/contact", data);
  return res.data;
}

// ── Forms: Warranty ───────────────────────────────────────────
export async function submitWarrantyClaim(data: {
  name: string;
  email: string;
  deviceBrand: string;
  deviceModel: string;
  claimInfo: string;
  orderReference?: string;
}) {
  const res = await api.post("/forms/warranty", data);
  return res.data;
}

// ── Public Catalog: Pricing by model ──────────────────────────
export interface PricingRuleResult {
  _id:                  string;
  modelId:              string;
  modelName:            string;
  brandName:            string;
  repairTypeId:         string;
  repairTypeName:       string;
  repairTypeImageUrl?:  string;
  category:             string;
  price:                number;
  originalPrice?:       number;
  description?:         string;
  warranty?:            string;
  turnaround?:          string;
  isActive:             boolean;
}

export async function getPricingByModel(modelSlug: string): Promise<PricingRuleResult[]> {
  try {
    // First get the model by slug to get its _id
    const modelRes = await api.get<{ data: { _id: string } }>(`/public/models/${modelSlug}`);
    const modelId = modelRes.data.data?._id;
    if (!modelId) return [];
    // Then get all pricing rules for that model
    const res = await api.get<{ data: PricingRuleResult[] }>(`/public/pricing/model/${modelId}`);
    return res.data.data ?? [];
  } catch {
    return [];
  }
}

// ── Public Catalog: Addons ────────────────────────────────────
export interface AddonResult {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  imageUrl?: string;
  sortOrder: number;
}

export async function getPublicAddons(): Promise<AddonResult[]> {
  const res = await api.get<{ data: AddonResult[] }>("/public/addons");
  return res.data.data ?? [];
}

// ── Public Catalog: Device Types ──────────────────────────────
export interface DeviceTypeResult {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  brandCount: number;
  isActive: boolean;
}

export async function getPublicDeviceTypes(): Promise<DeviceTypeResult[]> {
  const res = await api.get<{ data: DeviceTypeResult[] }>("/public/device-types");
  return res.data.data ?? [];
}

// ── Public Catalog: Brands ────────────────────────────────────
export interface BrandResult {
  _id: string;
  deviceTypeId: string;
  deviceTypeName: string;
  name: string;
  slug: string;
  logoUrl?: string;
  showcaseImageUrl?: string;
  modelCount: number;
  isActive: boolean;
}

export async function getPublicBrands(deviceTypeId?: string): Promise<BrandResult[]> {
  const params = deviceTypeId ? { deviceTypeId } : {};
  const res = await api.get<{ data: BrandResult[] }>("/public/brands", { params });
  return res.data.data ?? [];
}

// ── Public Catalog: Brand Series ──────────────────────────────
export interface SeriesResult {
  _id: string;
  brandId: string;
  brandName: string;
  name: string;
  slug: string;
  modelCount: number;
  isActive: boolean;
}

export async function getPublicBrandSeries(brandSlug: string): Promise<{ brand: BrandResult; series: SeriesResult[] }> {
  const res = await api.get<{ data: { brand: BrandResult; series: SeriesResult[] } }>(`/public/brands/${brandSlug}/series`);
  return res.data.data;
}

// ── Public Catalog: Brand Models ──────────────────────────────
export interface ModelResult {
  _id: string;
  name: string;
  slug: string;
  brandName: string;
  deviceTypeName: string;
  imageUrl?: string;
  seriesId?: string;
  seriesName?: string;
  isActive: boolean;
}

export async function getPublicBrandModels(brandSlug: string, seriesSlug?: string): Promise<{ brand: BrandResult; models: ModelResult[] }> {
  const params = seriesSlug ? { seriesSlug } : {};
  const res = await api.get<{ data: { brand: BrandResult; models: ModelResult[] } }>(`/public/brands/${brandSlug}/models`, { params });
  return res.data.data;
}

// ── Public Catalog: Search ────────────────────────────────────
export interface SearchResultItem {
  name: string;
  brandName: string;
  slug: string;
  tab: string;
  image: string;
}

export async function searchCatalog(query: string): Promise<SearchResultItem[]> {
  if (query.length < 2) return [];
  const res = await api.get<{ data: SearchResultItem[] }>("/public/search", { params: { q: query } });
  return res.data.data ?? [];
}

// ── Promo Codes ───────────────────────────────────────────────
export interface PromoCodeResult {
  code: string;
  discount: number;
  label: string;
}

export async function validatePromoCode(code: string): Promise<PromoCodeResult> {
  const res = await api.post<{ data: PromoCodeResult }>("/public/promo-codes/validate", { code });
  return res.data.data;
}

// ── Blog ─────────────────────────────────────────────────────
export interface BlogPostResult {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  author: string;
  publishedAt: string;
  views: number;
}

export async function getPublicBlogs(params?: Record<string, string>): Promise<{ data: BlogPostResult[]; meta: any }> {
  const res = await api.get("/blog/public", { params });
  return { data: res.data.data ?? [], meta: res.data.meta };
}

export async function getPublicBlogBySlug(slug: string): Promise<BlogPostResult | null> {
  try {
    const res = await api.get(`/blog/public/${slug}`);
    return res.data.data;
  } catch { return null; }
}

export default api;
