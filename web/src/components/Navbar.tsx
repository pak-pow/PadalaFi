"use client";

import type { Tab } from "@/app/page";

interface NavbarProps {
  walletAddress: string | null;
  network: string | null;
  onConnect: () => void;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
}

export default function Navbar({ walletAddress, network, onConnect }: NavbarProps) {
  const short = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(6, 13, 31, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
          style={{
            background: "linear-gradient(135deg, var(--gold-400), var(--gold-600))",
            color: "var(--navy-950)",
          }}
        >
          ₱
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Padala<span style={{ color: "var(--gold-400)" }}>Fi</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {walletAddress && (
          <div className="hidden sm:flex items-center gap-2">
            {network && (
              <span
                className="px-2 py-1 rounded-lg text-xs font-bold"
                style={{
                  background: network === "Testnet" ? "rgba(251,191,36,0.1)" : "rgba(16,185,129,0.1)",
                  border: `1px solid ${network === "Testnet" ? "rgba(251,191,36,0.25)" : "rgba(16,185,129,0.25)"}`,
                  color: network === "Testnet" ? "var(--gold-400)" : "var(--green)",
                }}
              >
                {network}
              </span>
            )}
            <span
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{
                background: "var(--navy-800)",
                border: "1px solid var(--surface-border)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
              {short}
            </span>
          </div>
        )}
        <button
          id="btn-connect-wallet"
          onClick={onConnect}
          className="btn-primary text-sm px-5 py-2.5"
          style={{ borderRadius: "0.625rem" }}
        >
          {walletAddress ? "Disconnect" : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}
