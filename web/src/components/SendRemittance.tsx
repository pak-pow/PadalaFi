"use client";

import { useState } from "react";

interface SendRemittanceProps {
  walletAddress: string;
}

const USDC_TESTNET_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

export default function SendRemittance({ walletAddress }: SendRemittanceProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");

  const feeEstimate = amount ? (parseFloat(amount) * 0.0001).toFixed(4) : "0.00";
  const usdFee = amount ? "$0.01" : "$0.00";

  const handleSend = async () => {
    if (!recipientAddress || !amount) return;
    setStatus("sending");

    try {
      // In production: build + sign + submit a Stellar payment via @stellar/stellar-sdk
      // For demo: simulate a 2-second transaction
      await new Promise((res) => setTimeout(res, 2000));
      setTxHash("4e3f9c...demo_tx_hash");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto card p-8 text-center fade-in">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Remittance Sent!
        </h2>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          <span style={{ color: "var(--gold-400)", fontWeight: 600 }}>{amount} USDC</span> is on its way to your family in the Philippines.
        </p>
        <div className="p-4 rounded-xl mb-6" style={{ background: "var(--navy-800)", border: "1px solid var(--surface-border)" }}>
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Transaction Hash</div>
          <div className="font-mono text-sm" style={{ color: "var(--gold-400)" }}>{txHash}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-left mb-6">
          <div className="p-3 rounded-lg" style={{ background: "var(--navy-800)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Amount Sent</div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{amount} USDC</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: "var(--navy-800)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Total Fee</div>
            <div className="font-semibold" style={{ color: "var(--green)" }}>{usdFee} 🎉</div>
          </div>
        </div>
        <button
          id="btn-send-another"
          onClick={() => { setStatus("idle"); setAmount(""); setRecipientAddress(""); setMemo(""); setTxHash(""); }}
          className="btn-primary w-full"
        >
          Send Another Remittance
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Send Remittance
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Send USDC to your family in the Philippines — near-zero fees, settled in seconds.
        </p>
      </div>

      {/* From */}
      <div className="card p-5">
        <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>From (Your Wallet)</div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "rgba(251,191,36,0.1)" }}>👤</div>
          <span className="font-mono text-sm" style={{ color: "var(--text-primary)" }}>
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
          </span>
          <span className="badge-green ml-auto">Connected</span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "var(--gold-400)" }}>
          ↓
        </div>
      </div>

      {/* To */}
      <div className="card p-5 space-y-4">
        <div className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Recipient (Philippines)</div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            Stellar Address (G...)
          </label>
          <input
            id="input-recipient-address"
            type="text"
            className="input-field font-mono text-sm"
            placeholder="GABCDE...1234 (Family's Stellar wallet)"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              id="input-send-amount"
              type="number"
              className="input-field pr-20"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
              style={{ color: "var(--gold-400)" }}
            >
              USDC
            </span>
          </div>
          {amount && (
            <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>≈ ₱{(parseFloat(amount) * 56).toLocaleString()} Philippine Peso</span>
              <span>Network fee: {feeEstimate} XLM (~{usdFee})</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            Memo <span className="font-normal" style={{ color: "var(--text-muted)" }}>(optional)</span>
          </label>
          <input
            id="input-send-memo"
            type="text"
            className="input-field text-sm"
            placeholder="Allowance for June · Birthday gift · Tuition"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={28}
          />
        </div>
      </div>

      {/* Fee comparison */}
      {amount && (
        <div className="card p-4 fade-in">
          <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Fee Comparison</div>
          <div className="space-y-2">
            {[
              { name: "Western Union", fee: `$${(parseFloat(amount) * 0.03).toFixed(2)}`, pct: "~3%" },
              { name: "Remitly", fee: `$${(parseFloat(amount) * 0.015).toFixed(2)}`, pct: "~1.5%" },
              { name: "PadalaFi (Stellar)", fee: usdFee, pct: "<0.001%", highlight: true },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{
                background: r.highlight ? "rgba(16,185,129,0.08)" : "transparent",
                border: r.highlight ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
              }}>
                <span className="text-sm" style={{ color: r.highlight ? "var(--green)" : "var(--text-secondary)" }}>
                  {r.highlight && "⚡ "}{r.name}
                </span>
                <span className="text-sm font-bold" style={{ color: r.highlight ? "var(--green)" : "var(--text-secondary)" }}>
                  {r.fee} ({r.pct})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USDC note */}
      <div className="flex gap-3 p-4 rounded-xl text-sm" style={{
        background: "rgba(251,191,36,0.05)",
        border: "1px solid rgba(251,191,36,0.12)",
      }}>
        <span>ℹ️</span>
        <span style={{ color: "var(--text-secondary)" }}>
          This sends <strong style={{ color: "var(--text-primary)" }}>USDC (USD Coin)</strong> on the Stellar Testnet.
          The recipient uses asset issuer <code className="font-mono text-xs" style={{ color: "var(--gold-400)" }}>{USDC_TESTNET_ISSUER.slice(0, 12)}...</code>
        </span>
      </div>

      <button
        id="btn-send-remittance"
        onClick={handleSend}
        disabled={!recipientAddress || !amount || status === "sending"}
        className="btn-primary w-full text-base"
      >
        {status === "sending" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending on Stellar...
          </span>
        ) : (
          `Send ${amount || "0"} USDC →`
        )}
      </button>
    </div>
  );
}
