import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const SECRET = process.env.APPROVAL_WEBHOOK_SECRET!;

// minimal Supabase/Postgres client; replace with your helper
async function callEnqueueRPC(p: any) {
  const res = await fetch(process.env.DB_RPC_URL! + "/enqueue_priority_job", {
    method: "POST",
    headers: { "Content-Type": "application/json", apiKey: process.env.DB_SERVICE_ROLE_KEY! },
    body: JSON.stringify(p),
  });
  if (!res.ok) throw new Error(`RPC failed: ${res.status}`);
  return res.json();
}

function ok<T>(data: T, status = 200) { return NextResponse.json(data, { status }); }
function bad(reason: string, status = 400) { return NextResponse.json({ error: reason }, { status }); }

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-signature");
  if (!sig) return bad("missing signature", 401);

  const mac = crypto.createHmac("sha256", SECRET).update(raw, "utf8").digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(mac))) {
    return bad("invalid signature", 401);
  }

  let p: any;
  try { p = JSON.parse(raw); } catch { return bad("invalid json"); }

  // Basic shape guard
  if (!p.suggestionId || !p.action || !p.platform || !p.actor) return bad("missing fields");
  if (p.action === "modify" && (typeof p.newPriority !== "number")) return bad("newPriority required");

  // Create deduped job atomically via RPC (also flips suggestion if implemented there).
  try {
    const jobId = await callEnqueueRPC({
      suggestionId: p.suggestionId,
      action: p.action,
      platform: p.platform,
      newPriority: p.newPriority ?? 0,
      reason: p.reason ?? null,
      actor: p.actor
    });
    return ok({ jobId });
  } catch (e: any) {
    return bad(e?.message || "enqueue error", 500);
  }
}
