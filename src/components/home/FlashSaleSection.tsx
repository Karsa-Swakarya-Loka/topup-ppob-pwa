"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Zap, Flame } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashItems = [
    {
      id: "fs-1",
      gameName: "Mobile Legends",
      gameSlug: "mobile-legends",
      thumbnail: "/images/games/mobile-legends.png",
      name: "Weekly Diamond Pass",
      originalPrice: 32000,
      flashPrice: 27400,
      soldPercent: 88,
      tag: "Diskon 14%",
    },
    {
      id: "fs-2",
      gameName: "Free Fire",
      gameSlug: "free-fire",
      thumbnail: "/images/games/free-fire.png",
      name: "140 Diamonds",
      originalPrice: 22000,
      flashPrice: 18300,
      soldPercent: 74,
      tag: "Diskon 17%",
    },
    {
      id: "fs-3",
      gameName: "Genshin Impact",
      gameSlug: "genshin-impact",
      thumbnail: "/images/games/genshin-impact.png",
      name: "Welkin Moon Pass",
      originalPrice: 79000,
      flashPrice: 66200,
      soldPercent: 92,
      tag: "Diskon 16%",
    },
  ];

  return (
    <div id="flash-sale" className="w-full rounded-(--radius-card) border border-border bg-terracotta-soft/40 p-6 md:p-8">
      {/* Header with Countdown */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-terracotta px-3 py-0.5 text-xs font-bold text-warm-white">
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>Flash Sale</span>
            </span>
            <h2 className="text-xl font-bold text-deep-pine md:text-2xl">
              Penawaran Terbatas Hari Ini
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Harga termurah dengan kuota terbatas, reset otomatis setiap 6 jam.
          </p>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-full bg-white px-4 py-1.5 border border-border shadow-xs text-xs font-medium text-ink">
          <Clock className="h-4 w-4 text-terracotta animate-pulse" />
          <span>Berakhir dalam:</span>
          <span className="font-mono font-bold text-deep-pine tabular-nums">
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {flashItems.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-(--radius-card) border border-border bg-white p-5 hover:shadow-md transition-[box-shadow,transform] duration-300"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full border border-border bg-soft-sand">
                    <Image
                      src={item.thumbnail}
                      alt={item.gameName}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted">
                    {item.gameName}
                  </span>
                </div>
                <span className="rounded-full bg-terracotta-soft px-2.5 py-0.5 text-[11px] font-bold text-terracotta">
                  {item.tag}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-deep-pine">
                {item.name}
              </h3>

              {/* Price comparison */}
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-lg font-bold text-deep-pine tabular-nums">
                  {formatRupiah(item.flashPrice)}
                </span>
                <span className="text-xs text-muted line-through tabular-nums">
                  {formatRupiah(item.originalPrice)}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-muted mb-1">
                  <span className="tabular-nums">Terjual {item.soldPercent}%</span>
                  <span className="text-terracotta font-semibold">Tersisa 12 Slot</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft-sand">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all duration-500"
                    style={{ width: `${item.soldPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              href={`/order/${item.gameSlug}`}
              className="tap-target mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-deep-pine py-2.5 text-xs font-bold text-warm-white group-hover:bg-karyalo-green transition-colors shadow-xs"
            >
              <span>Beli Flash Sale</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
