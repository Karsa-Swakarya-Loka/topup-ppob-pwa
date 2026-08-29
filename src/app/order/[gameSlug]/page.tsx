"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GAME_LIST, PRODUCTS_BY_GAME, PAYMENT_CHANNELS, STREAMER_REFERRALS } from "@/lib/mock-data";
import { ProductSKU, PaymentChannel, Transaction, PaymentCreationResult, SavedGameAccount, StreamerReferral } from "@/lib/types";
import { formatRupiah, generateInvoiceNumber, sanitizePhoneNumber, isValidIndonesianPhone, safeStorage } from "@/lib/utils";
import { checkGameNickname } from "@/lib/api-nickname";
import { createPaymentInvoice, calculateFee } from "@/lib/api-payment";
import CheckoutModal from "@/components/order/CheckoutModal";
import {
  ArrowLeft,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Zap,
  UserCheck,
  Sparkles,
  Ticket,
  Lock,
  Tv,
  Check,
  X,
  HelpCircle,
} from "lucide-react";

export default function OrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameSlug = params.gameSlug as string;

  const game = GAME_LIST.find((g) => g.slug === gameSlug);
  const products = PRODUCTS_BY_GAME[gameSlug] || PRODUCTS_BY_GAME["mobile-legends"] || [];

  // Form State
  const [userId, setUserId] = useState<string>("");
  const [zoneId, setZoneId] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isCheckingNick, setIsCheckingNick] = useState(false);
  const [nickError, setNickError] = useState<string>("");
  const [saveAccount, setSaveAccount] = useState<boolean>(true);

  // Selection State
  const [selectedProduct, setSelectedProduct] = useState<ProductSKU | null>(products[0] || null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentChannel | null>(PAYMENT_CHANNELS[0]);
  
  // Streamer Referral State (Hidden public coupons, creator referral only)
  const [selectedReferral, setSelectedReferral] = useState<StreamerReferral | null>(null);
  const [referralInput, setReferralInput] = useState<string>("");
  const [referralError, setReferralError] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");

  // Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentCreationResult | null>(null);

  // Auto-fill from URL params (User ID, Zone ID, and Streamer Referral Code)
  useEffect(() => {
    const qUserId = searchParams.get("userId");
    const qZoneId = searchParams.get("zoneId");
    const qRef = searchParams.get("ref") || searchParams.get("code") || searchParams.get("streamer");

    if (qUserId) {
      setUserId(qUserId);
      if (qZoneId) setZoneId(qZoneId);
      checkGameNickname(gameSlug, qUserId, qZoneId || undefined).then((res) => {
        if (res.valid && res.nickname) {
          setNickname(res.nickname);
        }
      });
    }

    if (qRef) {
      const match = STREAMER_REFERRALS.find(
        (s) => s.code.toUpperCase() === qRef.trim().toUpperCase()
      );
      if (match) {
        setSelectedReferral(match);
      }
    }
  }, [gameSlug, searchParams]);

  const handleCheckNickname = async () => {
    if (!userId.trim()) {
      setNickError("Silakan masukkan User ID terlebih dahulu");
      return;
    }
    if (game?.hasZoneId && !zoneId.trim()) {
      setNickError(`Silakan masukkan ${game.zoneIdLabel || "Zone ID"}`);
      return;
    }

    setIsCheckingNick(true);
    setNickError("");
    setNickname("");

    try {
      const res = await checkGameNickname(gameSlug, userId, zoneId || undefined);
      if (res.valid && res.nickname) {
        setNickname(res.nickname);
      } else {
        setNickError(res.message || "User ID tidak ditemukan. Periksa kembali ID Anda.");
      }
    } catch {
      setNickError("Gagal memeriksa akun. Silakan coba lagi.");
    } finally {
      setIsCheckingNick(false);
    }
  };

  // Calculate streamer referral discount
  let referralDiscount = 0;
  if (selectedProduct && selectedReferral) {
    if (selectedProduct.sellPrice >= selectedReferral.minSpend) {
      if (selectedReferral.discountType === "FIXED") {
        referralDiscount = selectedReferral.discountValue;
      } else {
        referralDiscount = Math.min(15000, Math.round((selectedProduct.sellPrice * selectedReferral.discountValue) / 100));
      }
    }
  }

  const basePriceAfterDiscount = selectedProduct
    ? Math.max(100, selectedProduct.sellPrice - referralDiscount)
    : 0;

  const currentFee = selectedPayment
    ? calculateFee(selectedPayment.id, basePriceAfterDiscount)
    : 0;

  const currentTotal = basePriceAfterDiscount + currentFee;

  const savingsTotal = selectedProduct
    ? (selectedProduct.sellPrice - selectedProduct.vipPrice) + referralDiscount
    : 0;

  const handleApplyReferral = (e: React.FormEvent) => {
    e.preventDefault();
    setReferralError("");

    if (!referralInput.trim()) {
      setReferralError("Masukkan kode referral streamer.");
      return;
    }

    const found = STREAMER_REFERRALS.find(
      (s) => s.code.toUpperCase() === referralInput.trim().toUpperCase()
    );

    if (found) {
      if (selectedProduct && selectedProduct.sellPrice < found.minSpend) {
        setReferralError(`Minimal order untuk kode streamer ini adalah ${formatRupiah(found.minSpend)}`);
        return;
      }
      setSelectedReferral(found);
      setReferralInput("");
    } else {
      setReferralError("Kode referral streamer tidak ditemukan. Pastikan huruf sudah sesuai.");
    }
  };

  const handleRemoveReferral = () => {
    setSelectedReferral(null);
    setReferralError("");
  };

  const handleOpenCheckout = async () => {
    if (!userId.trim()) {
      alert("Silakan masukkan User ID game Anda.");
      return;
    }
    if (game?.hasZoneId && !zoneId.trim()) {
      alert(`Silakan masukkan ${game?.zoneIdLabel || "Zone ID"}.`);
      return;
    }
    if (!selectedProduct) {
      alert("Silakan pilih nominal produk top up.");
      return;
    }
    if (!selectedPayment) {
      alert("Silakan pilih metode pembayaran.");
      return;
    }
    if (!whatsapp.trim()) {
      alert("Silakan masukkan nomor WhatsApp aktif untuk menerima invoice dan bukti transaksi.");
      return;
    }

    const cleanPhone = sanitizePhoneNumber(whatsapp);
    if (!isValidIndonesianPhone(cleanPhone)) {
      alert("Nomor WhatsApp tidak valid. Masukkan nomor HP Indonesia yang aktif (contoh: 081289123456).");
      return;
    }

    const invoiceNo = generateInvoiceNumber();

    const pResult = await createPaymentInvoice({
      invoiceNo,
      amount: basePriceAfterDiscount,
      paymentChannelId: selectedPayment.id,
      customerName: nickname || "Customer",
      customerPhone: cleanPhone,
      orderTitle: `${game?.name || "Game"} - ${selectedProduct.name}`,
    });

    const grossMargin = Math.max(0, (selectedProduct.sellPrice - selectedProduct.basePrice) - referralDiscount);
    const ownerShare = Math.round(grossMargin * 0.5);
    const streamerShare = grossMargin - ownerShare;

    const tx: Transaction = {
      invoiceNo,
      createdAt: new Date().toISOString(),
      gameSlug,
      gameName: game?.name || "Game",
      gameThumbnail: game?.thumbnail || "",
      productName: selectedProduct.name,
      skuCode: selectedProduct.skuCode,
      userId,
      zoneId: zoneId || undefined,
      nickname: nickname || undefined,
      whatsapp: cleanPhone,
      paymentChannelId: selectedPayment.id,
      paymentChannelName: selectedPayment.name,
      basePrice: selectedProduct.sellPrice,
      discountAmount: referralDiscount,
      savingsTotal: savingsTotal,
      feeAmount: currentFee,
      totalAmount: currentTotal,
      grossProfit: grossMargin,
      ownerProfitShare: ownerShare,
      streamerProfitShare: streamerShare,
      status: "PENDING",
      qrString: pResult.qrString,
      vaNumber: pResult.vaNumber,
    };

    if (saveAccount) {
      const stored = safeStorage.get<SavedGameAccount[]>("topup_saved_accounts", []);
      const exists = stored.find(
        (a: SavedGameAccount) => a.gameSlug === gameSlug && a.userId === userId
      );
      if (!exists) {
        const newAccount: SavedGameAccount = {
          id: `saved-${Date.now()}`,
          gameSlug,
          gameName: game?.name || "Game",
          userId,
          zoneId: zoneId || undefined,
          nickname: nickname || undefined,
          lastUsed: "Baru saja",
        };
        safeStorage.set("topup_saved_accounts", [newAccount, ...stored]);
      }
    }

    const existingOrders = safeStorage.get<Transaction[]>("topup_orders_history", []);
    const filteredExisting = existingOrders.filter((o) => o.invoiceNo !== tx.invoiceNo);
    safeStorage.set("topup_orders_history", [tx, ...filteredExisting]);

    setCurrentTransaction(tx);
    setPaymentResult(pResult);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-32 pt-4 md:pt-6">
      <div className="mx-auto max-w-(--container-content) px-4 md:px-6">
        {/* Breadcrumb & Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="tap-target inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-muted hover:text-deep-pine transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Katalog</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Transaksi Resmi &amp; Terverifikasi H2H</span>
          </span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Game Info & Instruction Card */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            <div className="overflow-hidden rounded-(--radius-card) border border-border bg-white p-6 shadow-xs">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
                {game?.thumbnail ? (
                  <Image
                    src={game.thumbnail}
                    alt={game.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-deep-pine text-warm-white">
                    <span className="text-xl font-bold">{gameSlug}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-warm-white">
                  <span className="rounded-full bg-deep-pine/90 px-3 py-1 text-xs font-bold backdrop-blur-md border border-white/10">
                    {game?.publisher || "Official"}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold backdrop-blur-md">
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    <span>3 Detik</span>
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-deep-pine tracking-tight">
                  {game?.name || gameSlug}
                </h1>
                <p className="text-xs text-muted leading-relaxed">
                  Layanan top up resmi dan instan. Item langsung masuk ke akun dalam hitungan detik setelah pembayaran terverifikasi.
                </p>
              </div>

              <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-xs text-ink/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Legal &amp; Garansi Moonton / Publisher</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Bebas Biaya Admin via QRIS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Support Kode Referral Streamer Favorit</span>
                </div>
              </div>
            </div>

            {/* Quick Guide Card */}
            <div className="rounded-(--radius-card) border border-border bg-soft-sand p-5 text-xs text-muted space-y-2">
              <div className="flex items-center gap-2 font-bold text-deep-pine">
                <HelpCircle className="h-4 w-4 text-karyalo-green" />
                <span>Petunjuk Cara Top Up:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Masukkan User ID dan Zone ID akun Anda.</li>
                <li>Pilih nominal Diamond atau Pass yang diinginkan.</li>
                <li>Pilih metode pembayaran (QRIS / E-Wallet / VA).</li>
                <li>Masukkan Kode Streamer (jika ada) &amp; No WhatsApp.</li>
                <li>Selesaikan pembayaran, diamond otomatis masuk!</li>
              </ol>
            </div>
          </div>

          {/* Right Column: 4-Step Order Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Account Input */}
            <div className="rounded-(--radius-card) border border-border bg-white p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-5 border-b border-border pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-pine text-xs font-bold text-warm-white">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-deep-pine">Masukkan Data Akun Game</h2>
                  <p className="text-xs text-muted">ID akun dapat dilihat di menu profil dalam game Anda.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-deep-pine mb-1.5">
                    {game?.userIdLabel || "User ID"}
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={game?.userIdPlaceholder || "Masukkan ID Game"}
                    className="w-full rounded-xl border border-border bg-soft-sand px-4 py-2.5 text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:bg-white focus:outline-none"
                  />
                </div>

                {game?.hasZoneId && (
                  <div>
                    <label className="block text-xs font-semibold text-deep-pine mb-1.5">
                      {game.zoneIdLabel || "Zone ID"}
                    </label>
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder={game.zoneIdPlaceholder || "Zone ID (4-5 digit)"}
                      className="w-full rounded-xl border border-border bg-soft-sand px-4 py-2.5 text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:bg-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Nickname validation button */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={isCheckingNick}
                  className="tap-target flex items-center gap-1.5 rounded-full border border-border bg-soft-sand px-4 py-2 text-xs font-bold text-deep-pine hover:bg-soft-sage active:scale-95 transition-all disabled:opacity-50"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>{isCheckingNick ? "Memeriksa ID..." : "Cek Nickname Otomatis"}</span>
                </button>

                {nickname && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Nickname: {nickname}</span>
                  </span>
                )}

                {nickError && (
                  <span className="text-xs font-semibold text-terracotta">{nickError}</span>
                )}
              </div>

              {/* Save account checkbox */}
              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-soft-sand p-3 border border-border/60">
                <input
                  type="checkbox"
                  id="saveAcc"
                  checked={saveAccount}
                  onChange={(e) => setSaveAccount(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-karyalo-green focus:ring-karyalo-green"
                />
                <label htmlFor="saveAcc" className="text-xs text-muted cursor-pointer select-none">
                  Simpan ID akun ini di perangkat untuk <span className="text-deep-pine font-bold">1-Tap Repeat Order</span> berikutnya.
                </label>
              </div>
            </div>

            {/* STEP 2: Nominal Top Up (Dual Pricing & Competitor Savings) */}
            <div className="rounded-(--radius-card) border border-border bg-white p-6 md:p-8 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-5 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-pine text-xs font-bold text-warm-white">
                    2
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-deep-pine">Pilih Nominal Top Up</h2>
                    <p className="text-xs text-muted">Pilih paket item diamond atau subscription pass.</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex rounded-full bg-soft-sage px-3 py-1 text-[11px] font-bold text-deep-pine">
                  Harga Real H2H
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                {products.map((p) => {
                  const isSelected = selectedProduct?.id === p.id;
                  const discountDiff = p.sellPrice - p.vipPrice;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      className={`relative flex flex-col justify-between rounded-2xl p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 active:scale-95 ${
                        isSelected
                          ? "border-2 border-karyalo-green bg-soft-sage shadow-sm ring-2 ring-karyalo-green/20"
                          : "border border-border bg-soft-sand hover:border-muted hover:bg-white"
                      }`}
                    >
                      {p.isBestSeller && (
                        <span className="absolute right-2.5 top-2.5 rounded-full bg-terracotta px-2.5 py-0.5 text-[9px] font-bold text-warm-white shadow-xs">
                          Favorit
                        </span>
                      )}

                      <div>
                        <h3 className="text-sm font-bold text-deep-pine">{p.name}</h3>
                        {p.bonusAmount && (
                          <span className="mt-1 inline-flex items-center gap-0.5 rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-karyalo-green">
                            <Sparkles className="h-3 w-3" />
                            <span>{p.bonusAmount}</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-4 border-t border-border/80 pt-2.5 space-y-1">
                        <div className="flex items-baseline justify-between gap-1">
                          <div className="text-sm font-extrabold text-deep-pine tabular-nums">
                            {formatRupiah(p.sellPrice)}
                          </div>
                          {p.competitorPrice && p.competitorPrice > p.sellPrice && (
                            <div className="text-[10px] text-muted line-through tabular-nums">
                              {p.competitorName || "Codashop"}: {formatRupiah(p.competitorPrice)}
                            </div>
                          )}
                        </div>

                        {p.competitorPrice && p.competitorPrice > p.sellPrice && (
                          <div className="text-[10px] font-bold text-terracotta flex items-center justify-between">
                            <span>Hemat vs {p.competitorName || "Kompetitor"}</span>
                            <span className="tabular-nums">-{formatRupiah(p.competitorPrice - p.sellPrice)}</span>
                          </div>
                        )}

                        {discountDiff > 0 && (
                          <div className="text-[10px] font-medium text-muted flex items-center justify-between pt-0.5 border-t border-dashed border-border/60">
                            <span className="tabular-nums">VIP: {formatRupiah(p.vipPrice)}</span>
                            <span className="text-karyalo-green font-semibold tabular-nums">Hemat {formatRupiah(discountDiff)}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Payment Method */}
            <div className="rounded-(--radius-card) border border-border bg-white p-6 md:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-5 border-b border-border pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-pine text-xs font-bold text-warm-white">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold text-deep-pine">Pilih Metode Pembayaran</h2>
                  <p className="text-xs text-muted">Dukungan QRIS instan semua bank &amp; e-wallet tanpa biaya admin.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PAYMENT_CHANNELS.map((ch) => {
                  const isSelected = selectedPayment?.id === ch.id;
                  const fee = selectedProduct ? calculateFee(ch.id, basePriceAfterDiscount) : 0;
                  const total = basePriceAfterDiscount + fee;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedPayment(ch)}
                      className={`flex items-center justify-between rounded-2xl p-4 text-left transition-[border-color,background-color,box-shadow,transform] active:scale-95 ${
                        isSelected
                          ? "border-2 border-karyalo-green bg-soft-sage shadow-sm ring-2 ring-karyalo-green/20"
                          : "border border-border bg-soft-sand hover:border-muted hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl bg-white border border-border/80 px-2 py-1.5 shadow-xs overflow-hidden">
                          {ch.logo ? (
                            <Image
                              src={ch.logo}
                              alt={ch.name}
                              width={72}
                              height={32}
                              className="h-7 w-auto max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="font-extrabold text-[10px] text-deep-pine">
                              {ch.id.replace("_VA", "")}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-deep-pine">{ch.name}</h3>
                          {ch.badge && (
                            <span className="text-[10px] text-emerald-700 font-bold block">
                              {ch.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-extrabold text-deep-pine tabular-nums">
                          {selectedProduct ? formatRupiah(total) : "-"}
                        </div>
                        {selectedProduct && (
                          <div className="text-[10px] text-muted tabular-nums">
                            Fee: {fee === 0 ? "Gratis" : formatRupiah(fee)}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: WhatsApp & Streamer Referral Code */}
            <div className="rounded-(--radius-card) border border-border bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-pine text-xs font-bold text-warm-white">
                  4
                </span>
                <div>
                  <h2 className="text-base font-bold text-deep-pine">Kontak WhatsApp &amp; Kode Streamer</h2>
                  <p className="text-xs text-muted">Masukkan nomor penerima invoice &amp; kode referral dari livestream streamer.</p>
                </div>
              </div>

              {/* Streamer Referral Section */}
              <div className="rounded-2xl border border-border bg-soft-sand p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tv className="h-4 w-4 text-karyalo-green" />
                    <span className="text-xs font-bold text-deep-pine">Punya Kode Referral Streamer?</span>
                  </div>
                  <span className="text-[10px] text-muted hidden sm:inline">Support Creator Livestream</span>
                </div>

                {selectedReferral ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3.5 border border-emerald-200 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />
                        <span>Kode Aktif: {selectedReferral.code} ({selectedReferral.streamerName})</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">{selectedReferral.streamerNote || selectedReferral.description}</p>
                      <span className="inline-block text-[10px] font-extrabold text-emerald-800 tabular-nums">
                        Hemat Rp {selectedReferral.discountValue.toLocaleString("id-ID")} Terpotong!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveReferral}
                      className="tap-target rounded-full p-1 text-muted hover:bg-emerald-100 hover:text-ink transition-colors"
                      aria-label="Hapus Kode"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyReferral} className="flex gap-2">
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="Masukkan kode referral streamer (cth: WINDAH, RRQLEMON)..."
                      className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-ink placeholder-muted focus:border-karyalo-green focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="tap-target shrink-0 rounded-xl bg-deep-pine px-5 py-2.5 text-xs font-bold text-warm-white hover:bg-karyalo-green active:scale-95 transition-all shadow-xs"
                    >
                      Terapkan
                    </button>
                  </form>
                )}

                {referralError && (
                  <p className="text-xs text-terracotta font-medium">{referralError}</p>
                )}
              </div>

              {/* WhatsApp Number Input */}
              <div>
                <label className="block text-xs font-bold text-deep-pine mb-1.5">
                  Nomor WhatsApp Penerima Bukti Transaksi
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 081289123456"
                  className="w-full rounded-xl border border-border bg-soft-sand px-4 py-2.5 text-sm font-medium text-ink placeholder-muted focus:border-karyalo-green focus:bg-white focus:outline-none"
                />
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                  <Lock className="h-3 w-3 text-deep-pine" />
                  <span>Invoice resmi &amp; status pesanan dikirim otomatis via WhatsApp. 100% Anti-spam.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-16 md:bottom-0 inset-x-0 z-30 border-t border-border bg-warm-white/95 p-4 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex max-w-(--container-content) items-center justify-between gap-4 px-4 md:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Total Pembayaran:</span>
              {savingsTotal > 0 && (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 tabular-nums">
                  Hemat {formatRupiah(savingsTotal)}
                </span>
              )}
            </div>
            <div className="text-lg md:text-2xl font-extrabold text-deep-pine tracking-tight tabular-nums">
              {selectedProduct ? formatRupiah(currentTotal) : "Rp 0"}
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCheckout}
            className="tap-target inline-flex items-center gap-2 rounded-full bg-karyalo-green px-8 py-3.5 text-sm font-extrabold text-warm-white hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all shadow-md"
          >
            <Zap className="h-4 w-4 text-accent-cyan fill-current" />
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>

      {/* Checkout QRIS Modal */}
      {checkoutModalOpen && currentTransaction && paymentResult && (
        <CheckoutModal
          onClose={() => setCheckoutModalOpen(false)}
          transaction={currentTransaction}
          paymentResult={paymentResult}
        />
      )}
    </div>
  );
}
