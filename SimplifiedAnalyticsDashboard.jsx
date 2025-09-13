import React, { useState } from 'react';

const AnalyticsDashboard = () => {
  const [connections, setConnections] = useState({ ga: false, fb: false });
  const [ids, setIds] = useState({ ga: '', fb: '' });
  const [loading, setLoading] = useState(false);

  const mockData = {
    ga: { visitors: 5247, leads: 127, conversion: 2.4, bounce: 58, mobile: 73, time: '3:42' },
    fb: { clicks: 1892, cpc: 2.34, leads: 47, cpl: 94, views: 3241, spend: 4428 }
  };

  const connect = (platform) => {
    if (!ids[platform]) return alert(`Enter your ${platform.toUpperCase()} ID`);
    setLoading(true);
    setTimeout(() => {
      setConnections(prev => ({ ...prev, [platform]: true }));
      setLoading(false);
      alert(`✅ ${platform.toUpperCase()} Connected!`);
    }, 1000);
  };

  const Card = ({ label, value, change, prefix = '', suffix = '', accent = 'blue' }) => (
    <div className={`bg-gray-50 p-5 rounded-lg border-l-4 border-${accent}-500`}>
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div className="text-2xl font-bold">
        {prefix}{value?.toLocaleString()}{suffix}
      </div>
      {change && (
        <div className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
        </div>
      )}
    </div>
  );

  const EventStatus = ({ name, tracking, desc, icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{icon} {name}</span>
        <span className={`px-2 py-1 rounded text-xs ${tracking ? 'bg-green-100' : 'bg-red-100'}`}>
          {tracking ? 'TRACKING' : 'NOT TRACKING'}
        </span>
      </div>
      <div className="text-sm text-gray-600">{desc}</div>
    </div>
  );

  const ConnectionPanel = ({ platform, label, icon, color }) => {
    const isGA = platform === 'ga';
    const connected = connections[platform];
    const data = connected ? mockData[platform] : null;

    return (
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span>{icon}</span> {label}
          </h2>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            connected ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {connected ? '✓ Connected' : '✗ Not Connected'}
          </div>
        </div>

        {!connected ? (
          <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
            <h3 className="font-semibold mb-4">
              {isGA ? 'Connect GA4 to See Real Data' : '🚨 You\'re Wasting Ad Money!'}
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={ids[platform]}
                onChange={(e) => setIds({...ids, [platform]: e.target.value})}
                placeholder={`Enter ${platform.toUpperCase()} ID`}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={() => connect(platform)}
                disabled={loading}
                className={`px-6 py-2 bg-${isGA ? 'green' : 'blue'}-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50`}
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
            {!isGA && <p className="text-red-600 font-semibold mt-4">💸 Est. waste: $2,800/month</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isGA ? (
              <>
                <Card label="Monthly Visitors" value={data.visitors} change={12} />
                <Card label="Lead Forms" value={data.leads} change={-5} />
                <Card label="Conversion Rate" value={data.conversion} suffix="%" change={-0.3} />
                <Card label="Bounce Rate" value={data.bounce} suffix="%" change={3} />
                <Card label="Mobile Traffic" value={data.mobile} suffix="%" change={2} />
                <Card label="Avg Time on Site" value={data.time} change={22} />
              </>
            ) : (
              <>
                <Card label="FB/IG Ad Clicks" value={data.clicks} accent="blue" 
                      suffix={` @ $${data.cpc}/click`} />
                <Card label="Leads from Ads" value={data.leads} accent="blue" 
                      suffix={` @ $${data.cpl}/lead`} />
                <Card label="Vehicle Views" value={data.views} accent="blue" />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const events = [
    { name: "Phone Calls", tracking: false, desc: "Missing 40% of lead data!", icon: "📞" },
    { name: "Chat Opens", tracking: false, desc: "Currently invisible", icon: "💬" },
    { name: "Form Starts", tracking: true, desc: "Good! Tracking drop-offs", icon: "📋" },
    { name: "VDP Views", tracking: true, desc: "Great! Vehicle interest tracked", icon: "🚗" },
    { name: "Payment Calc", tracking: false, desc: "5x conversion signals missed", icon: "💰" },
    { name: "Directions", tracking: false, desc: "Store visits = blind spot", icon: "📍" }
  ];

  const comparisonData = [
    { metric: "Page Load Speed", cwv: "✅ 2.8s", ga: "N/A", fb: "N/A" },
    { metric: "Visitor Count", cwv: "N/A", ga: connections.ga ? "✅ 5,247/mo" : "❌ Not Connected", 
      fb: connections.fb ? "✅ 4,892/mo" : "❌ Not Connected" },
    { metric: "Lead Forms", cwv: "N/A", ga: connections.ga ? "✅ 127 leads" : "❌ Not Connected", 
      fb: connections.fb ? "✅ 118 leads" : "❌ Not Connected" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-8 mb-6 shadow border-t-4 border-blue-500">
        <h1 className="text-4xl font-bold mb-3">📊 Analytics & Tracking Dashboard</h1>
        <p className="text-lg text-gray-600">Connect GA4 and Facebook Pixel to see real customer behavior</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="font-semibold text-blue-900">Why This Dashboard is Different</div>
        <div className="text-blue-700 text-sm">
          Core Web Vitals = SPEED. This = what customers DO. You need both.
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-2xl font-bold mb-4">🔄 What Each Tool Measures</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left border-b-2">Metric</th>
              <th className="p-3 text-left border-b-2">Core Web Vitals</th>
              <th className="p-3 text-left border-b-2">GA4</th>
              <th className="p-3 text-left border-b-2">FB Pixel</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-3 border-b font-medium">{row.metric}</td>
                <td className="p-3 border-b">{row.cwv}</td>
                <td className="p-3 border-b">{row.ga}</td>
                <td className="p-3 border-b">{row.fb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Connection Panels */}
      <ConnectionPanel platform="ga" label="Google Analytics 4" icon="📈" color="yellow" />
      <ConnectionPanel platform="fb" label="Facebook Pixel" icon="👥" color="red" />

      {/* Event Tracking */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-2xl font-bold mb-6">🎯 Critical Events to Track</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, i) => (
            <EventStatus key={i} {...event} />
          ))}
        </div>
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-6">
          <div className="font-semibold text-yellow-800 mb-2">⚠️ You're Flying Blind!</div>
          <div className="text-yellow-700 text-sm">
            4 critical events not tracking = missing buyer intent signals
          </div>
        </div>
      </div>

      {/* Setup Code */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-2xl font-bold mb-4">🔧 Quick Setup</h2>
        <details className="mb-4">
          <summary className="cursor-pointer font-semibold text-lg">GA4 Code</summary>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded mt-2 text-xs overflow-x-auto">
{`<script async src="https://www.googletagmanager.com/gtag/js?id=${ids.ga || 'G-XXXXXXXXXX'}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${ids.ga || 'G-XXXXXXXXXX'}');
</script>`}
          </pre>
        </details>
        <details>
          <summary className="cursor-pointer font-semibold text-lg">FB Pixel Code</summary>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded mt-2 text-xs overflow-x-auto">
{`<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${ids.fb || 'YOUR_PIXEL_ID'}');
fbq('track', 'PageView');
</script>`}
          </pre>
        </details>
      </div>

      {/* ROI Impact */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-6">💡 The Payoff</h2>
        <div className="grid grid-cols-3 gap-6 text-center mb-6">
          <div><div className="text-3xl font-bold text-blue-600">-$47</div><div className="text-sm">per lead</div></div>
          <div><div className="text-3xl font-bold text-green-600">+38%</div><div className="text-sm">more leads</div></div>
          <div><div className="text-3xl font-bold text-purple-600">2.8x</div><div className="text-sm">ROAS</div></div>
        </div>
        <div className="bg-white p-4 rounded text-center">
          <p className="font-semibold">🎯 $4,200 more profit/month. Same budget. Just tracking.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;