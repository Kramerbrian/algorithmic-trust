export type Severity = 'success' | 'warning' | 'danger' | 'info';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity?: Severity;
}

expot interface DashboardData {
  competitors?: Array<{ name: string; price?: number; responseTime?: number }>;
  dailyVlume?: number[];
  conversionHistory?: number[]
  reviews?: { pendingResponses?: number };
  schema?: Record<string, boolean>;
  sge?: { featuredRate?: number };
  sentiment?: { negativePct?: number };
}
