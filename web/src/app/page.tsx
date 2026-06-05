"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SendRemittance from "@/components/SendRemittance";
import Dashboard from "@/components/Dashboard";
import HowItWorks from "@/components/HowItWorks";

export type Tab = "send" | "dashboard";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("send");
  const [rates, setRates] = useState({ depositAPY: 8.4, borrowAPR: 12.0, ltv: 50 });

  useEffect(() => {
    fetch("http://localhost:4000/api/rates")
      .then((r) => r.json())
      .then((d) => setRates(d))
      .catch(() => {}); // silently fallback to defaults
  }, []);

  const handleConnect = async () => {
    if (walletAddress) {
      setWalletAddress(null);
      return;
    }
    // Real Freighter connection
    // @ts-expect-error freighter global
    if (typeof window !== "undefined" && window.freighter) {
      try {
        // @ts-expect-error freighter global
        const { publicKey } = await window.freighter.getPublicKey();
        setWalletAddress(publicKey);
      } catch {
        alert("Please approve the connection in Freighter.");
      }
    } else {
      // Demo mode — use a mock testnet address so the UI is functional
      setWalletAddress("GBDEMOOFWDEMOOOFWDEMOOOFWDEMO123EXAMPLEKEY5TESTNET");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      <Navbar
        walletAddress={walletAddress}
        onConnect={handleConnect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {!walletAddress ? (
        <>
          <HeroSection rates={rates} onConnect={handleConnect} />
          <HowItWorks />
        </>
      ) : (
        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Tab Switcher */}
          <div className="flex gap-0 border-b mb-8" style={{ borderColor: "var(--surface-border)" }}>
            {(["send", "dashboard"] as Tab[]).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-all cursor-pointer ${
                  activeTab === tab ? "tab-active" : "tab-inactive"
                }`}
              >
                {tab === "send" ? "📤 Send Remittance" : "📊 My Dashboard"}
              </button>
            ))}
          </div>

          <div className="fade-in">
            {activeTab === "send" && (
              <SendRemittance walletAddress={walletAddress} />
            )}
            {activeTab === "dashboard" && (
              <Dashboard walletAddress={walletAddress} rates={rates} />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
