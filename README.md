# Mystery Boxes Pro — Backend v2.0

## New in v2.0
- Provider System (Kingdomlikes / G2A / CJdropshipping)
- Pricing Engine (30% profit margin validation)
- Sync Service (auto-sync item prices from providers)
- Binance Pay integration (crypto deposits, lowest fees)
- Admin dashboard with revenue projections

## Quick Start
```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

## API
- POST /api/v1/auth/register|login
- GET|POST /api/v1/boxes  |  POST /api/v1/boxes/:id/open
- GET|POST /api/v1/wallet  |  POST /api/v1/wallet/deposit/crypto
- GET /api/v1/referrals
- GET /api/v1/orders
- /api/v1/admin/* (admin role)

## Profit Model
  EV ≤ Price × (1 - 0.30) → 30% margin on every open
