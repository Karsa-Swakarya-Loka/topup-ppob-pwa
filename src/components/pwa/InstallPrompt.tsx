"use client";

import React, { useState, useEffect } from "react";
import { Download, Sparkles, X, Smartphone, ArrowDown } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    const dismissed = sessionStorage.getItem("pwa_prompt_dismissed");
    if (dismissed) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        alert("Untuk pengguna iPhone/iPad: Tekan tombol 'Bagikan' (Share) di Safari, lalu pilih 'Tambahkan ke Layar Utama' (Add to Home Screen).");
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-6 duration-300 md:bottom-6 md:left-auto md:right-6">
      <div className="relative overflow-hidden rounded-(--radius-card) border border-border bg-warm-white p-5 shadow-xl">
        <button
          onClick={handleDismiss}
          className="tap-target absolute right-2 top-2 rounded-full p-1.5 text-muted hover:bg-soft-sand hover:text-ink"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-soft-sage text-deep-pine">
            <Smartphone className="h-6 w-6 stroke-[1.8]" />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-soft-sage px-2 py-0.5 text-[10px] font-semibold text-deep-pine">
                Aplikasi Web Ringan
              </span>
            </div>

            <h4 className="mt-1 text-sm font-semibold text-deep-pine">
              Pasang Aplikasi di Layar Utama HP
            </h4>
            <p className="mt-0.5 text-xs text-muted leading-relaxed">
              Akses cepat tanpa browser, auto-save akun game favorit, dan notifikasi flash sale.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="tap-target flex flex-1 items-center justify-center gap-2 rounded-full bg-karyalo-green py-2.5 px-4 text-xs font-semibold text-warm-white hover:opacity-90 active:scale-95 transition-all"
          >
            <Download className="h-4 w-4 stroke-2" />
            <span>Install Aplikasi</span>
          </button>
          <button
            onClick={handleDismiss}
            className="tap-target rounded-full border border-border bg-white px-4 py-2.5 text-xs font-medium text-muted hover:bg-soft-sand hover:text-ink transition-all"
          >
            Nanti
          </button>
        </div>

        {isIOS && (
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-muted">
            <ArrowDown className="h-3 w-3 text-deep-pine" />
            <span>iOS: Tekan tombol Share Safari ➔ "Add to Home Screen"</span>
          </div>
        )}
      </div>
    </div>
  );
}
