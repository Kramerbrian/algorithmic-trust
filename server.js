import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config();

import { resolveRouter } from "./resolve.js";
import { runAnalyze } from "./lib/analyze.js";
import { listScans, latestScan } from "./lib/supabase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// CORS allowlist
const ALLOW = (process.env.CORS_ALLOW_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => (!origin || !ALLOW.length || ALLOW.includes(origin)) ? cb(null, true) : cb(new Error("CORS blocked"))
}));

app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// Static tester
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// Health
app.get("/v1/healthz", (req, res) => {
  res.json({ ok: true, version: process.env.APP_VERSION || "dev" });
});

// Resolve
app.use("/v1", resolveRouter);

// Analyze
app.post("/v1/analyze", async (req, res) => {
  const dealer = (req.body?.dealer || "default").toString();
  const dealerLabel = (req.body?.dealerLabel || "Default Dealer").toString();
  try {
    const result = await runAnalyze({ dealer, dealerLabel });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e?.message || "analyze_failed" });
  }
});

// Scans
app.get("/v1/scans", async (req, res) => {
  const dealer = (req.query.dealer || "default").toString();
  const limit = Number(req.query.limit || 25);
  try {
    res.json(await listScans({ dealer_key: dealer, limit }));
  } catch (e) {
    res.status(500).json({ error: e?.message || "list_failed" });
  }
});

app.get("/v1/scans/latest", async (req, res) => {
  const dealer = (req.query.dealer || "default").toString();
  try {
    res.json({ row: await latestScan({ dealer_key: dealer }) });
  } catch (e) {
    res.status(500).json({ error: e?.message || "latest_failed" });
  }
});

const PORT = process.env.PORT || 3001;
createServer(app).listen(PORT, () => console.log(`API http://localhost:${PORT}`));
