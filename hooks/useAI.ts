import { useState, useEffect } from 'react';
import { AIInsight, DashboardData } from '@/types/ai';

export function useAI(data: DashboardData | null) {
  const [insights, setInsights] = useState<AIInsight[] | null>(null);

  useEffect(() => {
    if (!data) return;
    const fetchInsights = async () => {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      setInsights(json.insights);
    };
    fetchInsights();
  }, [data]);

  return insights;
}
