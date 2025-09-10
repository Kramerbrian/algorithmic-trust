#!/usr/bin/env bash
set -euo pipefail

echo "== Ensure deps =="
npm i -D typescript ts-node @types/node
npm i @upstash/redis

echo "== Prisma generate =="
npx prisma generate || true

echo "== Migrate schema (SQL) =="
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL not set. Skipping SQL apply."
else
  psql "$DATABASE_URL" -f lib/database/schema.sql || true
fi

echo "== Seed minimal data =="
npx ts-node scripts/seed_minimal.ts || true

echo "== Ready. Start dev server =="
npm run dev
