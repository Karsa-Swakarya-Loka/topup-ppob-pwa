/**
 * Mobile Legends Pricing Engine & Margin Calculator
 * Real Digiflazz H2H Distributor Base Cost + Public Margin vs Competitor Benchmarks
 */

import { ProductSKU } from "./types";

export interface MLPricingConfig {
  defaultPublicMarginPercent: number; // e.g. 5.5%
  defaultVipMarginPercent: number;    // e.g. 1.8%
}

export interface DigiflazzMLItem {
  id: string;
  skuCode: string;
  name: string;
  itemAmount: string;
  bonusAmount: string;
  digiflazzModalPrice: number; // Real base cost from Digiflazz H2H API
  competitorPrice: number;     // Real price on Codashop / Lapakgaming
  competitorName: string;
  isBestSeller?: boolean;
  isPromo?: boolean;
  promoBadge?: string;
  iconType: "diamond" | "pass";
}

export const REAL_DIGIFLAZZ_ML_PRICELIST: DigiflazzMLItem[] = [
  {
    id: "ml-weekly",
    skuCode: "ML-WDP-DG",
    name: "Weekly Diamond Pass",
    itemAmount: "WDP",
    bonusAmount: "Hemat 450% (220 DM + 70 COA)",
    digiflazzModalPrice: 25500,
    competitorPrice: 30500,
    competitorName: "Codashop",
    isBestSeller: true,
    isPromo: true,
    promoBadge: "BEST VALUE",
    iconType: "pass",
  },
  {
    id: "ml-86",
    skuCode: "ML-86-DG",
    name: "86 Diamonds",
    itemAmount: "86 DM",
    bonusAmount: "78 + 8 Bonus",
    digiflazzModalPrice: 20700,
    competitorPrice: 24500,
    competitorName: "Codashop",
    isBestSeller: true,
    promoBadge: "POPULER",
    iconType: "diamond",
  },
  {
    id: "ml-172",
    skuCode: "ML-172-DG",
    name: "172 Diamonds",
    itemAmount: "172 DM",
    bonusAmount: "156 + 16 Bonus",
    digiflazzModalPrice: 41300,
    competitorPrice: 48000,
    competitorName: "Codashop",
    iconType: "diamond",
  },
  {
    id: "ml-257",
    skuCode: "ML-257-DG",
    name: "257 Diamonds",
    itemAmount: "257 DM",
    bonusAmount: "234 + 23 Bonus",
    digiflazzModalPrice: 61800,
    competitorPrice: 72500,
    competitorName: "Codashop",
    isPromo: true,
    promoBadge: "EVENT 11.11",
    iconType: "diamond",
  },
  {
    id: "ml-343",
    skuCode: "ML-343-DG",
    name: "343 Diamonds",
    itemAmount: "343 DM",
    bonusAmount: "312 + 31 Bonus",
    digiflazzModalPrice: 82500,
    competitorPrice: 96000,
    competitorName: "Codashop",
    iconType: "diamond",
  },
  {
    id: "ml-514",
    skuCode: "ML-514-DG",
    name: "514 Diamonds",
    itemAmount: "514 DM",
    bonusAmount: "468 + 46 Bonus",
    digiflazzModalPrice: 123600,
    competitorPrice: 144000,
    competitorName: "Codashop",
    iconType: "diamond",
  },
  {
    id: "ml-706",
    skuCode: "ML-706-DG",
    name: "706 Diamonds",
    itemAmount: "706 DM",
    bonusAmount: "625 + 81 Bonus",
    digiflazzModalPrice: 168000,
    competitorPrice: 195000,
    competitorName: "Codashop",
    promoBadge: "HEMAT RP 19.100",
    iconType: "diamond",
  },
  {
    id: "ml-963",
    skuCode: "ML-963-DG",
    name: "963 Diamonds",
    itemAmount: "963 DM",
    bonusAmount: "859 + 104 Bonus",
    digiflazzModalPrice: 229000,
    competitorPrice: 265000,
    competitorName: "Codashop",
    iconType: "diamond",
  },
  {
    id: "ml-2195",
    skuCode: "ML-2195-DG",
    name: "2195 Diamonds",
    itemAmount: "2195 DM",
    bonusAmount: "1860 + 335 Bonus",
    digiflazzModalPrice: 505000,
    competitorPrice: 585000,
    competitorName: "Codashop",
    promoBadge: "HEMAT RP 60.000",
    iconType: "diamond",
  },
  {
    id: "ml-twilight",
    skuCode: "ML-TP-DG",
    name: "Twilight Pass (Starlight)",
    itemAmount: "Pass",
    bonusAmount: "Instant Skin + 500 Ticket",
    digiflazzModalPrice: 132000,
    competitorPrice: 155000,
    competitorName: "Codashop",
    iconType: "pass",
  },
];

/**
 * Calculates selling prices for Mobile Legends based on Digiflazz modal + margins
 */
export function calculateMLProductSKUs(
  publicMarginPercent = 5.5,
  vipMarginPercent = 1.8
): ProductSKU[] {
  return REAL_DIGIFLAZZ_ML_PRICELIST.map((item) => {
    // Round to nearest 100 rupiah for clean psychological pricing
    const rawPublicMargin = item.digiflazzModalPrice * (publicMarginPercent / 100);
    const marginAmount = Math.ceil(rawPublicMargin / 100) * 100;
    const sellPrice = item.digiflazzModalPrice + marginAmount;

    const rawVipMargin = item.digiflazzModalPrice * (vipMarginPercent / 100);
    const vipMarginAmount = Math.ceil(rawVipMargin / 100) * 100;
    const vipPrice = item.digiflazzModalPrice + vipMarginAmount;

    return {
      id: item.id,
      gameSlug: "mobile-legends",
      skuCode: item.skuCode,
      name: item.name,
      itemAmount: item.itemAmount,
      bonusAmount: item.bonusAmount,
      basePrice: item.digiflazzModalPrice,
      sellPrice,
      vipPrice,
      competitorPrice: item.competitorPrice,
      competitorName: item.competitorName,
      marginPercent: publicMarginPercent,
      marginAmount,
      isBestSeller: item.isBestSeller,
      isPromo: item.isPromo,
      promoBadge: item.promoBadge,
      iconType: item.iconType,
    };
  });
}
