
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, TrendingUp, Eye, Search, Shield, Brain, Target,
  BarChart3, RefreshCw, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

/** -------------------------------------------------------------
 * DealershipAI Dashboard (v2) — Preview Build
 * - TypeScript, ARIA-friendly, keyboard navigable tabs
 * - UI primitives (Card, Badge, Pill, Modal)
 * - MetricCard component + Skeletons
 * - Debounced URL input + validation
 * - LocalStorage persistence (tier, dealership)
 * - Preview overlays with auto-dismiss
 * - No live API calls (stubbed functions only)
 * --------------------------------------------------------------*/

type Severity = "Critical" | "High" | "Medium" | "Low";
type Priority = "P0" | "P1" | "P2" | "P3";

type Threat = {
  category: "AI Search" | "Zero-Click" | "UGC/Reviews" | "Local SEO";
  severity: Severity;
  impact: string;
  description: string;
};

type AIPlatformKey = "chatgpt" | "claude" | "gemini" | "perplexity" | "copilot" | "grok";

type DashboardState = {
  riskScore: number;
  monthlyLossRisk: number;
  aiVisibilityScore: number;
  invisiblePercentage: number;
  marketPosition: number;
  totalCompetitors: number;
  sovPercentage: number;
  threats: Threat[];
  aiPlatformScores: Record<AIPlatformKey, number>;
};

type Recommendation = {
  priority: Priority;
  category: string;
  task: string;
  impact: "High" | "Medium" | "Low";
  effort: string;
  roiScore: number;
};

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>{children}</div>
);

const SectionHeader: React.FC<{ title: string; onToggle?: () => void; expanded?: boolean }> = ({ title, onToggle, expanded }) => (
  <div
    className="flex items-center justify-between p-6 cursor-pointer select-none"
    onClick={onToggle}
    role={onToggle ? "button" : undefined}
    aria-expanded={expanded}
  >
    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
    {onToggle && (expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />)}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`px-2 py-1 rounded-full text-xs border border-slate-600 bg-slate-700 text-slate-200 ${className}`}>{children}</span>
);

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-700/60 rounded ${className}`} />
);

type MetricCardProps = {
  title: string;
  value: React.ReactNode;
  change?: number | null;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
};
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, footer, isLoading }) => (
  <Card className="p-6 hover:bg-slate-750 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 rounded-lg bg-slate-700">{icon}</div>
      {typeof change === "number" && (
        <div className={`flex items-center text-sm ${change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-slate-400"}`}>
          {change === 0 ? "0%" : `${Math.abs(change)}%`}
        </div>
      )}
    </div>
    <div className="space-y-1">
      {isLoading ? <Skeleton className="h-8 w-28" /> : <p className="text-2xl font-bold text-slate-100">{value}</p>}
      <p className="text-sm text-slate-400">{title}</p>
      {footer && <div className="pt-2">{footer}</div>}
    </div>
  </Card>
);

/* ------------------------ Main ------------------------ */
const initialDashboard: DashboardState = {
  riskScore: 73,
  monthlyLossRisk: 47250,
  aiVisibilityScore: 34,
  invisiblePercentage: 78,
  marketPosition: 7,
  totalCompetitors: 12,
  sovPercentage: 12.3,
  threats: [
    { category: "AI Search", severity: "Critical", impact: "$18,750/month", description: "Invisible in 82% of ChatGPT searches for local Toyota dealers" },
    { category: "Zero-Click", severity: "High", impact: "$12,400/month", description: "Missing from Google SGE results for 67% of relevant queries" },
    { category: "UGC/Reviews", severity: "High", impact: "$9,100/month", description: "Poor review response rate (23%) vs competitors (78%)" },
    { category: "Local SEO", severity: "Medium", impact: "$7,000/month", description: "Not in top 3 map pack for primary keywords 43% of the time" }
  ],
  aiPlatformScores: { chatgpt: 28, claude: 31, gemini: 42, perplexity: 29, copilot: 35, grok: 25 }
};

