"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown, TrendingUp, Activity, Target } from "lucide-react";

interface AnalyticsProps {
  analytics: {
    averageGas: number;
    savingsAmount: number;
    savingsPercentage: number;
  };
  routes: any[];
}

export default function Analytics({ analytics, routes }: AnalyticsProps) {
  const chartData = routes.map((route, index) => ({
    name: index === 0 ? "Optimal" : `Alt ${index}`,
    gas: parseFloat(route.totalGas.toFixed(4)),
    time: parseFloat((route.totalTime / 1000).toFixed(1)),
    reliability: route.relaibility,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Gas Savings Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-emerald-500/90 to-teal-500/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-emerald-100 uppercase tracking-wide">
                Total Savings
              </div>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingDown size={20} className="text-white" />
              </div>
            </div>
            <div className="text-5xl font-black text-white mt-3 mb-2">
              {analytics.savingsPercentage.toFixed(1)}%
            </div>
            <div className="flex items-baseline gap-2 text-emerald-100">
              <span className="text-2xl font-bold">
                {analytics.savingsAmount.toFixed(4)}
              </span>
              <span className="text-sm font-semibold opacity-90">
                DOT saved
              </span>
            </div>
          </div>
        </div>

        {/* Average Gas Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-blue-500/90 to-indigo-500/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-blue-100 uppercase tracking-wide">
                Avg Gas Cost
              </div>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Activity size={20} className="text-white" />
              </div>
            </div>
            <div className="text-5xl font-black text-white mt-3 mb-2">
              {analytics.averageGas.toFixed(4)}
            </div>
            <div className="flex items-baseline gap-2 text-blue-100">
              <span className="text-sm font-semibold opacity-90">
                DOT per route
              </span>
            </div>
          </div>
        </div>

        {/* Routes Found Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-purple-100 uppercase tracking-wide">
                Routes Found
              </div>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Target size={20} className="text-white" />
              </div>
            </div>
            <div className="text-5xl font-black text-white mt-3 mb-2">
              {routes.length}
            </div>
            <div className="flex items-baseline gap-2 text-purple-100">
              <span className="text-sm font-semibold opacity-90">
                Optimal paths discovered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-slate-400/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-slate-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
            Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
                axisLine={{ stroke: "#475569" }}
                tickLine={{ stroke: "#475569" }}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "#475569" }}
                tickLine={{ stroke: "#475569" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "2px solid #334155",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                  padding: "12px",
                  color: "#fff",
                }}
                cursor={{ fill: "#1e293b", opacity: 0.3 }}
                labelStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "25px" }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="gas"
                fill="url(#gasGradient)"
                name="Gas Cost (DOT)"
                radius={[10, 10, 0, 0]}
                maxBarSize={60}
              />
              <Bar
                dataKey="time"
                fill="url(#timeGradient)"
                name="Time (s)"
                radius={[10, 10, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
