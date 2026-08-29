"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ReceiptText, SlidersHorizontal, Sparkles, LayoutGrid } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Beranda",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Flash Sale",
      href: "/#flash-sale",
      icon: Sparkles,
      isActive: false,
    },
    {
      name: "Riwayat",
      href: "/history",
      icon: ReceiptText,
      isActive: pathname.startsWith("/history") || pathname.startsWith("/invoice"),
    },
    {
      name: "Admin",
      href: "/admin",
      icon: SlidersHorizontal,
      isActive: pathname.startsWith("/admin"),
    },
  ];

  return (
    <nav
      aria-label="Navigasi utama (mobile)"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-warm-white md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-stretch justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                aria-current={item.isActive ? "page" : undefined}
                className={`tap-target relative flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                  item.isActive ? "text-deep-pine font-semibold" : "text-muted hover:text-ink"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={item.isActive ? 2.2 : 1.8}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
