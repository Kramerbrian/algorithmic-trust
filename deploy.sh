#!/usr/bin/env bash
set -euo pipefail

# Required env: SUPABASE_PROJECT_REF, SUPABASE_DB_PASSWORD, SUPABASE_SERVICE_KEY,
# VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID

export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://${SUPABASE_PROJECT_REF}.supabase.co}"

# Prisma URLs for Supabase
export DIRECT_URL="postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${SUPABASE_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require"
export DATABASE_URL="${DIRECT_URL}&pgbouncer=true&connection_limit=1"

echo "⛏️  Install deps"
npm ci

echo "🧬 Prisma"
npx prisma generate
npx prisma migrate deploy

echo "🌱 Seed (optional)"
if [ -f scripts/seed_dealers.ts ] && [ -f seed/dealers_seed.csv ]; then
  npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed_dealers.ts seed/dealers_seed.csv || true
fi

echo "🔐 Sync Vercel env"
node scripts/vercel-sync-env.ts

echo "🚀 Vercel deploy"
npm i -g vercel@latest
vercel pull --yes --environment=production --token "$VERCEL_TOKEN"
vercel build --prod --token "$VERCEL_TOKEN"
vercel deploy --prebuilt --prod --token "$VERCEL_TOKEN"
