# feat: Mystery Shop core engine, API routes, CSV export, Prisma scaffolding, deploy config

## Summary
Adds the Mystery Shop core, front-end admin utilities, API routes, DB service scaffolding, and infra files. Compiles clean and runs locally. Mock endpoints are safe to replace with production integrations.

## Changes
- **lib/**
  - `mystery-shop-engine.ts` – WebSocket client with reconnect, deploy helper
  - `csv-export.ts` – robust CSV export with formatting
  - `types.ts` – shared types
  - `database/connection.ts` – Prisma singleton + scoring
  - `database/schema.sql` – SQL schema for Postgres
  - `database/prisma.schema` – Prisma models
- **components/**
  - `UserManagement.tsx` – users table (mem API)
  - `EmailTemplateBuilder.tsx` – template UI
  - `ReportGenerator.tsx` – PDF export trigger
- **app/api/**
  - `analytics/performance` – mock KPIs
  - `mystery/deploy` – validation + deploy stub
  - `webhooks/dealer-response` – HMAC-verified webhook
  - `export` – csv/json/pdf/excel stubs
  - `users` – mem store
  - `competitors` – mem store
  - `reports/generate` – PDF bytes
- **infra**
  - `docker-compose.yml`, `Dockerfile`
  - `.github/workflows/deploy.yml`
  - `.env.production` sample

## Config
Required env keys:
```
WEBHOOK_SECRET=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
ONESIGNAL_API_KEY=...
ONESIGNAL_APP_ID=...
DATABASE_URL=postgres://...
REDIS_URL=redis://...
```
Note: routes with Buffer declare `export const runtime = 'nodejs'`.

## Migrations
- Option A: SQL
  ```bash
  psql "$DATABASE_URL" -f lib/database/schema.sql
  ```
- Option B: Prisma
  ```bash
  npx prisma generate
  # npx prisma db push   # if you want Prisma to create tables
  ```

## Test plan
- Start app: `npm run dev`
- Endpoints:
  - `GET /api/analytics/performance?period=7d`
  - `POST /api/mystery/deploy` with minimal body:
    ```json
    { "shopper": {"email":"a@b.com"}, "vehicle": {"model":"Tucson"}, "targetDealers": [] }
    ```
  - Webhook signature example:
    ```bash
    BODY='{"dealerId":"d1","shopId":"s1","responseData":{"hasOTDPricing":true,"hasTradeValue":true}}'
    SIG=$(node -e "const c=process.argv[1];const s=process.env.WEBHOOK_SECRET;console.log(require('crypto').createHmac('sha256',s).update(c).digest('hex'))" "$BODY")
    curl -s -X POST http://localhost:3000/api/webhooks/dealer-response       -H "content-type: application/json" -H "x-webhook-signature: $SIG"       -d "$BODY"
    ```
  - `POST /api/reports/generate` returns PDF blob
- UI components render without SSR/client errors

## Risks / follow-ups
- `users` and `competitors` are in-memory; replace with DB.
- PDF/Excel generators are stubs; wire `pdfkit`/`puppeteer` and `exceljs`.
- Add auth (NextAuth) and RBAC.
- If moving routes to Edge, remove Buffer usage.

## Rollback
Revert this PR. No destructive migrations are run by default.
