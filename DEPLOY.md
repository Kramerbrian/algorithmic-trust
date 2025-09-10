# Deployment

## Options
Pick one:
- **Fly.io**: single Dockerfile. Good for API. Use Upstash Redis or Fly Postgres/Redis.
- **Render.com**: render.yaml with web + worker.
- **GHCR**: CI builds and pushes the image for any container host.

## 1) Configure env
Set these at your host:
- `PORT=3001`
- `REDIS_URL=` e.g., `rediss://...` from Upstash or `redis://...`
- `SUPABASE_URL=https://...supabase.co`
- `SUPABASE_SERVICE_ROLE=...`
- `GOOGLE_MAPS_API_KEY=...`
- `CORS_ALLOW_ORIGINS=https://your-frontend.vercel.app,https://your-domain`

## 2) Fly.io
- Install flyctl and run `flyctl launch` once (or edit `fly.toml` app name).
- Add secrets:
  ```bash
  flyctl secrets set REDIS_URL="..." SUPABASE_URL="..." SUPABASE_SERVICE_ROLE="..." GOOGLE_MAPS_API_KEY="..." CORS_ALLOW_ORIGINS="..."
  ```
- Deploy:
  ```bash
  flyctl deploy --remote-only
  ```

## 3) Render.com
- Connect repo.
- Render detects `render.yaml`. Create two services:
  - `dealershipai-api` web service
  - `dealershipai-worker` background worker
- Set the env vars. For worker `ANALYZE_WEBHOOK_URL`, Render template injects the API base URL. The worker code appends `/v1/analyze` internally if you choose.

## 4) GitHub Container Registry
- Add `GHCR` workflow secrets if needed. Default uses `GITHUB_TOKEN`.
- On push to `main`, image is built and pushed to `ghcr.io/<owner>/dealershipai-api:latest`.

## Health
- `/v1/healthz` returns `{ ok: true }` and is wired in `fly.toml` as HTTP healthcheck.
