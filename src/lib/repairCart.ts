import { useEffect, useMemo, useState } from "react";

export type RepairCartServiceType = "mail-in";

export type AddonCartColor = {
  name: string;
  hex: string;
};

export type RepairCartItem = {
  id: string;
  brandName: string;
  brandSlug: string;
  deviceImage: string;
  model: string;
  modelSlug: string;
  priceLabel: string;
  quantity: number;
  repairName: string;
  sectionSlug?: string;
  serviceType: RepairCartServiceType;
  tab: "phone" | "tablet" | "watch";
  turnaround: string;
  unitPrice: number;
  warranty: string;
  category?: "repair" | "accessory";
  /** For add-ons with colour variants — the colour the customer chose */
  selectedColor?: AddonCartColor;
  /** Used when the item is an accessory add-on — lets us look up colour palette + backend addonId */
  addonId?: string;
  addonColors?: AddonCartColor[];
};

export type AddRepairCartResult = {
  item: RepairCartItem;
  items: RepairCartItem[];
  status: "added" | "exists";
};

export type PostageType = "print-label" | "send-pack" | "collection";

export type RepairCheckoutDetails = {
  additionalInfo: string;
  addressLine1: string;
  city: string;
  devicePassword: string;
  email: string;
  firstName: string;
  lastName: string;
  marketingConsent: boolean;
  mobileNetwork: string;
  phoneNumber: string;
  postageType: PostageType | "";
  postcode: string;
  termsAccepted: boolean;
};

export type RepairCheckoutPaymentStatus = "pending" | "paid" | "failed";

export type RepairCheckoutSession = {
  createdAt: string;
  customerDetails: RepairCheckoutDetails;
  items: RepairCartItem[];
  paymentReference?: string;
  paymentStatus: RepairCheckoutPaymentStatus;
  subtotal: number;
  total: number;
  orderId?: string;
};

const STORAGE_KEY = "repair-my-phone-screen-cart";
const CHECKOUT_STORAGE_KEY = "repair-my-phone-screen-checkout";
const REPAIR_CART_EVENT = "repair-cart-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitRepairCartUpdate() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(REPAIR_CART_EVENT));
}

function writeRepairCartItems(items: RepairCartItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitRepairCartUpdate();
}

export function readRepairCartItems() {
  if (!isBrowser()) {
    return [] as RepairCartItem[];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [] as RepairCartItem[];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as RepairCartItem[]) : ([] as RepairCartItem[]);
  } catch {
    return [] as RepairCartItem[];
  }
}

export function addRepairCartItem(item: Omit<RepairCartItem, "quantity">): AddRepairCartResult {
  const items = readRepairCartItems();
  const existingItem = items.find((entry) => entry.id === item.id);

  if (existingItem) {
    writeRepairCartItems(items);

    return {
      item: existingItem,
      items,
      status: "exists",
    };
  }

  const createdItem = { ...item, quantity: 1 };
  const updatedItems = [...items, createdItem];
  writeRepairCartItems(updatedItems);

  return {
    item: createdItem,
    items: updatedItems,
    status: "added",
  };
}

export function updateRepairCartItemColor(id: string, color: AddonCartColor) {
  const items = readRepairCartItems();
  const updated = items.map(item => item.id === id ? { ...item, selectedColor: color } : item);
  writeRepairCartItems(updated);
  return updated;
}

export function updateRepairCartItemQuantity(id: string, quantity: number) {
  const items = readRepairCartItems();
  const nextQuantity = Math.min(1, Math.max(1, quantity));
  const updatedItems = items.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item));

  writeRepairCartItems(updatedItems);
  return updatedItems;
}

export function removeRepairCartItem(id: string) {
  const updatedItems = readRepairCartItems().filter((item) => item.id !== id);
  writeRepairCartItems(updatedItems);
  return updatedItems;
}

export function clearRepairCart() {
  writeRepairCartItems([]);
}

export function readRepairCheckoutSession() {
  if (!isBrowser()) {
    return null as RepairCheckoutSession | null;
  }

  try {
    const raw = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);

    if (!raw) {
      return null as RepairCheckoutSession | null;
    }

    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === "object" ? (parsed as RepairCheckoutSession) : (null as RepairCheckoutSession | null);
  } catch {
    return null as RepairCheckoutSession | null;
  }
}

export function saveRepairCheckoutSession(session: RepairCheckoutSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(session));
}

export function clearRepairCheckoutSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(CHECKOUT_STORAGE_KEY);
}

export function updateRepairCheckoutPaymentStatus(status: Exclude<RepairCheckoutPaymentStatus, "pending">, paymentReference?: string) {
  const session = readRepairCheckoutSession();

  if (!session) {
    return null as RepairCheckoutSession | null;
  }

  const updatedSession: RepairCheckoutSession = {
    ...session,
    paymentReference,
    paymentStatus: status,
  };

  saveRepairCheckoutSession(updatedSession);
  return updatedSession;
}

export function formatRepairCartCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function useRepairCart() {
  const [items, setItems] = useState<RepairCartItem[]>(() => readRepairCartItems());

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const syncItems = () => {
      setItems(readRepairCartItems());
    };

    syncItems();
    window.addEventListener(REPAIR_CART_EVENT, syncItems);
    window.addEventListener("storage", syncItems);

    return () => {
      window.removeEventListener(REPAIR_CART_EVENT, syncItems);
      window.removeEventListener("storage", syncItems);
    };
  }, []);

  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0), [items]);

  return {
    clearCart: clearRepairCart,
    itemCount,
    items,
    removeItem: removeRepairCartItem,
    subtotal,
    updateQuantity: updateRepairCartItemQuantity,
  };
}
