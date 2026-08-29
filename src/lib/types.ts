export type GameCategory = "all" | "game-mobile" | "game-pc" | "voucher" | "pulsa-ppob";

export interface GameItem {
  id: string;
  slug: string;
  name: string;
  publisher: string;
  category: GameCategory;
  thumbnail: string;
  banner: string;
  hasZoneId: boolean;
  zoneIdLabel?: string;
  zoneIdPlaceholder?: string;
  userIdLabel?: string;
  userIdPlaceholder?: string;
  guideImage?: string;
  isPopular?: boolean;
  tag?: "HOT" | "NEW" | "PROMO" | "EVENT";
}

export interface ProductSKU {
  id: string;
  gameSlug: string;
  skuCode: string;
  name: string;
  itemAmount: string; // e.g. "86 Diamonds"
  bonusAmount?: string; // e.g. "+ 10 Bonus" or "Hemat 450%"
  basePrice: number; // Real Digiflazz H2H modal price
  sellPrice: number; // Regular public price
  vipPrice: number; // Reseller / VIP member price
  competitorPrice?: number; // Codashop / Market benchmark price
  competitorName?: string; // e.g. "Codashop"
  marginPercent?: number; // e.g. 5.5 (%)
  marginAmount?: number; // e.g. 1400 (Rp)
  isBestSeller?: boolean;
  isPromo?: boolean;
  promoBadge?: string; // e.g. "EVENT 11.11", "HEMAT 450%", "POPULER"
  iconType?: "diamond" | "crystal" | "uc" | "vp" | "voucher" | "coin" | "pass";
}

export interface VoucherCoupon {
  code: string;
  title: string;
  discountType: "FIXED" | "PERCENT";
  discountValue: number; // e.g. 2000 or 10 (%)
  minSpend: number;
  description: string;
  tag: string;
}

export interface StreamerReferral {
  code: string; // e.g. "WINDAH", "RRQLEMON", "DEANKT", "KARYALOPRO"
  streamerName: string; // e.g. "Windah Basudara"
  platform: "YouTube" | "TikTok" | "Instagram" | "Kick";
  discountType: "FIXED" | "PERCENT";
  discountValue: number; // e.g. 2500 (Rp) or 5 (%)
  minSpend: number;
  description: string;
  streamerNote?: string;
}

export interface PaymentChannel {
  id: string;
  name: string;
  category: "QRIS" | "E_WALLET" | "VIRTUAL_ACCOUNT" | "CONVENIENCE_STORE";
  logo: string;
  feePercent: number; // e.g. 0.7 for QRIS
  feeFlat: number; // e.g. 2500 for VA
  badge?: string; // e.g. "0% Biaya Admin - Rekomendasi"
  minAmount: number;
}

export interface PaymentCreationResult {
  success: boolean;
  invoiceNo: string;
  qrString?: string;
  vaNumber?: string;
  feeAmount: number;
  discountAmount?: number;
  savingsTotal?: number;
  totalAmount: number;
  expiredAt: string;
  checkoutUrl?: string;
  message?: string;
}

export type TransactionStatus = "PENDING" | "PAID" | "PROCESSING" | "SUCCESS" | "FAILED" | "EXPIRED";

export interface ExclusivePartnerConfig {
  partnerName: string; // e.g. "Nama Streamer Partner"
  channelName: string; // e.g. "@StreamerOfficial"
  platform: "YouTube" | "TikTok" | "Instagram" | "Kick";
  referralCode: string; // e.g. "STREAMER"
  discountValue: number; // e.g. 2000 (Rp potongan untuk penonton)
  minSpend: number; // e.g. 20000
  profitSharePercent: number; // 50 (50% untuk Streamer, 50% untuk Owner Web)
  avatar?: string;
  tagline: string;
  streamUrl?: string;
}

export interface Transaction {
  invoiceNo: string;
  createdAt: string;
  gameSlug: string;
  gameName: string;
  gameThumbnail: string;
  productName: string;
  skuCode: string;
  userId: string;
  zoneId?: string;
  nickname?: string;
  whatsapp: string;
  paymentChannelId: string;
  paymentChannelName: string;
  basePrice: number;
  discountAmount?: number;
  savingsTotal?: number;
  feeAmount: number;
  totalAmount: number;
  grossProfit?: number; // Total untung kotor per transaksi
  ownerProfitShare?: number; // 50% bagian Owner Web
  streamerProfitShare?: number; // 50% bagian Partner Streamer
  status: TransactionStatus;
  qrString?: string;
  vaNumber?: string;
  paidAt?: string;
  completedAt?: string;
}

export interface SavedGameAccount {
  id: string;
  gameSlug: string;
  gameName: string;
  userId: string;
  zoneId?: string;
  nickname?: string;
  lastUsed: string;
}

export interface PushPromoNotification {
  id: string;
  title: string;
  body: string;
  url: string;
  icon?: string;
  tag?: string;
  timestamp: string;
  badgeCount?: number;
}
