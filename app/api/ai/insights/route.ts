import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DashboardData, AIInsight } from '@/types/ai';
import competitiveAnalysis from '@/plugins/competitiveAnalysis';
import predictiveAnalytics from '@/plugins/predictiveAnalytics';
import opportunityDetection from '@/plugins/opportunityDetection';
import sentimentAnalysis from '@/plugins/sentimentAnalysis';

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  let insights: AIInsight[] = [];
  const plugins = [competitiveAnalysis, predictiveAnalytics, opportunityDetection, sentimentAnalysis];
  plugins.forEach((plugin) => {
    insights = insights.concat(plugin(data as DashboardData));
  });
  return NextResponse.json({ insights });
}
