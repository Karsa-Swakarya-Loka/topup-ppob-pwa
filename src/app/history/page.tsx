"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Transaction } from "@/lib/types";
import { formatRupiah, safeStorage } from "@/lib/utils";
import {
  ReceiptText,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sample: Transaction[] = [
      {
        invoiceNo: "INV-260827-X9A21",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        gameSlug: "mobile-legends",
        gameName: "Mobile Legends",
        gameThumbnail: "/images/games/mobile-legends.png",
        productName: "Weekly Diamond Pass",
        skuCode: "ML-WEEKLY-DG",
        userId: "84920194",
        zoneId: "2172",
        nickname: "RRQ Lemonade",
        whatsapp: "081289123456",
        paymentChannelId: "QRIS",
        paymentChannelName: "QRIS All Payment",
        basePrice: 28900,
        feeAmount: 202,
        totalAmount: 29102,
        status: "SUCCESS",
        completedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      },
      {
        invoiceNo: "INV-260827-K38M2",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        gameSlug: "free-fire",
        gameName: "Free Fire",
        gameThumbnail: "/images/games/free-fire.png",
        productName: "140 Diamonds",
        skuCode: "FF-140-DG",
        userId: "192837410",
        nickname: "EVOS_Sultan99",
        whatsapp: "081289123456",
        paymentChannelId: "QRIS",
        paymentChannelName: "QRIS All Payment",
        basePrice: 19500,
        feeAmount: 137,
        totalAmount: 19637,
        status: "SUCCESS",
        completedAt: new Date(Date.now() - 1000 * 60 * 59 * 2).toISOString(),
      },
    ];
    const stored = safeStorage.get<Transaction[]>("topup_orders_history", sample);
    // Deduplicate by invoiceNo to guarantee unique keys across renders
    const uniqueMap = new Map<string, Transaction>();
    stored.forEach((item) => {
      if (item.invoiceNo && !uniqueMap.has(item.invoiceNo)) {
        uniqueMap.set(item.invoiceNo, item);
      }
    });
    const uniqueList = Array.from(uniqueMap.values());
    safeStorage.set("topup_orders_history", uniqueList);
    setTransactions(uniqueList);
    setIsLoaded(true);
  }, []);

  const filtered = transactions.filter(
    (tx) =>
      tx.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.whatsapp.includes(searchQuery)
  );

  return (
    <div className="min-h-screen pb-28 pt-6">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-deep-pine md:text-2xl">
            Riwayat &amp; Lacak Pesanan
          </h1>
          <p className="mt-1 text-sm text-muted">
            Cek status pengiriman item dan invoice pembayaran secara otomatis.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan Nomor Invoice (cth: INV-...) atau User ID..."
            className="w-full rounded-full border border-border bg-white py-3 pl-10 pr-4 text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:outline-none"
          />
        </div>

        {/* Orders List */}
        {!isLoaded ? (
          <div className="space-y-4">
            <div className="h-32 w-full rounded-(--radius-card) bg-soft-sand animate-pulse" />
            <div className="h-32 w-full rounded-(--radius-card) bg-soft-sand animate-pulse" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-(--radius-card) border border-border bg-white p-12 text-center">
            <ReceiptText className="mx-auto h-12 w-12 text-muted mb-2 stroke-[1.5]" />
            <h3 className="text-base font-semibold text-deep-pine">Tidak ada transaksi ditemukan</h3>
            <p className="mt-1 text-sm text-muted">
              Belum ada pesanan dengan nomor invoice atau ID tersebut.
            </p>
            <Link
              href="/"
              className="tap-target mt-4 inline-flex items-center gap-2 rounded-full bg-karyalo-green px-6 py-2.5 text-xs font-semibold text-warm-white"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Top Up Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((tx, idx) => (
              <div
                key={`${tx.invoiceNo || "tx"}-${idx}`}
                className="overflow-hidden rounded-(--radius-card) border border-border bg-white p-5 md:p-6 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <span className="font-mono text-xs font-semibold text-deep-pine">
                      {tx.invoiceNo}
                    </span>
                    <p className="text-[11px] text-muted">
                      {new Date(tx.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      tx.status === "SUCCESS"
                        ? "bg-soft-sage text-deep-pine"
                        : "bg-terracotta-soft text-terracotta"
                    }`}
                  >
                    {tx.status === "SUCCESS" ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-karyalo-green" />
                        <span>Sukses Terkirim</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5 text-terracotta" />
                        <span>Menunggu Pembayaran</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-deep-pine">
                      {tx.gameName} - {tx.productName}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted">
                      ID: <span className="font-mono font-semibold text-ink">{tx.userId}</span>
                      {tx.zoneId ? ` (${tx.zoneId})` : ""} {tx.nickname ? `• ${tx.nickname}` : ""}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      Metode: {tx.paymentChannelName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-muted">Total Pembayaran</span>
                    <div className="text-base font-semibold text-deep-pine">
                      {formatRupiah(tx.totalAmount)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-deep-pine" />
                    <span>Terverifikasi Provider API Resmi</span>
                  </span>
                  <Link
                    href={`/order/${tx.gameSlug}?userId=${tx.userId}${tx.zoneId ? `&zoneId=${tx.zoneId}` : ""}`}
                    className="flex items-center gap-1 font-semibold text-karyalo-green hover:underline"
                  >
                    <span>Beli Lagi</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
