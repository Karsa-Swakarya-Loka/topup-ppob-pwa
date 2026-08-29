"use client";

import React, { useState } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import TestimonialTicker from "@/components/home/TestimonialTicker";
import SavedAccountsQuickBar from "@/components/home/SavedAccountsQuickBar";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import CategoryTabs from "@/components/home/CategoryTabs";
import GameGrid from "@/components/home/GameGrid";
import { GameCategory } from "@/lib/types";
import { Search, Zap, ShieldCheck, Headphones, QrCode, Sparkles } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<GameCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-10 pb-28 pt-4 md:gap-14 md:pt-6">
      {/* 1. Real-time Status Ticker */}
      <section className="mx-auto w-full max-w-(--container-content) px-4 md:px-6">
        <TestimonialTicker />
      </section>

      {/* 2. Hero Banner Carousel */}
      <section className="mx-auto w-full max-w-(--container-content) px-4 md:px-6">
        <HeroBanner />
      </section>

      {/* 3. Saved Accounts (1-Tap Quick Re-Order) */}
      <section className="mx-auto w-full max-w-(--container-content) px-4 md:px-6">
        <SavedAccountsQuickBar />
      </section>

      {/* 4. Flash Sale Section */}
      <section className="mx-auto w-full max-w-(--container-content) px-4 md:px-6">
        <FlashSaleSection />
      </section>

      {/* 5. Main Catalog Section with Search & Filter */}
      <section className="mx-auto w-full max-w-(--container-content) px-4 md:px-6">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-karyalo-green" />
              <h2 className="text-xl font-extrabold text-deep-pine md:text-2xl tracking-tight">
                Katalog Game &amp; Produk Digital
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Pilih game favorit Anda dan selesaikan top up instan dalam hitungan detik.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Mobile Legends, FF, Valorant..."
              className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:ring-2 focus:ring-karyalo-green/20 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Products Grid */}
        <GameGrid
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />
      </section>

      {/* 6. Trust & Security Badges (Esports Quality Tier) */}
      <section className="mx-auto w-full max-w-(--container-content) px-4 md:px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 rounded-(--radius-card) border border-border bg-white p-6 sm:p-8 md:grid-cols-4 shadow-sm">
          {[
            {
              icon: Zap,
              title: "Instan 1 - 3 Detik",
              subtitle: "Proses H2H otomatis langsung ke akun game.",
              iconBg: "bg-amber-100 text-amber-700",
            },
            {
              icon: ShieldCheck,
              title: "100% Legal & Resmi",
              subtitle: "Terverifikasi langsung oleh Moonton & Garena.",
              iconBg: "bg-emerald-100 text-emerald-700",
            },
            {
              icon: QrCode,
              title: "QRIS All Payment",
              subtitle: "Bebas admin & dukung semua e-wallet / bank.",
              iconBg: "bg-cyan-100 text-cyan-800",
            },
            {
              icon: Headphones,
              title: "CS WhatsApp 24 Jam",
              subtitle: "Bantuan transaksi siap siaga setiap hari.",
              iconBg: "bg-blue-100 text-blue-700",
            },
          ].map(({ icon: Icon, title, subtitle, iconBg }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center p-2">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} shadow-xs`}>
                <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-deep-pine">{title}</h3>
              <p className="text-[11px] text-muted leading-tight">{subtitle}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
