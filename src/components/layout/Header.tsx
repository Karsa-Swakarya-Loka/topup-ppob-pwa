"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Bell, Sparkles, X, CheckCircle2, ShieldCheck, Flame, Sliders } from "lucide-react";
import { getStoredNotifications, requestNotificationPermission, sendLocalNotification } from "@/lib/push-notifications";
import { PushPromoNotification } from "@/lib/types";

export default function Header() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<PushPromoNotification[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    setNotifications(getStoredNotifications());
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  const handleEnablePush = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      await sendLocalNotification({
        title: "Selamat Datang di TopUpPlay",
        body: "Notifikasi Flash Sale & Event Game sudah aktif. Dapatkan info harga promo pertama kali!",
        url: "/",
      });
      setNotifications(getStoredNotifications());
    }
  };

  const handleSendTestPromo = async () => {
    await sendLocalNotification({
      title: "Flash Sale Game Mobile Legends",
      body: "Weekly Diamond Pass diskon khusus hari ini. Cek ketersediaan sekarang!",
      url: "/order/mobile-legends",
    });
    setNotifications(getStoredNotifications());
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-warm-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-(--container-content) items-center justify-between gap-4 px-4 py-3 md:px-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-deep-pine text-warm-white shadow-sm transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-accent-cyan fill-current" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold tracking-tight text-deep-pine">
                  TopUp<span className="text-karyalo-green">Play</span>
                </span>
                <span className="rounded-full bg-soft-sage px-2 py-0.5 text-[10px] font-semibold text-deep-pine">
                  PWA
                </span>
              </div>
              <span className="text-[10px] text-muted -mt-0.5 hidden sm:inline">
                Top Up Game & PPOB Otomatis
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink">
            <Link href="/" className="hover:text-deep-pine font-medium">
              Katalog Game
            </Link>
            <Link href="/#flash-sale" className="hover:text-deep-pine font-medium">
              Flash Sale
            </Link>
            <Link href="/history" className="hover:text-deep-pine font-medium">
              Lacak Pesanan
            </Link>
            <Link href="/admin" className="hover:text-deep-pine font-medium text-karyalo-green">
              Admin & Notifikasi
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full bg-soft-sage px-3 py-1 text-xs font-medium text-deep-pine sm:flex">
              <Sparkles className="h-3.5 w-3.5 text-karyalo-green" />
              <span>Harga VIP Otomatis</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              aria-label="Pusat Notifikasi"
              className="tap-target relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-soft-sage transition-all active:scale-95"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-semibold text-warm-white">
                {notifications.length > 0 ? notifications.length : "!"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Drawer Modal */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 backdrop-blur-xs sm:items-center">
          <div className="relative w-full max-w-md rounded-(--radius-card) border border-border bg-warm-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-deep-pine" />
                <h3 className="font-semibold text-deep-pine text-base">Pusat Notifikasi Promo</h3>
              </div>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="tap-target rounded-full p-1.5 text-muted hover:bg-soft-sand hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Push Permission CTA */}
            {!hasPermission ? (
              <div className="my-4 rounded-(--radius-card) border border-border bg-soft-sage p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-karyalo-green shadow-xs">
                  <Flame className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-deep-pine">Aktifkan Notifikasi Promo</h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Dapatkan info event Diamond Kuning, Gacha Baru, dan Flash Sale kilat langsung ke layar HP Anda.
                </p>
                <button
                  onClick={handleEnablePush}
                  className="tap-target mt-3 w-full rounded-full bg-karyalo-green py-2.5 text-xs font-semibold text-warm-white hover:opacity-90 active:scale-95 transition-all"
                >
                  Aktifkan Notifikasi Sekarang
                </button>
              </div>
            ) : (
              <div className="my-3 flex items-center justify-between rounded-xl bg-soft-sage p-3 text-xs text-deep-pine">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-karyalo-green" />
                  <span>Push Notifikasi Aktif</span>
                </div>
                <button
                  onClick={handleSendTestPromo}
                  className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-karyalo-green border border-border hover:bg-soft-sand"
                >
                  Test Notif
                </button>
              </div>
            )}

            {/* Notification List */}
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted">
                  Belum ada notifikasi baru. Tekan tombol aktifkan di atas.
                </div>
              ) : (
                notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.url}
                    onClick={() => setIsNotifOpen(false)}
                    className="block rounded-xl border border-border bg-white p-3 hover:border-karyalo-green/40 hover:bg-soft-sand transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs text-deep-pine">{notif.title}</span>
                      <span className="text-[10px] text-muted">{notif.timestamp}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink/80 leading-relaxed">{notif.body}</p>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-border pt-3 text-center">
              <span className="flex items-center justify-center gap-1 text-[11px] text-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-deep-pine" />
                Sistem Notifikasi Resmi & Bebas Spam
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
