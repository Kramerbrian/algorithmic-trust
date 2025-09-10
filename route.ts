import { NextRequest } from 'next/server';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const channel = 'mystery:updates';

  if (url && token) {
    const upstream = await fetch(`${url}/subscribe/${encodeURIComponent(channel)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!upstream.ok || !upstream.body) {
      return new Response('Upstream subscribe failed', { status: 502 });
    }
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`event: ready\ndata: "no-upstash"\n\n`));
      const iv = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`));
      }, 15000);
      // @ts-ignore
      stream.iv = iv;
    },
    cancel() {
      // @ts-ignore
      clearInterval(stream.iv);
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
