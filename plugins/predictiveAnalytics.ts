import type { AIInsight, DashboardData } from '@/types/ai';
const sma = (arr: number[], n = 3) =>
  arr.length >= n ? arr.slice(-n).reduce((sum, x) => sum + x, 0) / n : null;

export default function predictiveAnalytics(data: DashboardData): { insights: AIInsight[] } {
  const avg = sma(data.dailyVolume ?? []);
  if (!avg) return { insights: [] };
  return {
    insights: [
      {
        id: 'volume-forecast',
        title: 'Next Week Volume Forecast',
        description: `Projected ~${Math.round(avg)} inquiries. Prepare staffing and campaigns.`,
        severity: 'info',
      },
    ],
  };
}
