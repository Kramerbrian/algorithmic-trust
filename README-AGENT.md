# DealershipAI Agent Deploy Kit

## What this does
- Wires CI/CD: GitHub → Supabase migrations → Vercel deploy.
- Syncs env vars to Vercel via API.
- Uses Prisma as DB source of truth on Supabase Postgres.

## Files
- `.github/workflows/ci-vercel-supabase.yml` — CI pipeline.
- `scripts/deploy.sh` — Runs Prisma migrate, syncs env, deploys on Vercel.
- `scripts/vercel-sync-env.ts` — Pushes secrets to Vercel.
- `vercel.json` — Runtime config.
- `prisma/schema.prisma` — Database models.

## One‑time setup
1. Add GitHub repo secrets (Settings → Secrets → Actions):
   - `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`, `SUPABASE_SERVICE_KEY`
   - `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`
   - Optional: `OPENAI_API_KEY`, `SENDGRID_API_KEY`, `TWILIO_*`, etc.
2. Commit these files to the repo root and push to `main`.
3. CI runs, migrates Supabase, syncs env to Vercel, deploys prod.

## Verify
- Vercel build green.
- Supabase tables exist under `public`.
- `GET /api/analytics/performance` returns JSON.
