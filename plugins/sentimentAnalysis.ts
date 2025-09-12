import type { AIInsight, DashboardData } from '@/types/ai';

export default function sentimentAnalysis(data: DashboardData): { insights: AIInsight[] } {
  const neg = data.sentiment?.negativePct ?? 0;
  if (neg >= 0.15) {
    const percent = Math.round(neg * 100);
    return {
      insights: [
        {
          id: 'sentiment-down',
          title: 'Customer Sentiment Declining',
          description: `${percent}% negative sentiment detected. Review dialogues/scripts.`,
          severity: 'danger',
        },
      ],
    };
  }
  return { insights: [] };
}
