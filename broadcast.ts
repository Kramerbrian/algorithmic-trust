export async function broadcastUpdate(payload: any) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  const channel = 'mystery:updates';
  const msg = encodeURIComponent(JSON.stringify(payload));
  const res = await fetch(`${url}/publish/${encodeURIComponent(channel)}/${msg}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}
