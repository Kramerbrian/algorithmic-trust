import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, BarChart3, Globe, Star, MapPin, Users } from "lucide-react";

export default function DealerAIDashboard() {
  const [activeTab, setActiveTab] = useState("ai");

  const tabs = [
    { id: "ai", label: "AI Visibility", icon: <Search size={16} /> },
    { id: "ugc", label: "UGC & Reviews", icon: <Star size={16} /> },
    { id: "zero", label: "Zero-Click", icon: <Globe size={16} /> },
    { id: "geo", label: "Local GEO", icon: <MapPin size={16} /> },
    { id: "comp", label: "Competitors", icon: <Users size={16} /> },
  ];

  const MetricCard = ({ label, value, status, description }) => (
    <Card className="rounded-2xl shadow-md bg-neutral-900 border border-neutral-800">
      <CardContent className="p-4">
        <div className="text-sm text-neutral-400 mb-1">{label}</div>
        <div className={`text-2xl font-bold ${status === "good" ? "text-green-500" : status === "warn" ? "text-yellow-400" : "text-red-500"}`}>{value}</div>
        <div className="text-xs text-neutral-500 mt-1">{description}</div>
      </CardContent>
    </Card>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "ai":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="AI Mentions" value="42%" status="bad" description="% of AI queries that named your store" />
            <MetricCard label="Visibility Index" value="62/100" status="warn" description="Composite score across AI platforms" />
            <MetricCard label="Revenue at Risk" value="$47K/mo" status="bad" description="Estimated lost gross due to AI blindness" />
          </div>
        );
      case "ugc":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Google Reviews" value="4.2 ★" status="warn" description="Average rating (3,240 reviews)" />
            <MetricCard label="DealerRater Response Rate" value="62%" status="bad" description="Last 30 days response" />
            <MetricCard label="Yelp Sentiment" value="78%" status="good" description="Positive mentions" />
          </div>
        );
      case "zero":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Zero-Click Coverage" value="38%" status="bad" description="% of queries where you appear without click" />
            <MetricCard label="Schema Health" value="65%" status="warn" description="Structured data audit score" />
            <MetricCard label="Citations Indexed" value="114" status="good" description="Structured citations discovered" />
          </div>
        );
      case "geo":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Local Pack Presence" value="2/5" status="warn" description="Appearances in top-3 Google results" />
            <MetricCard label="GBP Health" value="74%" status="warn" description="Profile completeness score" />
            <MetricCard label="NAP Consistency" value="88%" status="good" description="Consistency across directories" />
          </div>
        );
      case "comp":
        return (
          <div className="grid grid-cols-1 gap-4">
            <Card className="rounded-2xl shadow bg-neutral-900 border border-neutral-800 p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="font-semibold text-white">Kennesaw Hyundai</div>
                  <div className="text-sm text-neutral-500">Avg price: $31,450</div>
                </div>
                <div className="text-red-500 font-bold">-$2,340</div>
              </div>
              <div className="text-xs text-neutral-400">AI Visibility: 68% | GBP Health: 92%</div>
            </Card>
            <Card className="rounded-2xl shadow bg-neutral-900 border border-neutral-800 p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="font-semibold text-white">Roswell Hyundai</div>
                  <div className="text-sm text-neutral-500">Avg price: $33,200</div>
                </div>
                <div className="text-green-500 font-bold">+$590</div>
              </div>
              <div className="text-xs text-neutral-400">AI Visibility: 81% | GBP Health: 88%</div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-neutral-950 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dealer AI Visibility Dashboard</h1>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id ? "bg-blue-600" : "bg-neutral-800"} text-white px-3 py-1 rounded-md text-sm flex items-center gap-1`}
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>
      </div>
      {renderTab()}
    </div>
  );
}
