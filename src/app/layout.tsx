import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import OfflineBanner from "@/components/layout/OfflineBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#14213d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://topup.karyalo.id"),
  title: {
    default: "TopUpPlay — Top Up Game & PPOB Termurah & Tercepat 24 Jam",
    template: "%s — TopUpPlay",
  },
  description:
    "Platform Top Up Game Mobile Legends, Free Fire, Genshin Impact, Valorant, Steam Wallet, dan Pulsa PPOB otomatis 1-3 detik dengan QRIS All Payment bebas biaya admin.",
  keywords: [
    "top up game murah",
    "top up diamond mlbb",
    "top up free fire",
    "top up genshin impact",
    "voucher steam idr",
    "valorant points",
    "qris top up game",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TopUpPlay",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "TopUpPlay — Top Up Game & PPOB Termurah 24 Jam",
    description: "Proses instan 1-3 detik otomatis resmi Moonton & Garena via QRIS & Virtual Account.",
    url: "https://topup.karyalo.id",
    siteName: "TopUpPlay",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/promos/promo-mlbb.jpg",
        width: 1200,
        height: 630,
        alt: "TopUpPlay Game Top Up Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopUpPlay — Top Up Game Resmi & Terpercaya",
    description: "Top Up Game & PPOB otomatis 1-3 detik via QRIS All Payment.",
    images: ["/images/promos/promo-mlbb.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TopUpPlay",
    applicationCategory: "GameApplication, ShoppingApplication",
    operatingSystem: "All",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: "1500",
      highPrice: "5000000",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "12840",
    },
  };

  return (
    <html lang="id" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-warm-white text-ink font-sans antialiased">
        <OfflineBanner />
        <AnnouncementBar />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <BottomNav />
        <InstallPrompt />
      </body>
    </html>
  );
}
