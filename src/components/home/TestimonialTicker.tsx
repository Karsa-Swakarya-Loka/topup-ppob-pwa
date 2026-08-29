"use client";

import React, { useState, useEffect } from "react";
import { LIVE_TRANSACTIONS_FEED } from "@/lib/mock-data";
import { CheckCircle2 } from "lucide-react";

export default function TestimonialTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LIVE_TRANSACTIONS_FEED.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const current = LIVE_TRANSACTIONS_FEED[index];

  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded-full border border-border bg-soft-sage px-4 py-2 text-xs text-deep-pine">
      <div className="flex items-center gap-2 overflow-hidden">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-karyalo-green" />
        <span className="font-medium truncate">
          {current.text}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 pl-2 text-muted">
        <span className="text-[11px]">{current.time}</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-deep-pine border border-border">
          Sukses
        </span>
      </div>
    </div>
  );
}
