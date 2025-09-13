import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// SSE Hook
const useSSE = (url) => {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('disconnected');
  const eventSourceRef = useRef(null);
  
  useEffect(() => {
    if (!url) return;
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;
    
    eventSource.onopen = () => setStatus('connected');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents(prev => [...prev, { ...data, timestamp: Date.now() }].slice(-100));
      } catch {
        setEvents(prev => [...prev, { data: event.data, timestamp: Date.now() }].slice(-100));
      }
    };
    
    eventSource.onerror = () => {
      setStatus('error');
      setTimeout(() => setStatus('reconnecting'), 3000);
    };
    
    return () => {
      eventSource.close();
      setStatus('disconnected');
    };
  }, [url]);
  
  return { events, status };
};

// Main Dashboard Component
export default function DealershipDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [planLevel, setPlanLevel] = useState(2); // 1=Basic, 2=Pro, 3=Enterprise
  const [previewTimers, setPreviewTimers] = useState({});
  const [showEEATModal, setShowEEATModal] = useState(null);
  const [showFixModal, setShowFixModal] = useState(null);
  const [dealerInfo, setDealerInfo] = useState({
    name: 'Premium Auto Dealership',
    location: 'Cape Coral, FL',
    website: 'https://premiumauto.com',
    phone: '(239) 555-0123'
  });
  
  const [metrics, setMetrics] = useState({
    revenueAtRisk: 367000,
    aiConfidence: 92,
    mysteryScore: 73,
    leadScore: 87,
    responseTime: 2.3,
    conversionRate: 3.8,
    overallAIScore: 85,
    websiteHealth: {
      performanceScore: 87,
      seoScore: 94,
      uptime: 99.8,
      responseTime: 245,
      securityGrade: 'A+',
      coreWebVitals: {
        lcp: { value: 2.1, score: 85, status: 'good' },
        inp: { value: 285, score: 65, status: 'needs-improvement' },
        cls: { value: 0.18, score: 35, status: 'poor' }
      },
      issues: {
        critical: 3,
        warnings: 7,
        info: 12
      }
    }
  });
  
  // SSE Integration (commented out for demo)
  // const { events, status } = useSSE(process.env.REACT_APP_SSE_URL);
  const events = useRef([]).current; // Mock for demo
  const status = 'connected'; // Mock for demo
  
  // Real-time monitoring data
  const [realtimeMetrics, setRealtimeMetrics] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 60 }, (_, i) => ({
      time: new Date(now - (59 - i) * 1000).toLocaleTimeString(),
      responseTime: 200 + Math.random() * 100,
      errorRate: Math.random() * 0.5,
      throughput: 80 + Math.random() * 40
    }));
  });
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        aiConfidence: Math.min(100, Math.max(85, prev.aiConfidence + (Math.random() - 0.5) * 2)),
        leadScore: Math.min(100, Math.max(80, prev.leadScore + (Math.random() - 0.5))),
        conversionRate: Math.max(0, prev.conversionRate + (Math.random() - 0.5) * 0.1)
      }));
      
      setRealtimeMetrics(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          responseTime: 200 + Math.random() * 100,
          errorRate: Math.random() * 0.5,
          throughput: 80 + Math.random() * 40
        };
        return [...prev.slice(1), newPoint];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Mock data for charts
  const revenueData = useMemo(() => [
    { day: 'Mon', value: 45000, target: 42000 },
    { day: 'Tue', value: 52000, target: 48000 },
    { day: 'Wed', value: 48000, target: 50000 },
    { day: 'Thu', value: 61000, target: 55000 },
    { day: 'Fri', value: 58000, target: 60000 },
    { day: 'Sat', value: 72000, target: 65000 },
    { day: 'Sun', value: 31000, target: 35000 }
  ], []);
  
  const trafficSources = useMemo(() => [
    { name: 'Organic Search', value: 45, color: '#0ea5e9' },
    { name: 'Direct', value: 28, color: '#22c55e' },
    { name: 'AI Platforms', value: 18, color: '#f59e0b' },
    { name: 'Social', value: 9, color: '#8b5cf6' }
  ], []);
  
  const aiPlatforms = useMemo(() => [
    { 
      name: 'ChatGPT', 
      status: 'visible', 
      coverage: 78, 
      trend: 'up', 
      change: '+5%',
      factors: {
        authority: 85,
        trust: 72,
        experience: 64,
        recency: 89,
        structure: 91
      },
      weights: {
        authority: 0.45,
        trust: 0.175,
        experience: 0.125,
        recency: 0.10,
        structure: 0.10
      },
      citations: 23,
      topGap: 'Experience content',
      gapImpact: '+12 pts'
    },
    { 
      name: 'Google Gemini', 
      status: 'partial', 
      coverage: 82, 
      trend: 'stable', 
      change: '±0%',
      factors: {
        authority: 78,
        trust: 88,
        experience: 71,
        recency: 85,
        structure: 89
      },
      weights: {
        authority: 0.35,
        trust: 0.275,
        experience: 0.175,
        recency: 0.125,
        structure: 0.075
      },
      citations: 31,
      topGap: 'Authority signals',
      gapImpact: '+8 pts'
    },
    { 
      name: 'Perplexity', 
      status: 'missing', 
      coverage: 65, 
      trend: 'down', 
      change: '-8%',
      factors: {
        authority: 71,
        trust: 82,
        experience: 45,
        recency: 78,
        structure: 68
      },
      weights: {
        authority: 0.20,
        trust: 0.275,
        experience: 0.375,
        recency: 0.125,
        structure: 0.025
      },
      citations: 12,
      topGap: 'Customer stories',
      gapImpact: '+18 pts'
    },
    { 
      name: 'Claude', 
      status: 'visible', 
      coverage: 74, 
      trend: 'up', 
      change: '+12%',
      factors: {
        authority: 88,
        trust: 69,
        experience: 58,
        recency: 83,
        structure: 86
      },
      weights: {
        authority: 0.45,
        trust: 0.20,
        experience: 0.15,
        recency: 0.10,
        structure: 0.10
      },
      citations: 18,
      topGap: 'Trust signals',
      gapImpact: '+9 pts'
    },
    { 
      name: 'Copilot', 
      status: 'partial', 
      coverage: 69, 
      trend: 'stable', 
      change: '+2%',
      factors: {
        authority: 73,
        trust: 76,
        experience: 67,
        recency: 91,
        structure: 72
      },
      weights: {
        authority: 0.30,
        trust: 0.25,
        experience: 0.25,
        recency: 0.15,
        structure: 0.05
      },
      citations: 15,
      topGap: 'Authority depth',
      gapImpact: '+11 pts'
    }
  ], []);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', minLevel: 1 },
    { id: 'ai-health', label: 'AI Search Health', icon: '🤖', minLevel: 1 },
    { id: 'website', label: 'Website Health', icon: '🌐', minLevel: 1 },
    { id: 'schema', label: 'Schema Audit', icon: '🔍', minLevel: 2 },
    { id: 'ugc-analysis', label: 'UGC Analysis', icon: '💬', minLevel: 2 },
    { id: 'reviews', label: 'Reviews Hub', icon: '⭐', minLevel: 2 },
    { id: 'mystery', label: 'Mystery Shop', icon: '🕵️', minLevel: 3 },
    { id: 'predictive', label: 'Predictive', icon: '🔮', minLevel: 3 },
    { id: 'geo-sge', label: 'GEO/SGE', icon: '🌐', minLevel: 3 }
  ];
  
  const planNames = {
    1: 'AWARENESS',
    2: 'DIY GUIDE', 
    3: 'DONE-FOR-YOU'
  };
  
  const planDescriptions = {
    1: 'See what\'s happening',
    2: 'Know exactly what to do',
    3: 'We implement it for you'
  };
  
  const isTabLocked = (minLevel) => planLevel < minLevel;
  
  // Handle preview functionality for locked features
  const startPreview = (featureId) => {
    if (previewTimers[featureId]) return; // Already previewing
    
    setPreviewTimers(prev => ({ ...prev, [featureId]: 20 }));
    
    const interval = setInterval(() => {
      setPreviewTimers(prev => {
        const newTime = (prev[featureId] || 0) - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          return { ...prev, [featureId]: 0 };
        }
        return { ...prev, [featureId]: newTime };
      });
    }, 1000);
  };
  
  const isPreviewActive = (featureId) => {
    return (previewTimers[featureId] || 0) > 0;
  };

  // Dealer Settings Modal
  const [showDealerModal, setShowDealerModal] = useState(false);
  const [tempDealerInfo, setTempDealerInfo] = useState(dealerInfo);

  const DealerSettingsModal = () => {
    if (!showDealerModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-xl font-semibold text-white">Dealership Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Dealership Name</label>
              <input 
                type="text" 
                value={tempDealerInfo.name}
                onChange={(e) => setTempDealerInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            {/* Website Health Quick Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Website Health Summary</h3>
                <button 
                  onClick={() => setActiveTab('website')}
                  className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm hover:bg-blue-900/70 transition-colors"
                >
                  View Details →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{metrics.websiteHealth.performanceScore}</div>
                  <div className="text-xs text-gray-400">Performance</div>
                  <div className={`text-xs mt-1 ${
                    metrics.websiteHealth.performanceScore >= 90 ? 'text-green-400' :
                    metrics.websiteHealth.performanceScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {metrics.websiteHealth.performanceScore >= 90 ? 'Excellent' :
                     metrics.websiteHealth.performanceScore >= 70 ? 'Good' : 'Needs Work'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{metrics.websiteHealth.seoScore}</div>
                  <div className="text-xs text-gray-400">SEO Score</div>
                  <div className="text-xs text-green-400 mt-1">Excellent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{metrics.websiteHealth.uptime}%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                  <div className="text-xs text-green-400 mt-1">Stable</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{metrics.websiteHealth.issues.critical}</div>
                  <div className="text-xs text-gray-400">Critical Issues</div>
                  <div className={`text-xs mt-1 ${
                    metrics.websiteHealth.issues.critical === 0 ? 'text-green-400' :
                    metrics.websiteHealth.issues.critical <= 2 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {metrics.websiteHealth.issues.critical === 0 ? 'None' :
                     metrics.websiteHealth.issues.critical <= 2 ? 'Few' : 'Action Needed'}
                  </div>
                </div>
              </div>
              
              {/* Core Web Vitals Mini Preview */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-3">Core Web Vitals Status</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      metrics.websiteHealth.coreWebVitals.lcp.status === 'good' ? 'bg-green-500' :
                      metrics.websiteHealth.coreWebVitals.lcp.status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-xs text-gray-400">LCP: {metrics.websiteHealth.coreWebVitals.lcp.value}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      metrics.websiteHealth.coreWebVitals.inp.status === 'good' ? 'bg-green-500' :
                      metrics.websiteHealth.coreWebVitals.inp.status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-xs text-gray-400">INP: {metrics.websiteHealth.coreWebVitals.inp.value}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      metrics.websiteHealth.coreWebVitals.cls.status === 'good' ? 'bg-green-500' :
                      metrics.websiteHealth.coreWebVitals.cls.status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-xs text-gray-400">CLS: {metrics.websiteHealth.coreWebVitals.cls.value}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Location</label>
              <input 
                type="text" 
                value={tempDealerInfo.location}
                onChange={(e) => setTempDealerInfo(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Website</label>
              <input 
                type="url" 
                value={tempDealerInfo.website}
                onChange={(e) => setTempDealerInfo(prev => ({ ...prev, website: e.target.value }))}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Phone</label>
              <input 
                type="tel" 
                value={tempDealerInfo.phone}
                onChange={(e) => setTempDealerInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="p-6 border-t border-gray-800 flex gap-3">
            <button 
              onClick={() => setShowDealerModal(false)}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                setDealerInfo(tempDealerInfo);
                setShowDealerModal(false);
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Fix Action Modal Component
  const FixActionModal = ({ gap, onClose }) => {
    if (!gap) return null;
    
    const fixPlans = {
      video: {
        title: 'Missing Video Content',
        impact: '-15 Experience Points',
        currentState: 'No video testimonials or walkthroughs on site',
        awareness: {
          description: 'Video content is missing from your site, impacting E-E-A-T scores.',
          insight: 'Sites with customer testimonial videos see 34% higher trust scores.'
        },
        diyGuide: {
          steps: [
            {
              title: 'Set Up Video Recording',
              tasks: [
                'Purchase basic video equipment (smartphone tripod, lapel mic - $200)',
                'Designate quiet recording area in showroom',
                'Create simple backdrop with dealership branding'
              ],
              time: '2 hours',
              cost: '$200',
              icon: '🎥'
            },
            {
              title: 'Record Customer Testimonials',
              tasks: [
                'Script 5 key questions for satisfied customers',
                'Record 10 testimonials (2 minutes each)',
                'Edit and upload to website testimonial section'
              ],
              time: '8 hours',
              cost: '$0',
              icon: '🎬'
            }
          ]
        },
        doneForYou: {
          description: 'Our video team will handle everything for you.',
          timeline: '2 weeks from project start',
          deliverables: [
            '15 professionally edited customer testimonial videos',
            'Video testimonial page with schema markup',
            'YouTube channel setup and optimization',
            'Monthly video content calendar'
          ]
        },
        expectedOutcome: 'Add 15 videos in 2 weeks, boost Experience score by 15 points'
      },
      'layout-shift': {
        title: 'Critical Layout Shift Issues',
        impact: 'CLS Score: 0.18 (Poor)',
        currentState: 'Significant layout instability affecting user experience and SEO',
        awareness: {
          description: 'Your CLS score of 0.18 is in the "Poor" range, hurting SEO rankings.',
          insight: 'Layout shifts cause 23% of users to abandon the page within 3 seconds.'
        },
        diyGuide: {
          steps: [
            {
              title: 'Fix Image Dimensions',
              tasks: [
                'Add explicit width and height attributes to all images',
                'Use aspect-ratio CSS property for responsive images',
                'Implement proper image placeholders and skeleton loading'
              ],
              time: '4 hours',
              cost: '$0',
              icon: '🖼️'
            },
            {
              title: 'Optimize Dynamic Content',
              tasks: [
                'Reserve space for ads and dynamic content blocks',
                'Preload web fonts to prevent FOIT/FOUT',
                'Use transform animations instead of layout-triggering properties'
              ],
              time: '6 hours',
              cost: '$0',
              icon: '⚡'
            },
            {
              title: 'Implement Content Stability',
              tasks: [
                'Use CSS containment for isolated layout areas',
                'Add proper loading states for async content',
                'Test and validate CLS improvements with real user monitoring'
              ],
              time: '3 hours',
              cost: '$0',
              icon: '📏'
            }
          ]
        },
        doneForYou: {
          description: 'Our development team will fix all CLS issues automatically.',
          timeline: '3 business days',
          deliverables: [
            'All images optimized with proper dimensions',
            'Dynamic content loading stabilized',
            'CLS score improved to < 0.1 (Good)',
            'Real user monitoring setup for ongoing tracking'
          ]
        },
        expectedOutcome: 'Reduce CLS to < 0.1 (Good), improve user experience, boost SEO rankings by 15-20%'
      }
    };
    
    const plan = fixPlans[gap];
    if (!plan) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{plan.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-red-900/50 text-red-400 rounded text-sm">
                    {plan.impact}
                  </span>
                  <span className="text-sm text-gray-400">{plan.currentState}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Awareness Level */}
            {planLevel >= 1 && (
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-blue-400 font-medium">What's Happening</h3>
                </div>
                <p className="text-sm text-gray-300 mb-2">{plan.awareness.description}</p>
                <p className="text-sm text-blue-300">{plan.awareness.insight}</p>
              </div>
            )}

            {/* DIY Guide Level */}
            {planLevel >= 2 && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🛠️</span>
                  <h3 className="text-green-400 font-medium">Step-by-Step Fix Guide</h3>
                </div>
                <div className="space-y-4">
                  {plan.diyGuide.steps.map((step, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{step.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-2">Step {index + 1}: {step.title}</h4>
                          <ul className="space-y-1">
                            {step.tasks.map((task, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span className="text-sm text-gray-400">{task}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>⏱️ {step.time}</span>
                            <span>💰 {step.cost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Done-For-You Level */}
            {planLevel >= 3 && (
              <div className="mb-6 p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🚀</span>
                  <h3 className="text-purple-400 font-medium">We'll Handle Everything</h3>
                </div>
                <p className="text-sm text-gray-300 mb-3">{plan.doneForYou.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-purple-300 mb-2">Timeline</h4>
                    <p className="text-sm text-gray-400">{plan.doneForYou.timeline}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-300 mb-2">What You Get</h4>
                    <ul className="space-y-1">
                      {plan.doneForYou.deliverables.map((item, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-purple-400 mt-1">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Expected Outcome */}
            <div className="p-4 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-800/50 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="text-cyan-400 font-medium">Expected Outcome</div>
                  <p className="text-sm text-gray-300 mt-1">{plan.expectedOutcome}</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              {planLevel === 1 && (
                <button 
                  onClick={() => setPlanLevel(2)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
                >
                  Get DIY Guide
                </button>
              )}
              {planLevel === 2 && (
                <button 
                  onClick={() => setPlanLevel(3)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Have Us Do It
                </button>
              )}
              {planLevel === 3 && (
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                  Schedule Implementation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // E-E-A-T Action Modal
  const EEATActionModal = ({ letter, onClose }) => {
    const actionPlans = {
      E: {
        title: 'Experience',
        score: 82,
        description: 'Demonstrating first-hand expertise and real-world knowledge',
        actions: [
          {
            title: 'Capture Customer Stories',
            description: 'Record 10 video testimonials from satisfied customers this week',
            impact: '+8 points',
            effort: '4 hours',
            icon: '📹'
          }
        ]
      }
    };
    
    const plan = actionPlans[letter];
    if (!plan) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{plan.score}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{plan.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {plan.actions.map((action, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{action.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">Step {index + 1}: {action.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors">
                Start Implementation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const MetricCard = ({ title, value, change, progress, locked = false, icon = '📈', featureId, onClick }) => {
    const isPreviewing = isPreviewActive(featureId);
    const canPreview = locked && !isPreviewing;
    
    return (
      <div 
        className={`bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all hover:border-gray-700 ${locked && !isPreviewing ? 'opacity-50 relative' : ''} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {locked && !isPreviewing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm text-gray-400 mb-1">
                {planLevel === 1 ? 'DIY Guide Required' : 'Done-For-You Required'}
              </div>
              <div className="text-xs text-gray-500">
                {planLevel === 1 ? 'Get step-by-step instructions' : 'One-click implementation'}
              </div>
              {canPreview && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    startPreview(featureId);
                  }}
                  className="mt-2 px-3 py-1 bg-purple-900/50 text-purple-400 rounded text-xs hover:bg-purple-900/70"
                >
                  Preview (20s)
                </button>
              )}
            </div>
          </div>
        )}
        {isPreviewing && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-purple-900/50 text-purple-400 rounded text-xs">
            Preview: {previewTimers[featureId]}s
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        {progress !== undefined && (
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {change && (
          <div className={`text-sm ${change.startsWith('+') ? 'text-green-500' : change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
            {change}
          </div>
        )}
      </div>
    );
  };
  
  const LiveFeed = ({ events }) => {
    const [feedItems, setFeedItems] = useState([
      { id: 1, type: 'success', message: 'ChatGPT visibility improved by 5%', time: '2 min ago' },
      { id: 2, type: 'warning', message: 'Response time exceeding target', time: '5 min ago' },
      { id: 3, type: 'info', message: 'New competitor detected in SERP', time: '12 min ago' }
    ]);
    
    useEffect(() => {
      const interval = setInterval(() => {
        const types = ['success', 'warning', 'info', 'danger'];
        const messages = [
          'AI confidence score updated',
          'New review detected on Google',
          'Schema validation completed',
          'Mystery shop report available',
          'Competitor price change detected',
          'Website performance improved',
          'New lead captured via ChatGPT',
          'Service appointment scheduled',
          'Inventory update completed'
        ];
        
        setFeedItems(prev => [{
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          time: 'just now'
        }, ...prev].slice(0, 10));
      }, 15000);
      
      return () => clearInterval(interval);
    }, []);
    
    const typeColors = {
      success: 'bg-green-900/50 border-green-800 text-green-400',
      warning: 'bg-yellow-900/50 border-yellow-800 text-yellow-400',
      info: 'bg-blue-900/50 border-blue-800 text-blue-400',
      danger: 'bg-red-900/50 border-red-800 text-red-400'
    };
    
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Live Intelligence Feed</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">{status}</span>
          </div>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {feedItems.map(item => (
            <div key={item.id} className={`p-3 rounded-lg border ${typeColors[item.type]} transition-all`}>
              <div className="flex justify-between items-start">
                <span className="text-sm">{item.message}</span>
                <span className="text-xs opacity-75 ml-2 whitespace-nowrap">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // GEO/SGE Section Component (NEW)
  const GeoSgeSection = () => {
    const [entityCovered, setEntityCovered] = useState(42);
    const [entityTotal] = useState(60);
    const [citationPotential, setCitationPotential] = useState(85);
    const [structuredHave, setStructuredHave] = useState(6);
    const [structuredTotal] = useState(15);
    
    const [entities, setEntities] = useState([
      { label: 'Auto Dealership', verified: true },
      { label: 'Auto Service', verified: true },
      { label: 'Oil Change', verified: false },
      { label: 'Brake Repair', verified: false },
      { label: 'Cape Coral', verified: true },
      { label: 'Tire Rotation', verified: false },
      { label: 'Vehicle Inspection', verified: false },
      { label: 'Certified Technicians', verified: false },
    ]);

    const toggleEntity = (i) =>
      setEntities(prev => prev.map((e, idx) => (idx === i ? { ...e, verified: !e.verified } : e)));

    const Badge = ({ tone, children }) => {
      const map = {
        high: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
        medium: "bg-amber-500/15 text-amber-300 border-amber-400/30",
        low: "bg-rose-500/15 text-rose-300 border-rose-400/30",
      };
      return <span className={`px-2 py-0.5 text-xs font-bold rounded-full border uppercase ${map[tone]}`}>{children}</span>;
    };

    const CheckItem = ({ status, title, desc, cta }) => {
      const dot = status === "complete" ? "bg-emerald-500" : status === "partial" ? "bg-amber-500" : "bg-rose-500";
      return (
        <li className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70 transition">
          <span className={`mt-0.5 h-5 w-5 rounded-full grid place-items-center text-xs text-white ${dot}`}>
            {status === "complete" ? "✓" : status === "partial" ? "!" : "✗"}
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="text-xs text-gray-400">{desc}</div>
            {cta && (
              <button className="mt-2 px-2.5 py-1.5 text-xs rounded bg-cyan-500 hover:bg-cyan-400 text-white">
                {cta}
              </button>
            )}
          </div>
        </li>
      );
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2">GEO/SGE Enhancement</h2>
          <p className="text-gray-400">Optimize for AI-driven search experiences & generative results</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">AI Overview Score</div>
              <Badge tone="high">Strong</Badge>
            </div>
            <div className="mt-2 text-3xl font-bold text-white">78%</div>
            <div className="text-xs text-emerald-300 mt-1">↑ +12% from last scan</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Entity Coverage</div>
              <Badge tone="medium">Moderate</Badge>
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {entityCovered}/{entityTotal}
            </div>
            <div className="text-xs text-gray-400 mt-1">{entityTotal - entityCovered} entities need optimization</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Citation Potential</div>
              <Badge tone="high">High</Badge>
            </div>
            <div className="mt-2 text-3xl font-bold text-cyan-300">{citationPotential}%</div>
            <div className="text-xs text-emerald-300 mt-1">Above industry average</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Structured Data</div>
              <Badge tone="low">Needs Work</Badge>
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {structuredHave}/{structuredTotal}
            </div>
            <div className="text-xs text-rose-300 mt-1">{structuredTotal - structuredHave} schema types missing</div>
          </div>
        </div>

        {/* Optimization sections */}
        <div className="grid grid-cols-1 gap-6">
          {/* Entity & KG */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Entity & Knowledge Graph Optimization</h3>
            <div className="grid gap-3">
              <ul className="grid gap-2">
                <CheckItem
                  status="complete"
                  title="Primary Business Entity Established"
                  desc="LocalBusiness schema implemented with full NAP data and service areas."
                />
                <CheckItem
                  status="partial"
                  title="Brand Entity Disambiguation"
                  desc="Missing sameAs connections to Wikipedia, Wikidata, and brand knowledge bases."
                  cta="Add Entity Links"
                />
                <CheckItem
                  status="missing"
                  title="Service Entity Markup"
                  desc="No AutoRepair or AutoDealer service schemas detected."
                  cta="Generate Schema"
                />
                <CheckItem
                  status="complete"
                  title="Staff & Expert Entities"
                  desc="5 Person schemas for service technicians with certifications."
                />
              </ul>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {entities.map((e, i) => (
                  <button
                    key={e.label + i}
                    onClick={() => toggleEntity(i)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold text-left transition-colors ${
                      e.verified ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30" : "bg-gray-800 text-gray-400 border border-gray-600"
                    }`}
                    title="Toggle verified"
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Priority Recommendations */}
          <div className="bg-gray-900 border border-amber-400/30 bg-amber-500/5 rounded-xl p-6">
            <div className="font-semibold mb-4 flex items-center gap-2 text-white">
              <span>⚡</span> Priority GEO/SGE Recommendations
            </div>
            <div className="grid gap-3">
              {[
                {
                  prio: "P0",
                  title: "Implement Complete Service Schema Suite",
                  desc: "Add AutoRepair, Service, and Offer schemas to all 15 service pages. This directly impacts AI understanding and citation potential.",
                },
                {
                  prio: "P0",
                  title: "Create AI-Optimized FAQ Hub",
                  desc: "Build comprehensive FAQ section with 50+ Q&As using FAQPage schema, targeting voice search and AI overview queries.",
                },
                {
                  prio: "P1",
                  title: "Enhance Entity Relationships",
                  desc: "Connect brand, location, and service entities through sameAs properties and knowledge graph optimization.",
                }
              ].map((r, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      r.prio === "P0" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                    }`}
                  >
                    {r.prio}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white">{r.title}</div>
                    <div className="text-xs text-gray-400">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-fuchsia-500 hover:shadow-lg text-white transition-all">
            <span>🚀</span> Run Full GEO/SGE Audit
          </button>
          <button className="px-4 py-2 rounded-lg border border-cyan-400/40 bg-gray-800 hover:bg-gray-700 text-white transition-colors">
            <span>📊</span> Export Enhancement Report
          </button>
          <button className="px-4 py-2 rounded-lg border border-cyan-400/40 bg-gray-800 hover:bg-gray-700 text-white transition-colors">
            <span>🔧</span> Generate All Schemas
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  dAI
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    DealershipAI
                  </h1>
                  <div className="text-xs text-gray-500">Algorithmic Trust Dashboard</div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-4 pl-4 ml-4 border-l border-gray-700">
                <div className="text-sm">
                  <div className="text-gray-300 font-medium">{dealerInfo.name}</div>
                  <div className="text-gray-500 text-xs">{dealerInfo.location}</div>
                </div>
                <button 
                  onClick={() => {
                    setTempDealerInfo(dealerInfo);
                    setShowDealerModal(true);
                  }}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-600 transition-colors"
                >
                  Edit Details
                </button>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  planLevel === 3 ? 'bg-purple-900/50 text-purple-400 border border-purple-800' :
                  planLevel === 2 ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                  'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {planNames[planLevel]}
                  {planLevel < 3 && (
                    <button 
                      onClick={() => setPlanLevel(prev => Math.min(3, prev + 1))}
                      className="ml-2 text-xs underline opacity-75 hover:opacity-100"
                    >
                      Upgrade
                    </button>
                  )}
                </span>
                <div className="text-xs text-gray-500 mt-1">{planDescriptions[planLevel]}</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live Monitoring</span>
              </div>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => !isTabLocked(tab.minLevel) && setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-900/50 text-blue-400 border border-blue-800'
                    : isTabLocked(tab.minLevel)
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                } ${isTabLocked(tab.minLevel) ? 'relative' : ''}`}
                disabled={isTabLocked(tab.minLevel)}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
                {isTabLocked(tab.minLevel) && (
                  <span className="ml-2 text-xs">🔒</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Revenue at Risk"
                value={`$${(metrics.revenueAtRisk / 1000).toFixed(0)}K`}
                change="+$45K from last analysis"
                progress={75}
                icon="💰"
                locked={planLevel < 3 && !isPreviewActive('revenue')}
                featureId="revenue"
              />
              <MetricCard
                title="AI Model Confidence"
                value={`${metrics.aiConfidence.toFixed(0)}%`}
                change="ChatGPT + Claude Active"
                progress={metrics.aiConfidence}
                icon="🧠"
              />
              <MetricCard
                title="Website Health"
                value={`${metrics.websiteHealth.performanceScore}/100`}
                change={`${metrics.websiteHealth.issues.critical} critical issues`}
                progress={metrics.websiteHealth.performanceScore}
                icon="🌐"
                onClick={() => setActiveTab('website')}
              />
              <MetricCard
                title="Mystery Shop Score"
                value={metrics.mysteryScore}
                change="12 active shops"
                progress={metrics.mysteryScore}
                icon="🛡️"
                locked={planLevel < 3 && !isPreviewActive('mystery')}
                featureId="mystery"
              />
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Weekly Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2} name="Actual" />
                    <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={1} strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Traffic Sources</h3>
                <div className="space-y-4">
                  {trafficSources.map(source => (
                    <div key={source.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                          <span className="text-sm text-gray-300">{source.name}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{source.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ 
                            width: `${source.value}%`,
                            backgroundColor: source.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Total Sessions</span>
                    <span className="text-white font-medium">12,847 this month</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Live Feed */}
            <LiveFeed events={events} />
          </div>
        )}
        
        {activeTab === 'ai-health' && (
          <div className="space-y-6">
            {/* Overall AI Health Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">AI Search Health Scoreboard</h3>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      73.6
                    </div>
                    <div className="text-xs text-gray-500">Weighted Average</div>
                  </div>
                  <button className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm hover:bg-blue-900/70 transition-colors">
                    Run Citation Audit
                  </button>
                </div>
              </div>
              
              {/* Platform Performance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {aiPlatforms.map(platform => {
                  // Calculate weighted score
                  const weightedScore = Math.round(
                    (platform.factors.authority * platform.weights.authority) +
                    (platform.factors.trust * platform.weights.trust) +
                    (platform.factors.experience * platform.weights.experience) +
                    (platform.factors.recency * platform.weights.recency) +
                    (platform.factors.structure * platform.weights.structure || 0)
                  );
                  
                  return (
                    <div key={platform.name} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium text-sm">{platform.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            platform.status === 'visible' ? 'bg-green-900/50 text-green-400' :
                            platform.status === 'partial' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {platform.citations} CITES
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl font-bold text-white">{weightedScore}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                weightedScore >= 80 ? 'bg-green-500' :
                                weightedScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${weightedScore}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {platform.trend === 'up' ? '↑' : platform.trend === 'down' ? '↓' : '→'} {platform.change}
                          </div>
                        </div>
                      </div>
                      
                      {/* Factor Breakdown */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Authority ({Math.round(platform.weights.authority * 100)}%)</span>
                          <span className={platform.factors.authority >= 80 ? 'text-green-400' : platform.factors.authority >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                            {platform.factors.authority}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Trust ({Math.round(platform.weights.trust * 100)}%)</span>
                          <span className={platform.factors.trust >= 80 ? 'text-green-400' : platform.factors.trust >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                            {platform.factors.trust}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Experience ({Math.round(platform.weights.experience * 100)}%)</span>
                          <span className={platform.factors.experience >= 80 ? 'text-green-400' : platform.factors.experience >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                            {platform.factors.experience}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-500">Top Gap</div>
                            <div className="text-xs text-red-400">{platform.topGap}</div>
                          </div>
                          <div className="text-xs text-green-400">{platform.gapImpact}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Citation Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Citation Performance</h3>
                <div className="space-y-4">
                  {aiPlatforms.map(platform => (
                    <div key={platform.name} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">{platform.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          platform.trend === 'up' ? 'bg-green-900/50 text-green-400' :
                          platform.trend === 'down' ? 'bg-red-900/50 text-red-400' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {platform.change}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{platform.citations}</div>
                        <div className="text-xs text-gray-500">citations/month</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-500">
                    Last audit: 3 days ago • Next: Jan 15
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Priority Optimization Queue</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-red-400 font-medium text-sm">Perplexity: Customer Stories</div>
                      <div className="text-green-400 text-xs">+18 pts</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">Add 15 detailed customer testimonials with outcomes</div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Impact: High (37.5% weight)</span>
                      <span>Effort: 12 hours</span>
                    </div>
                    {planLevel >= 2 && (
                      <div className="mt-2 pt-2 border-t border-red-800/30">
                        <div className="text-xs text-green-400">✓ Step-by-step guide available</div>
                      </div>
                    )}
                    {planLevel >= 3 && (
                      <button className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                        Auto-Generate Stories →
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-yellow-400 font-medium text-sm">ChatGPT: Authority Citations</div>
                      <div className="text-green-400 text-xs">+12 pts</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">Add 25 trade publication mentions and certifications</div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Impact: High (45% weight)</span>
                      <span>Effort: 8 hours</span>
                    </div>
                    {planLevel >= 3 && (
                      <button className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors">
                        Schedule Outreach →
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-blue-400 font-medium text-sm">Copilot: Experience Balance</div>
                      <div className="text-green-400 text-xs">+11 pts</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">Improve process documentation and case studies</div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Impact: Medium (25% weight)</span>
                      <span>Effort: 6 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Factor Analysis */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Factor Performance Analysis</h3>
                <div className="text-xs text-gray-500">
                  Scores weighted by platform importance • Last updated: 2 hours ago
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {['Authority', 'Trust', 'Experience', 'Recency', 'Structure'].map((factor, index) => {
                  const factorKey = factor.toLowerCase();
                  const avgScore = Math.round(
                    aiPlatforms.reduce((sum, platform) => sum + (platform.factors[factorKey] || 0), 0) / aiPlatforms.length
                  );
                  const highestPlatform = aiPlatforms.reduce((highest, platform) => 
                    (platform.factors[factorKey] || 0) > (highest.factors[factorKey] || 0) ? platform : highest
                  );
                  const lowestPlatform = aiPlatforms.reduce((lowest, platform) => 
                    (platform.factors[factorKey] || 100) < (lowest.factors[factorKey] || 100) ? platform : lowest
                  );
                  
                  return (
                    <div key={factor} className="p-4 bg-gray-800/30 rounded-lg">
                      <div className="text-white font-medium mb-2">{factor}</div>
                      <div className="text-2xl font-bold text-white mb-3">{avgScore}</div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            avgScore >= 80 ? 'bg-green-500' :
                            avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${avgScore}%` }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-green-400">Best:</span>
                          <span className="text-gray-300">{highestPlatform.name}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-red-400">Worst:</span>
                          <span className="text-gray-300">{lowestPlatform.name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* E-E-A-T Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">E-E-A-T Score Analysis</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    {metrics.overallAIScore}/100
                  </span>
                  <span className="text-xs text-gray-500">Overall Score</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { letter: 'E', title: 'Experience', score: 82, color: '#22C55E' },
                  { letter: 'E2', title: 'Expertise', score: 88, color: '#3B82F6' },
                  { letter: 'A', title: 'Authoritativeness', score: 79, color: '#F59E0B' },
                  { letter: 'T', title: 'Trustworthiness', score: 91, color: '#8B5CF6' }
                ].map((item) => (
                  <button 
                    key={item.letter}
                    onClick={() => setShowEEATModal(item.letter)}
                    className="group cursor-pointer text-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="relative inline-flex items-center justify-center mb-3">
                      <svg className="w-16 h-16">
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                        <circle 
                          cx="32" cy="32" r="28" 
                          stroke={item.color}
                          strokeWidth="4" 
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28 * (item.score/100)} ${2 * Math.PI * 28}`}
                          strokeLinecap="round"
                          transform="rotate(-90 32 32)"
                        />
                      </svg>
                      <div className="absolute">
                        <div className="text-lg font-bold text-white">{item.score}</div>
                      </div>
                    </div>
                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">Click for actions</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mystery' && (
          <div className="space-y-6">
            {/* Mystery Shop Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Mystery Shop Analysis</h2>
                  <p className="text-gray-400">Competitive intelligence and performance benchmarking</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">73</div>
                    <div className="text-xs text-gray-500">Overall Score</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
                    <div className="text-xs text-gray-500">Active Shops</div>
                  </div>
                  <button className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm hover:bg-blue-900/70 transition-colors">
                    Deploy New Shop
                  </button>
                </div>
              </div>

              {/* Performance Categories */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                {[
                  { category: 'Greeting', score: 85, target: 90, trend: 'up' },
                  { category: 'Product Knowledge', score: 68, target: 85, trend: 'down' },
                  { category: 'Needs Assessment', score: 79, target: 80, trend: 'up' },
                  { category: 'Presentation', score: 72, target: 85, trend: 'stable' },
                  { category: 'Close Attempt', score: 61, target: 75, trend: 'down' },
                  { category: 'Follow-up', score: 43, target: 70, trend: 'down' }
                ].map((cat, index) => (
                  <div key={cat.category} className={`p-4 rounded-lg border ${
                    cat.score >= cat.target ? 'bg-green-900/20 border-green-800/50' :
                    cat.score >= cat.target - 10 ? 'bg-yellow-900/20 border-yellow-800/50' :
                    'bg-red-900/20 border-red-800/50'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{cat.score}</div>
                      <div className="text-xs text-gray-400 mt-1">{cat.category}</div>
                      <div className="text-xs text-gray-500">Target: {cat.target}</div>
                      <div className={`text-xs mt-1 ${
                        cat.trend === 'up' ? 'text-green-400' :
                        cat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {cat.trend === 'up' ? '↗' : cat.trend === 'down' ? '↘' : '→'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Model Grid */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Per-Model Competitive Analysis</h3>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded">Performance Leader</span>
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded">Price Leader</span>
                  <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded">Lagging</span>
                </div>
              </div>

              {/* Awareness Level - Basic Grid */}
              {planLevel >= 1 && (
                <div className="space-y-6">
                  {/* Performance Scores */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Mystery Shop Performance Scores</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1000px]">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left text-white font-medium p-3 min-w-[120px]">Model Category</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Premium Auto<br/><span className="text-xs text-gray-400">(Us)</span></th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Terry Reid<br/>Hyundai</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">AutoNation<br/>Honda</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Germain<br/>Toyota</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Crown<br/>BMW</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Sunset<br/>Ford</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { 
                              model: 'Mid-Size Sedan', 
                              example: 'Camry LE / Accord LX / Sonata SE',
                              us: 73, 
                              competitors: [89, 76, 82, 68, 71],
                              competitorNames: ['Terry Reid', 'AutoNation', 'Germain', 'Crown', 'Sunset']
                            },
                            { 
                              model: 'Compact SUV', 
                              example: 'RAV4 LE / CR-V LX / Tucson SE',
                              us: 81, 
                              competitors: [77, 83, 79, 74, 78],
                              competitorNames: ['Terry Reid', 'AutoNation', 'Germain', 'Crown', 'Sunset']
                            },
                            { 
                              model: 'Full-Size Truck', 
                              example: 'F-150 Regular / Silverado WT / Tundra SR',
                              us: 69, 
                              competitors: [85, 72, 74, 67, 91],
                              competitorNames: ['Terry Reid', 'AutoNation', 'Germain', 'Crown', 'Sunset']
                            },
                            { 
                              model: 'Luxury Sedan', 
                              example: '3 Series 330i / A4 40 / G70 2.0T',
                              us: 78, 
                              competitors: [71, 68, 70, 88, 73],
                              competitorNames: ['Terry Reid', 'AutoNation', 'Germain', 'Crown', 'Sunset']
                            },
                            { 
                              model: '3-Row SUV', 
                              example: 'Pilot LX / Highlander L / Palisade SE',
                              us: 75, 
                              competitors: [82, 79, 84, 71, 76],
                              competitorNames: ['Terry Reid', 'AutoNation', 'Germain', 'Crown', 'Sunset']
                            }
                          ].map((row, index) => (
                            <tr key={row.model} className="border-b border-gray-800">
                              <td className="p-3">
                                <div>
                                  <div className="text-white font-medium text-sm">{row.model}</div>
                                  <div className="text-xs text-gray-400">{row.example}</div>
                                </div>
                              </td>
                              <td className="p-2 text-center">
                                <div className={`text-lg font-bold ${
                                  row.us >= Math.max(...row.competitors) ? 'text-green-400' :
                                  row.us >= Math.max(...row.competitors) - 5 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {row.us}
                                </div>
                                <div className="text-xs text-gray-400">Performance</div>
                              </td>
                              {row.competitors.map((score, i) => (
                                <td key={i} className="p-2 text-center">
                                  <div className={`text-lg font-bold ${
                                    score < row.us ? 'text-green-400' :
                                    score < row.us + 5 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    {score}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {score > row.us ? `+${score - row.us}` : score < row.us ? `${score - row.us}` : '0'}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Advertised Pricing Comparison */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Advertised Entry-Level Pricing (MSRP)</h4>
                    <div className="text-xs text-gray-400 mb-3">
                      *Based on current advertised specials for base trim levels - Manual data entry until API integration
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1000px]">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left text-white font-medium p-3 min-w-[120px]">Entry Model</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Premium Auto<br/><span className="text-xs text-gray-400">(Us)</span></th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Terry Reid<br/>Hyundai</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">AutoNation<br/>Honda</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Germain<br/>Toyota</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Crown<br/>BMW</th>
                            <th className="text-center text-white font-medium p-2 min-w-[100px]">Sunset<br/>Ford</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { 
                              model: '2024 Camry LE', 
                              us: 26895, 
                              competitors: [25995, 27200, 26450, 0, 0],
                              available: [true, true, true, false, false]
                            },
                            { 
                              model: '2024 Accord LX', 
                              us: 27995, 
                              competitors: [0, 26800, 0, 0, 0],
                              available: [false, true, false, false, false]
                            },
                            { 
                              model: '2024 Sonata SE', 
                              us: 0, 
                              competitors: [24995, 0, 0, 0, 0],
                              available: [false, true, false, false, false]
                            },
                            { 
                              model: '2024 RAV4 LE', 
                              us: 29450, 
                              competitors: [0, 0, 28995, 0, 0],
                              available: [false, false, true, false, false]
                            },
                            { 
                              model: '2024 CR-V LX', 
                              us: 28995, 
                              competitors: [0, 27850, 0, 0, 0],
                              available: [false, true, false, false, false]
                            },
                            { 
                              model: '2024 Tucson SE', 
                              us: 0, 
                              competitors: [26450, 0, 0, 0, 0],
                              available: [false, true, false, false, false]
                            },
                            { 
                              model: '2024 F-150 Regular', 
                              us: 36995, 
                              competitors: [0, 0, 0, 0, 34995],
                              available: [false, false, false, false, true]
                            },
                            { 
                              model: '2024 330i', 
                              us: 0, 
                              competitors: [0, 0, 0, 44995, 0],
                              available: [false, false, false, true, false]
                            }
                          ].map((row, index) => (
                            <tr key={row.model} className="border-b border-gray-800">
                              <td className="p-3">
                                <div className="text-white font-medium text-sm">{row.model}</div>
                              </td>
                              <td className="p-2 text-center">
                                {row.us > 0 ? (
                                  <div>
                                    <div className={`text-sm font-bold ${
                                      row.competitors.filter((p, i) => p > 0).length === 0 ? 'text-blue-400' :
                                      row.us <= Math.min(...row.competitors.filter(p => p > 0)) ? 'text-green-400' :
                                      row.us <= Math.min(...row.competitors.filter(p => p > 0)) + 1000 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                      ${row.us.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-400">Available</div>
                                  </div>
                                ) : (
                                  <div className="text-gray-600 text-sm">N/A</div>
                                )}
                              </td>
                              {row.competitors.map((price, i) => (
                                <td key={i} className="p-2 text-center">
                                  {price > 0 ? (
                                    <div>
                                      <div className={`text-sm font-bold ${
                                        row.us === 0 ? 'text-blue-400' :
                                        price > row.us ? 'text-green-400' :
                                        price > row.us - 1000 ? 'text-yellow-400' : 'text-red-400'
                                      }`}>
                                        ${price.toLocaleString()}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {row.us > 0 ? (price > row.us ? `+${(price - row.us).toLocaleString()}` : `-${(row.us - price).toLocaleString()}`) : ''}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-600 text-sm">N/A</div>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* DIY Guide Level - Detailed Insights */}
              {planLevel >= 2 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                    <div className="text-green-400 font-medium mb-3">Competitive Advantages</div>
                    <div className="text-sm text-gray-300 space-y-2">
                      <div>
                        <div className="font-medium text-white mb-1">Performance Leaders:</div>
                        <ul className="text-xs space-y-1">
                          <li>• Compact SUV category: +4 pts above Terry Reid</li>
                          <li>• Luxury sedan experience beats all non-premium</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium text-white mb-1">Price Competitive:</div>
                        <ul className="text-xs space-y-1">
                          <li>• Camry: Only $450 above Terry Reid's aggressive pricing</li>
                          <li>• F-150: $2K premium but justify with service quality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                    <div className="text-red-400 font-medium mb-3">Critical Competitive Threats</div>
                    <div className="text-sm text-gray-300 space-y-2">
                      <div>
                        <div className="font-medium text-white mb-1">Performance Gaps:</div>
                        <ul className="text-xs space-y-1">
                          <li>• Terry Reid: -16 pts on sedan sales process</li>
                          <li>• Sunset Ford: -22 pts on truck category</li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium text-white mb-1">Pricing Disadvantages:</div>
                        <ul className="text-xs space-y-1">
                          <li>• Terry Reid Sonata: $1,900 cheaper than our Camry</li>
                          <li>• Missing Hyundai/Genesis luxury lineup entirely</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Done-For-You Level - Automated Actions */}
              {planLevel >= 3 && (
                <div className="mt-4 p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
                  <div className="text-purple-400 font-medium mb-3">Automated Competitive Response</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                      Match Terry Reid Sonata Pricing
                    </button>
                    <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Deploy F-150 Value Justification
                    </button>
                    <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                      Update Pricing Strategy: Sedan Segment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Mystery Shop Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Recent Shop Results</h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 'MS-2024-047',
                      date: '2 days ago',
                      shopper: 'Jennifer K.',
                      vehicle: '2024 Camry',
                      associate: 'Jason Williams',
                      score: 67,
                      issues: ['Weak product knowledge', 'No test drive offered', 'Poor follow-up'],
                      strengths: ['Friendly greeting', 'Clean facility']
                    },
                    {
                      id: 'MS-2024-046',
                      date: '4 days ago', 
                      shopper: 'Michael R.',
                      vehicle: '2024 RAV4',
                      associate: 'Mike Rodriguez',
                      score: 89,
                      issues: ['Pricing presentation rushed'],
                      strengths: ['Excellent needs assessment', 'Strong close', 'Professional demeanor']
                    },
                    {
                      id: 'MS-2024-045',
                      date: '1 week ago',
                      shopper: 'Sarah T.',
                      vehicle: '2024 F-150',
                      associate: 'Lisa Thompson',
                      score: 72,
                      issues: ['Limited truck knowledge', 'No feature demonstration'],
                      strengths: ['Great rapport building', 'Thorough paperwork']
                    }
                  ].map((shop) => (
                    <div key={shop.id} className={`p-4 rounded-lg border ${
                      shop.score >= 85 ? 'bg-green-900/20 border-green-800/50' :
                      shop.score >= 70 ? 'bg-yellow-900/20 border-yellow-800/50' :
                      'bg-red-900/20 border-red-800/50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-white font-medium text-sm">{shop.id}</div>
                          <div className="text-xs text-gray-400">{shop.date} • {shop.shopper}</div>
                        </div>
                        <div className={`text-2xl font-bold ${
                          shop.score >= 85 ? 'text-green-400' :
                          shop.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {shop.score}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-gray-300 text-sm">{shop.vehicle}</span>
                        <span className="text-gray-400 text-xs mx-2">•</span>
                        <span className="text-gray-400 text-sm">{shop.associate}</span>
                      </div>

                      {/* Awareness Level */}
                      {planLevel >= 1 && (
                        <div className="text-xs text-gray-500 mb-2">
                          {shop.issues.length} issues identified, {shop.strengths.length} strengths noted
                        </div>
                      )}

                      {/* DIY Guide Level */}
                      {planLevel >= 2 && (
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-red-400 font-medium">Issues:</div>
                            <ul className="text-xs text-gray-400 ml-2">
                              {shop.issues.map((issue, i) => (
                                <li key={i}>• {issue}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-green-400 font-medium">Strengths:</div>
                            <ul className="text-xs text-gray-400 ml-2">
                              {shop.strengths.map((strength, i) => (
                                <li key={i}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Done-For-You Level */}
                      {planLevel >= 3 && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="flex gap-2">
                            <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">
                              Auto-Schedule Training
                            </button>
                            <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors">
                              Send Coaching Alert
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-2">
                        <button className="text-xs text-blue-400 hover:underline">
                          View Full Report →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Training Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-red-400 font-medium text-sm">Critical: Product Knowledge</div>
                      <span className="text-red-400 text-xs">HIGH PRIORITY</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      3 associates scoring below 70% on vehicle features and specifications
                    </div>
                    <div className="text-xs text-gray-500">
                      Affected: Jason Williams, Lisa Thompson, Kevin Park
                    </div>
                    {planLevel >= 2 && (
                      <div className="mt-2 text-xs text-green-400">
                        Suggested: Weekly product training sessions, manufacturer certification program
                      </div>
                    )}
                    {planLevel >= 3 && (
                      <button className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                        Schedule Training →
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-yellow-400 font-medium text-sm">Follow-up Process</div>
                      <span className="text-yellow-400 text-xs">MEDIUM</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Average follow-up score: 43/100 across all associates
                    </div>
                    {planLevel >= 2 && (
                      <div className="mt-2 text-xs text-green-400">
                        Suggested: CRM training, follow-up templates, automated reminders
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-blue-400 font-medium text-sm">Closing Techniques</div>
                      <span className="text-blue-400 text-xs">MEDIUM</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Close attempt rate: 61% - industry standard is 80%+
                    </div>
                    {planLevel >= 2 && (
                      <div className="mt-2 text-xs text-green-400">
                        Suggested: Role-playing exercises, objection handling workshop
                      </div>
                    )}
                  </div>
                </div>

                {planLevel >= 2 && (
                  <div className="mt-6 p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                    <div className="text-green-400 font-medium text-sm mb-2">Quick Wins</div>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Implement test drive requirement checklist</li>
                      <li>• Create vehicle feature cheat sheets</li>
                      <li>• Set up 24-hour follow-up automation</li>
                      <li>• Schedule monthly mystery shops</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ugc-analysis' && (
          <div className="space-y-6">
            {/* UGC Overview Dashboard */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">User Generated Content Analysis</h2>
                  <p className="text-gray-400">Comprehensive review and UGC monitoring across all platforms</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-400 mb-1">84.2</div>
                  <div className="text-xs text-gray-500">Overall UGC Score</div>
                  <button className="mt-2 px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm hover:bg-blue-900/70 transition-colors">
                    Refresh All Sources
                  </button>
                </div>
              </div>

              {/* UGC Source Performance Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { platform: 'Google Business', score: 92, reviews: 847, sentiment: 4.6, trend: 'up', weight: 'critical' },
                  { platform: 'Facebook', score: 88, reviews: 312, sentiment: 4.4, trend: 'stable', weight: 'high' },
                  { platform: 'Yelp', score: 79, reviews: 156, sentiment: 4.1, trend: 'up', weight: 'high' },
                  { platform: 'DealerRater', score: 85, reviews: 234, sentiment: 4.5, trend: 'up', weight: 'high' },
                  { platform: 'TikTok', score: 73, reviews: 45, sentiment: 4.2, trend: 'down', weight: 'medium' },
                  { platform: 'Reddit', score: 68, reviews: 23, sentiment: 3.8, trend: 'stable', weight: 'medium' },
                  { platform: 'BBB', score: 81, reviews: 67, sentiment: 4.3, trend: 'up', weight: 'medium' },
                  { platform: 'Google Maps', score: 90, reviews: 692, sentiment: 4.5, trend: 'up', weight: 'critical' },
                  { platform: 'Cars.com', score: 76, reviews: 89, sentiment: 4.0, trend: 'stable', weight: 'low' },
                  { platform: 'AutoTrader', score: 82, reviews: 134, sentiment: 4.4, trend: 'up', weight: 'medium' },
                  { platform: 'Wikipedia', score: 45, reviews: 2, sentiment: 3.0, trend: 'down', weight: 'low' },
                  { platform: 'Glassdoor', score: 74, reviews: 28, sentiment: 3.9, trend: 'stable', weight: 'low' }
                ].map((source, index) => (
                  <div key={source.platform} className={`p-4 rounded-lg border ${
                    source.weight === 'critical' ? 'bg-red-900/20 border-red-800/50' :
                    source.weight === 'high' ? 'bg-yellow-900/20 border-yellow-800/50' :
                    source.weight === 'medium' ? 'bg-blue-900/20 border-blue-800/50' :
                    'bg-gray-800/50 border-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{source.platform}</h4>
                      <div className={`text-xs px-2 py-1 rounded ${
                        source.weight === 'critical' ? 'bg-red-500 text-white' :
                        source.weight === 'high' ? 'bg-yellow-500 text-black' :
                        source.weight === 'medium' ? 'bg-blue-500 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {source.weight.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="text-2xl font-bold text-white mb-2">{source.score}</div>
                    <div className="text-xs text-gray-400 mb-2">
                      {source.reviews} reviews • ⭐ {source.sentiment}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`text-xs ${
                        source.trend === 'up' ? 'text-green-400' :
                        source.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {source.trend === 'up' ? '↗' : source.trend === 'down' ? '↘' : '→'} Trend
                      </div>
                      <button className="text-xs text-blue-400 hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personnel Performance Matrix */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Associate UGC Performance Matrix</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-900/50 text-green-400 rounded-lg text-sm hover:bg-green-900/70 transition-colors">
                    Current Staff (12)
                  </button>
                  <button className="px-3 py-1 bg-red-900/50 text-red-400 rounded-lg text-sm hover:bg-red-900/70 transition-colors">
                    Former Staff (8)
                  </button>
                </div>
              </div>

              {/* Matrix Grid */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-white font-medium p-3 min-w-[150px]">Associate</th>
                      <th className="text-center text-white font-medium p-2 min-w-[90px]">Google Business</th>
                      <th className="text-center text-white font-medium p-2 min-w-[80px]">Facebook</th>
                      <th className="text-center text-white font-medium p-2 min-w-[80px]">Yelp</th>
                      <th className="text-center text-white font-medium p-2 min-w-[90px]">DealerRater</th>
                      <th className="text-center text-white font-medium p-2 min-w-[80px]">TikTok</th>
                      <th className="text-center text-white font-medium p-2 min-w-[80px]">Reddit</th>
                      <th className="text-center text-white font-medium p-2 min-w-[70px]">BBB</th>
                      <th className="text-center text-white font-medium p-2 min-w-[80px]">Maps</th>
                      <th className="text-center text-white font-medium p-2 min-w-[90px]">Overall Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Mike Rodriguez', role: 'Sales Manager', status: 'current', scores: { gb: { count: 47, rating: 4.8, sentiment: 'positive' }, fb: { count: 23, rating: 4.6, sentiment: 'positive' }, yelp: { count: 12, rating: 4.2, sentiment: 'mixed' }, dr: { count: 31, rating: 4.7, sentiment: 'positive' }, tiktok: { count: 8, rating: 4.5, sentiment: 'positive' }, reddit: { count: 3, rating: 4.0, sentiment: 'neutral' }, bbb: { count: 5, rating: 4.4, sentiment: 'positive' }, maps: { count: 52, rating: 4.7, sentiment: 'positive' } }, overall: 94 },
                      { name: 'Sarah Chen', role: 'Finance Manager', status: 'current', scores: { gb: { count: 34, rating: 4.9, sentiment: 'positive' }, fb: { count: 19, rating: 4.7, sentiment: 'positive' }, yelp: { count: 8, rating: 4.3, sentiment: 'positive' }, dr: { count: 22, rating: 4.8, sentiment: 'positive' }, tiktok: { count: 2, rating: 4.0, sentiment: 'neutral' }, reddit: { count: 1, rating: 5.0, sentiment: 'positive' }, bbb: { count: 3, rating: 4.3, sentiment: 'positive' }, maps: { count: 39, rating: 4.8, sentiment: 'positive' } }, overall: 92 },
                      { name: 'Jason Williams', role: 'Sales Associate', status: 'current', scores: { gb: { count: 29, rating: 4.5, sentiment: 'positive' }, fb: { count: 15, rating: 4.4, sentiment: 'positive' }, yelp: { count: 6, rating: 4.1, sentiment: 'mixed' }, dr: { count: 18, rating: 4.6, sentiment: 'positive' }, tiktok: { count: 12, rating: 4.3, sentiment: 'positive' }, reddit: { count: 2, rating: 3.5, sentiment: 'mixed' }, bbb: { count: 2, rating: 4.0, sentiment: 'neutral' }, maps: { count: 33, rating: 4.4, sentiment: 'positive' } }, overall: 87 },
                      { name: 'Lisa Thompson', role: 'Service Advisor', status: 'current', scores: { gb: { count: 41, rating: 4.7, sentiment: 'positive' }, fb: { count: 21, rating: 4.5, sentiment: 'positive' }, yelp: { count: 14, rating: 4.0, sentiment: 'mixed' }, dr: { count: 25, rating: 4.4, sentiment: 'positive' }, tiktok: { count: 1, rating: 3.0, sentiment: 'negative' }, reddit: { count: 0, rating: 0, sentiment: 'none' }, bbb: { count: 4, rating: 4.2, sentiment: 'positive' }, maps: { count: 45, rating: 4.6, sentiment: 'positive' } }, overall: 85 },
                      { name: 'Tom Bradley', role: 'Sales Associate', status: 'former', scores: { gb: { count: 23, rating: 3.8, sentiment: 'mixed' }, fb: { count: 11, rating: 3.6, sentiment: 'mixed' }, yelp: { count: 9, rating: 3.2, sentiment: 'negative' }, dr: { count: 15, rating: 3.9, sentiment: 'mixed' }, tiktok: { count: 0, rating: 0, sentiment: 'none' }, reddit: { count: 4, rating: 2.8, sentiment: 'negative' }, bbb: { count: 3, rating: 3.3, sentiment: 'mixed' }, maps: { count: 28, rating: 3.7, sentiment: 'mixed' } }, overall: 62 },
                      { name: 'Kevin Park', role: 'Service Technician', status: 'current', scores: { gb: { count: 18, rating: 4.6, sentiment: 'positive' }, fb: { count: 9, rating: 4.4, sentiment: 'positive' }, yelp: { count: 3, rating: 4.7, sentiment: 'positive' }, dr: { count: 12, rating: 4.5, sentiment: 'positive' }, tiktok: { count: 0, rating: 0, sentiment: 'none' }, reddit: { count: 0, rating: 0, sentiment: 'none' }, bbb: { count: 1, rating: 5.0, sentiment: 'positive' }, maps: { count: 22, rating: 4.5, sentiment: 'positive' } }, overall: 89 }
                    ].map((associate, index) => (
                      <tr key={associate.name} className={`border-b border-gray-800 ${associate.status === 'former' ? 'opacity-75' : ''}`}>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${associate.status === 'current' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <div className="text-white font-medium text-sm">{associate.name}</div>
                              <div className="text-xs text-gray-400">{associate.role}</div>
                            </div>
                          </div>
                        </td>
                        {['gb', 'fb', 'yelp', 'dr', 'tiktok', 'reddit', 'bbb', 'maps'].map((platform) => {
                          const score = associate.scores[platform];
                          return (
                            <td key={platform} className="p-2 text-center">
                              <div className="text-white font-medium text-sm">{score.count}</div>
                              <div className={`text-xs ${
                                score.sentiment === 'positive' ? 'text-green-400' :
                                score.sentiment === 'negative' ? 'text-red-400' :
                                score.sentiment === 'mixed' ? 'text-yellow-400' :
                                'text-gray-400'
                              }`}>
                                {score.rating > 0 ? `⭐ ${score.rating}` : '—'}
                              </div>
                            </td>
                          );
                        })}
                        <td className="p-2 text-center">
                          <div className={`text-xl font-bold ${
                            associate.overall >= 90 ? 'text-green-400' :
                            associate.overall >= 80 ? 'text-blue-400' :
                            associate.overall >= 70 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {associate.overall}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-xl">⚠️</span>
                      <div className="flex-1">
                        <div className="text-red-400 font-medium">High Risk: Tom Bradley (Former)</div>
                        <p className="text-sm text-gray-400 mt-1">
                          62 overall score with negative sentiment across Reddit and Yelp. 
                          Recent activity spike after departure.
                        </p>
                        <div className="flex gap-2 mt-3">
                          {planLevel >= 1 && (
                            <span className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">
                              -12 AI impact points
                            </span>
                          )}
                          {planLevel >= 2 && (
                            <button className="text-xs text-red-400 underline">
                              Response Strategy →
                            </button>
                          )}
                          {planLevel >= 3 && (
                            <button className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors">
                              Auto-Respond →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 text-xl">📊</span>
                      <div className="flex-1">
                        <div className="text-yellow-400 font-medium">Monitor: Wikipedia Presence</div>
                        <p className="text-sm text-gray-400 mt-1">
                          Low activity (2 mentions) but high AI platform weight. 
                          Opportunity for reputation improvement.
                        </p>
                        {planLevel >= 2 && (
                          <div className="mt-2 text-xs text-green-400">
                            Strategy: Create business profile, add to local business directory
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">⭐</span>
                      <div className="flex-1">
                        <div className="text-green-400 font-medium">Top Performer: Mike Rodriguez</div>
                        <p className="text-sm text-gray-400 mt-1">
                          94 overall score with consistent positive sentiment. 
                          Strong presence across all platforms.
                        </p>
                        {planLevel >= 3 && (
                          <button className="mt-2 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors">
                            Feature in Marketing →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Platform Optimization Priorities</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/50">
                    <div>
                      <div className="text-red-400 font-medium text-sm">Wikipedia</div>
                      <div className="text-xs text-gray-400">High AI weight, low presence</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">45</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/50">
                    <div>
                      <div className="text-yellow-400 font-medium text-sm">Reddit</div>
                      <div className="text-xs text-gray-400">Growing AI influence, mixed sentiment</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">68</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800/50">
                    <div>
                      <div className="text-blue-400 font-medium text-sm">TikTok</div>
                      <div className="text-xs text-gray-400">Video content opportunity</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">73</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800/50">
                    <div>
                      <div className="text-green-400 font-medium text-sm">Google Business</div>
                      <div className="text-xs text-gray-400">Strong performance, maintain</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">92</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                </div>

                {planLevel >= 2 && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded">
                    <div className="text-blue-400 text-sm font-medium mb-2">30-Day Action Plan:</div>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Week 1: Address Tom Bradley reputation issues</li>
                      <li>• Week 2: Boost Wikipedia presence and citations</li>
                      <li>• Week 3: Increase positive Reddit engagement</li>
                      <li>• Week 4: Launch TikTok video testimonial campaign</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Reviews Hub Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Reviews Hub</h2>
                  <p className="text-gray-400">Unified review management across all platforms</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400 mb-1">47</div>
                    <div className="text-xs text-gray-500">Pending Responses</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400 mb-1">92%</div>
                    <div className="text-xs text-gray-500">Response Rate</div>
                  </div>
                  <button className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm hover:bg-blue-900/70 transition-colors">
                    Sync All Platforms
                  </button>
                </div>
              </div>

              {/* Platform Connection Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {[
                  { platform: 'Google Business', status: 'connected', lastSync: '2 min ago', pendingReviews: 23 },
                  { platform: 'Facebook', status: 'connected', lastSync: '5 min ago', pendingReviews: 8 },
                  { platform: 'Yelp', status: 'connected', lastSync: '1 hour ago', pendingReviews: 12 },
                  { platform: 'DealerRater', status: 'error', lastSync: '3 days ago', pendingReviews: 4 },
                  { platform: 'TikTok', status: 'disconnected', lastSync: 'Never', pendingReviews: 0 },
                  { platform: 'BBB', status: 'connected', lastSync: '30 min ago', pendingReviews: 0 }
                ].map((platform, index) => (
                  <div key={platform.platform} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        platform.status === 'connected' ? 'bg-green-500' :
                        platform.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-white text-xs font-medium">{platform.platform}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      Last sync: {platform.lastSync}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Pending</span>
                      <span className={`text-xs font-medium ${
                        platform.pendingReviews > 0 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {platform.pendingReviews}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Response Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Recent Reviews Requiring Response</h3>
                  <div className="flex gap-2">
                    <select className="bg-gray-800 text-white text-xs px-3 py-1 rounded border border-gray-600">
                      <option>All Platforms</option>
                      <option>Google Business</option>
                      <option>Facebook</option>
                      <option>Yelp</option>
                    </select>
                    <select className="bg-gray-800 text-white text-xs px-3 py-1 rounded border border-gray-600">
                      <option>All Ratings</option>
                      <option>5 Stars</option>
                      <option>4 Stars</option>
                      <option>3 Stars</option>
                      <option>1-2 Stars</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[
                    {
                      id: 1,
                      platform: 'Google Business',
                      reviewer: 'Jennifer Martinez',
                      rating: 5,
                      date: '2 hours ago',
                      review: 'Mike Rodriguez was absolutely fantastic! He helped us find the perfect SUV for our family and made the entire process smooth. Highly recommend this dealership.',
                      associate: 'Mike Rodriguez',
                      sentiment: 'positive',
                      priority: 'medium'
                    },
                    {
                      id: 2,
                      platform: 'Yelp',
                      reviewer: 'David Kim',
                      rating: 2,
                      date: '4 hours ago',
                      review: 'Had a terrible experience with Tom Bradley before he left. Now dealing with service issues and no one seems to know what happened with my warranty.',
                      associate: 'Tom Bradley (Former)',
                      sentiment: 'negative',
                      priority: 'urgent'
                    },
                    {
                      id: 3,
                      platform: 'Facebook',
                      reviewer: 'Sarah Johnson',
                      rating: 4,
                      date: '6 hours ago',
                      review: 'Good experience overall. Lisa Thompson in service was very helpful, though the wait time was longer than expected.',
                      associate: 'Lisa Thompson',
                      sentiment: 'positive',
                      priority: 'low'
                    },
                    {
                      id: 4,
                      platform: 'DealerRater',
                      reviewer: 'Robert Wilson',
                      rating: 1,
                      date: '8 hours ago',
                      review: 'Worst dealership experience ever. Jason Williams was unprofessional and pushy. Would never recommend.',
                      associate: 'Jason Williams',
                      sentiment: 'negative',
                      priority: 'urgent'
                    }
                  ].map((review) => (
                    <div key={review.id} className={`p-4 rounded-lg border ${
                      review.priority === 'urgent' ? 'bg-red-900/20 border-red-800/50' :
                      review.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-800/50' :
                      'bg-green-900/20 border-green-800/50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            review.platform === 'Google Business' ? 'bg-blue-600 text-white' :
                            review.platform === 'Facebook' ? 'bg-blue-800 text-white' :
                            review.platform === 'Yelp' ? 'bg-red-600 text-white' :
                            'bg-orange-600 text-white'
                          }`}>
                            {review.platform}
                          </span>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          review.priority === 'urgent' ? 'bg-red-600 text-white' :
                          review.priority === 'medium' ? 'bg-yellow-600 text-black' :
                          'bg-green-600 text-white'
                        }`}>
                          {review.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-2">
                        <span className="text-white font-medium text-sm">{review.reviewer}</span>
                        <span className="text-gray-400 text-xs ml-2">mentioned: {review.associate}</span>
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{review.review}</p>

                      <div className="flex items-center gap-2">
                        {/* Awareness Level */}
                        {planLevel >= 1 && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            review.sentiment === 'positive' ? 'bg-green-900/50 text-green-400' :
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {review.sentiment === 'positive' ? 'Positive Sentiment' : 'Negative Sentiment'}
                          </span>
                        )}

                        {/* DIY Guide Level */}
                        {planLevel >= 2 && (
                          <>
                            <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors">
                              Use Template
                            </button>
                            <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors">
                              AI Draft
                            </button>
                          </>
                        )}

                        {/* Done-For-You Level */}
                        {planLevel >= 3 && (
                          <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors">
                            Auto-Respond
                          </button>
                        )}

                        <button className="text-xs text-blue-400 underline hover:text-blue-300">
                          View Full Thread
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Templates & AI Assistant */}
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Response Templates</h3>
                  <div className="space-y-3">
                    {[
                      { name: '5-Star Thank You', type: 'positive', usage: 234 },
                      { name: 'Service Recovery', type: 'negative', usage: 67 },
                      { name: 'General Appreciation', type: 'neutral', usage: 145 },
                      { name: 'Follow-up Request', type: 'positive', usage: 89 }
                    ].map((template, index) => (
                      <div key={template.name} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">{template.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            template.type === 'positive' ? 'bg-green-900/50 text-green-400' :
                            template.type === 'negative' ? 'bg-red-900/50 text-red-400' :
                            'bg-blue-900/50 text-blue-400'
                          }`}>
                            {template.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Used {template.usage} times</span>
                          <button className="text-xs text-blue-400 hover:underline">
                            Preview
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {planLevel >= 2 && (
                    <button className="w-full mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Create Custom Template
                    </button>
                  )}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">AI Response Assistant</h3>
                  
                  {planLevel >= 2 ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-purple-900/20 border border-purple-800/50 rounded-lg">
                        <div className="text-purple-400 text-sm font-medium mb-2">Smart Suggestions</div>
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>• Personalized responses using customer name</li>
                          <li>• Associate-specific acknowledgments</li>
                          <li>• Sentiment-appropriate tone matching</li>
                          <li>• Escalation path recommendations</li>
                        </ul>
                      </div>

                      {planLevel >= 3 && (
                        <div className="p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
                          <div className="text-green-400 text-sm font-medium mb-2">Auto-Response Rules</div>
                          <ul className="text-xs text-gray-400 space-y-1">
                            <li>• 5-star reviews: Thank within 2 hours</li>
                            <li>• 1-2 star reviews: Manager response within 30 min</li>
                            <li>• Mentions former staff: Immediate escalation</li>
                            <li>• Service complaints: Auto-assign to Lisa Thompson</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🔒</div>
                      <div className="text-sm text-gray-400 mb-2">AI Assistant Locked</div>
                      <button 
                        onClick={() => setPlanLevel(2)}
                        className="text-xs text-blue-400 underline"
                      >
                        Upgrade to DIY Guide
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Response Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Response Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="text-white text-sm">Average Response Time</div>
                      <div className="text-xs text-gray-400">Target: &lt; 2 hours</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">1.3h</div>
                      <div className="text-xs text-green-400">↓ -0.4h</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="text-white text-sm">Response Rate</div>
                      <div className="text-xs text-gray-400">Industry avg: 78%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">92%</div>
                      <div className="text-xs text-blue-400">↑ +3%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="text-white text-sm">Follow-up Reviews</div>
                      <div className="text-xs text-gray-400">After response</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">23%</div>
                      <div className="text-xs text-yellow-400">→ 0%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="text-white text-sm">Sentiment Improvement</div>
                      <div className="text-xs text-gray-400">Post-response</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">67%</div>
                      <div className="text-xs text-green-400">↑ +12%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Escalation Queue</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-red-400 font-medium text-sm">Manager Required</div>
                      <span className="text-red-400 text-xs">URGENT</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      David Kim - Yelp - 2 star review about Tom Bradley issues
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors">
                        Assign Manager
                      </button>
                      <span className="text-xs text-gray-500">4h overdue</span>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-yellow-400 font-medium text-sm">Service Follow-up</div>
                      <span className="text-yellow-400 text-xs">MEDIUM</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Sarah Johnson - Facebook - Wait time complaint
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors">
                        Assign Lisa T.
                      </button>
                      <span className="text-xs text-gray-500">2h remaining</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-blue-400 font-medium text-sm">Positive Follow-up</div>
                      <span className="text-blue-400 text-xs">LOW</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Jennifer Martinez - Google - 5 star for Mike Rodriguez
                    </div>
                    <div className="flex gap-2">
                      {planLevel >= 3 ? (
                        <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors">
                          Auto-Thank
                        </button>
                      ) : (
                        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">
                          Use Template
                        </button>
                      )}
                      <span className="text-xs text-gray-500">6h remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-6">
            {/* Schema Audit Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Schema Markup Audit</h2>
                  <p className="text-gray-400">Structured data implementation for AI search optimization</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">68/100</div>
                  <div className="text-xs text-gray-500">Implementation Score</div>
                  <button className="mt-2 px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm hover:bg-blue-900/70 transition-colors">
                    Run Validation
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-800/50">
                  <div className="text-2xl font-bold text-green-400">12</div>
                  <div className="text-xs text-gray-400 mt-1">Implemented</div>
                </div>
                <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-800/50">
                  <div className="text-2xl font-bold text-red-400">8</div>
                  <div className="text-xs text-gray-400 mt-1">Missing Critical</div>
                </div>
                <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/50">
                  <div className="text-2xl font-bold text-yellow-400">5</div>
                  <div className="text-xs text-gray-400 mt-1">Validation Errors</div>
                </div>
                <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-800/50">
                  <div className="text-2xl font-bold text-blue-400">+23</div>
                  <div className="text-xs text-gray-400 mt-1">AI Score Impact</div>
                </div>
              </div>
            </div>

            {/* Schema Implementation Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Implemented Schema Types</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Organization', status: 'complete', pages: 1, errors: 0, impact: 'High' },
                    { type: 'LocalBusiness', status: 'complete', pages: 1, errors: 0, impact: 'Critical' },
                    { type: 'BreadcrumbList', status: 'complete', pages: 47, errors: 2, impact: 'Medium' },
                    { type: 'WebSite', status: 'complete', pages: 1, errors: 0, impact: 'Medium' },
                    { type: 'ContactPoint', status: 'partial', pages: 3, errors: 1, impact: 'High' },
                    { type: 'Review', status: 'partial', pages: 12, errors: 3, impact: 'High' }
                  ].map((schema, index) => (
                    <div key={schema.type} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          schema.status === 'complete' ? 'bg-green-500' :
                          schema.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="text-white text-sm font-medium">{schema.type}</div>
                          <div className="text-xs text-gray-400">
                            {schema.pages} pages • {schema.errors} errors
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded ${
                          schema.impact === 'Critical' ? 'bg-red-900/50 text-red-400' :
                          schema.impact === 'High' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-blue-900/50 text-blue-400'
                        }`}>
                          {schema.impact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Missing Critical Schema</h3>
                <div className="space-y-3">
                  {[
                    { type: 'AutoDealer', impact: 'Critical', aiBoost: '+8 pts', platforms: ['ChatGPT', 'Gemini'] },
                    { type: 'AutoRepair', impact: 'Critical', aiBoost: '+7 pts', platforms: ['Perplexity', 'Claude'] },
                    { type: 'Service', impact: 'High', aiBoost: '+6 pts', platforms: ['All'] },
                    { type: 'FAQPage', impact: 'High', aiBoost: '+5 pts', platforms: ['Perplexity', 'Copilot'] },
                    { type: 'Person', impact: 'Medium', aiBoost: '+3 pts', platforms: ['ChatGPT', 'Claude'] },
                    { type: 'Offer', impact: 'Medium', aiBoost: '+4 pts', platforms: ['Gemini', 'Copilot'] }
                  ].map((schema, index) => (
                    <div key={schema.type} className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-red-400 font-medium text-sm">{schema.type}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-xs">{schema.aiBoost}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            schema.impact === 'Critical' ? 'bg-red-900/50 text-red-400' :
                            schema.impact === 'High' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-blue-900/50 text-blue-400'
                          }`}>
                            {schema.impact}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Boosts: {schema.platforms.join(', ')}
                      </div>
                      
                      {/* Awareness Level */}
                      {planLevel >= 1 && (
                        <div className="text-xs text-gray-500">
                          Missing structured data reduces AI platform understanding
                        </div>
                      )}
                      
                      {/* DIY Guide Level */}
                      {planLevel >= 2 && (
                        <div className="mt-2 p-2 bg-green-900/20 border border-green-800/30 rounded text-xs">
                          <div className="text-green-400 font-medium">Implementation Guide:</div>
                          <div className="text-gray-400">JSON-LD template + validation steps provided</div>
                        </div>
                      )}
                      
                      {/* Done-For-You Level */}
                      {planLevel >= 3 && (
                        <button className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                          Auto-Generate Schema →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Validation Errors */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Schema Validation Issues</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-900/50 text-red-400 rounded-lg text-sm hover:bg-red-900/70 transition-colors">
                    3 Critical
                  </button>
                  <button className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-lg text-sm hover:bg-yellow-900/70 transition-colors">
                    2 Warnings
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">⚠️</span>
                    <div className="flex-1">
                      <div className="text-red-400 font-medium">Critical: LocalBusiness Missing Required Properties</div>
                      
                      {/* Awareness Level */}
                      {planLevel >= 1 && (
                        <p className="text-sm text-gray-400 mt-1">
                          Missing required 'address' and 'telephone' properties in LocalBusiness schema
                        </p>
                      )}
                      
                      {/* DIY Guide Level */}
                      {planLevel >= 2 && (
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-800/30 rounded">
                          <div className="text-green-400 text-sm font-medium mb-1">Fix Instructions:</div>
                          <pre className="text-xs text-gray-400 bg-gray-900 p-2 rounded overflow-x-auto">{`"address": {
  "@type": "PostalAddress",
  "streetAddress": "123 Auto Blvd",
  "addressLocality": "Cape Coral",
  "addressRegion": "FL",
  "postalCode": "33904"
},
"telephone": "(239) 555-0123"`}</pre>
                        </div>
                      )}
                      
                      {/* Done-For-You Level */}
                      {planLevel >= 3 && (
                        <button className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                          Auto-Fix Schema →
                        </button>
                      )}
                      
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span>Page: /</span>
                        <span>Impact: -12 AI points</span>
                        <span>Affects: Google Gemini, Claude</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl">⚠️</span>
                    <div className="flex-1">
                      <div className="text-yellow-400 font-medium">Warning: Review Schema Missing Aggregates</div>
                      
                      {planLevel >= 1 && (
                        <p className="text-sm text-gray-400 mt-1">
                          Individual reviews present but missing AggregateRating schema
                        </p>
                      )}
                      
                      {planLevel >= 2 && (
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-800/30 rounded">
                          <div className="text-green-400 text-sm font-medium mb-1">Add AggregateRating:</div>
                          <div className="text-xs text-gray-400">Calculate average rating from individual reviews</div>
                        </div>
                      )}
                      
                      {planLevel >= 3 && (
                        <button className="mt-3 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors">
                          Generate Aggregate →
                        </button>
                      )}
                      
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span>Pages: 12 review pages</span>
                        <span>Impact: -5 AI points</span>
                        <span>Affects: Perplexity, Copilot</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Platform Impact Analysis */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Schema Impact on AI Platforms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    platform: 'ChatGPT', 
                    currentImpact: 'Medium', 
                    missingSchema: ['AutoDealer', 'Person', 'Service'],
                    potentialGain: '+15 pts',
                    priority: 'High'
                  },
                  { 
                    platform: 'Perplexity', 
                    currentImpact: 'Low', 
                    missingSchema: ['FAQPage', 'AutoRepair', 'Review'],
                    potentialGain: '+18 pts',
                    priority: 'Critical'
                  },
                  { 
                    platform: 'Google Gemini', 
                    currentImpact: 'High', 
                    missingSchema: ['AutoDealer', 'Offer'],
                    potentialGain: '+8 pts',
                    priority: 'Medium'
                  }
                ].map((analysis, index) => (
                  <div key={analysis.platform} className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{analysis.platform}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        analysis.priority === 'Critical' ? 'bg-red-900/50 text-red-400' :
                        analysis.priority === 'High' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-blue-900/50 text-blue-400'
                      }`}>
                        {analysis.priority}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Impact:</span>
                        <span className="text-white">{analysis.currentImpact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Potential Gain:</span>
                        <span className="text-green-400">{analysis.potentialGain}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Missing Critical:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.missingSchema.map((schema, i) => (
                          <span key={i} className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded">
                            {schema}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Roadmap */}
            {planLevel >= 2 && (
              <div className="bg-gray-900 border border-green-800/50 bg-green-500/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Implementation Roadmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { phase: 'Week 1', task: 'Fix Validation Errors', effort: '4 hours', impact: '+12 pts' },
                    { phase: 'Week 2', task: 'Add AutoDealer Schema', effort: '6 hours', impact: '+8 pts' },
                    { phase: 'Week 3', task: 'Implement FAQPage', effort: '8 hours', impact: '+5 pts' },
                    { phase: 'Week 4', task: 'Add Service Markup', effort: '12 hours', impact: '+6 pts' }
                  ].map((phase, index) => (
                    <div key={phase.phase} className="p-4 bg-gray-800/30 rounded-lg border border-green-800/30">
                      <div className="text-green-400 font-medium text-sm mb-2">{phase.phase}</div>
                      <div className="text-white text-sm mb-1">{phase.task}</div>
                      <div className="text-xs text-gray-400 mb-2">Effort: {phase.effort}</div>
                      <div className="text-xs text-green-400">Impact: {phase.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'geo-sge' && <GeoSgeSection />}

        {activeTab === 'website' && (
          <div className="space-y-6">
            {/* Website Health Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Website Health Overview</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-500">Live Monitoring</span>
                  </div>
                  <button className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-lg text-sm hover:bg-blue-900/70 transition-colors">
                    Run Full Audit
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-lg border border-green-800/50">
                  <div className="text-3xl font-bold text-green-400">87</div>
                  <div className="text-xs text-gray-400 mt-1">Performance Score</div>
                  <div className="text-xs text-green-400 mt-1">↑ +5 from last week</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-lg border border-blue-800/50">
                  <div className="text-3xl font-bold text-blue-400">94</div>
                  <div className="text-xs text-gray-400 mt-1">SEO Score</div>
                  <div className="text-xs text-blue-400 mt-1">↑ +2 this week</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 rounded-lg border border-yellow-800/50">
                  <div className="text-3xl font-bold text-yellow-400">99.8%</div>
                  <div className="text-xs text-gray-400 mt-1">Uptime</div>
                  <div className="text-xs text-gray-400 mt-1">30-day average</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-lg border border-purple-800/50">
                  <div className="text-3xl font-bold text-purple-400">245ms</div>
                  <div className="text-xs text-gray-400 mt-1">Response Time</div>
                  <div className="text-xs text-red-400 mt-1">↑ +12ms from baseline</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 rounded-lg border border-cyan-800/50">
                  <div className="text-3xl font-bold text-cyan-400">A+</div>
                  <div className="text-xs text-gray-400 mt-1">Security Grade</div>
                  <div className="text-xs text-cyan-400 mt-1">SSL + Headers OK</div>
                </div>
              </div>
            </div>

            {/* Real-time Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">Response Time (Real-time)</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={realtimeMetrics.slice(-20)}>
                    <defs>
                      <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="responseTime" stroke="#0EA5E9" fill="url(#responseGradient)" strokeWidth={2} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} 
                      formatter={(value) => [`${Math.round(value)}ms`, 'Response Time']}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="text-xs text-gray-400 mt-2">Target: &lt; 300ms</div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">Error Rate</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={realtimeMetrics.slice(-20)}>
                    <defs>
                      <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="errorRate" stroke="#EF4444" fill="url(#errorGradient)" strokeWidth={2} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} 
                      formatter={(value) => [`${(value).toFixed(2)}%`, 'Error Rate']}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="text-xs text-gray-400 mt-2">Target: &lt; 1%</div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">Throughput</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={realtimeMetrics.slice(-20)}>
                    <defs>
                      <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="throughput" stroke="#22C55E" fill="url(#throughputGradient)" strokeWidth={2} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} 
                      formatter={(value) => [`${Math.round(value)} req/s`, 'Throughput']}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="text-xs text-gray-400 mt-2">Current load</div>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Core Web Vitals</h3>
                <span className="text-xs text-gray-500">Last measured: 2 minutes ago</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">LCP (Largest Contentful Paint)</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-400">GOOD</span>
                  </div>
                  <div className="text-3xl font-bold text-white">2.1s</div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '85%' }} />
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 2.5s | Excellent: &lt; 1.2s</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">INP (Interaction to Next Paint)</span>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-900/50 text-yellow-400">NEEDS WORK</span>
                  </div>
                  <div className="text-3xl font-bold text-white">285ms</div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: '65%' }} />
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 200ms | Excellent: &lt; 100ms</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">CLS (Cumulative Layout Shift)</span>
                    <span className="text-xs px-2 py-1 rounded bg-red-900/50 text-red-400">POOR</span>
                  </div>
                  <div className="text-3xl font-bold text-white">0.18</div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-500" style={{ width: '35%' }} />
                  </div>
                  <p className="text-xs text-gray-500">Target: &lt; 0.1 | Excellent: &lt; 0.05</p>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Performance Audit Results</h3>
                <div className="space-y-3">
                  {[
                    { metric: 'First Contentful Paint', value: '1.4s', status: 'good', target: '< 1.8s' },
                    { metric: 'Speed Index', value: '3.2s', status: 'average', target: '< 3.4s' },
                    { metric: 'Time to Interactive', value: '4.1s', status: 'poor', target: '< 3.8s' },
                    { metric: 'Total Blocking Time', value: '245ms', status: 'average', target: '< 300ms' },
                    { metric: 'First Input Delay', value: '12ms', status: 'good', target: '< 100ms' }
                  ].map(item => (
                    <div key={item.metric} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'good' ? 'bg-green-500' :
                          item.status === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-white text-sm">{item.metric}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          item.status === 'good' ? 'text-green-400' :
                          item.status === 'average' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{item.value}</div>
                        <div className="text-xs text-gray-500">{item.target}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">SEO Health Check</h3>
                <div className="space-y-3">
                  {[
                    { metric: 'Meta Descriptions', status: 'good', value: '98% optimized', issue: '2 pages missing' },
                    { metric: 'Title Tags', status: 'good', value: '100% present', issue: 'All optimized' },
                    { metric: 'H1 Headers', status: 'warning', value: '87% unique', issue: '13 duplicates found' },
                    { metric: 'Image Alt Text', status: 'error', value: '62% complete', issue: '142 images missing alt text' },
                    { metric: 'Internal Links', status: 'good', value: '3.2 avg per page', issue: 'Good distribution' }
                  ].map(item => (
                    <div key={item.metric} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'good' ? 'bg-green-500' :
                          item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-white text-sm">{item.metric}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">{item.value}</div>
                        <div className="text-xs text-gray-500">{item.issue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile & Desktop Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Mobile Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Overall Mobile Score</span>
                    <span className="text-2xl font-bold text-yellow-400">72</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Performance</span>
                        <span className="text-white">68/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-500" style={{ width: '68%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Accessibility</span>
                        <span className="text-white">89/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '89%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Best Practices</span>
                        <span className="text-white">76/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: '76%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">SEO</span>
                        <span className="text-white">94/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Desktop Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Overall Desktop Score</span>
                    <span className="text-2xl font-bold text-green-400">87</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Performance</span>
                        <span className="text-white">89/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '89%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Accessibility</span>
                        <span className="text-white">92/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Best Practices</span>
                        <span className="text-white">84/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '84%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">SEO</span>
                        <span className="text-white">94/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Technical Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-green-400">SSL Certificate</span>
                    </div>
                    <span className="text-xs text-green-400">Valid until Mar 2025</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-green-400">HTTPS Redirect</span>
                    </div>
                    <span className="text-xs text-green-400">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-yellow-400">Security Headers</span>
                    </div>
                    <span className="text-xs text-yellow-400">6/8 configured</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-green-400">WAF Protection</span>
                    </div>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Technical Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300 text-sm">Page Load Speed</span>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">2.8s</div>
                      <div className="text-xs text-gray-500">Industry avg: 4.2s</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300 text-sm">Page Size</span>
                    <div className="text-right">
                      <div className="text-yellow-400 font-medium">3.2MB</div>
                      <div className="text-xs text-gray-500">Recommended: &lt; 3MB</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300 text-sm">HTTP Requests</span>
                    <div className="text-right">
                      <div className="text-red-400 font-medium">147</div>
                      <div className="text-xs text-gray-500">Recommended: &lt; 100</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300 text-sm">Cache Hit Rate</span>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">94.2%</div>
                      <div className="text-xs text-gray-500">Excellent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues & Recommendations */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Critical Issues & Recommendations</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-900/50 text-red-400 rounded-lg text-sm hover:bg-red-900/70 transition-colors">
                    3 Critical
                  </button>
                  <button className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-lg text-sm hover:bg-yellow-900/70 transition-colors">
                    7 Warnings
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">🔴</span>
                    <div className="flex-1">
                      <div className="text-red-400 font-medium">Critical: Layout Shift Issues</div>
                      
                      {/* Awareness Level - Show problem only */}
                      {planLevel >= 1 && (
                        <p className="text-sm text-gray-400 mt-1">
                          CLS score of 0.18 indicates significant layout instability affecting user experience and SEO rankings.
                        </p>
                      )}
                      
                      {/* DIY Guide Level - Show detailed fix instructions */}
                      {planLevel >= 2 && (
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-800/30 rounded">
                          <div className="text-green-400 text-sm font-medium mb-2">DIY Fix Instructions:</div>
                          <ul className="text-xs text-gray-400 space-y-1">
                            <li>1. Add explicit width/height to all images (4 hrs)</li>
                            <li>2. Reserve space for dynamic content blocks (2 hrs)</li>
                            <li>3. Preload fonts to prevent layout shifts (1 hr)</li>
                          </ul>
                          <div className="text-xs text-green-400 mt-2">Total effort: 7 hours, $0 cost</div>
                        </div>
                      )}
                      
                      {/* Done-For-You Level - Show implementation button */}
                      {planLevel >= 3 && (
                        <div className="mt-3 p-3 bg-purple-900/20 border border-purple-800/30 rounded">
                          <div className="text-purple-400 text-sm font-medium mb-2">We'll fix this automatically:</div>
                          <div className="text-xs text-gray-400 mb-3">3 business days • CLS improved to &lt; 0.1</div>
                          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors">
                            Schedule Fix →
                          </button>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        {planLevel === 1 && (
                          <>
                            <button className="text-xs text-red-400 bg-red-900/30 px-3 py-1 rounded hover:bg-red-900/50">
                              View Details →
                            </button>
                            <button 
                              onClick={() => setPlanLevel(2)}
                              className="text-xs text-green-400 underline"
                            >
                              Get Fix Instructions
                            </button>
                          </>
                        )}
                        {planLevel === 2 && (
                          <>
                            <button 
                              onClick={() => setShowFixModal('layout-shift')}
                              className="text-xs text-green-400 bg-green-900/30 px-3 py-1 rounded hover:bg-green-900/50"
                            >
                              View Full Guide →
                            </button>
                            <button 
                              onClick={() => setPlanLevel(3)}
                              className="text-xs text-purple-400 underline"
                            >
                              Have Us Do It
                            </button>
                          </>
                        )}
                        {planLevel === 3 && (
                          <button 
                            onClick={() => setShowFixModal('layout-shift')}
                            className="text-xs text-red-400 bg-red-900/30 px-3 py-1 rounded hover:bg-red-900/50"
                          >
                            View Implementation Details →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl">🟡</span>
                    <div className="flex-1">
                      <div className="text-yellow-400 font-medium">Warning: Unoptimized Images</div>
                      
                      {/* Awareness Level */}
                      {planLevel >= 1 && (
                        <p className="text-sm text-gray-400 mt-1">
                          23 images could be optimized, potentially saving 450KB in loading time.
                        </p>
                      )}
                      
                      {/* DIY Guide Level */}
                      {planLevel >= 2 && (
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-800/30 rounded">
                          <div className="text-green-400 text-sm font-medium mb-2">DIY Optimization Steps:</div>
                          <ul className="text-xs text-gray-400 space-y-1">
                            <li>1. Convert images to WebP format using online tools</li>
                            <li>2. Implement lazy loading for below-fold images</li>
                            <li>3. Add responsive image sizes with srcset</li>
                          </ul>
                        </div>
                      )}
                      
                      {/* Done-For-You Level */}
                      {planLevel >= 3 && (
                        <div className="mt-3 p-3 bg-purple-900/20 border border-purple-800/30 rounded">
                          <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors">
                            Auto-Optimize All Images →
                          </button>
                          <div className="text-xs text-gray-400 mt-1">1-click optimization in 24 hours</div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        {planLevel === 1 && (
                          <button 
                            onClick={() => setPlanLevel(2)}
                            className="text-xs text-green-400 underline"
                          >
                            Get Optimization Guide
                          </button>
                        )}
                        {planLevel === 2 && (
                          <button 
                            onClick={() => setPlanLevel(3)}
                            className="text-xs text-purple-400 underline"
                          >
                            Auto-Optimize Instead
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 text-xl">💡</span>
                    <div className="flex-1">
                      <div className="text-blue-400 font-medium">Suggestion: Enable Compression</div>
                      
                      {planLevel >= 1 && (
                        <p className="text-sm text-gray-400 mt-1">
                          Brotli compression could reduce text asset size by ~20% compared to current gzip.
                        </p>
                      )}
                      
                      {planLevel >= 2 && (
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-800/30 rounded">
                          <div className="text-green-400 text-sm font-medium mb-1">Server Configuration:</div>
                          <div className="text-xs text-gray-400">Add Brotli module to web server config</div>
                        </div>
                      )}
                      
                      {planLevel >= 3 && (
                        <div className="mt-3 p-3 bg-purple-900/20 border border-purple-800/30 rounded">
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                            Enable Brotli Compression →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Locked Tab Display */}
        {isTabLocked(tabs.find(t => t.id === activeTab)?.minLevel) && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">Feature Requires Upgrade</h2>
            <p className="text-gray-400 mb-6">
              {planLevel === 1 && 'Upgrade to DIY Guide to see exactly what steps to take.'}
              {planLevel === 2 && 'Upgrade to Done-For-You to have us implement these fixes automatically.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
              <div className={`p-4 rounded-lg border ${planLevel >= 1 ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800/50'}`}>
                <h3 className="text-white font-semibold mb-2">AWARENESS</h3>
                <p className="text-sm text-gray-400 mb-3">See what's happening</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Monitor all metrics</li>
                  <li>• Identify problems</li>
                  <li>• Basic insights</li>
                </ul>
                {planLevel >= 1 && <div className="text-xs text-blue-400 mt-2">✓ Current</div>}
              </div>
              <div className={`p-4 rounded-lg border ${planLevel >= 2 ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-800/50'}`}>
                <h3 className="text-white font-semibold mb-2">DIY GUIDE</h3>
                <p className="text-sm text-gray-400 mb-3">Know exactly what to do</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Step-by-step instructions</li>
                  <li>• Implementation templates</li>
                  <li>• Time & cost estimates</li>
                </ul>
                {planLevel >= 2 && <div className="text-xs text-green-400 mt-2">✓ Current</div>}
                {planLevel < 2 && (
                  <button 
                    onClick={() => setPlanLevel(2)}
                    className="text-xs text-green-400 underline mt-2"
                  >
                    Upgrade →
                  </button>
                )}
              </div>
              <div className={`p-4 rounded-lg border ${planLevel >= 3 ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800/50'}`}>
                <h3 className="text-white font-semibold mb-2">DONE-FOR-YOU</h3>
                <p className="text-sm text-gray-400 mb-3">We implement it for you</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• One-click fixes</li>
                  <li>• Automated implementation</li>
                  <li>• Managed services</li>
                </ul>
                {planLevel >= 3 && <div className="text-xs text-purple-400 mt-2">✓ Current</div>}
                {planLevel < 3 && (
                  <button 
                    onClick={() => setPlanLevel(3)}
                    className="text-xs text-purple-400 underline mt-2"
                  >
                    Upgrade →
                  </button>
                )}
              </div>
            </div>
            <button 
              onClick={() => setPlanLevel(prev => Math.min(3, prev + 1))}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors"
            >
              Upgrade to {planLevel === 1 ? 'DIY Guide' : 'Done-For-You'}
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <DealerSettingsModal />
      <FixActionModal gap={showFixModal} onClose={() => setShowFixModal(null)} />
      <EEATActionModal letter={showEEATModal} onClose={() => setShowEEATModal(null)} />
    </div>
  );
}