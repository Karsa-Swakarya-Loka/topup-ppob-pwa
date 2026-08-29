"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCheck, Trash2, ArrowRight } from "lucide-react";
import { SavedGameAccount } from "@/lib/types";
import { INITIAL_SAVED_ACCOUNTS, GAME_LIST } from "@/lib/mock-data";

const LOCAL_STORAGE_KEY = "topup_saved_accounts";

export default function SavedAccountsQuickBar() {
  const [savedAccounts, setSavedAccounts] = useState<SavedGameAccount[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSavedAccounts(JSON.parse(stored));
      } else {
        setSavedAccounts(INITIAL_SAVED_ACCOUNTS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAVED_ACCOUNTS));
      }
    } catch {
      setSavedAccounts(INITIAL_SAVED_ACCOUNTS);
    }
    setIsLoaded(true);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = savedAccounts.filter((acc) => acc.id !== id);
    setSavedAccounts(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const getGameThumbnail = (slug: string) => {
    const game = GAME_LIST.find((g) => g.slug === slug);
    return game?.thumbnail || "/images/games/mobile-legends.png";
  };

  if (!isLoaded || savedAccounts.length === 0) return null;

  return (
    <div className="w-full rounded-(--radius-card) border border-border bg-soft-sand p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft-sage text-deep-pine">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-deep-pine md:text-base">
              Akun Game Favorit Saya
            </h3>
            <p className="text-xs text-muted">Beli ulang 1-klik tanpa ketik ulang ID Akun</p>
          </div>
        </div>
        <span className="rounded-full bg-soft-sage px-3 py-1 text-xs font-semibold text-deep-pine">
          Auto-Fill 1-Tap
        </span>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {savedAccounts.map((account) => (
          <Link
            key={account.id}
            href={`/order/${account.gameSlug}?userId=${encodeURIComponent(account.userId)}${
              account.zoneId ? `&zoneId=${encodeURIComponent(account.zoneId)}` : ""
            }`}
            className="group relative flex items-center justify-between rounded-xl border border-border bg-white p-3.5 hover:border-karyalo-green/40 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border bg-soft-sand shadow-xs">
                <Image
                  src={getGameThumbnail(account.gameSlug)}
                  alt={account.gameName}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-ink group-hover:text-deep-pine transition-colors block">
                  {account.nickname || account.gameName}
                </span>
                <span className="text-[11px] text-muted">
                  ID: {account.userId} {account.zoneId ? `(${account.zoneId})` : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => handleDelete(account.id, e)}
                className="tap-target rounded-full p-1 text-muted hover:text-terracotta transition-colors"
                title="Hapus akun tersimpan"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-sand text-deep-pine group-hover:bg-karyalo-green group-hover:text-warm-white transition-all shadow-xs">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
