"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-terracotta-soft text-terracotta shadow-sm ring-4 ring-terracotta/10">
        <AlertTriangle size={42} strokeWidth={2} />
      </div>

      <span className="mt-6 font-mono text-xs font-bold uppercase tracking-widest text-terracotta">
        Terjadi Kendala Sistem
      </span>

      <h1 className="mt-2 text-2xl font-extrabold text-deep-pine sm:text-3xl tracking-tight">
        Gagal Memuat Halaman
      </h1>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted leading-relaxed">
        Sistem mendeteksi gangguan koneksi atau kegagalan render. Silakan coba muat ulang atau kembali ke halaman utama.
      </p>

      {error.digest && (
        <span className="mt-3 font-mono text-[11px] text-muted/80 bg-soft-sand px-3 py-1 rounded-full border border-border">
          Digest ID: {error.digest}
        </span>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="tap-target inline-flex items-center gap-2 rounded-full bg-karyalo-green px-6 py-3 text-xs sm:text-sm font-bold text-warm-white hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Muat Ulang Halaman</span>
        </button>
        <Link
          href="/"
          className="tap-target inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-xs sm:text-sm font-bold text-deep-pine hover:bg-soft-sand active:scale-95 transition-all shadow-xs"
        >
          <Home className="h-4 w-4" />
          <span>Ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
