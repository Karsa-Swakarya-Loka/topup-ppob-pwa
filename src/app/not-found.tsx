"use client";

import React from "react";
import Link from "next/link";
import { Gamepad2, ArrowLeft, Home, Search, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-soft-sage text-karyalo-green shadow-sm ring-4 ring-karyalo-green/10">
        <Gamepad2 size={42} strokeWidth={1.8} />
      </div>

      <span className="mt-6 font-mono text-xs font-bold uppercase tracking-widest text-terracotta">
        Error 404 &bull; Halaman Tidak Ditemukan
      </span>

      <h1 className="mt-2 text-2xl font-extrabold text-deep-pine sm:text-3xl tracking-tight">
        Oops! Halaman yang Kamu Cari Tidak Ada
      </h1>

      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted leading-relaxed">
        Halaman mungkin telah dipindahkan, tautan salah ketik, atau produk game sedang diperbarui di sistem.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="tap-target inline-flex items-center gap-2 rounded-full bg-deep-pine px-6 py-3 text-xs sm:text-sm font-bold text-warm-white hover:bg-karyalo-green active:scale-95 transition-all shadow-sm"
        >
          <Home className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/#flash-sale"
          className="tap-target inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-xs sm:text-sm font-bold text-deep-pine hover:bg-soft-sand active:scale-95 transition-all shadow-xs"
        >
          <Zap className="h-4 w-4 text-accent-cyan fill-current" />
          <span>Lihat Flash Sale</span>
        </Link>
      </div>
    </div>
  );
}
