import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ── Client-side cache & request de-dupe ───────────────────────────────────
// For read-only public catalog endpoints (device types, brands, series,
// models, pricing) we cache responses in memory with a short TTL and
// de-duplicate concurrent in-flight requests for the same key.
// This dramatically speeds up back-button navigation and avoids hitting
// the same endpoint 10× from different components mounting in the same tick.
type CacheEntry<T> = { value: T; expiresAt: number };
const responseCache = new Map<string, CacheEntry<unknown>>();
const inflight      = new Map<string, Promise<unknown>>();

function getCached<T>(key: string): T | null {
  const hit = responseCache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    responseCache.delete(key);
    return null;
  }
  return hit.value as T;
}

function setCached<T>(key: string, value: T, ttlMs: number) {
  responseCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/**
 * Wraps a network fetch with:
 *   1. In-memory cache (skips the request entirely while fresh)
 *   2. Request deduplication (parallel callers share the same promise)
 */
async function cachedFetch<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) return cached;

  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fetcher()
    .then((value) => {
      setCached(key, value, ttlMs);
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

/** Clear cached catalog entries — useful after mutations in admin workflows */
export function clearPublicCatalogCache() {
  responseCache.clear();
  inflight.clear();
}

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
  collectionAddress?: string;
  collectionPostcode?: string;
  items: {
    repairTypeId: string;
    repairTypeName: string;
    modelId: string;
    modelName: string;
    quantity: number;
    unitPrice: number;
  }[];
  addons?: {
    addonId: string;
    name: string;
    price: number;
    selectedColor?: { name: string; hex: string };
  }[];
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

/**
 * ⚡ Fast one-shot endpoint — returns the model, its brand, and all active
 * pricing rules in a single network request. Replaces the old two-request
 * flow of getPublicBrandModels() + getPricingByModel().
 */
export interface ModelBundleResult {
  _id: string;
  name: string;
  slug: string;
  brandName: string;
  deviceTypeName: string;
  imageUrl?: string;
  seriesId?: string;
  seriesName?: string;
  isActive: boolean;
  brand: BrandResult;
  pricing: PricingRuleResult[];
}

export async function getPublicModelBundle(modelSlug: string): Promise<ModelBundleResult | null> {
  return cachedFetch(`model-bundle:${modelSlug}`, 10 * 60 * 1000, async () => {
    try {
      const res = await api.get<{ data: ModelBundleResult }>(`/public/models/${modelSlug}/bundle`);
      return res.data.data ?? null;
    } catch {
      return null;
    }
  });
}

// ── Public Catalog: Addons ────────────────────────────────────
export interface AddonColorOption {
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface AddonResult {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  imageUrl?: string;
  sortOrder: number;
  colors?: AddonColorOption[];
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
  return cachedFetch("device-types", 30 * 60 * 1000, async () => {
    const res = await api.get<{ data: DeviceTypeResult[] }>("/public/device-types");
    return res.data.data ?? [];
  });
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
  hasSeries?: boolean;
  isActive: boolean;
}

export async function getPublicBrands(deviceTypeId?: string): Promise<BrandResult[]> {
  const key = `brands:${deviceTypeId ?? 'all'}`;
  return cachedFetch(key, 15 * 60 * 1000, async () => {
    const params = deviceTypeId ? { deviceTypeId } : {};
    const res = await api.get<{ data: BrandResult[] }>("/public/brands", { params });
    return res.data.data ?? [];
  });
}

/**
 * ⚡ Same as getPublicBrands but with a pre-computed `hasSeries` flag on
 * each brand — lets the brand grid page skip its previous N+1 series probes.
 */
export async function getPublicBrandsWithMeta(deviceTypeId?: string): Promise<BrandResult[]> {
  const key = `brands-meta:${deviceTypeId ?? 'all'}`;
  return cachedFetch(key, 15 * 60 * 1000, async () => {
    const params = deviceTypeId ? { deviceTypeId } : {};
    const res = await api.get<{ data: BrandResult[] }>("/public/brands-with-meta", { params });
    return res.data.data ?? [];
  });
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
  return cachedFetch(`brand-series:${brandSlug}`, 15 * 60 * 1000, async () => {
    const res = await api.get<{ data: { brand: BrandResult; series: SeriesResult[] } }>(`/public/brands/${brandSlug}/series`);
    return res.data.data;
  });
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

export interface BrandModelsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface BrandModelsResponse {
  brand: BrandResult;
  models: ModelResult[];
  pagination?: BrandModelsPagination;
}

/**
 * ⚡ Now paginated + searchable on the server. Pass `page` / `limit` / `q`
 * to load in chunks instead of all 90+ models at once.
 *
 * When called without pagination params, it still returns the first
 * `limit` (default 30) models for backwards compatibility — callers that
 * need more should pass explicit page/limit or use the `loadMore` pattern.
 */
export async function getPublicBrandModels(
  brandSlug: string,
  seriesSlug?: string,
  opts?: { page?: number; limit?: number; q?: string },
): Promise<BrandModelsResponse> {
  const params: Record<string, string | number> = {};
  if (seriesSlug)      params.seriesSlug = seriesSlug;
  if (opts?.page)      params.page = opts.page;
  if (opts?.limit)     params.limit = opts.limit;
  if (opts?.q && opts.q.trim().length > 0) params.q = opts.q.trim();

  // Only cache when there's no search query — search results shouldn't be
  // cached aggressively because callers may re-query as the user types.
  const shouldCache = !opts?.q;
  const key = `brand-models:${brandSlug}:${seriesSlug ?? 'all'}:${opts?.page ?? 1}:${opts?.limit ?? 30}`;

  const fetcher = async () => {
    const res = await api.get<{ data: BrandModelsResponse }>(`/public/brands/${brandSlug}/models`, { params });
    return res.data.data;
  };

  if (shouldCache) {
    return cachedFetch(key, 10 * 60 * 1000, fetcher);
  }
  return fetcher();
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
