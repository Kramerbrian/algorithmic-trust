import type { AIInsight, DashboardData } from '@/types/ai';

export default function competitiveAnalysis(data: DashboardData): { insights: AIInsight[] } {
  const comps = data.competitors || [];
  if (!comps.length) return { insights: [] };
  const avg = comps.reduce((sum, c) => sum + (c.price || 0), 0) / comps.length || 0;
  const myPrice = data.competitors?.[0]?.price ?? 0;
  const delta = avg ? (avg - myPrice) / avg : 0;
  const pct = Math.round(delta * 1000) / 10;
  return {
    insights: [
      {
        id: 'price-adv',
        title: delta > 0 ? 'Price Advantage Detected' : 'Price Disadvantage Detected',
        description: `${delta > 0 ? 'Below' : 'Above'} market by ${Math.abs(pct)}%. Review pricing.`,
        severity: delta > 0 ? 'success' : 'warning',
      },
    ],
  };
}
