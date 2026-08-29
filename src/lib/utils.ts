import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const prefix = "INV";
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const timeHex = Date.now().toString(36).toUpperCase().slice(-4);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${timeHex}${randomStr}`;
}

/**
 * Format and sanitize Indonesian WhatsApp/Phone number
 * Converts '0812...' or '+62812...' to clean standard format
 */
export function sanitizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+62")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("62")) {
    cleaned = "0" + cleaned.slice(2);
  }
  return cleaned;
}

export function isValidIndonesianPhone(phone: string): boolean {
  const cleaned = sanitizePhoneNumber(phone);
  // Indonesian mobile prefix starts with 08 and has length between 10 to 14 digits
  return /^08[1-9][0-9]{7,11}$/.test(cleaned);
}

/**
 * Safe LocalStorage wrapper with Incognito/Private mode exception handling
 */
export const safeStorage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
