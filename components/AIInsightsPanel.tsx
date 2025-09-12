"use client";
import React from "react";
import { useAI } from "@/hooks/useAI";

export default function AIInsightsPanel({ data }: { data: any }) {
  const insights = useAI(data);
  if (!insights) return <div className="p-4 text-gray-400">Loading AI insights…</div>;
  if (!insights.length) return <div className="p-4 text-gray-400">No AI insights available.</div>;
  return (
    <div className="space-y-3">
      {insights.map((i: any) => (
        <div key={i.id} className={`p-4 rounded-lg border ${style(i.severity)}`}>
          <h4 className="font-medium text-white mb-1">{i.title}</h4>
          <p className="text-sm text-gray-300">{i.description}</p>
        </div>
      ))}
    </div>
  );
}

function style(severity?: string) {
  if (severity === "success") return "border-green-600 bg-green-900/20";
  if (severity === "warning") return "border-yellow-600 bg-yellow-900/20";
  if (severity === "danger")  return "border-red-600 bg-red-900/20";
  return "border-gray-700 bg-gray-800/50";
}
