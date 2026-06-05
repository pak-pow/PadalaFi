"use client";

import { useState, useEffect } from "react";

interface Rates {
  depositAPY: number;
  borrowAPR: number;
  ltv: number;
}

interface DashboardProps {
  walletAddress: string;
  rates: Rates;
}

type DashTab = "overview" | "stake" | "borrow" | "history";

export default function Dashboard({ walletAddress, rates }: DashboardProps) {
  const [dashTab, setDashTab] = useState<DashTab>("overview");
  const [collateral, setCollateral] = useState(0);
  const [borrowed, setBorrowed] = useState(0);
  const [yieldEarned] = useState(12.45);
  const [stakeAmount, setStakeAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [stellarBalance, setStellarBalance] = useState<{ asset: string; balance: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/account/${walletAddress}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.balances) setStellarBalance(d.balances);
      })
      .catch(() => {
        // Fallback demo balances
        setStellarBalance([
          { asset: "USDC", balance: "500.0000000" },
          { asset: "XLM", balance: "94.8200000" },
        ]);
      })
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const maxBorrow = Math.floor(collateral * (rates.ltv / 100));
  const healthFactor = borrowed > 0 ? (collateral / borrowed) * (rates.ltv / 100) : null;
  const collateralRatioUsed = collateral > 0 ? Math.min((borrowed / maxBorrow) * 100, 100) : 0;

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    setActionStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setCollateral((c) => c + parseFloat(stakeAmount));
    setStakeAmount("");
    setActionStatus("done");
    setTimeout(() => setActionStatus("idle"), 2000);
  };

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) > maxBorrow) return;
    setActionStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setBorrowed((b) => b + parseFloat(borrowAmount));
    setBorrowAmount("");
    setActionStatus("done");
    setTimeout(() => setActionStatus("idle"), 2000);
  };

  const tabs: { id: DashTab; label: string }[] = [
    { id: "overview", label: "📊 Overview" },
    { id: "stake", label: "🔒 Stake & Earn" },
    { id: "borrow", label: "💸 Borrow" },
    { id: "history", label: "📜 History" },
  ];

  const usdcBalance = stellarBalance.find((b) => b.asset === "USDC")?.balance || "0";
  const xlmBalance = stellarBalance.find((b) => b.asset === "XLM")?.balance || "0";

  return (
    <div className="space-y-6">
      {/* Inner tabs */}
      <div className="flex gap-0 overflow-x-auto" style={{ borderBottom: "1px solid var(--surface-border)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`dash-tab-${t.id}`}
            onClick={() => setDashTab(t.id)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              dashTab === t.id ? "tab-active" : "tab-inactive"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {dashTab === "overview" && (
        <div className="space-y-4 fade-in">
          {/* Wallet balances */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Wallet Balances
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="shimmer h-20 rounded-xl" />
                ))
              ) : (
                <>
                  <div className="card p-4 stat-gradient">
                    <div className="text-xs mb-2 font-medium" style={{ color: "var(--text-muted)" }}>USDC Balance</div>
                    <div className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                      {parseFloat(usdcBalance).toFixed(2)}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--gold-400)" }}>USDC</div>
                  </div>
                  <div className="card p-4 stat-gradient">
                    <div className="text-xs mb-2 font-medium" style={{ color: "var(--text-muted)" }}>XLM Balance</div>
                    <div className="text-2xl font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                      {parseFloat(xlmBalance).toFixed(2)}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>XLM (gas)</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Protocol Position */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Protocol Position (Soroban)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Locked Collateral", value: `${collateral} USDC`, color: "var(--gold-400)" },
                { label: "Borrowed", value: `${borrowed} PHPT`, color: "var(--red)" },
                { label: "Yield Earned", value: `${yieldEarned} USDC`, color: "var(--green)" },
                { label: "APY", value: `${rates.depositAPY}%`, color: "var(--gold-400)" },
              ].map((stat) => (
                <div key={stat.label} className="card p-4">
                  <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                  <div className="text-xl font-bold font-mono" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Factor */}
          {collateral > 0 && (
            <div className="card p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Collateral Usage</span>
                <span className="text-sm font-mono" style={{ color: collateralRatioUsed > 80 ? "var(--red)" : "var(--green)" }}>
                  {collateralRatioUsed.toFixed(1)}% used
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${collateralRatioUsed}%`,
                    background:
                      collateralRatioUsed > 80
                        ? "linear-gradient(90deg, var(--red), #f87171)"
                        : "linear-gradient(90deg, var(--gold-400), var(--gold-600))",
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>0 PHPT borrowed</span>
                <span>Max: {maxBorrow} PHPT</span>
              </div>
              {healthFactor !== null && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span style={{ color: "var(--text-muted)" }}>Health Factor:</span>
                  <span
                    className="font-bold"
                    style={{ color: healthFactor >= 1.5 ? "var(--green)" : healthFactor >= 1 ? "var(--gold-400)" : "var(--red)" }}
                  >
                    {healthFactor.toFixed(2)}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {healthFactor >= 1.5 ? "✅ Safe" : healthFactor >= 1 ? "⚠️ At Risk" : "🚨 Liquidation Risk"}
                  </span>
                </div>
              )}
            </div>
          )}

          {collateral === 0 && (
            <div className="card p-8 text-center" style={{ borderStyle: "dashed" }}>
              <div className="text-4xl mb-3">🔒</div>
              <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No collateral locked yet</div>
              <div className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Stake your USDC to unlock micro-loans and earn {rates.depositAPY}% APY
              </div>
              <button onClick={() => setDashTab("stake")} className="btn-primary px-6 py-2.5 text-sm">
                Stake Now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAKE */}
      {dashTab === "stake" && (
        <div className="max-w-lg mx-auto space-y-5 fade-in">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Stake & Earn
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Lock your USDC in the Soroban contract. Earn {rates.depositAPY}% APY automatically — and unlock the ability to borrow PHPT against it.
            </p>
          </div>

          {/* Info boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--gold-400)" }}>{rates.depositAPY}%</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Annual Yield (APY)</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--green)" }}>{collateral} USDC</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Currently Staked</div>
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Amount to Stake (USDC)
              </label>
              <div className="relative">
                <input
                  id="input-stake-amount"
                  type="number"
                  className="input-field pr-20"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  min="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "var(--gold-400)" }}>
                  USDC
                </span>
              </div>
              {stakeAmount && parseFloat(stakeAmount) > 0 && (
                <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  Est. monthly yield:{" "}
                  <span style={{ color: "var(--green)" }}>
                    +{((parseFloat(stakeAmount) * rates.depositAPY) / 100 / 12).toFixed(2)} USDC/month
                  </span>
                </div>
              )}
            </div>

            <button
              id="btn-stake"
              onClick={handleStake}
              disabled={!stakeAmount || actionStatus === "loading"}
              className="btn-primary w-full"
            >
              {actionStatus === "loading" ? "Staking on Soroban..." :
               actionStatus === "done" ? "✅ Staked!" :
               `Lock ${stakeAmount || "0"} USDC in Soroban`}
            </button>
          </div>

          <div className="p-4 rounded-xl text-sm" style={{
            background: "rgba(251,191,36,0.05)",
            border: "1px solid rgba(251,191,36,0.1)",
          }}>
            <div className="font-semibold mb-1" style={{ color: "var(--gold-400)" }}>How staking works</div>
            <ul className="space-y-1" style={{ color: "var(--text-secondary)" }}>
              <li>• Your USDC is deposited into a Soroban smart contract</li>
              <li>• You earn {rates.depositAPY}% APY automatically from the lending pool</li>
              <li>• You can borrow up to {rates.ltv}% of your staked value in PHPT</li>
              <li>• Withdraw anytime, as long as your borrow ratio stays healthy</li>
            </ul>
          </div>
        </div>
      )}

      {/* BORROW */}
      {dashTab === "borrow" && (
        <div className="max-w-lg mx-auto space-y-5 fade-in">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Borrow PHPT
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Borrow Philippine Peso Token (PHPT) against your locked USDC. {rates.borrowAPR}% APR — fixed.
            </p>
          </div>

          {collateral === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">⛔</div>
              <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No collateral to borrow against</div>
              <div className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                You need to stake USDC first before you can borrow PHPT.
              </div>
              <button onClick={() => setDashTab("stake")} className="btn-primary px-6 py-2.5 text-sm">
                Stake USDC First →
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Collateral", value: `${collateral} USDC` },
                  { label: "Available to Borrow", value: `${maxBorrow - borrowed} PHPT`, color: "var(--green)" },
                  { label: "Interest Rate", value: `${rates.borrowAPR}% APR` },
                ].map((s) => (
                  <div key={s.label} className="card p-3 text-center">
                    <div className="text-sm font-bold mb-0.5" style={{ color: s.color || "var(--gold-400)" }}>{s.value}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="card p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Borrow Amount (PHPT)
                  </label>
                  <div className="relative">
                    <input
                      id="input-borrow-amount"
                      type="number"
                      className="input-field pr-20"
                      placeholder="0.00"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
                      max={maxBorrow - borrowed}
                      min="1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "var(--gold-400)" }}>
                      PHPT
                    </span>
                  </div>
                  {borrowAmount && (
                    <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      Monthly interest:{" "}
                      <span style={{ color: "var(--red)" }}>
                        {((parseFloat(borrowAmount) * rates.borrowAPR) / 100 / 12).toFixed(2)} PHPT/month
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick amounts */}
                <div className="flex gap-2">
                  {[25, 50, 75].map((pct) => (
                    <button
                      key={pct}
                      id={`btn-borrow-pct-${pct}`}
                      onClick={() => setBorrowAmount(String(Math.floor(((maxBorrow - borrowed) * pct) / 100)))}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all"
                      style={{
                        background: "var(--navy-800)",
                        border: "1px solid var(--surface-border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                <button
                  id="btn-borrow"
                  onClick={handleBorrow}
                  disabled={!borrowAmount || parseFloat(borrowAmount) > (maxBorrow - borrowed) || actionStatus === "loading"}
                  className="btn-outline w-full"
                >
                  {actionStatus === "loading" ? "Processing on Soroban..." :
                   actionStatus === "done" ? "✅ Loan Approved!" :
                   `Borrow ${borrowAmount || "0"} PHPT`}
                </button>
              </div>

              <div className="p-4 rounded-xl text-sm" style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}>
                <div className="font-semibold mb-1" style={{ color: "var(--red)" }}>⚠️ Risk Notice</div>
                <p style={{ color: "var(--text-secondary)" }}>
                  If your collateral value drops and your health factor falls below 1.0, your position may be liquidated to repay the loan. Keep your ratio healthy.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* HISTORY */}
      {dashTab === "history" && (
        <div className="fade-in space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Remittance History
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Incoming USDC transactions to your Stellar address.
            </p>
          </div>

          {/* Mock history */}
          {[
            { from: "GOFWXXX...4321", amount: "200.00", date: "Jun 03, 2026", memo: "Allowance June" },
            { from: "GOFWXXX...4321", amount: "150.00", date: "May 15, 2026", memo: "Emergency fund" },
            { from: "GOFWXXX...4321", amount: "500.00", date: "Apr 30, 2026", memo: "School tuition" },
          ].map((tx, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
                style={{ background: "rgba(16,185,129,0.1)" }}>
                📥
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    +{tx.amount} USDC
                  </span>
                  <span className="badge-green">Received</span>
                </div>
                <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  From: {tx.from} · {tx.memo}
                </div>
              </div>
              <div className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                {tx.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
