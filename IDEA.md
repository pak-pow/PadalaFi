# PadalaFi — Project Submission

Fill this in as you build. It doubles as your **submission README**, and it maps
directly to how projects are judged (meaningful Stellar use, real problem,
working demo).

## Idea

- **Track:** Remittance / Financial Inclusion / DeFi
- **Idea # (from the 300-ideas list):** Idea 1 — OFW Remittance + Micro-Lending
- **One-liner:** Send USDC home for ~$0.01 and let your family lock it as collateral for an instant micro-loan on Stellar.

## Problem

Overseas Filipino Workers (OFWs) remit over **$36 billion** to the Philippines every year — but traditional remittance services (Western Union, Remitly) charge **1.5–5% in fees**. A family receiving $300/month loses up to $15–$18 every single month to middlemen.

Worse, the families back home often have **no access to formal credit**. No bank account → no credit history → no small business loan. The money arrives but it can't grow.

**Philippines angle:** OFWs are one of the largest economic forces in the Philippine economy. A Stellar-native remittance + micro-lending protocol directly serves millions of Filipinos who are underserved by the traditional financial system.

## How it Uses Stellar

Stellar is **central** to every part of the product — not cosmetic:

| Feature | Stellar Primitive |
|---|---|
| Near-zero remittance | Stellar payment (USDC on testnet, ~$0.01 fee) |
| Collateral locking | **Soroban Smart Contract** — `deposit()` |
| Micro-loan enforcement | Soroban — `borrow()` with 50% LTV ratio enforced on-chain |
| Wallet authentication | Freighter via `@stellar/freighter-api` |
| Live balance reading | Horizon REST API |
| Remittance history | Horizon payments feed filtered by USDC |
| Yield from staking | Lending pool APY tracked in Soroban contract state |

## What Works in the Demo

- [x] Connect wallet (Freighter, testnet) — real wallet address shown
- [x] Core remittance flow — send USDC with fee comparison vs. Western Union/Remitly
- [x] Real XLM + USDC balances from Stellar Horizon
- [x] Stake USDC as collateral in Soroban contract
- [x] Borrow PHPT (up to 50% of collateral) — enforced on-chain
- [x] Health factor bar + liquidation risk warning
- [x] Remittance history from real Horizon payment feed
- [x] Smart contract unit tests passing (`cargo test ✅ 1 passed`)

## Setup / Run

Network: **Stellar Testnet**

```powershell
# Frontend
cd web
npm install
npm run dev       # → http://localhost:3000

# Backend (Horizon proxy)
cd backend
npm install
npm run dev       # → http://localhost:4000

# Smart Contract tests
cd contracts
cargo test        # ✅ 1 passed
```

Contract deployment (after Stellar CLI is installed):

```powershell
cd contracts
stellar contract build
stellar contract deploy --wasm target/wasm32v1-none/release/padalafi_contract.wasm --source <identity> --network testnet
```

Set the returned `CONTRACT_ID` in `backend/.env`.

## Demo

- **2–4 min video:** *(record and add link here before submission)*
- **Public repo:** https://github.com/pak-pow/PadalaFi

## Submission Checklist

- [x] Public GitHub repo with a license (MIT)
- [x] README explains problem, Stellar usage, and setup
- [x] Soroban smart contract with passing unit tests
- [x] Working frontend with real Horizon + Freighter integration
- [ ] Demo video (2–4 min showing the flow on testnet)
- [ ] Submitted via the SwitchX hackathon portal before **June 24, 2026**
