import React from "react";

export default function OrderLoading() {
  return (
    <div className="min-h-screen pb-32 pt-4 md:pt-6 animate-pulse">
      <div className="mx-auto max-w-(--container-content) px-4 md:px-6">
        <div className="h-6 w-32 rounded-full bg-soft-sand mb-6" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-4 space-y-4">
            <div className="h-80 w-full rounded-(--radius-card) bg-soft-sand border border-border" />
            <div className="h-44 w-full rounded-(--radius-card) bg-soft-sand border border-border" />
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="h-48 w-full rounded-(--radius-card) bg-soft-sand border border-border" />
            <div className="h-64 w-full rounded-(--radius-card) bg-soft-sand border border-border" />
            <div className="h-48 w-full rounded-(--radius-card) bg-soft-sand border border-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
