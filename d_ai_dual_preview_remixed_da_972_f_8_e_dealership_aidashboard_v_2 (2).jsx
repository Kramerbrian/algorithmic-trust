import React, { useState } from "react";
import {
  AlertTriangle, TrendingUp, TrendingDown, Eye, Search, Shield, Zap, Globe, Brain, Target,
  BarChart3, Clock, Users, DollarSign, ArrowUp, ArrowDown, RefreshCw, Settings, ChevronDown,
  ChevronUp, ExternalLink, Download
} from "lucide-react";

/******************************
 * Dual Preview Wrapper
 * - Left tab: remixed-da972f8e (placeholder until source is provided)
 * - Right tab: DealershipAIDashboard_v2 (full render below)
 ******************************/

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t font-medium text-sm transition-colors border-b-2
        ${active ? "border-blue-500 text-blue-400 bg-slate-800" : "border-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800"}`}
    >
      {children}
    </button>
  );
}

const RemixedDa972f8e: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-[60vh] border border-slate-700 rounded-b-lg rounded-tr-lg">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-5xl mb-4">🧩</div>
        <h2 className="text-2xl font-bold mb-2">remixed-da972f8e</h2>
        <p className="text-slate-300">
          I couldn’t load the source file in this environment. Paste the component code here (or re-upload) and I’ll render it beside the v2 dashboard instantly.
        </p>
        <div className="mt-6 grid gap-3 text-sm text-left bg-slate-800/70 rounded-lg p-4 border border-slate-700">
          <div className="font-semibold">How to show it here:</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Reply in chat with the full <code>remixed-da972f8e.tsx</code> component code.</li>
            <li>I’ll stitch it into this canvas as <code>RemixedDa972f8e</code> and re-render.</li>
            <li>We’ll keep both tabs for side-by-side evaluation.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

/*****************************************************
 * DealershipAIDashboard_v2 — pasted and lightly renamed
 * - Original default export renamed to DealershipAIDashboardV2
 * - No external network calls; UI/UX optimized version
 *****************************************************/

/** -------------------------------------------------------------
 * DealershipAI Dashboard (v2) — UX & UI optimized
 * - TypeScript, ARIA-friendly, keyboard navigable tabs
 * - UI primitives (Card, Badge, Pill, Modal)
 * - MetricCard component + Skeletons
 * - Debounced URL input + validation
 * - LocalStorage persistence (tier, dealership)
 * - Preview overlays with auto-dismiss
 * - No live API calls (stubbed functions only)
 * --------------------------------------------------------------*/

/* ------------------------ Types ------------------------ */

type Severity = "Critical" | "High" | "Medium" | "Low";

type Priority = "P0" | "P1" | "P2" | "P3";

type Threat = {
  category: "AI Search" | "Zero-Click" | "UGC/Reviews" | "Local SEO";
  severity: Severity;
  impact: string; // "$12,300/month"
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

type CoreWebVitals = {
  lcp: { value: number; score: number; status: "good" | "needs-improvement" | "poor" };
  inp: { value: number; score: number; status: "good" | "needs-improvement" | "poor" };
  cls: { value: number; score: number; status: "good" | "needs-improvement" | "poor" };
};

type WebsiteHealth = {
  overallScore: number;
  coreWebVitals: CoreWebVitals;
  seoScore: number;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  mobileFriendly: boolean;
  httpsEnabled: boolean;
  issues: { type: "Critical" | "High" | "Medium" | "Low"; description: string; impact: "High" | "Medium" | "Low" }[];
};

type SchemaAudit = {
  overallScore: number;
  totalSchemas: number;
  validSchemas: number;
  invalidSchemas: number;
  missingSchemas: number;
  detectedTypes: string[];
  missingTypes: string[];
  issues: { type: "Error" | "Warning"; field: string; description: string }[];
  lastAnalyzed?: Date;
};

type ReviewItem = {
  platform: string;
  rating: number;
  date: string;
  text: string;
  responded: boolean;
  sentiment: "positive" | "negative" | "neutral";
};

type ReviewHub = {
  overallRating: number;
  totalReviews: number;
  responseRate: number;
  avgResponseTime: string; // human readable
  sentimentScore: number; // 0-100
  monthlyGrowth: number; // %
  platforms: Record<string, any>;
  recentReviews: ReviewItem[];
  keywordAnalysis: { keyword: string; mentions: number; sentiment: number; trend: "up" | "down" | "stable" }[];
};

type Predictive = {
  riskTrend: "increasing" | "decreasing" | "stable";
  confidenceLevel: number;
  forecastPeriod: string;
  predictions: Record<string, { current: number; predicted: number; change: number; confidence: number }>;
  anomalies: { metric: string; detected: string; severity: Severity; description: string }[];
  insights: { priority: "Critical" | "High" | "Medium"; insight: string; action: string }[];
};

type Competitor = {
  name: string;
  aiScore: number;
  monthlyTraffic: number;
  marketShare: number;
};

type CompetitorIntel = {
  marketAnalysis: {
    totalCompetitors: number;
    marketLeader: string;
    yourRank: number;
    marketShare: number;
    growthRate: number;
  };
  competitors: Competitor[];
  battleplan: {
    priority: Priority;
    target: string;
    strategy: string;
    tactic: string;
    timeline: string;
    expectedImpact: string;
  }[];
};

/* --------------------- UI Primitives --------------------- */
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

const Badge: React.FC<{ tone?: "default" | "info" | "success" | "warn" | "danger"; children: React.ReactNode; className?: string }> = ({
  tone = "default",
  children,
  className = ""
}) => {
  const tones: Record<string, string> = {
    default: "bg-slate-700 text-slate-200 border-slate-600",
    info: "bg-blue-900 text-blue-200 border-blue-700",
    success: "bg-green-900 text-green-200 border-green-700",
    warn: "bg-yellow-900 text-yellow-200 border-yellow-700",
    danger: "bg-red-900 text-red-200 border-red-700"
  };
  return <span className={`px-2 py-1 text-xs rounded-full border ${tones[tone]} ${className}`}>{children}</span>;
};

const Pill: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`px-2 py-1 rounded-full text-xs border border-slate-600 bg-slate-700 text-slate-200 ${className}`}>{children}</span>
);

const Modal: React.FC<{ title: string; open: boolean; onClose: () => void; children: React.ReactNode; maxWidth?: string }> = ({
  title,
  open,
  onClose,
  children,
  maxWidth = "max-w-4xl"
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-800 rounded-lg w-full ${maxWidth} border border-slate-700`}>
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px=6 py-4 flex justify-between items-center px-6">
          <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-200 text-2xl">✕</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-700/60 rounded ${className}`} />
);

