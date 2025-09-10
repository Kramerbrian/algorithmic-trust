export type Unsubscribe = () => void;

export function connectSSE(onMessage: (data: any) => void): Unsubscribe {
  if (typeof window === 'undefined') return () => void 0;
  const es = new EventSource('/api/realtime/stream', { withCredentials: false });
  const handler = (e: MessageEvent) => {
    try { onMessage(JSON.parse(e.data)); } catch {}
  };
  es.addEventListener('message', handler);
  es.addEventListener('mystery:updates', handler);
  return () => es.close();
}
