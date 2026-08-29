"use client";

import React, { useState, useEffect } from "react";
import { sendLocalNotification } from "@/lib/push-notifications";
import { formatRupiah } from "@/lib/utils";
import { calculateMLProductSKUs } from "@/lib/pricing-calculator";
import { EXCLUSIVE_STREAMER_PARTNER } from "@/lib/mock-data";
import {
  Bell,
  Sliders,
  DollarSign,
  TrendingUp,
  Users,
  Radio,
  CheckCircle2,
  Send,
  Zap,
  Scale,
  Tv,
  Share2,
  Copy,
  Wallet,
  Handshake,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function AdminPage() {
  const [promoTitle, setPromoTitle] = useState("Flash Sale Diamond Mobile Legends");
  const [promoBody, setPromoBody] = useState("Diskon khusus 20% untuk penonton live stream hari ini. Cek sekarang!");
  const [promoUrl, setPromoUrl] = useState(`/order/mobile-legends?ref=${EXCLUSIVE_STREAMER_PARTNER.referralCode}`);
  const [broadcastStatus, setBroadcastStatus] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [origin, setOrigin] = useState<string>("https://topup.karyalo.id");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Margin percentages
  const [markupPercent, setMarkupPercent] = useState<number>(5.5);
  const [vipMarkupPercent, setVipMarkupPercent] = useState<number>(1.8);

  const mlProductMatrix = calculateMLProductSKUs(markupPercent, vipMarkupPercent);

  // Metrics (Simulated from 142 live orders)
  const totalOmzet = 4850000;
  const totalGrossProfit = 420000;
  const ownerShareTotal = Math.round(totalGrossProfit * 0.5);
  const streamerShareTotal = totalGrossProfit - ownerShareTotal;

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastStatus("SENDING");

    await sendLocalNotification({
      title: promoTitle,
      body: promoBody,
      url: promoUrl,
    });

    setBroadcastStatus("SUCCESS");
    setTimeout(() => setBroadcastStatus(""), 4000);
  };

  const handleCopyPartnerLink = () => {
    const url = `${origin}/order/mobile-legends?ref=${EXCLUSIVE_STREAMER_PARTNER.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyStreamerReport = () => {
    const text = `📊 *Laporan Bagi Hasil TopUpPlay x ${EXCLUSIVE_STREAMER_PARTNER.partnerName}*\n` +
      `📅 Periode: Hari Ini\n` +
      `💰 Total Omzet: ${formatRupiah(totalOmzet)}\n` +
      `💵 Total Gross Profit: ${formatRupiah(totalGrossProfit)}\n` +
      `----------------------------------\n` +
      `🟢 Bagian Streamer (50%): ${formatRupiah(streamerShareTotal)}\n` +
      `🔵 Bagian Pengelola Web (50%): ${formatRupiah(ownerShareTotal)}\n` +
      `----------------------------------\n` +
      `✅ Status: Siap Dicairkan ke Rekening Partner\n` +
      `🌐 Link Store: ${origin}/order/mobile-legends?ref=${EXCLUSIVE_STREAMER_PARTNER.referralCode}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  return (
    <div className="min-h-screen pb-32 pt-6">
      <div className="mx-auto max-w-(--container-content) px-4 md:px-6 space-y-10">
        {/* Header */}
        <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-pine text-warm-white text-xs font-bold">
                <Handshake className="h-4 w-4 text-accent-cyan" />
              </span>
              <h1 className="text-2xl font-black text-deep-pine md:text-3xl tracking-tight">
                Dashboard Kemitraan 50:50 (Owner &amp; Streamer)
              </h1>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-muted">
              Model bisnis kemitraan eksklusif: Anda mengontrol web &amp; API, partner streamer memasarkan lewat livestream.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyStreamerReport}
              className="tap-target inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-4 py-2 text-xs font-bold text-deep-pine hover:bg-soft-sand shadow-xs transition-all active:scale-95"
            >
              <FileText className="h-3.5 w-3.5 text-karyalo-green" />
              <span>{copiedReport ? "Teks Rekap Disalin!" : "Salin Rekap WA Streamer"}</span>
            </button>
          </div>
        </div>

        {/* 50:50 Profit Split Highlight Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Total Omzet Bersama</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-deep-pine tracking-tight tabular-nums">
                {formatRupiah(totalOmzet)}
              </div>
              <span className="mt-1 inline-flex items-center text-xs font-bold text-emerald-600">
                142 Transaksi Sukses
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Total Keuntungan Bersih</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-deep-pine tracking-tight tabular-nums">
                {formatRupiah(totalGrossProfit)}
              </div>
              <span className="mt-1 inline-flex items-center text-xs font-bold text-karyalo-green">
                100% Siap Dibagi 50:50
              </span>
            </div>
          </div>

          {/* Owner 50% Share */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-karyalo-green/40 bg-soft-sage p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-deep-pine uppercase tracking-wider">Bagian Anda (Owner 50%)</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-deep-pine text-warm-white">
                <Wallet className="h-4 w-4 text-accent-cyan" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-deep-pine tracking-tight tabular-nums">
                {formatRupiah(ownerShareTotal)}
              </div>
              <span className="mt-1 inline-flex items-center text-xs font-bold text-deep-pine">
                Pengelola Web &amp; Server
              </span>
            </div>
          </div>

          {/* Streamer 50% Share */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-purple-300 bg-purple-50 p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Bagian Streamer (50%)</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-800 text-warm-white">
                <Tv className="h-4 w-4 text-warm-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-purple-950 tracking-tight tabular-nums">
                {formatRupiah(streamerShareTotal)}
              </div>
              <span className="mt-1 inline-flex items-center text-xs font-bold text-purple-800">
                Partner Kreator Livestream
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Exclusive Streamer Profile & Bio Link Generator */}
        <div className="rounded-(--radius-card) border border-border bg-white p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-800 shadow-xs">
                <Tv className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-deep-pine">
                  Profil Partner Streamer Eksklusif
                </h2>
                <p className="text-xs text-muted">
                  Tautan khusus untuk ditaruh di bio TikTok, deskripsi YouTube live, atau perintah bot chat (!topup).
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Kemitraan 50:50 Aktif</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-soft-sand p-5 space-y-3">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Info Partner Streamer</span>
              <div>
                <h3 className="text-base font-extrabold text-deep-pine">{EXCLUSIVE_STREAMER_PARTNER.partnerName}</h3>
                <p className="text-xs text-purple-700 font-semibold">{EXCLUSIVE_STREAMER_PARTNER.channelName} &bull; {EXCLUSIVE_STREAMER_PARTNER.platform}</p>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Penonton livestream mendapatkan diskon langsung Rp {EXCLUSIVE_STREAMER_PARTNER.discountValue.toLocaleString("id-ID")}.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-soft-sand p-5 space-y-3">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Kode Promo &amp; Bagi Hasil</span>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-deep-pine px-3 py-1.5 font-mono text-sm font-bold text-warm-white">
                  {EXCLUSIVE_STREAMER_PARTNER.referralCode}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  Bagi Hasil: 50% / 50%
                </span>
              </div>
              <p className="text-xs text-muted">
                Setiap order yang masuk otomatis tercatat dan dibagi 50% tanpa repot hitung manual.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-soft-sand p-5 space-y-3">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Tautan Cepat Livestream</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPartnerLink}
                  className="tap-target w-full inline-flex items-center justify-center gap-2 rounded-xl bg-karyalo-green py-2.5 px-4 text-xs font-bold text-warm-white hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedLink ? "Tautan Bio Tersalin!" : "Salin Tautan Bio / Live Stream"}</span>
                </button>
              </div>
              <p className="text-[11px] text-muted truncate">
                {origin}/order/mobile-legends?ref={EXCLUSIVE_STREAMER_PARTNER.referralCode}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Real Mobile Legends Pricing & 50:50 Split Table Matrix */}
        <div className="rounded-(--radius-card) border border-border bg-white p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft-sage text-deep-pine shadow-xs">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-deep-pine">
                  Matriks Harga Real Digiflazz &amp; Simulasi Bagi Hasil 50:50 (Mobile Legends)
                </h2>
                <p className="text-xs text-muted">
                  Perhitungan keuntungan bersih dan pembagian 50% Owner vs 50% Streamer per SKU.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-soft-sage px-3 py-1 text-xs font-bold text-deep-pine self-start sm:self-auto">
              10 SKU Aktif
            </span>
          </div>

          {/* Sliders for margin adjustment */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 rounded-2xl bg-soft-sand p-5 border border-border">
            <div>
              <div className="flex justify-between text-xs font-bold text-deep-pine mb-2">
                <span>Margin Publik (+{markupPercent}%)</span>
                <span className="text-karyalo-green font-extrabold">{markupPercent}%</span>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                step={0.5}
                value={markupPercent}
                onChange={(e) => setMarkupPercent(parseFloat(e.target.value))}
                className="w-full accent-deep-pine cursor-pointer"
              />
              <span className="text-[11px] text-muted">Rentang ideal ritel: 4% - 8%</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-deep-pine mb-2">
                <span>Margin VIP Member (+{vipMarkupPercent}%)</span>
                <span className="text-karyalo-green font-extrabold">{vipMarkupPercent}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={6}
                step={0.1}
                value={vipMarkupPercent}
                onChange={(e) => setVipMarkupPercent(parseFloat(e.target.value))}
                className="w-full accent-karyalo-green cursor-pointer"
              />
              <span className="text-[11px] text-muted">Rentang ideal reseller: 1% - 2.5%</span>
            </div>
          </div>

          {/* Table Matrix with 50/50 Split columns */}
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-soft-sand border-b border-border font-bold text-deep-pine">
                <tr>
                  <th className="py-3.5 px-4">Produk MLBB</th>
                  <th className="py-3.5 px-4">Modal Digiflazz</th>
                  <th className="py-3.5 px-4">Harga Jual Web</th>
                  <th className="py-3.5 px-4">Harga Codashop</th>
                  <th className="py-3.5 px-4">Untung Total</th>
                  <th className="py-3.5 px-4 text-karyalo-green">Bagian Owner (50%)</th>
                  <th className="py-3.5 px-4 text-purple-700 text-right">Bagian Streamer (50%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {mlProductMatrix.map((item) => {
                  const profit = item.sellPrice - item.basePrice;
                  const ownerShare = Math.round(profit * 0.5);
                  const streamerShare = profit - ownerShare;
                  return (
                    <tr key={item.id} className="hover:bg-soft-sand/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-deep-pine">
                        <div>{item.name}</div>
                        <span className="text-[10px] font-normal text-muted">{item.bonusAmount}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-muted tabular-nums">
                        {formatRupiah(item.basePrice)}
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-deep-pine tabular-nums">
                        {formatRupiah(item.sellPrice)}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted line-through tabular-nums">
                        {item.competitorPrice ? formatRupiah(item.competitorPrice) : "-"}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600 tabular-nums">
                        +{formatRupiah(profit)}
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-karyalo-green tabular-nums">
                        +{formatRupiah(ownerShare)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-purple-700 tabular-nums">
                        +{formatRupiah(streamerShare)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Push Notification Broadcaster */}
        <div className="rounded-(--radius-card) border border-border bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft-sage text-deep-pine">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-deep-pine">
                Broadcast Web Push Notification (Promo ke HP Pengguna)
              </h2>
              <p className="text-xs text-muted">
                Kirimkan notifikasi instan langsung ke seluruh perangkat HP yang menginstall aplikasi.
              </p>
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Judul Notifikasi Promo
              </label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-soft-sand px-4 py-2.5 text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Isi Pesan / Copywriting Diskon
              </label>
              <textarea
                value={promoBody}
                onChange={(e) => setPromoBody(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-soft-sand px-4 py-2.5 text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Target URL Redirect
              </label>
              <input
                type="text"
                value={promoUrl}
                onChange={(e) => setPromoUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-soft-sand px-4 py-2.5 text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={broadcastStatus === "SENDING"}
                className="tap-target inline-flex items-center gap-2 rounded-full bg-deep-pine px-6 py-3 text-xs font-bold text-warm-white hover:bg-karyalo-green active:scale-95 transition-all shadow-sm disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>
                  {broadcastStatus === "SENDING" ? "Mengirim Push..." : "Kirim Siaran Notifikasi"}
                </span>
              </button>

              {broadcastStatus === "SUCCESS" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Notifikasi berhasil dikirim ke perangkat!</span>
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
