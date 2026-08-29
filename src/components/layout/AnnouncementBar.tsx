"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="relative z-50 w-full bg-deep-pine text-warm-white py-2 px-4 border-b border-white/10 shadow-xs">
      <div className="mx-auto flex max-w-(--container-content) items-center justify-between gap-3 text-xs md:px-6">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="flex items-center gap-1.5 rounded-full bg-accent-cyan/20 px-2 py-0.5 text-[10px] font-bold text-accent-cyan uppercase tracking-wider shrink-0 border border-accent-cyan/30">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-ping" />
            <span>EVENT 11.11</span>
          </span>
          <span className="truncate text-soft-sage text-[11px] md:text-xs">
            Flash Sale Mobile Legends &amp; Free Fire &bull; Cashback s/d 25% via QRIS Otomatis
          </span>
        </div>

        <Link
          href="/#flash-sale"
          className="tap-target hidden sm:inline-flex items-center gap-1 font-bold text-accent-cyan hover:underline shrink-0 text-xs transition-colors"
        >
          <span>Klaim Sekarang</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
