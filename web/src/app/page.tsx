"use client";

import { useState, useEffect } from "react";
import { isConnected, requestAccess, getNetworkDetails } from "@stellar/freighter-api";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SendRemittance from "@/components/SendRemittance";
import Dashboard from "@/components/Dashboard";
import HowItWorks from "@/components/HowItWorks";

export type Tab = "send" | "dashboard";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("send");
  const [rates, setRates] = useState({ depositAPY: 8.4, borrowAPR: 12.0, ltv: 50 });
  const [connectError, setConnectError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/rates")
      .then((r) => r.json())
      .then((d) => setRates(d))
      .catch(() => {});
  }, []);

  const handleConnect = async () => {
    if (walletAddress) {
      setWalletAddress(null);
      setNetwork(null);
      return;
    }

    setConnectError(null);

    try {
      // Check if Freighter is installed
      const connected = await isConnected();
      if (!connected.isConnected) {
        setConnectError("Freighter is not installed. Please install it from freighter.app");
        return;
      }

      // Request wallet access — Freighter will pop up for approval
      const accessResult = await requestAccess();
      if (accessResult.error) {
        setConnectError("Connection rejected. Please approve in Freighter.");
        return;
      }

      // Get network details
      const networkDetails = await getNetworkDetails();
      setNetwork(networkDetails.networkPassphrase?.includes("Test") ? "Testnet" : "Mainnet");
      setWalletAddress(accessResult.address);
      setActiveTab("dashboard");
    } catch (err) {
      setConnectError("Could not connect to Freighter. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--navy-950)" }}>
      <Navbar
        walletAddress={walletAddress}
        network={network}
        onConnect={handleConnect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {connectError && (
        <div className="max-w-xl mx-auto mt-4 px-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            <span>⚠️</span> {connectError}
          </div>
        </div>
      )}

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
              <Dashboard walletAddress={walletAddress} network={network} rates={rates} />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
