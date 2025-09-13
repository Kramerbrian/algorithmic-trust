import React, { useEffect, useState } from 'react';

/**
 * Example integration component for the dealershipAI dashboard.
 *
 * This React component demonstrates how to fetch data from the
 * multi‑agent backend (e.g. via a Next.js API route) and render the
 * results with a witty, humorous tone. It includes a section for
 * auto‑generated responses that incorporate subtle pop culture
 * references (think Ludicrous Mode without explicitly saying so) and
 * one‑click escalation workflows.
 */
export default function DealershipAIIntegrationExample() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const businessName = 'Toyota of Naples';
  const location = 'Naples, FL';

  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true);
      try {
        const resp = await fetch(`/api/analysis?businessName=${encodeURIComponent(businessName)}&location=${encodeURIComponent(location)}`);
        const data = await resp.json();
        setAnalysis(data);
      } catch (err) {
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [businessName, location]);

  const handleRespond = (platform: string, text: string) => {
    // In a real app, this would POST the response to the appropriate
    // service (e.g. Google, Yelp). For now, we just log to the console.
    console.log(`Posting witty response to ${platform}:`, text);
    alert(`🚀 Response sent to ${platform}!\n\n${text}\n\nHold on tight, we’re shifting into Plaid…`);
  };

  if (loading || !analysis) {
    return <div className="p-4 text-gray-500">Loading analysis…</div>;
  }

  const { visibility_reports, competitor_reports, review_data, auto_responses } = analysis;

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Algorithmic Trust Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">Visibility Metrics</h2>
        {visibility_reports.map((vr: any) => (
          <div key={vr.query} className="mb-4 p-4 bg-slate-800 text-gray-200 rounded">
            <h3 className="font-medium">Query: {vr.query}</h3>
            <p>Visibility Score: {vr.visibility_score}%</p>
            <p>Platforms Mentioned: {vr.platforms_mentioned.join(', ') || 'None'}</p>
            <p>Revenue at Risk: ${vr.revenue_at_risk.toLocaleString()}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Reviews & Sentiment</h2>
        <div className="p-4 bg-slate-800 text-gray-200 rounded">
          <p>Overall Rating: {review_data.overall_rating}★</p>
          <p>Sentiment: {(review_data.overall_sentiment * 100).toFixed(1)}%</p>
          <p className="mt-2 text-sm text-slate-400">Our reputation engines are humming. But remember: even a hyperspace drive needs maintenance.</p>
        </div>
      </section>
      {auto_responses && auto_responses.suggestions && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Quick Quips (Auto‑Responses)</h2>
          <p className="text-slate-400 text-sm mb-4">Below are witty responses suggested for platforms with low response rates. Engage responsibly—these are set to overdrive.</p>
          {Object.entries(auto_responses.suggestions).map(([platform, response]) => (
            <div key={platform} className="mb-4 p-4 bg-slate-900 text-gray-100 rounded border border-slate-700">
              <h3 className="font-medium">{platform}</h3>
              <p className="mb-2">{response}</p>
              <button
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                onClick={() => handleRespond(platform, response as string)}
              >
                Engage Plaid Mode
              </button>
            </div>
          ))}
        </section>
      )}
      <section>
        <h2 className="text-xl font-semibold mb-2">Competitor Overview</h2>
        {competitor_reports.map((cr: any) => (
          <div key={cr.query} className="mb-4 p-4 bg-slate-800 text-gray-200 rounded">
            <h3 className="font-medium">Query: {cr.query}</h3>
            {cr.competitors.length > 0 ? (
              <ul className="list-disc pl-6">
                {cr.competitors.slice(0, 3).map(([name, count]: any) => (
                  <li key={name}>{name} — {count} mentions</li>
                ))}
              </ul>
            ) : (
              <p>No competitors detected for this query.</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}