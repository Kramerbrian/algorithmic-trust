import type { AIInsight, DashboardData } from '@/types/ai';

export default function opportunityDetection(data: DashboardData): { insights: AIInsight[] } {
  const insights: AIInsight[] = [];

  if ((data.reviews?.pendingResponses ?? 0) > 0) {
    insights.push({
      id: 'reviews',
      title: 'Reviews Need Responses',
      description: 'Reply to all pending reviews within 24 hours.',
      severity: 'warning',
    });
  }

  const missingSchemas = ['AutoDealer', 'Product', 'FAQ', 'Review'].filter(
    (type) => !data.schema?.[type]
  );

  if (missingSchemas.length > 0) {
    insights.push({
      id: 'schema-gaps',
      title: 'Schema Coverage Gaps',
      description: `Missing: ${missingSchemas.join(', ')} schema. Add JSON-LD.`,
      severity: 'warning',
    });
  }

  return { insights };
}
