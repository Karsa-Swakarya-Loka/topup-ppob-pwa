"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GameCategory } from "@/lib/types";
import { GAME_LIST, PRODUCTS_BY_GAME } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import { Zap } from "lucide-react";

interface GameGridProps {
  activeCategory: GameCategory;
  searchQuery: string;
}

export default function GameGrid({ activeCategory, searchQuery }: GameGridProps) {
  const filteredGames = GAME_LIST.filter((game) => {
    const matchCategory = activeCategory === "all" || game.category === activeCategory;
    const matchSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getStartingPrice = (slug: string) => {
    const prods = PRODUCTS_BY_GAME[slug];
    if (prods && prods.length > 0) {
      const min = Math.min(...prods.map((p) => p.sellPrice));
      return formatRupiah(min);
    }
    return "Rp 1.500";
  };

  if (filteredGames.length === 0) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-soft-sand py-16 text-center">
        <p className="text-sm text-muted">
          Tidak ada game atau produk yang cocok dengan pencarian "{searchQuery}".
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
      {filteredGames.map((game) => (
        <div key={game.id} className="group relative flex flex-col card-hover-lift">
          {/* Card Image Container */}
          <div className="relative overflow-hidden rounded-(--radius-card) bg-slate-900 border border-border shadow-xs group-hover:border-karyalo-green/60">
            <Link href={`/order/${game.slug}`} className="block">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={game.thumbnail}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>
            </Link>

            {/* Badge Tag */}
            {game.tag && (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-terracotta px-2.5 py-0.5 text-[10px] font-extrabold text-warm-white shadow-sm uppercase tracking-wider">
                {game.tag}
              </span>
            )}

            {/* Instant processing badge */}
            <span className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-full bg-deep-pine/90 px-2.5 py-0.5 text-[10px] font-bold text-warm-white backdrop-blur-md shadow-sm border border-white/10">
              <Zap size={11} className="text-accent-cyan fill-current" />
              <span>3 Detik</span>
            </span>
          </div>

          {/* Details */}
          <Link href={`/order/${game.slug}`} className="mt-3 flex flex-col gap-0.5 px-0.5">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              {game.publisher}
            </span>
            <span className="line-clamp-1 text-sm font-extrabold text-deep-pine group-hover:text-karyalo-green transition-colors">
              {game.name}
            </span>
            <span className="text-xs font-bold text-karyalo-green mt-0.5 tabular-nums">
              Mulai {getStartingPrice(game.slug)}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
