/* Minimal stub worker: periodically triggers analyze webhook */
const url = process.env.ANALYZE_WEBHOOK_URL || "";
const dealer = process.env.WORKER_DEALER || "default";
const label = process.env.WORKER_DEALER_LABEL || "Default Dealer";

async function tick(){
  if(!url) {
    console.log("ANALYZE_WEBHOOK_URL not set; idle");
    return;
  }
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dealer, dealerLabel: label })
    });
    console.log("analyze:", resp.status);
  } catch (e) {
    console.error("worker error:", e?.message || e);
  }
}

setInterval(tick, Number(process.env.WORKER_INTERVAL_MS || 60000)); // 60s
tick();
