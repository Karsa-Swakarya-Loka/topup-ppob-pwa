/**
 * Payment Gateway Helper (Tripay / QRIS / Duitku)
 */

export interface CreatePaymentParams {
  invoiceNo: string;
  amount: number;
  paymentChannelId: string;
  customerName?: string;
  customerPhone: string;
  orderTitle: string;
}

export interface PaymentCreationResult {
  success: boolean;
  invoiceNo: string;
  qrString?: string;
  vaNumber?: string;
  feeAmount: number;
  totalAmount: number;
  expiredAt: string;
  checkoutUrl?: string;
  message?: string;
}

export function calculateFee(channelId: string, amount: number): number {
  if (channelId === "QRIS") {
    // 0.7% QRIS MDR
    return Math.round(amount * 0.007);
  }
  if (["DANA", "GOPAY", "SHOPEEPAY"].includes(channelId)) {
    // 1.5% E-Wallet MDR
    return Math.round(amount * 0.015);
  }
  if (channelId.endsWith("_VA")) {
    // Rp 2.500 Flat fee Virtual Account
    return 2500;
  }
  if (channelId === "ALFAMART") {
    // Rp 3.500 Convenience Store
    return 3500;
  }
  return 0;
}

export async function createPaymentInvoice(
  params: CreatePaymentParams
): Promise<PaymentCreationResult> {
  const fee = calculateFee(params.paymentChannelId, params.amount);
  const total = params.amount + fee;
  const expiredTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 menit

  if (params.paymentChannelId === "QRIS") {
    // Generate valid dummy QRIS standard EMVCo payload string
    const qrisPayload = `00020101021226590014ID.LINKAJA.WWW01189360000201100000000215${params.invoiceNo}520458125303360540${total}5802ID5910TOPUPPLAY6007JAKARTA62070703A016304`;

    return {
      success: true,
      invoiceNo: params.invoiceNo,
      qrString: qrisPayload,
      feeAmount: fee,
      totalAmount: total,
      expiredAt: expiredTime,
    };
  }

  if (params.paymentChannelId.endsWith("_VA")) {
    const bankPrefix = params.paymentChannelId.split("_")[0];
    const prefixMap: Record<string, string> = {
      BCA: "12800",
      BRI: "88099",
      MANDIRI: "89508",
      BNI: "98800",
    };
    const code = prefixMap[bankPrefix] || "88800";
    const phoneTrim = params.customerPhone.replace(/[^0-9]/g, "").slice(-8);

    return {
      success: true,
      invoiceNo: params.invoiceNo,
      vaNumber: `${code}${phoneTrim}`,
      feeAmount: fee,
      totalAmount: total,
      expiredAt: expiredTime,
    };
  }

  // E-Wallet / Retail
  return {
    success: true,
    invoiceNo: params.invoiceNo,
    qrString: `https://pay.example.com/checkout/${params.invoiceNo}`,
    feeAmount: fee,
    totalAmount: total,
    expiredAt: expiredTime,
  };
}
