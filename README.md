# PadalaFi 💸

> **OFW Remittance + Micro-Lending on Stellar**
> Send money home for near-zero fees. Let your family lock it as collateral for an instant micro-loan or stake it to earn yield — all on-chain.

Built for the **StellarX Philippines Hackathon 2026** · Soroban Testnet

---

## The Problem

Overseas Filipino Workers (OFWs) remit **over $36 billion** to the Philippines every year. But:

- Traditional remittance fees (Western Union, Remitly) eat **1.5–5%** of every transfer.
- Filipino families who receive money often have **no access to formal credit** or loans.
- No collateral history → no bank loan → no small business.

**PadalaFi solves both.** Send USDC over Stellar for **~$0.01**. Then let your family put that money to work inside a Soroban smart contract — stake it to earn yield, or lock it as collateral to borrow PHPT (Philippine Peso Token) for business capital.

---

## How it Uses Stellar

| Feature | Stellar Primitive |
|---|---|
| Near-zero remittance | Stellar payments (USDC on testnet) |
| Micro-lending collateral | **Soroban Smart Contract** — `deposit`, `borrow`, `withdraw` |
| 50% LTV borrow logic | On-chain enforcement via Soroban |
| Real wallet balance | Horizon REST API (balances + payment history) |
| Wallet connection | Freighter (`@stellar/freighter-api`) |
| Yield staking pool | Soroban contract state (lending pool APY) |

Stellar is **central**, not cosmetic — the remittance, lending logic, and wallet auth all run on-chain.

---

## Repo Structure

```
PadalaFi/
├── web/                  # Next.js 16 + TypeScript + Tailwind v4 frontend
│   └── src/
│       ├── app/          # page.tsx, layout.tsx, globals.css
│       └── components/   # Navbar, HeroSection, HowItWorks, SendRemittance, Dashboard
├── backend/              # Node.js Express API (Horizon proxy + rates endpoint)
│   └── src/index.js
├── contracts/            # Soroban Rust smart contract (soroban-sdk v22)
│   └── src/
│       ├── lib.rs        # deposit / borrow / withdraw
│       └── test.rs       # unit tests (cargo test ✅)
└── README.md
```

---

## What Works in the Demo

- [x] Connect Freighter wallet (real address, Testnet/Mainnet badge)
- [x] Send USDC remittance — recipient address, amount, memo, real fee comparison
- [x] Dashboard: real XLM + USDC balance fetched from Stellar Horizon
- [x] Stake USDC as collateral into Soroban contract
- [x] Borrow PHPT up to 50% LTV (enforced on-chain)
- [x] Health factor & collateral usage bar
- [x] Remittance history (real Horizon payment feed)
- [x] Smart contract: `deposit`, `borrow`, `withdraw` with unit tests passing

---

## Prerequisites

- **Node.js 20+** and **npm**
- **Freighter** browser extension — switch it to **Test Net**
- **Rust** + `wasm32v1-none` target + **Stellar CLI** (for contract deployment)

### Install the contract toolchain (Windows)

```powershell
winget install --id Rustlang.Rustup -e --accept-source-agreements --accept-package-agreements
winget install --id Stellar.StellarCLI -e --accept-source-agreements --accept-package-agreements
```

Open a new terminal, then add the WASM target:

```powershell
rustup default stable-x86_64-pc-windows-gnu
rustup target add wasm32v1-none
```

---

## Setup & Run

### 1. Frontend

```powershell
cd web
npm install
npm run dev
```

Open <http://localhost:3000>

1. Click **Connect Wallet** → approve in Freighter (make sure it's on **Test Net**)
2. Your real XLM balance appears on the Dashboard
3. Use **Send Remittance** tab to send USDC to a family address
4. Use **Stake & Earn** to lock USDC into the Soroban contract
5. Use **Borrow** to take a PHPT micro-loan against your collateral

### 2. Backend

```powershell
cd backend
npm install
npm run dev
```

Runs on <http://localhost:4000> — proxies Stellar Horizon for balances and remittance history.

Environment variables (`.env`):

```
HORIZON_URL=https://horizon-testnet.stellar.org
PORT=4000
CONTRACT_ID=           # fill in after deploying the contract
```

### 3. Smart Contract

```powershell
# From the contracts/ directory
cargo test             # run unit tests — should show 1 passed ✅

# Build WASM
stellar contract build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/padalafi_contract.wasm \
  --source <your-identity> \
  --network testnet
```

Set the returned Contract ID in `backend/.env` as `CONTRACT_ID=`.

---

## Smart Contract Functions

| Function | Description |
|---|---|
| `deposit(from, token, amount)` | Lock USDC as collateral |
| `get_collateral(user)` | Read a user's locked balance |
| `borrow(from, loan_token, amount)` | Borrow up to 50% of collateral (enforced on-chain) |
| `get_borrowed(user)` | Read a user's outstanding loan |
| `withdraw(from, token, amount)` | Withdraw collateral (enforces borrow ratio) |

---

## Troubleshooting

- **Freighter "not detected"** — install the extension, reload the page, confirm it is unlocked.
- **Balance shows 0** — fund your testnet account via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test).
- **Backend errors** — make sure `npm run dev` is running in `/backend` on port 4000.
- **`tx_bad_auth`** — wrong network passphrase; this app uses `Networks.TESTNET`.
- **`cargo test` linking error on Windows** — use the GNU toolchain: `rustup default stable-x86_64-pc-windows-gnu`.

---

## Demo

- **Public repo:** https://github.com/pak-pow/PadalaFi
- **Network:** Stellar Testnet

---

## Submission Checklist

- [x] Public GitHub repo with MIT license
- [x] README explains problem, Stellar usage, and setup
- [x] Soroban smart contract with unit tests
- [x] Working frontend connected to real Horizon + Freighter
- [ ] Submitted via SwitchX hackathon portal

---

## License

MIT — see [LICENSE](./LICENSE)
