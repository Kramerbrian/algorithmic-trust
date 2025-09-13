import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simple configuration
const PLANS = ['AWARENESS', 'DIY GUIDE', 'DONE-FOR-YOU'];
const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'ai-health', label: 'AI Health', icon: '🤖' },
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'tools', label: 'Tools', icon: '🛠️' }
];

// Streamlined components
const ScoreCard = ({ title, subtitle, score, color, metrics, onClick }) => (
  <div className={`bg-gradient-to-br ${color.bg} border ${color.border} rounded-xl p-6 cursor-pointer hover:opacity-90 transition-opacity`} onClick={onClick}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 ${color.icon} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
        {title.split(' ').map(w => w[0]).join('')}
      </div>
      <div>
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
    
    <div className="text-center mb-4">
      <div className={`text-3xl font-bold ${color.text} mb-2`}>{score.toFixed(1)}</div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color.bar} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 text-xs">
      {Object.entries(metrics).slice(0, 4).map(([key, value]) => (
        <div key={key} className="bg-gray-800/50 rounded p-2">
          <div className="text-gray-400">{key.replace(/([A-Z])/g, ' $1')}</div>
          <div className="text-white font-medium">{typeof value === 'number' ? value : value}</div>
        </div>
      ))}
    </div>
  </div>
);

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

export default function DealershipDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [planLevel, setPlanLevel] = useState(2);
  
  const [metrics, setMetrics] = useState({
    seo: { score: 87.3, coreWebVitals: 78, localSerpPack: 92, schemaCoverage: 85, contentFresh: 76 },
    aeo: { score: 73.6, aiMentions: 99, citationStability: 82, sentimentScore: 76, entityBreadth: 74 },
    geo: { score: 81.4, aigvr: 76, marketShare: 18.7, footTraffic: 234, aecr: 12.3 },
    revenue: 367000,
    aiConfidence: 92,
    mysteryScore: 73,
    leadScore: 87
  });

  const revenueData = [
    { day: 'Mon', value: 45000, target: 42000 },
    { day: 'Tue', value: 52000, target: 48000 },
    { day: 'Wed', value: 48000, target: 50000 },
    { day: 'Thu', value: 61000, target: 55000 },
    { day: 'Fri', value: 58000, target: 60000 },
    { day: 'Sat', value: 72000, target: 65000 },
    { day: 'Sun', value: 31000, target: 35000 }
  ];

  const colors = {
    seo: { 
      bg: 'from-blue-900/20 to-blue-800/10', 
      border: 'border-blue-800/50', 
      text: 'text-blue-400', 
      bar: 'bg-blue-500',
      icon: 'bg-blue-600'
    },
    aeo: { 
      bg: 'from-purple-900/20 to-purple-800/10', 
      border: 'border-purple-800/50', 
      text: 'text-purple-400', 
      bar: 'bg-purple-500',
      icon: 'bg-purple-600'
    },
    geo: { 
      bg: 'from-green-900/20 to-green-800/10', 
      border: 'border-green-800/50', 
      text: 'text-green-400', 
      bar: 'bg-green-500',
      icon: 'bg-green-600'
    }
  };

  // Simple real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        seo: { ...prev.seo, score: Math.min(100, Math.max(70, prev.seo.score + (Math.random() - 0.5) * 2)) },
        aeo: { ...prev.aeo, score: Math.min(100, Math.max(60, prev.aeo.score + (Math.random() - 0.5) * 1.5)) },
        geo: { ...prev.geo, score: Math.min(100, Math.max(65, prev.geo.score + (Math.random() - 0.5) * 1.8)) },
        aiConfidence: Math.min(100, Math.max(85, prev.aiConfidence + (Math.random() - 0.5) * 2))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        {/* Primary Score Cards */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <ScoreCard 
              title="Search Engine Optimization"
              subtitle="Traditional search visibility"
              score={metrics.seo.score}
              color={colors.seo}
              metrics={metrics.seo}
              onClick={() => setActiveTab('website')}
            />
          </div>
          <div className="flex-1">
            <ScoreCard 
              title="Answer Engine Optimization"
              subtitle="AI-powered search visibility"
              score={metrics.aeo.score}
              color={colors.aeo}
              metrics={metrics.aeo}
              onClick={() => setActiveTab('ai-health')}
            />
          </div>
          <div className="flex-1">
            <ScoreCard 
              title="Generative Engine Optimization"
              subtitle="Local AI & location visibility"
              score={metrics.geo.score}
              color={colors.geo}
              metrics={metrics.geo}
              onClick={() => setActiveTab('tools')}
            />
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">AI Data Sources</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['SerpApi', 'Semrush', 'Otterly AI', 'Nozzle.ai', 'Addlly GEO'].map((source) => (
              <div key={source} className="bg-gray-800/50 rounded p-3 text-center">
                <div className="text-white text-sm font-medium">{source}</div>
                <div className="text-xs text-green-400 mt-1">Active</div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Revenue at Risk" value={`$${Math.round(metrics.revenue/1000)}K`} icon="💰" trend="+$45K this month" />
          <MetricCard title="AI Confidence" value={`${Math.round(metrics.aiConfidence)}%`} icon="🧠" trend="Multi-platform active" />
          <MetricCard title="Mystery Score" value={metrics.mysteryScore} icon="🛡️" trend="12 active shops" locked={planLevel < 3} />
          <MetricCard title="Lead Quality" value={`${Math.round(metrics.leadScore)}%`} icon="🎯" trend="+3.2% this quarter" />
        </div>

        {/* Charts */}
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
              {[
                { name: 'Organic Search', value: 45, color: '#0ea5e9' },
                { name: 'Direct', value: 28, color: '#22c55e' },
                { name: 'AI Platforms', value: 18, color: '#f59e0b' },
                { name: 'Social', value: 9, color: '#8b5cf6' }
              ].map(source => (
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
      {/* Simplified Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                dAI
              </div>
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
      
      {/* Simplified Navigation */}
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
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}