import React from "react";

export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-(--container-content) px-4 py-8 md:px-6 space-y-8 animate-pulse">
      {/* Ticker Skeleton */}
      <div className="h-10 w-full rounded-full bg-soft-sand/80 border border-border" />

      {/* Hero Banner Skeleton */}
      <div className="h-64 md:h-80 w-full rounded-(--radius-card) bg-soft-sand/90 border border-border" />

      {/* Saved Accounts Skeleton */}
      <div className="h-32 w-full rounded-(--radius-card) bg-soft-sand/70 border border-border" />

      {/* Flash Sale Skeleton */}
      <div className="h-56 w-full rounded-(--radius-card) bg-soft-sand/80 border border-border" />

      {/* Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-soft-sand" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-(--radius-card) bg-soft-sand border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
