import express from "express";
import crypto from "crypto";
import { findPlace, placeDetails, extractCidFromMapsUrl } from "./connectors/gbp.js";
import { redis } from "./lib/redis.js";

export const resolveRouter = express.Router();
const WINDOW_SEC = Number(process.env.RESOLVE_THROTTLE_SEC || 60);

const sha1 = (s="") => crypto.createHash("sha1").update(s).digest("hex");

function normalizeDealerKey(name = "", address = "") {
  const base = [name, address].filter(Boolean).join(" | ").toLowerCase().trim();
  return sha1(base || "unknown").slice(0, 12);
}

function ipFromReq(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.ip || req.connection?.remoteAddress || "unknown";
}

async function tryRateLimit(ip, ttlSec) {
  const key = `rate:resolve:ip:${ip}`;
  try {
    const ok = await redis.set(key, "1", "NX", "EX", ttlSec);
    if (ok === "OK") return { allowed: true };
    const ttl = await redis.ttl(key);
    return { allowed: false, retry: Math.max(1, ttl) };
  } catch {
    return { allowed: true };
  }
}

async function cacheGet(key) {
  try { const v = await redis.get(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
async function cacheSet(key, val, ttlSec) {
  try { await redis.set(key, JSON.stringify(val), "EX", ttlSec); } catch {}
}

resolveRouter.get("/resolve", async (req, res) => {
  const input = String(req.query.input || "").trim();
  const dealer = String(req.query.dealer || "default").trim();
  const key = process.env.GOOGLE_MAPS_API_KEY || "";
  if (!input) return res.status(400).json({ ok: false, error: "missing input" });
  if (!key)   return res.status(400).json({ ok: false, error: "missing GOOGLE_MAPS_API_KEY" });

  // distributed throttle
  const ip = ipFromReq(req);
  const rl = await tryRateLimit(ip, WINDOW_SEC);
  if (!rl.allowed) {
    res.setHeader("Retry-After", String(rl.retry));
    res.setHeader("X-RateLimit-Limit", "1");
    res.setHeader("X-RateLimit-Remaining", "0");
    res.setHeader("X-RateLimit-Reset", String(Math.floor((Date.now()/1000) + rl.retry)));
    return res.status(429).json({ ok: false, error: "rate_limited", retry_after_sec: rl.retry });
  }

  try {
    const cidFromUrl = extractCidFromMapsUrl(input);

    const findKey = `places:find:${sha1(input)}`;
    let found = await cacheGet(findKey);
    if (!found) {
      found = await findPlace(input, key);
      if (found) await cacheSet(findKey, found, 24 * 3600);
    }

    if (!found) {
      return res.json({
        ok: true, dealer, input,
        cid: cidFromUrl || null,
        dealer_key: normalizeDealerKey(input, ""),
        note: "No Places candidate found. Only CID (if any) returned."
      });
    }

    const detailsKey = `places:details:${found.place_id}`;
    let details = await cacheGet(detailsKey);
    if (!details) {
      details = await placeDetails(found.place_id, key);
      if (details) await cacheSet(detailsKey, details, 7 * 24 * 3600);
    }

    const name = details?.name || found.name || "";
    const addr = details?.formatted_address || found.formatted_address || "";
    const dealer_key = normalizeDealerKey(name, addr);

    res.setHeader("X-RateLimit-Limit", "1");
    res.setHeader("X-RateLimit-Remaining", "0");

    return res.json({
      ok: true,
      dealer,
      dealer_key,
      place_id: details?.place_id || found.place_id || null,
      cid: details?.cid || found.cid || cidFromUrl || null,
      name,
      formatted_address: addr,
      website: details?.website ?? found?.website ?? null,
      maps_url: details?.url ?? found?.url ?? null,
      phone: details?.international_phone_number ?? found?.international_phone_number ?? null,
      rating: details?.rating ?? found?.rating ?? null,
      user_ratings_total: details?.user_ratings_total ?? found?.user_ratings_total ?? null,
      opening_hours: details?.opening_hours ?? null,
      types: details?.types ?? null,
      input,
      source: "google-places"
    });
  } catch (err) {
    console.error("resolve error", err);
    return res.status(500).json({ ok: false, error: "resolve_failed" });
  }
});