const DealershipAIDashboard: React.FC = () => {
  const [userTier, setUserTier] = useState<"Level 1" | "Level 2" | "Level 3">("Level 1");
  const [selectedDealership, setSelectedDealership] = useState("Toyota of Naples");
  const [selectedLocation, setSelectedLocation] = useState("Naples, FL");
  const [dealershipUrl, setDealershipUrl] = useState("https://toyotaofnaples.com");

  const [activeTab, setActiveTab] = useState<
    "risk-assessment" | "ai-analysis" | "website-health" | "schema-audit" | "reviews" | "mystery-shop" | "predictive" | "competitor"
  >("risk-assessment");
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [expanded, setExpanded] = useState({ threats: true, aiVisibility: true, recommendations: true });

  const [dashboard] = useState<DashboardState>(initialDashboard);

  const recommendations: Recommendation[] = [
    { priority: "P0", category: "AI Optimization", task: "Implement AutoDealer & FAQ structured data", impact: "High", effort: "2–3 days", roiScore: 94 },
    { priority: "P1", category: "Review Management", task: "Activate automated review responses", impact: "High", effort: "1 day", roiScore: 88 },
    { priority: "P1", category: "Content Strategy", task: "AI-optimized FAQ section for zero-click", impact: "Medium", effort: "3–5 days", roiScore: 82 }
  ];

  const refresh = useCallback(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setLastRefresh(new Date());
      setLoading(false);
    }, 900);
    return () => clearTimeout(id);
  }, []);

  const tabs = [
    { id: "risk-assessment", label: "Risk Assessment", icon: AlertTriangle },
    { id: "ai-analysis", label: "AI Intelligence", icon: Brain },
    { id: "website-health", label: "Website Health", icon: Search, locked: userTier === "Level 1", preview: true },
    { id: "schema-audit", label: "Schema Audit", icon: Search, locked: userTier === "Level 1", preview: true },
    { id: "reviews", label: "Review Hub", icon: BarChart3, preview: true },
    { id: "mystery-shop", label: "Mystery Shop", icon: Eye, locked: userTier === "Level 1" },
    { id: "predictive", label: "Predictive", icon: TrendingUp, locked: userTier === "Level 1" },
    { id: "competitor", label: "Competitor Intel", icon: Target, locked: userTier === "Level 1" }
  ] as const;

  const handleTabClick = (tabId: typeof activeTab, locked?: boolean, previewable?: boolean) => {
    if (!locked) {
      setActiveTab(tabId);
    } else if (previewable && userTier === "Level 1") {
      // no-op preview toast in minimal build
      alert("Preview – unlock in Level 2/3");
    }
  };

  const scoreColor = (score: number) => (score >= 70 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-900 border-b border-slate-700 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg grid place-items-center font-bold">dAI</div>
              <div>
                <h1 className="text-xl font-bold">dealershipAI</h1>
                <div className="text-xs text-slate-400">Algorithmic Trust Dashboard</div>
              </div>
              <div className="hidden md:flex items-center gap-3 pl-4 ml-4 border-l border-slate-700">
                <div className="text-sm text-slate-300">{selectedDealership} • {selectedLocation}</div>
                <button onClick={() => alert('Demo: Switch Dealership')} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-600">
                  Switch Dealership
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                aria-label="Subscription level"
                value={userTier}
                onChange={(e) => setUserTier(e.target.value as any)}
                className="text-sm border border-slate-600 bg-slate-800 text-slate-200 rounded-lg px-3 py-2"
              >
                <option value="Level 1">Level 1 (Free)</option>
                <option value="Level 2">Level 2 ($599/mo)</option>
                <option value="Level 3">Level 3 ($999/mo)</option>
              </select>

              <button
                onClick={refresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>

              <div className="text-xs text-slate-400">Updated: {lastRefresh.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-slate-800 border-b border-slate-700" role="tablist" aria-label="Dashboard sections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((t) => {
              const Icon = t.icon as any;
              const isActive = activeTab === (t.id as any);
              const locked = (t as any).locked;
              const previewable = (t as any).preview;
              return (
                <button
                  key={t.id as string}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => handleTabClick(t.id as any, locked, previewable)}
                  className={`flex items-center gap-2 py-4 px-4 font-medium text-sm transition-colors rounded-t
                    ${isActive ? "border-b-2 border-blue-500 text-blue-400 bg-slate-700" :
                      locked && !previewable ? "text-slate-500 cursor-not-allowed" :
                        "text-slate-300 hover:text-slate-100 hover:bg-slate-700"}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{(t as any).label}</span>
                  {locked && !previewable && <span className="text-xs bg-slate-600 px-2 py-1 rounded">🔒</span>}
                  {previewable && userTier === "Level 1" && <span className="text-xs bg-blue-600 px-2 py-1 rounded">👁️</span>}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-900">
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-semibold">{selectedDealership}</div>
                <div className="text-sm text-slate-400">{selectedLocation}</div>
              </div>
              <div className="h-8 w-px bg-slate-600" />
              <div>
                <div className="text-sm text-slate-400">Website</div>
                <a href={dealershipUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <span className="truncate max-w-[220px]">{dealershipUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="text-xs text-slate-500">Last analysis: {lastRefresh.toLocaleString()}</div>
          </div>
        </Card>

        {activeTab === "risk-assessment" && (
          <div className="space-y-8" id="panel-risk-assessment" role="tabpanel" aria-labelledby="risk-assessment-tab">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-100">Critical Revenue Risk Detected</h3>
                  <p className="text-red-200 mt-1">
                    You're invisible to <strong>{dashboard.invisiblePercentage}%</strong> of AI car shoppers. The average dealership is pacing to lose{" "}
                    <strong>${dashboard.monthlyLossRisk.toLocaleString()}/month</strong> due to AI blindness.
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Algorithmic Trust Score" value={`${dashboard.riskScore}/100`} change={-12} icon={<Shield className="w-6 h-6 text-blue-400" />} />
              <MetricCard title="Revenue at Risk" value={`$${(dashboard.monthlyLossRisk / 1000).toFixed(0)}k/mo`} change={8} icon={<BarChart3 className="w-6 h-6 text-red-400" />} />
              <MetricCard title="AI Visibility Score" value={`${dashboard.aiVisibilityScore}%`} change={-23} icon={<Brain className="w-6 h-6 text-purple-400" />} />
              <MetricCard title="Market Position" value={`#${dashboard.marketPosition} of ${dashboard.totalCompetitors}`} icon={<Target className="w-6 h-6 text-orange-400" />} />
            </div>

            <Card>
              <SectionHeader
                title="AI Platform Visibility Scores"
                onToggle={() => setExpanded((e) => ({ ...e, aiVisibility: !e.aiVisibility }))}
                expanded={expanded.aiVisibility}
              />
              {expanded.aiVisibility && (
                <div className="border-t border-slate-700 p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(dashboard.aiPlatformScores).map(([platform, score]) => (
                    <div key={platform} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{platform}</span>
                        <span className={`text-xl font-bold ${scoreColor(score)}`}>{score}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                        <div className={`${score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"} h-2 rounded-full`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <SectionHeader
                title="Actionable Recommendations"
                onToggle={() => setExpanded((e) => ({ ...e, recommendations: !e.recommendations }))}
                expanded={expanded.recommendations}
              />
              {expanded.recommendations && (
                <div className="border-t border-slate-700 p-6 space-y-4">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Pill>{rec.priority}</Pill>
                            <span className="text-sm text-slate-400">{rec.category}</span>
                          </div>
                          <p className="font-semibold">{rec.task}</p>
                          <p className="text-sm text-slate-400 mt-1">Effort: {rec.effort}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-400">ROI: {rec.roiScore}%</div>
                          <div className={`text-sm ${rec.impact === "High" ? "text-red-400" : rec.impact === "Medium" ? "text-yellow-400" : "text-green-400"}`}>{rec.impact} Impact</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "ai-analysis" && (
          <div className="space-y-8" id="panel-ai-analysis" role="tabpanel">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <h3 className="text-lg font-semibold mb-4">AI Search Health Report</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-red-900 rounded-lg border border-red-700">
                    <div>
                      <h4 className="font-semibold text-red-200">ChatGPT Visibility</h4>
                      <p className="text-sm text-red-300">Mentioned in only 28% of relevant searches</p>
                    </div>
                    <div className="text-2xl font-bold text-red-400">28%</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-900 rounded-lg border border-yellow-700">
                    <div>
                      <h4 className="font-semibold text-yellow-200">Gemini Performance</h4>
                      <p className="text-sm text-yellow-300">Best performing AI platform</p>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">42%</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-900 rounded-lg border border-blue-700">
                    <div>
                      <h4 className="font-semibold text-blue-200">Overall AI Score</h4>
                      <p className="text-sm text-blue-300">Composite across all platforms</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">32%</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Live AI Query Testing (Simulated)</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter custom query to test"
                    className="w-full border border-slate-600 bg-slate-700 text-slate-200 rounded-md px-3 py-2 text-sm"
                  />
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Test Live Query</button>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <h4 className="font-semibold mb-2">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Queries Today:</span><span className="font-semibold">247</span></div>
                    <div className="flex justify_between"><span className="text-slate-400">Success Rate:</span><span className="font-semibold">94.2%</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Avg Response Time:</span><span className="font-semibold">1.3s</span></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DealershipAIDashboard;
