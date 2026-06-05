import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Horizon } from '@stellar/stellar-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const HORIZON_URL = process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_URL);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', network: 'testnet' });
});

// ─── GET /api/account/:address ────────────────────────────────────────────────
// Returns balances for a given Stellar address
app.get('/api/account/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const account = await server.loadAccount(address);
    const balances = account.balances.map((b) => ({
      asset: b.asset_type === 'native' ? 'XLM' : b.asset_code,
      issuer: b.asset_type === 'native' ? null : b.asset_issuer,
      balance: b.balance,
    }));
    res.json({ address, balances });
  } catch (err) {
    res.status(404).json({ error: 'Account not found or not activated on testnet.' });
  }
});

// ─── GET /api/rates ──────────────────────────────────────────────────────────
// Returns current mock lending rates (in production: fetch from oracle)
app.get('/api/rates', (_req, res) => {
  res.json({
    depositAPY: 8.4,    // 8.4% APY for staking USDC
    borrowAPR: 12.0,    // 12% APR for PHPT loans
    ltv: 50,            // 50% Loan-to-Value ratio
    liquidationThreshold: 75, // liquidate if health factor < 1
  });
});

// ─── GET /api/remittances/:address ────────────────────────────────────────────
// Returns last 10 USDC inbound transactions for an address
app.get('/api/remittances/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const payments = await server
      .payments()
      .forAccount(address)
      .limit(20)
      .order('desc')
      .call();

    const remittances = payments.records
      .filter((p) => p.type === 'payment' && p.asset_code === 'USDC' && p.to === address)
      .slice(0, 10)
      .map((p) => ({
        id: p.id,
        from: p.from,
        amount: p.amount,
        asset: p.asset_code,
        date: p.created_at,
        memo: p.transaction_attr?.memo || null,
      }));

    res.json({ remittances });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch remittances.' });
  }
});

// ─── GET /api/position/:address ──────────────────────────────────────────────
// Returns mock lending position for a user (in prod: read from Soroban)
// For testnet MVP we simulate this off-chain
app.get('/api/position/:address', async (req, res) => {
  const { address } = req.params;
  // Placeholder: in production, invoke the Soroban contract read via RPC
  res.json({
    address,
    collateralUsdc: '0',
    borrowedPhpt: '0',
    availableToBorrow: '0',
    healthFactor: null,
    yieldEarned: '0',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 PadalaFi Backend running on http://localhost:${PORT}`);
  console.log(`   Network: Stellar Testnet`);
  console.log(`   Horizon: ${HORIZON_URL}\n`);
});
