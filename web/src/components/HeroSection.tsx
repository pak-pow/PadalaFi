"use client";

interface Rates {
  depositAPY: number;
  borrowAPR: number;
  ltv: number;
}

interface HeroSectionProps {
  rates: Rates;
  onConnect: () => void;
}

export default function HeroSection({ rates, onConnect }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
      {/* Background glow blobs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(251,191,36,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{
        background: "rgba(251,191,36,0.08)",
        border: "1px solid rgba(251,191,36,0.2)",
        color: "var(--gold-400)",
      }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold-400)" }} />
        Built on Stellar · Soroban Testnet
      </div>

      {/* Headline */}
      <h1
        className="text-5xl md:text-6xl font-bold leading-tight mb-5 max-w-3xl mx-auto"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Send money home.
        <br />
        <span style={{ color: "var(--gold-400)" }}>Make it work harder.</span>
      </h1>

      <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        OFWs send billions home every year — but fees eat your hard-earned money. PadalaFi sends{" "}
        <strong style={{ color: "var(--text-primary)" }}>USDC over Stellar for near-zero fees</strong>, and lets
        your family lock it as collateral to unlock{" "}
        <strong style={{ color: "var(--text-primary)" }}>instant micro-loans</strong> or earn{" "}
        <strong style={{ color: "var(--gold-400)" }}>{rates.depositAPY}% APY</strong> yield.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <button
          id="hero-connect-btn"
          onClick={onConnect}
          className="btn-primary text-base px-8 py-4 gold-glow"
        >
          Start Sending →
        </button>
        <a
          href="#how-it-works"
          className="btn-outline text-base px-8 py-4"
        >
          How it works
        </a>
      </div>

      {/* Stats row */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
        {[
          { label: "Remittance Fee", value: "~$0.01", sub: "vs. $15–30 traditional" },
          { label: "Staking APY", value: `${rates.depositAPY}%`, sub: "Lock USDC, earn yield" },
          { label: "Loan-to-Value", value: `${rates.ltv}%`, sub: "Borrow against collateral" },
        ].map((s) => (
          <div
            key={s.label}
            className="card flex-1 p-5 text-center"
            style={{ background: "var(--surface-card)" }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: "var(--gold-400)", fontFamily: "var(--font-display)" }}>
              {s.value}
            </div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{s.label}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
