import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/*
 * This variant of the dashboard hooks into the multi‑agent architecture rather
 * than relying on randomised metrics. On a regular interval the client
 * triggers a simulated multi‑agent analysis and updates the KPI cards and
 * charts based on those results. In a production environment this could be
 * replaced with real agent calls to your backend.
 */

// Configuration
const PLANS = ['AWARENESS', 'DIY GUIDE', 'DONE-FOR-YOU'];
const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'ai-health', label: 'AI Health', icon: '🤖' },
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'tools', label: 'Tools', icon: '🛠️' }
];

// Helper to simulate multi‑agent results. In place of API calls this
// function returns deterministic values reminiscent of the server‑side
// `generateFinalAnalysis` and `generateMockAgentData` in the orchestrator UI.
function runMultiAgentSimulation() {
  // Mock search/SEO agent
  const seoAgent = {
    mentions: 67 + (Math.random() * 10 - 5),
    citations: 23 + (Math.random() * 6 - 3),
    sentiment: 82 + (Math.random() * 6 - 3),
    contentReadiness: 78 + (Math.random() * 6 - 3),
    shareOfVoice: 15.2 + (Math.random() * 2 - 1)
  };
  // Mock AI/Answer agent
  const aeoAgent = {
    mentions: 99 + (Math.random() * 12 - 6),
    citations: 76 + (Math.random() * 10 - 5),
    sentiment: 76 + (Math.random() * 8 - 4),
    contentReadiness: 65 + (Math.random() * 10 - 5),
    shareOfVoice: 8.7 + (Math.random() * 2 - 1)
  };
  // Mock generative/geo agent
  const geoAgent = {
    mentions: 45 + (Math.random() * 6 - 3),
    citations: 31 + (Math.random() * 4 - 2),
    sentiment: 84 + (Math.random() * 4 - 2),
    contentReadiness: 72 + (Math.random() * 6 - 3),
    shareOfVoice: 12.4 + (Math.random() * 2 - 1)
  };
  // Mock analysis agent for revenue and confidence
  const revenueAtRisk = 367000 + (Math.random() * 20000 - 10000);
  const aiConfidence = 90 + (Math.random() * 6 - 3);
  const mysteryScore = 70 + (Math.random() * 10 - 5);
  const leadScore = 85 + (Math.random() * 6 - 3);
  return { seoAgent, aeoAgent, geoAgent, revenueAtRisk, aiConfidence, mysteryScore, leadScore };
}

