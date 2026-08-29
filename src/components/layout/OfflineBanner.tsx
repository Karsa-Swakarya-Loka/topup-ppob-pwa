"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-warm-white transition-all duration-300 ${
        isOnline
          ? "bg-emerald-600 shadow-md"
          : "bg-terracotta shadow-md animate-bounce"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Koneksi internet Anda telah kembali online.</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Anda sedang offline. Periksa koneksi internet Anda untuk memproses transaksi.</span>
        </>
      )}
    </div>
  );
}
