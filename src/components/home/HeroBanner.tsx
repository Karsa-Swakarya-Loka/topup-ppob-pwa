"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FEATURED_PROMOS } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Zap, ShieldCheck } from "lucide-react";

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_PROMOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const promo = FEATURED_PROMOS[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-(--radius-card) bg-deep-pine text-warm-white shadow-md">
      {/* Background Ambient Glow & Blurred Backdrop */}
      <div className="absolute inset-0 -z-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="relative h-full w-full">
          <Image
            src={promo.image}
            alt={promo.title}
            fill
            className="object-cover blur-2xl transition-all duration-700 scale-110"
            priority
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-deep-pine via-deep-pine/90 to-deep-pine/40 z-0 pointer-events-none" />

      {/* Main Banner Container */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-6 sm:p-8 md:p-12">
        {/* Left Column: Text & CTA */}
        <div className="md:col-span-7 flex flex-col items-start justify-center space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-accent-cyan px-3 py-1 text-xs font-bold text-deep-pine uppercase tracking-wider">
              {promo.tag}
            </span>
            <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-warm-white">
              {promo.badge}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-soft-sage">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-cyan" />
              <span>Otomatis Masuk 3 Detik</span>
            </span>
          </div>

          <div className="space-y-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-warm-white tracking-tight leading-tight">
              {promo.title}
            </h1>
            <p className="text-sm sm:text-base text-soft-sage/90 leading-relaxed font-normal">
              {promo.subtitle}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 w-full">
            <Link
              href={`/order/${promo.gameSlug}`}
              className="tap-target inline-flex items-center gap-2 rounded-full bg-karyalo-green px-7 py-3.5 text-sm font-bold text-warm-white hover:bg-blue-600 hover:shadow-lg active:scale-95 transition-[background-color,box-shadow,transform] duration-200 shadow-md"
            >
              <Zap className="h-4 w-4 text-accent-cyan fill-current" />
              <span>Klaim Promo Sekarang</span>
            </Link>

            {/* Pagination Indicators & Controls */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1.5">
                {FEATURED_PROMOS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                      idx === currentIndex
                        ? "w-7 bg-accent-cyan"
                        : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) =>
                        (prev - 1 + FEATURED_PROMOS.length) % FEATURED_PROMOS.length
                    )
                  }
                  className="tap-target flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-warm-white hover:bg-white/30 active:scale-90 transition-[background-color,transform] duration-150"
                  aria-label="Previous Promo"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % FEATURED_PROMOS.length)
                  }
                  className="tap-target flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-warm-white hover:bg-white/30 active:scale-90 transition-[background-color,transform] duration-150"
                  aria-label="Next Promo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Product Artwork */}
        <div className="md:col-span-5 hidden md:flex items-center justify-center">
          <Link
            href={`/order/${promo.gameSlug}`}
            className="group relative h-56 w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md shadow-xl transition-transform duration-300 hover:scale-[1.02]"
          >
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-pine/90 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider">
                  HOT DEALS
                </span>
                <p className="text-xs font-semibold text-warm-white truncate">
                  {promo.title}
                </p>
              </div>
              <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-warm-white">
                Beli &rarr;
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
