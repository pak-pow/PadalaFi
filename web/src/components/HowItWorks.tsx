export default function HowItWorks() {
  const steps = [
    {
      icon: "✈️",
      title: "OFW Sends USDC",
      desc: "Connect your Freighter wallet abroad and send USDC directly to your family's Stellar address. Near-zero fees. Arrives in seconds.",
      role: "Sender (OFW)",
    },
    {
      icon: "📥",
      title: "Family Receives Instantly",
      desc: "The family connects their own wallet and sees the USDC arrive on their dashboard. They choose: cash out or put it to work.",
      role: "Receiver (Philippines)",
    },
    {
      icon: "🔒",
      title: "Lock as Collateral",
      desc: "Lock the USDC into the PadalaFi Soroban smart contract. This becomes the collateral that secures a micro-loan.",
      role: "DeFi: Collateral",
    },
    {
      icon: "💸",
      title: "Borrow Up to 50%",
      desc: "Instantly borrow PHPT (Philippine Peso Token) worth up to 50% of your collateral. Use it to start a business, pay tuition, or cover emergencies.",
      role: "DeFi: Lending",
    },
    {
      icon: "📈",
      title: "Or Earn 8.4% APY",
      desc: "Prefer passive income? Stake your USDC in the lending pool to earn yield for the family. Simple, transparent, on-chain.",
      role: "DeFi: Staking",
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-20" style={{ background: "rgba(11,19,43,0.5)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            How PadalaFi Works
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            From overseas to the Philippines — all on the Stellar blockchain.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-6 top-8 bottom-8 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, var(--gold-400), transparent)" }}
          />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 items-start fade-in card p-5 md:p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                      {step.title}
                    </h3>
                    <span className="badge-green">{step.role}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {step.desc}
                  </p>
                </div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "var(--navy-700)", color: "var(--gold-400)" }}
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
