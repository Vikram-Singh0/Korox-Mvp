"use client";

import {
  ArrowRight,
  Clock,
  Zap,
  Shield,
  Star,
  TrendingDown,
} from "lucide-react";

interface RouteDisplayProps {
  route: any;
  isRecommended?: boolean;
}

export default function RouteDisplay({
  route,
  isRecommended = false,
}: RouteDisplayProps) {
  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low":
        return "from-green-500/20 to-green-600/20 border-green-500/30 text-green-300";
      case "medium":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-300";
      case "high":
        return "from-red-500/20 to-red-600/20 border-red-500/30 text-red-300";
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300";
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return "text-green-400";
    if (reliability >= 90) return "text-orange-400";
    return "text-yellow-400";
  };

  return (
    <div
      className={`relative group transition-all duration-500 hover:scale-[1.01] ${
        isRecommended ? "scale-[1.02]" : ""
      }`}
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity ${
          isRecommended
            ? "bg-gradient-to-r from-orange-500/30 to-orange-600/30 opacity-50"
            : "bg-gradient-to-r from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-30"
        }`}
      ></div>

      <div
        className={`relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 transition-all ${
          isRecommended
            ? "border-orange-500/50 shadow-2xl shadow-orange-500/20"
            : "border-orange-500/20 hover:border-orange-500/30"
        }`}
      >
        {isRecommended && (
          <div className="flex items-center gap-2 mb-5 pb-5 border-b border-orange-500/20">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-50 animate-pulse"></div>
              <Star
                className="relative text-orange-400 fill-orange-400"
                size={22}
              />
            </div>
            <span className="text-lg font-black text-orange-400">
              OPTIMAL ROUTE ⚔️
            </span>
          </div>
        )}

        {/* Route Path */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {route.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="relative group/chain">
                    <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-0 group-hover/chain:opacity-40 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/30 px-4 py-3 rounded-xl backdrop-blur-sm hover:border-orange-400/50 transition-all">
                      <span className="text-white font-bold text-sm">
                        {step.chain.charAt(0).toUpperCase() +
                          step.chain.slice(1)}
                      </span>
                    </div>
                  </div>
                  {step.bridge && (
                    <div className="px-2 py-0.5 bg-zinc-900/50 border border-orange-500/20 rounded-md">
                      <span className="text-xs text-orange-300 font-semibold">
                        {step.bridge}
                      </span>
                    </div>
                  )}
                </div>
                {index < route.steps.length - 1 && (
                  <ArrowRight
                    className="text-gray-500 flex-shrink-0"
                    size={18}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Gas Fee */}
          <div className="relative group/metric">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl blur-md opacity-0 group-hover/metric:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border border-yellow-500/20 p-4 rounded-xl backdrop-blur-sm hover:border-yellow-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Zap size={20} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                    Gas Fee
                  </div>
                  <div className="text-xl font-black text-white">
                    {route.totalGas.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">WND</div>
                </div>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="relative group/metric">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl blur-md opacity-0 group-hover/metric:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20 p-4 rounded-xl backdrop-blur-sm hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                    Time
                  </div>
                  <div className="text-xl font-black text-white">
                    {(route.totalTime / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    seconds
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reliability */}
          <div className="relative group/metric">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl blur-md opacity-0 group-hover/metric:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-emerald-500/5 to-green-500/5 border border-emerald-500/20 p-4 rounded-xl backdrop-blur-sm hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Shield size={20} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                    Reliability
                  </div>
                  <div
                    className={`text-xl font-black ${getReliabilityColor(
                      route.relaibility
                    )}`}
                  >
                    {(route.relaibility ?? 0).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Congestion */}
          <div className="relative group/metric">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getCongestionColor(
                route.congestionLevel
              )} rounded-xl blur-md opacity-0 group-hover/metric:opacity-100 transition-opacity`}
            ></div>
            <div
              className={`relative bg-gradient-to-br ${getCongestionColor(
                route.congestionLevel
              )} border p-4 rounded-xl backdrop-blur-sm hover:border-opacity-60 transition-all`}
            >
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">
                Network Status
              </div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border ${
                  getCongestionColor(route.congestionLevel).split(" ")[1]
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    route.congestionLevel === "low"
                      ? "bg-emerald-400"
                      : route.congestionLevel === "medium"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  } animate-pulse`}
                ></div>
                <span
                  className={`text-sm font-black uppercase ${
                    getCongestionColor(route.congestionLevel).split(" ")[2]
                  }`}
                >
                  {route.congestionLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gas Savings Banner */}
        {route.gasSaving > 0 && (
          <div className="relative group/savings overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingDown className="text-emerald-400" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-emerald-300 font-bold text-sm">
                    Gas Optimization
                  </p>
                  <p className="text-white font-black text-lg">
                    {route.gasSaving.toFixed(1)}% savings
                    <span className="text-sm text-gray-400 font-medium ml-2">
                      vs avg routes
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
