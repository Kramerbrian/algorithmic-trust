import { setTimeout as sleep } from "node:timers/promises";

const DB_URL = process.env.DB_URL!;
const HEADERS = { "Content-Type": "application/json", apiKey: process.env.DB_SERVICE_ROLE_KEY! };

async function listQueued(limit = 10) {
  const r = await fetch(`${DB_URL}/priority_jobs?status=eq.queued&order=created_at.asc&limit=${limit}`, { headers: HEADERS });
  if (!r.ok) throw new Error("list failed");
  return r.json();
}

async function mark(id: string, patch: any, prevStatus: string) {
  const r = await fetch(`${DB_URL}/priority_jobs?id=eq.${id}&status=eq.${prevStatus}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("mark failed");
}

async function applySideEffect(j: any) {
  if (j.action !== "reject") {
    // call your real priority override; must be idempotent
    await fetch(process.env.OPTIMIZER_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: j.platform, newPriority: j.new_priority }),
    });
  }
}

export async function runOnce() {
  const jobs = await listQueued();
  for (const j of jobs) {
    try {
      await mark(j.id, { status: "running" }, "queued");
      await applySideEffect(j);
      await mark(j.id, { status: "done", attempts: j.attempts + 1 }, "running");
    } catch (e: any) {
      const next = j.attempts + 1;
      await mark(
        j.id,
        {
          status: next >= 5 ? "error" : "queued",
          attempts: next,
          last_error: String(e?.message || e),
        },
        "running",
      );
    }
  }
}

async function loop() {
  for (;;) {
    await runOnce();
    await sleep(5000);
  }
}

if (require.main === module) loop();
