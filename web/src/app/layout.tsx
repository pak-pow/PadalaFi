import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PadalaFi — OFW Remittance & Micro-Lending on Stellar",
  description:
    "Send money home for near-zero fees. Lock your USDC as collateral to unlock micro-loans for your family back in the Philippines.",
  keywords: ["OFW", "Remittance", "Stellar", "DeFi", "Philippines", "USDC", "Soroban"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