// Main Dashboard Component
export default function DealershipDashboardMultiAgent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [planLevel, setPlanLevel] = useState(2);
  const [metrics, setMetrics] = useState({
    seo: { mentions: 67, citations: 23, sentiment: 82, contentReadiness: 78, shareOfVoice: 15.2 },
    aeo: { mentions: 99, citations: 76, sentiment: 76, contentReadiness: 65, shareOfVoice: 8.7 },
    geo: { mentions: 45, citations: 31, sentiment: 84, contentReadiness: 72, shareOfVoice: 12.4 },
    revenue: 367000,
    aiConfidence: 92,
    mysteryScore: 73,
    leadScore: 87
  });

  // Chart data remains static for demonstration. In a real app you could
  // derive these from agent results as well.
  const revenueData = [
    { day: 'Mon', value: 45000, target: 42000 },
    { day: 'Tue', value: 52000, target: 48000 },
    { day: 'Wed', value: 48000, target: 50000 },
    { day: 'Thu', value: 61000, target: 55000 },
    { day: 'Fri', value: 58000, target: 60000 },
    { day: 'Sat', value: 72000, target: 65000 },
    { day: 'Sun', value: 31000, target: 35000 }
  ];

  const trafficSources = [
    { name: 'Organic Search', value: 45, color: '#0ea5e9' },
    { name: 'Direct', value: 28, color: '#22c55e' },
    { name: 'AI Platforms', value: 18, color: '#f59e0b' },
    { name: 'Social', value: 9, color: '#8b5cf6' }
  ];

  // Colour schemes
  const colors = {
    seo: { bg: 'from-blue-900/20 to-blue-800/10', border: 'border-blue-800/50', text: 'text-blue-400', icon: 'bg-blue-600' },
    aeo: { bg: 'from-purple-900/20 to-purple-800/10', border: 'border-purple-800/50', text: 'text-purple-400', icon: 'bg-purple-600' },
    geo: { bg: 'from-green-900/20 to-green-800/10', border: 'border-green-800/50', text: 'text-green-400', icon: 'bg-green-600' }
  };

  // Run the multi‑agent simulation periodically to refresh metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const { seoAgent, aeoAgent, geoAgent, revenueAtRisk, aiConfidence, mysteryScore, leadScore } = runMultiAgentSimulation();
      setMetrics(prev => ({
        ...prev,
        seo: seoAgent,
        aeo: aeoAgent,
        geo: geoAgent,
        revenue: revenueAtRisk,
        aiConfidence: aiConfidence,
        mysteryScore: mysteryScore,
        leadScore: leadScore
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Score Card and Metric Card components unchanged from the provided dashboard
  const ScoreCard = ({ title, subtitle, color, metrics, onClick, type }) => {
    const calculateVisibilityScore = (metrics, type) => {
      try {
        if (!metrics || !type) return '0.0';
        const weights = {
          seo: { mentions: 0.20, citations: 0.25, sentiment: 0.15, contentReadiness: 0.25, shareOfVoice: 0.15 },
          aeo: { mentions: 0.30, citations: 0.35, sentiment: 0.10, contentReadiness: 0.15, shareOfVoice: 0.10 },
          geo: { mentions: 0.25, citations: 0.30, sentiment: 0.20, contentReadiness: 0.15, shareOfVoice: 0.10 }
        };
        const w = weights[type] || weights.seo;
        const mentions = Number(metrics.mentions) || 0;
        const citations = Number(metrics.citations) || 0;
        const sentiment = Number(metrics.sentiment) || 0;
        const contentReadiness = Number(metrics.contentReadiness) || 0;
        const shareOfVoice = Number(metrics.shareOfVoice) || 0;
        const score = (
          (mentions / 100) * w.mentions +
          (citations / 100) * w.citations +
          (sentiment / 100) * w.sentiment +
          (contentReadiness / 100) * w.contentReadiness +
          (shareOfVoice / 100) * w.shareOfVoice
        ) * 100;
        if (!Number.isFinite(score)) return '0.0';
        return Math.min(100, Math.max(0, score)).toFixed(1);
      } catch (error) {
        return '0.0';
      }
    };
    const safeFormat = (value, decimals = 0) => {
      try {
        const num = Number(value);
        if (!Number.isFinite(num)) return '0';
        return decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
      } catch {
        return '0';
      }
    };
    const visibilityScore = calculateVisibilityScore(metrics, type);
    return (
      <div className={`bg-gradient-to-br ${color.bg} border ${color.border} rounded-xl p-6 cursor-pointer hover:opacity-90 transition-opacity`} onClick={onClick}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${color.icon} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
              {title.split(' ').map(w => w[0]).join('')}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{title}</h3>
              <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
          </div>
          <div className={`text-2xl font-bold ${color.text}`}>{visibilityScore}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="bg-gray-800/50 rounded p-2">
            <div className="text-gray-400">AI Mentions</div>
            <div className="text-white font-medium">{safeFormat(metrics?.mentions)}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <div className="text-gray-400">Citations</div>
            <div className="text-white font-medium">{safeFormat(metrics?.citations)}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <div className="text-gray-400">Sentiment</div>
            <div className="text-white font-medium">{safeFormat(metrics?.sentiment)}%</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <div className="text-gray-400">Share of Voice</div>
            <div className="text-white font-medium">{safeFormat(metrics?.shareOfVoice, 1)}%</div>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {type === 'seo' && 'Traditional search visibility & technical performance'}
          {type === 'aeo' && 'Featured in AI overviews & voice responses'}
          {type === 'geo' && 'Cited by ChatGPT, Gemini, Perplexity & Claude'}
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value, icon, trend, locked }) => (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-4 ${locked ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{trend}</div>
    </div>
  );

  const renderContent = () => {
    if (activeTab !== 'overview') {
      return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h2 className="text-xl font-bold mb-2">{TABS.find(t => t.id === activeTab)?.label}</h2>
          <p className="text-gray-400">Coming soon</p>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <ScoreCard title="Search Engine Optimization" subtitle="Traditional search visibility" color={colors.seo} metrics={metrics.seo} type="seo" onClick={() => setActiveTab('website')} />
          </div>
          <div className="flex-1">
            <ScoreCard title="Answer Engine Optimization" subtitle="AI-powered search visibility" color={colors.aeo} metrics={metrics.aeo} type="aeo" onClick={() => setActiveTab('ai-health')} />
          </div>
          <div className="flex-1">
            <ScoreCard title="Generative Engine Optimization" subtitle="Local AI & location visibility" color={colors.geo} metrics={metrics.geo} type="geo" onClick={() => setActiveTab('tools')} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Revenue at Risk" value={`$${Math.round((metrics.revenue || 367000)/1000)}K`} icon="💰" trend="+$45K this month" />
          <MetricCard title="AI Confidence" value={`${Math.round(metrics.aiConfidence || 92)}%`} icon="🧠" trend="Multi-platform active" />
          <MetricCard title="Mystery Score" value={metrics.mysteryScore || 73} icon="🛡️" trend="12 active shops" locked={planLevel < 3} />
          <MetricCard title="Lead Quality" value={`${Math.round(metrics.leadScore || 87)}%`} icon="🎯" trend="+3.2% this quarter" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-medium mb-4">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={1} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-medium mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {trafficSources.map(source => (
                <div key={source.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">{source.name}</span>
                    <span className="text-sm text-white">{source.value}%</span>
                  </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${source.value}%`, backgroundColor: source.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">dAI</div>
              <div>
                <h1 className="text-xl font-bold text-white">DealershipAI</h1>
                <div className="text-xs text-gray-500">Algorithmic Trust Dashboard</div>
              </div>
              <div className="hidden md:flex items-center gap-3 ml-6 pl-6 border-l border-gray-700">
                <div className="text-sm">
                  <div className="text-gray-300">Premium Auto Dealership</div>
                  <div className="text-gray-500 text-xs">Cape Coral, FL</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs">
                <span className={`px-3 py-1 rounded-full font-medium ${
                  planLevel === 2 ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-400'
                }`}>
                  {PLANS[planLevel]}
                  {planLevel < 2 && (
                    <button onClick={() => setPlanLevel(prev => Math.min(2, prev + 1))} className="ml-2 underline opacity-75 hover:opacity-100">
                      Upgrade
                    </button>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 py-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-blue-900/50 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}