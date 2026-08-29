"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Transaction, PaymentCreationResult } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import { digiflazz } from "@/lib/api-digiflazz";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Clock,
  Copy,
  QrCode,
  ShieldCheck,
  Zap,
  X,
  Sparkles,
  Ticket,
} from "lucide-react";

interface CheckoutModalProps {
  transaction: Transaction;
  paymentResult: PaymentCreationResult;
  onClose: () => void;
}

export default function CheckoutModal({ transaction, paymentResult, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [status, setStatus] = useState<"WAITING_PAYMENT" | "PROCESSING" | "SUCCESS">("WAITING_PAYMENT");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (paymentResult.qrString) {
      QRCode.toDataURL(paymentResult.qrString, {
        width: 240,
        margin: 2,
        color: {
          dark: "#1e2f5c",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR error:", err));
    }
  }, [paymentResult.qrString]);

  useEffect(() => {
    if (status === "SUCCESS") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setStatus("PROCESSING");
    await new Promise((res) => setTimeout(res, 1200));

    const targetNo = transaction.zoneId
      ? `${transaction.userId}${transaction.zoneId}`
      : transaction.userId;

    const digiResult = await digiflazz.topUp(
      transaction.skuCode,
      targetNo,
      transaction.invoiceNo
    );

    if (digiResult.success) {
      setSerialNumber(digiResult.sn || `SN-${Date.now()}`);
      setStatus("SUCCESS");

      try {
        const history = JSON.parse(localStorage.getItem("topup_orders_history") || "[]");
        const completedTx: Transaction = {
          ...transaction,
          status: "SUCCESS",
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem("topup_orders_history", JSON.stringify([completedTx, ...history]));
      } catch {
        // ignore
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-lg overflow-hidden rounded-(--radius-card) border border-border bg-warm-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5 bg-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Invoice Pembayaran Resmi
            </span>
            <h3 className="font-mono text-base font-extrabold text-deep-pine">
              {transaction.invoiceNo}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="tap-target rounded-full p-1.5 text-muted hover:bg-soft-sand hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {status === "SUCCESS" ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-soft-sage text-karyalo-green shadow-xs">
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-deep-pine">
                  Transaksi Berhasil!
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Item otomatis berhasil dikirimkan ke akun game Anda via API resmi.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-soft-sand p-4 text-left text-xs space-y-2.5 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Game &amp; Produk</span>
                  <span className="font-bold text-ink">
                    {transaction.gameName} - {transaction.productName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Akun Tujuan</span>
                  <span className="font-bold text-deep-pine">
                    {transaction.nickname ? `${transaction.nickname} • ` : ""}
                    ID: {transaction.userId}
                    {transaction.zoneId ? ` (${transaction.zoneId})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Pembayaran</span>
                  <span className="font-extrabold text-deep-pine">
                    {formatRupiah(transaction.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/80 pt-2 text-[11px]">
                  <span className="text-muted">Serial Number (SN)</span>
                  <span className="font-mono font-bold text-ink">{serialNumber}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => router.push("/history")}
                  className="tap-target w-full rounded-full bg-karyalo-green py-3 text-xs font-bold text-warm-white hover:bg-blue-600 transition-all shadow-xs"
                >
                  Lihat Riwayat &amp; Cetak Bukti
                </button>
                <button
                  onClick={onClose}
                  className="tap-target w-full rounded-full border border-border bg-white py-2.5 text-xs font-semibold text-muted hover:bg-soft-sand hover:text-ink transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : status === "PROCESSING" ? (
            <div className="text-center py-12 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soft-sage text-karyalo-green animate-spin">
                <Zap className="h-6 w-6 fill-current" />
              </div>
              <h4 className="text-base font-bold text-deep-pine">
                Memproses Pengiriman ke Server Game...
              </h4>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Pembayaran terverifikasi! Sistem sedang mengirimkan pesanan Anda melalui API H2H resmi.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Subtle Savings Micro-Reinforcement */}
              {transaction.savingsTotal && transaction.savingsTotal > 0 ? (
                <div className="flex items-center gap-2 rounded-xl bg-soft-sage p-3 text-xs font-bold text-deep-pine border border-karyalo-green/20">
                  <Sparkles className="h-4 w-4 text-karyalo-green shrink-0" />
                  <span>Kamu berhasil menghemat {formatRupiah(transaction.savingsTotal)} pada transaksi ini!</span>
                </div>
              ) : null}

              {/* Timer Bar */}
              <div className="flex items-center justify-between rounded-xl bg-soft-sand px-4 py-2.5 text-xs text-deep-pine border border-border">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Clock className="h-4 w-4 text-terracotta animate-pulse" />
                  <span>Batas Waktu Pembayaran:</span>
                </div>
                <span className="font-mono font-extrabold text-sm text-terracotta tabular-nums">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* QRIS Display */}
              {qrDataUrl && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-6 text-center shadow-xs">
                  <div className="mb-3 flex items-center gap-1.5">
                    <QrCode className="h-4 w-4 text-deep-pine" />
                    <span className="text-xs font-bold text-deep-pine">Scan QRIS All Payment</span>
                  </div>

                  <div className="rounded-2xl border border-border p-3 bg-white shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="QRIS Payment"
                      className="h-44 w-44 object-contain"
                    />
                  </div>

                  <p className="mt-3 text-[11px] text-muted">
                    Buka aplikasi BCA Mobile, GoPay, OVO, DANA, atau ShopeePay dan scan kode QRIS di atas.
                  </p>
                </div>
              )}

              {/* Virtual Account Display */}
              {paymentResult.vaNumber && (
                <div className="rounded-2xl border border-border bg-white p-4 space-y-2 shadow-xs">
                  <span className="text-xs font-medium text-muted">Nomor Virtual Account:</span>
                  <div className="flex items-center justify-between rounded-xl bg-soft-sand p-3 border border-border">
                    <span className="font-mono text-base font-bold text-deep-pine tabular-nums">
                      {paymentResult.vaNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(paymentResult.vaNumber!)}
                      className="rounded-full bg-deep-pine px-4 py-1.5 text-xs font-bold text-warm-white hover:bg-karyalo-green transition-colors"
                    >
                      {isCopied ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                </div>
              )}

              {/* Order Total Breakdown */}
              <div className="rounded-2xl border border-border bg-soft-sand p-4 text-xs space-y-2">
                <div className="flex justify-between text-muted">
                  <span>Harga Normal</span>
                  <span className="tabular-nums">{formatRupiah(transaction.basePrice)}</span>
                </div>
                {transaction.discountAmount && transaction.discountAmount > 0 ? (
                  <div className="flex justify-between text-karyalo-green font-bold">
                    <span className="flex items-center gap-1">
                      <Ticket className="h-3.5 w-3.5" />
                      <span>Potongan Kupon Promo</span>
                    </span>
                    <span className="tabular-nums">-{formatRupiah(transaction.discountAmount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-muted">
                  <span>Biaya Layanan Payment Gateway</span>
                  <span className="tabular-nums">{transaction.feeAmount === 0 ? "Gratis" : formatRupiah(transaction.feeAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-extrabold text-deep-pine">
                  <span>Total Tagihan Bersih</span>
                  <span className="text-karyalo-green tabular-nums">{formatRupiah(transaction.totalAmount)}</span>
                </div>
              </div>

              {/* Simulation button */}
              <div className="pt-2">
                <button
                  onClick={handleSimulatePayment}
                  className="tap-target w-full flex items-center justify-center gap-2 rounded-full bg-karyalo-green py-3.5 text-xs font-bold text-warm-white hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                >
                  <Zap className="h-4 w-4 fill-current text-accent-cyan" />
                  <span>Simulasi Bayar Sekarang (Uji Coba Demo)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
