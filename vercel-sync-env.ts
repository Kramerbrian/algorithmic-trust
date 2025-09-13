import process from "node:process";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const API = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env`;

const TARGETS = ["production", "preview", "development"] as const;
const KEYS = [
  "DATABASE_URL","DIRECT_URL","NEXT_PUBLIC_SUPABASE_URL","SUPABASE_SERVICE_KEY",
  "OPENAI_API_KEY","SENDGRID_API_KEY","TWILIO_ACCOUNT_SID","TWILIO_AUTH_TOKEN","TWILIO_PHONE_NUMBER",
  "ONESIGNAL_API_KEY","ONESIGNAL_APP_ID","WEBHOOK_SECRET","GOOGLE_ANALYTICS_ID","MIXPANEL_TOKEN",
  "AWS_S3_BUCKET","AWS_ACCESS_KEY_ID","AWS_SECRET_ACCESS_KEY","AWS_REGION",
  "ENABLE_REAL_TIME_UPDATES","ENABLE_AI_ANALYSIS","ENABLE_SMS_NOTIFICATIONS",
  "UPSTASH_REDIS_REST_URL","UPSTASH_REDIS_REST_TOKEN","NEXTAUTH_URL","NEXTAUTH_SECRET"
];

async function upsert(name: string, value: string) {
  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ key: name, value, target: TARGETS, type: "encrypted" })
  });
  if (res.ok) return;
  const txt = await res.text();
  if (!txt.includes("already exists")) {
    console.error(`Failed to set ${name}: ${txt}`);
    process.exit(1);
  }
}

(async () => {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.error("VERCEL_TOKEN or VERCEL_PROJECT_ID missing"); process.exit(1);
  }
  for (const k of KEYS) {
    const v = process.env[k];
    if (v && String(v).length) await upsert(k, String(v));
  }
  console.log("Vercel env sync complete.");
})();