/* -------------------- Helpers / Utils -------------------- */
const useLocalStorage = <T,>(key: string, initial: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState] as const;
};

const useDebouncedValue = <T,>(value: T, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

const isValidUrl = (u: string) => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(u || "");

const severityTone = (s: Severity) =>
  s === "Critical" ? "danger" : s === "High" ? "warn" : s === "Medium" ? "info" : "default";

const scoreColor = (score: number) => (score >= 70 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400");

/* -------------------- Metric Card -------------------- */

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
          {change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : change < 0 ? <ArrowDown className="w-4 h-4 mr-1" /> : null}
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

const DealershipAIDashboardV2: React.FC = () => {
  // Persistent user tier + selected dealership
  const [userTier, setUserTier] = useLocalStorage<"Level 1" | "Level 2" | "Level 3">("dAI:tier", "Level 1");
  const [selectedDealership, setSelectedDealership] = useLocalStorage("dAI:dealer", "Toyota of Naples");
  const [selectedLocation, setSelectedLocation] = useLocalStorage("dAI:loc", "Naples, FL");
  const [dealershipUrl, setDealershipUrl] = useLocalStorage("dAI:url", "https://toyotaofnaples.com");

  // UX state
  const [activeTab, setActiveTab] = useState<
    "risk-assessment" | "ai-analysis" | "website-health" | "schema-audit" | "reviews" | "mystery-shop" | "predictive" | "competitor"
  >("risk-assessment");
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [expanded, setExpanded] = useState({ threats: true, aiVisibility: true, recommendations: true });
  const [showDealershipModal, setShowDealershipModal] = useState(false);
  const [preview, setPreview] = useState<{ websiteHealth: boolean; schemaAudit: boolean; reviewHub: boolean }>({
    websiteHealth: false, schemaAudit: false, reviewHub: false
  });

  // Data
  const [dashboard, setDashboard] = useState<DashboardState>(initialDashboard);

  const [recommendations] = useState<Recommendation[]>([
    { priority: "P0", category: "AI Optimization", task: "Implement AutoDealer & FAQ structured data", impact: "High", effort: "2–3 days", roiScore: 94 },
    { priority: "P1", category: "Review Management", task: "Activate automated review responses", impact: "High", effort: "1 day", roiScore: 88 },
    { priority: "P1", category: "Content Strategy", task: "AI-optimized FAQ section for zero-click", impact: "Medium", effort: "3–5 days", roiScore: 82 }
  ]);

  const websiteHealth: WebsiteHealth = React.useMemo(() => ({
    overallScore: 67,
    coreWebVitals: {
      lcp: { value: 3.2, score: 45, status: "needs-improvement" },
      inp: { value: 285, score: 72, status: "good" },
      cls: { value: 0.18, score: 38, status: "poor" }
    },
    seoScore: 74,
    performanceScore: 58,
    accessibilityScore: 89,
    bestPracticesScore: 81,
    mobileFriendly: true,
    httpsEnabled: true,
    issues: [
      { type: "Critical", description: "Large Contentful Paint exceeds 3.0s", impact: "High" },
      { type: "High", description: "Cumulative Layout Shift causes instability", impact: "High" },
      { type: "Medium", description: "Missing alt text on 12 images", impact: "Medium" },
      { type: "Low", description: "3 HTTP requests could be compressed", impact: "Low" }
    ]
  }), []);

  const schemaAudit: SchemaAudit = React.useMemo(() => ({
    overallScore: 52,
    totalSchemas: 8,
    validSchemas: 6,
    invalidSchemas: 2,
    missingSchemas: 7,
    detectedTypes: ["Organization", "LocalBusiness", "WebSite", "BreadcrumbList", "Product", "Review"],
    missingTypes: ["AutoDealer", "Car", "Offer", "OpeningHours", "ContactPoint", "AggregateRating", "FAQ"],
    issues: [
      { type: "Error", field: "priceRange", description: "Missing required priceRange in LocalBusiness" },
      { type: "Error", field: "openingHours", description: "Invalid openingHours format" },
      { type: "Warning", field: "address", description: "Incomplete address (missing postalCode)" },
      { type: "Warning", field: "telephone", description: "Phone not in international format" }
    ]
  }), []);

  const reviewHub: ReviewHub = React.useMemo(() => ({
    overallRating: 4.2,
    totalReviews: 847,
    responseRate: 23,
    avgResponseTime: "3.2 days",
    sentimentScore: 74,
    monthlyGrowth: -8,
    platforms: {
      google: { rating: 4.3, reviews: 342, responseRate: 45, newThisMonth: 28, trend: "up" },
      yelp: { rating: 3.9, reviews: 156, responseRate: 12, newThisMonth: 8, trend: "down" },
      dealerRater: { rating: 4.5, reviews: 234, responseRate: 18, newThisMonth: 15, trend: "stable" },
      reddit: { mentions: 23, sentiment: 0.6, discussions: 12, newThisMonth: 4, trend: "up" },
      facebook: { rating: 4.1, reviews: 92, responseRate: 8, newThisMonth: 3, trend: "down" }
    },
    recentReviews: [
      { platform: "Google", rating: 5, date: "2 hours ago", text: "Excellent service! Mike helped me find the perfect Camry...", responded: false, sentiment: "positive" },
      { platform: "Yelp", rating: 2, date: "5 hours ago", text: "Waited too long for service, staff seemed overwhelmed...", responded: false, sentiment: "negative" },
      { platform: "DealerRater", rating: 5, date: "8 hours ago", text: "Best Toyota dealership in Southwest Florida! Great prices...", responded: true, sentiment: "positive" },
      { platform: "Google", rating: 1, date: "1 day ago", text: "Terrible experience with financing department...", responded: false, sentiment: "negative" }
    ],
    keywordAnalysis: [
      { keyword: "service", mentions: 156, sentiment: 0.7, trend: "up" },
      { keyword: "staff", mentions: 134, sentiment: 0.8, trend: "stable" },
      { keyword: "price", mentions: 98, sentiment: 0.4, trend: "down" },
      { keyword: "quality", mentions: 87, sentiment: 0.9, trend: "up" }
    ]
  }), []);

  const competitorIntel: CompetitorIntel = React.useMemo(() => ({
    marketAnalysis: { totalCompetitors: 12, marketLeader: "Germain Toyota", yourRank: 7, marketShare: 12.3, growthRate: -2.1 },
    competitors: [
      { name: "Toyota of Fort Myers", aiScore: 67, monthlyTraffic: 12400, marketShare: 18.5 },
      { name: "Germain Toyota", aiScore: 72, monthlyTraffic: 15200, marketShare: 22.1 },
      { name: "Toyota of Sarasota", aiScore: 58, monthlyTraffic: 9800, marketShare: 14.7 }
    ],
    battleplan: [
      { priority: "P0", target: "Germain Toyota", strategy: "AI Visibility Attack", tactic: "AutoDealer + FAQ schema", timeline: "2 weeks", expectedImpact: "Gain 15–20 visibility points" },
      { priority: "P1", target: "Toyota of Fort Myers", strategy: "Review Superiority", tactic: "24/7 review responses", timeline: "1 week", expectedImpact: "Response rate 23% → 80%" },
      { priority: "P1", target: "All", strategy: "Performance Advantage", tactic: "Improve Core Web Vitals", timeline: "3 weeks", expectedImpact: "Rank #7 → #4" }
    ]
  }), []);

  // Modals
  const [revenueThreat, setRevenueThreat] = useState<Threat | null>(null);

  // Debounced URL input (edit in modal)
  const [tmpDealer, setTmpDealer] = useState("");
  const [tmpLoc, setTmpLoc] = useState("");
  const [tmpUrl, setTmpUrl] = useState("");
  const debouncedUrl = useDebouncedValue(tmpUrl, 400);
  const urlValid = React.useMemo(() => isValidUrl(debouncedUrl), [debouncedUrl]);

  // Refresh stub
  const refresh = React.useCallback(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setLastRefresh(new Date());
      setLoading(false);
    }, 900);
    return () => clearTimeout(id);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        refresh();
      }
    };
    window.addEventListener("keydown", handler as any);
    return () => window.removeEventListener("keydown", handler as any);
  }, [refresh]);

  // Tab list (accessible)
  const tabs = React.useMemo(
    () => [
      { id: "risk-assessment", label: "Risk Assessment", icon: AlertTriangle },
      { id: "ai-analysis", label: "AI Intelligence", icon: Brain },
      { id: "website-health", label: "Website Health", icon: Globe, locked: userTier === "Level 1", preview: true },
      { id: "schema-audit", label: "Schema Audit", icon: Search, locked: userTier === "Level 1", preview: true },
      { id: "reviews", label: "Review Hub", icon: Users, preview: true },
      { id: "mystery-shop", label: "Mystery Shop", icon: Eye, locked: userTier === "Level 1" },
      { id: "predictive", label: "Predictive", icon: TrendingUp, locked: userTier === "Level 1" },
      { id: "competitor", label: "Competitor Intel", icon: Target, locked: userTier === "Level 1" }
    ] as const,
    [userTier]
  );

  const handleTabClick = (tabId: typeof activeTab, locked?: boolean, previewable?: boolean) => {
    if (!locked) {
      setActiveTab(tabId);
    } else if (previewable && userTier === "Level 1") {
      setPreview((p) => ({ ...p, [tabId.replace("-", "") as keyof typeof p]: true }));
      setTimeout(() => setPreview((p) => ({ ...p, [tabId.replace("-", "") as keyof typeof p]: false })), 20000);
    }
  };

  const severityClass = (s: Severity) =>
    s === "Critical" ? "text-red-300 bg-red-900 border-red-700"
      : s === "High" ? "text-orange-300 bg-orange-900 border-orange-700"
      : s === "Medium" ? "text-yellow-300 bg-yellow-900 border-yellow-700"
      : "text-slate-300 bg-slate-800 border-slate-600";

  const statusColor = (score: number) => (score >= 70 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
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
                <button onClick={() => {
                  setTmpDealer(selectedDealership);
                  setTmpLoc(selectedLocation);
                  setTmpUrl(dealershipUrl);
                  setShowDealershipModal(true);
                }} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-600">
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

      {/* Tabs */}
      <nav className="bg-slate-800 border-b border-slate-700" role="tablist" aria-label="Dashboard sections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((t: any) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              const locked = t.locked;
              const previewable = t.preview;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => handleTabClick(t.id, locked, previewable)}
                  className={`flex items-center gap-2 py-4 px-4 font-medium text-sm transition-colors rounded-t
                    ${isActive ? "border-b-2 border-blue-500 text-blue-400 bg-slate-700" :
                      locked && !previewable ? "text-slate-500 cursor-not-allowed" :
                        "text-slate-300 hover:text-slate-100 hover:bg-slate-700"}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                  {locked && !previewable && <span className="text-xs bg-slate-600 px-2 py-1 rounded">🔒</span>}
                  {previewable && userTier === "Level 1" && <span className="text-xs bg-blue-600 px-2 py-1 rounded">👁️</span>}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-900">
        {/* Info bar */}
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
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500">Last analysis: {lastRefresh.toLocaleString()}</div>
              <button
                onClick={() => {
                  setTmpDealer(selectedDealership);
                  setTmpLoc(selectedLocation);
                  setTmpUrl(dealershipUrl);
                  setShowDealershipModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Change Dealership
              </button>
            </div>
          </div>
        </Card>

        {/* Panels */}
        {activeTab === "risk-assessment" && (
          <div className="space-y-8" id="panel-risk-assessment" role="tabpanel" aria-labelledby="risk-assessment-tab">
            {/* Alert */}
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

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Algorithmic Trust Score" value={`${dashboard.riskScore}/100`} change={-12} icon={<Shield className="w-6 h-6 text-blue-400" />} />
              <MetricCard title="Revenue at Risk" value={`$${(dashboard.monthlyLossRisk / 1000).toFixed(0)}k/mo`} change={8} icon={<DollarSign className="w-6 h-6 text-red-400" />} />
              <MetricCard title="AI Visibility Score" value={`${dashboard.aiVisibilityScore}%`} change={-23} icon={<Brain className="w-6 h-6 text-purple-400" />} />
              <MetricCard title="Market Position" value={`#${dashboard.marketPosition} of ${dashboard.totalCompetitors}`} icon={<Target className="w-6 h-6 text-orange-400" />} />
            </div>

            {/* Threats */}
            <Card>
              <SectionHeader
                title="Major Threats & Weaknesses"
                onToggle={() => setExpanded((e) => ({ ...e, threats: !e.threats }))}
                expanded={expanded.threats}
              />
              {expanded.threats && (
                <div className="border-t border-slate-700 p-6 space-y-4">
                  {dashboard.threats.map((t, i) => (
                    <div key={i} className={`border rounded-lg p-4 ${severityClass(t.severity)}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">{t.category}</span>
                            <Badge tone={severityTone(t.severity)}>{t.severity}</Badge>
                          </div>
                          <p className="text-sm text-slate-200/90">{t.description}</p>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => setRevenueThreat(t)}
                            className="font-bold text-lg hover:underline text-blue-400 hover:text-blue-300"
                          >
                            {t.impact}
                          </button>
                          <div className="text-xs text-slate-500">Monthly Impact</div>
                          <div className="text-xs text-blue-400 mt-1">Click for calculation</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Platform Visibility */}
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
                        <span className={`text-xl font-bold ${statusColor(score as number)}`}>{score}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                        <div className={`${(score as number) >= 70 ? "bg-green-500" : (score as number) >= 40 ? "bg-yellow-500" : "bg-red-500"} h-2 rounded-full`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recommendations */}
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

        {/* AI Analysis (trimmed UI) */}
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
                    <div className="flex justify-between"><span className="text-slate-400">Success Rate:</span><span className="font-semibold">94.2%</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Avg Response Time:</span><span className="font-semibold">1.3s</span></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Locked modules prompt for Level 1 */}
        {(activeTab === "website-health" || activeTab === "schema-audit" || activeTab === "mystery-shop" || activeTab === "predictive" || activeTab === "competitor") && userTier === "Level 1" && (
          <div className="text-center py-12" role="tabpanel">
            <div className="text-slate-500 mb-4"><BarChart3 className="w-16 h-16 mx-auto" /></div>
            <h3 className="text-lg font-semibold mb-2">
              {activeTab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Module
            </h3>
            <p className="text-slate-400 mb-4">This feature requires Level 2 or Level 3 access.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Upgrade to Access</button>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal title="Switch Dealership" open={showDealershipModal} onClose={() => setShowDealershipModal(false)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-1">
              <label className="text-sm text-slate-300">Dealership Name</label>
              <input value={tmpDealer} onChange={(e) => setTmpDealer(e.target.value)} className="w-full border border-slate-600 bg-slate-700 text-slate-200 rounded-md px-3 py-2" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="text-sm text-slate-300">Location</label>
              <input value={tmpLoc} onChange={(e) => setTmpLoc(e.target.value)} className="w-full border border-slate-600 bg-slate-700 text-slate-200 rounded-md px-3 py-2" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="text-sm text-slate-300">Website URL</label>
              <input
                value={tmpUrl}
                onChange={(e) => setTmpUrl(e.target.value)}
                className={`w-full border ${urlValid || !tmpUrl ? "border-slate-600" : "border-red-600"} bg-slate-700 text-slate-200 rounded-md px-3 py-2`}
                placeholder="https://exampletoyota.com"
              />
              {!urlValid && tmpUrl && <div className="text-xs text-red-400 mt-1">Enter a valid URL starting with http(s)://</div>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button onClick={() => setShowDealershipModal(false)} className="px-4 py-2 text-slate-300 border border-slate-600 rounded-md hover:bg-slate-700">
              Cancel
            </button>
            <button
              onClick={() => {
                setSelectedDealership(tmpDealer || selectedDealership);
                setSelectedLocation(tmpLoc || selectedLocation);
                if (urlValid && tmpUrl) setDealershipUrl(tmpUrl);
                setShowDealershipModal(false);
                refresh();
              }}
              disabled={!tmpDealer || !tmpLoc || (!!tmpUrl && !urlValid)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Switch Dealership
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title={revenueThreat ? `${revenueThreat.category} Revenue Impact` : "Revenue Impact"}
        open={!!revenueThreat}
        onClose={() => setRevenueThreat(null)}
      >
        {!revenueThreat ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="bg-red-900 border border-red-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h4 className="text-lg font-semibold text-red-200">Revenue Impact Summary</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{revenueThreat.impact}</div>
                  <div className="text-sm text-red-300">Monthly Loss</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    ${Math.round((parseFloat(revenueThreat.impact.replace(/[$,\/a-zA-Z]/g, "")) * 12) / 1000)}k
                  </div>
                  <div className="text-sm text-orange-300">Annual Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-300">{revenueThreat.severity}</div>
                  <div className="text-sm text-slate-400">Threat Level</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-200 mb-2">Methodology</h4>
              <p className="text-sm text-blue-100 leading-relaxed">
                Estimates are calculated from AI visibility, zero‑click presence, review influence, and local SEO posture.
                Attribution factors are conservative and weight channel share of influence.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Previews for Level 1 */}
      {preview.websiteHealth && (
        <Modal title="Website Health Preview (20 seconds)" open={true} onClose={() => setPreview((p) => ({ ...p, websiteHealth: false }))}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-red-400 mb-2">67/100</div><div className="text-sm text-slate-300">Health Score</div></Card>
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-red-400 mb-2">3.2s</div><div className="text-sm text-slate-300">Load Time</div></Card>
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-yellow-400 mb-2">58</div><div className="text-sm text-slate-300">Performance</div></Card>
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-red-400 mb-2">4</div><div className="text-sm text-slate-300">Critical Issues</div></Card>
          </div>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">Upgrade to Level 2 - Full Website Analysis</button>
          </div>
        </Modal>
      )}

      {preview.schemaAudit && (
        <Modal title="Schema Audit Preview (20 seconds)" open={true} onClose={() => setPreview((p) => ({ ...p, schemaAudit: false }))}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-red-400 mb-2">52/100</div><div className="text-sm text-slate-300">Schema Score</div></Card>
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-orange-400 mb-2">7</div><div className="text-sm text-slate-300">Missing Types</div></Card>
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-red-400 mb-2">2</div><div className="text-sm text-slate-300">Errors</div></Card>
            <Card className="p-4 text-center"><div className="text-2xl font-bold text-green-400 mb-2">6</div><div className="text-sm text-slate-300">Valid Schemas</div></Card>
          </div>
          <div className="mb-4">
            <div className="text-sm text-slate-300 mb-2">Missing Critical Automotive Schemas:</div>
            <div className="flex flex-wrap gap-2">
              {["AutoDealer", "Car", "Offer", "FAQ"].map((s) => (
                <span key={s} className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">Upgrade to Level 2 - Full Schema Analysis</button>
          </div>
        </Modal>
      )}

      {preview.reviewHub && (
        <Modal title="Review Hub Preview (20 seconds)" open={true} onClose={() => setPreview((p) => ({ ...p, reviewHub: false }))}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center"><div className="text-3xl font-bold text-blue-400 mb-2">4.2★</div><div className="text-sm text-slate-300">Overall Rating</div></Card>
            <Card className="p-4 text-center"><div className="text-3xl font-bold text-slate-100 mb-2">847</div><div className="text-sm text-slate-300">Total Reviews</div></Card>
            <Card className="p-4 text-center"><div className="text-3xl font-bold text-red-400 mb-2">23%</div><div className="text-sm text-slate-300">Response Rate</div></Card>
            <Card className="p-4 text-center"><div className="text-3xl font-bold text-green-400 mb-2">74%</div><div className="text-sm text-slate-300">Sentiment</div></Card>
          </div>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">Full Access Available Now - No Upgrade Required</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default function DualPreview() {
  const [tab, setTab] = useState<'remixed' | 'v2'>('v2');
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex gap-2 border-b border-slate-700">
          <TabButton active={tab === 'remixed'} onClick={() => setTab('remixed')}>remixed-da972f8e</TabButton>
          <TabButton active={tab === 'v2'} onClick={() => setTab('v2')}>DealershipAIDashboard_v2</TabButton>
        </div>
      </div>
      {tab === 'remixed' ? <RemixedDa972f8e /> : <DealershipAIDashboardV2 />}
    </div>
  );
}
