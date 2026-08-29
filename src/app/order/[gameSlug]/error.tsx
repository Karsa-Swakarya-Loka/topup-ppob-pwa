"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function OrderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Order Page Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta-soft text-terracotta shadow-xs">
        <AlertCircle size={36} strokeWidth={2} />
      </div>

      <h2 className="mt-4 text-xl font-bold text-deep-pine">
        Gagal Memuat Produk Game
      </h2>

      <p className="mt-1.5 max-w-sm text-xs text-muted leading-relaxed">
        Terjadi kendala saat memuat katalog SKU game. Silakan coba muat ulang atau pilih game lain.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="tap-target inline-flex items-center gap-1.5 rounded-full bg-karyalo-green px-5 py-2.5 text-xs font-bold text-warm-white hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Coba Lagi</span>
        </button>
        <Link
          href="/"
          className="tap-target inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-5 py-2.5 text-xs font-bold text-deep-pine hover:bg-soft-sand active:scale-95 transition-all shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Katalog Game</span>
        </Link>
      </div>
    </div>
  );
}
