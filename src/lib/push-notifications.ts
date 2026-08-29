"use client";

import { PushPromoNotification } from "./types";

const LOCAL_STORAGE_KEY = "topup_push_subscribed";
const LOCAL_STORAGE_NOTIFS = "topup_notifications_history";

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      await registerServiceWorker();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

export function isPushSubscribed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LOCAL_STORAGE_KEY) === "true" && Notification.permission === "granted";
}

/**
 * Trigger simulasi pengiriman push notification lokal
 */
export async function sendLocalNotification(promo: Omit<PushPromoNotification, "id" | "timestamp">) {
  if (typeof window === "undefined") return;

  const newNotif: PushPromoNotification = {
    id: `notif-${Date.now()}`,
    title: promo.title,
    body: promo.body,
    url: promo.url,
    icon: promo.icon || "/icons/icon-192.png",
    timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  };

  // Simpan ke riwayat notif lokal
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTIFS) || "[]");
    localStorage.setItem(LOCAL_STORAGE_NOTIFS, JSON.stringify([newNotif, ...existing]));
  } catch {
    // Ignore storage errors
  }

  // Tampilkan notifikasi jika ada izin
  if ("serviceWorker" in navigator && Notification.permission === "granted") {
    const reg = await navigator.serviceWorker.ready;
    if (reg) {
      reg.showNotification(newNotif.title, {
        body: newNotif.body,
        icon: newNotif.icon,
        badge: newNotif.icon,
        data: { url: newNotif.url },
      });
    }
  }
}

export function getStoredNotifications(): PushPromoNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTIFS) || "[]");
  } catch {
    return [];
  }
}
