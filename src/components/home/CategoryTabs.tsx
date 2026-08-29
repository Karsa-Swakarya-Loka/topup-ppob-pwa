"use client";

import React from "react";
import { GameCategory } from "@/lib/types";
import { Gamepad2, Monitor, Ticket, PhoneCall, LayoutGrid } from "lucide-react";

interface CategoryTabsProps {
  activeCategory: GameCategory;
  onSelectCategory: (category: GameCategory) => void;
}

export default function CategoryTabs({ activeCategory, onSelectCategory }: CategoryTabsProps) {
  const tabs: { id: GameCategory; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "Semua Game & Produk", icon: LayoutGrid },
    { id: "game-mobile", label: "Mobile Legends & Game HP", icon: Gamepad2 },
    { id: "game-pc", label: "PC & Valorant", icon: Monitor },
    { id: "voucher", label: "Steam & Voucher", icon: Ticket },
    { id: "pulsa-ppob", label: "PLN & Pulsa", icon: PhoneCall },
  ];

  return (
    <div className="flex w-full items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`tap-target flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs md:text-sm font-semibold transition-[background-color,color,box-shadow,transform] duration-200 active:scale-95 ${
              isActive
                ? "bg-deep-pine text-warm-white shadow-sm ring-2 ring-deep-pine/20"
                : "bg-soft-sand text-ink hover:bg-soft-sage hover:text-deep-pine border border-border/80"
            }`}
          >
            <Icon size={16} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden="true" className={isActive ? "text-accent-cyan" : "text-muted"} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
