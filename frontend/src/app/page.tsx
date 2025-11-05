"use client";

import { useState, useEffect } from "react";
import IntentForm from "@/components/IntentForm";
import RouteDisplay from "@/components/RouteDisplay";
import Analytics from "@/components/Analytics";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Network,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleIntentSubmit = async (intent: any) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:4000/api/intents/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intent),
      });

      if (!response.ok) {
        throw new Error("Failed to solve intent");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(
        err.message ||
          "An error occurred. Please make sure the backend server is running on http://localhost:4000"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inselinear-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-linear-to-br from-purple-500 via-pink-500 to-blue-500 p-2.5 rounded-2xl shadow-2xl">
                  <Network className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                  KOROX
                </h1>
                <p className="text-xs text-gray-400 font-semibold tracking-wide">
                  INTELLIGENT ROUTING
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Network</span>
              </div>
              <div className="text-gray-400 text-sm">
                <span className="text-white font-semibold">4</span> Parachains
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {/* Hero Section */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Sparkles className="text-purple-400" size={16} />
              <span className="text-sm font-semibold text-purple-300">
                Next-Gen Cross-Chain Technology
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Discover the
              <br />
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Perfect Route
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              AI-powered intent solver for Polkadot ecosystem. Maximize savings,
              minimize time, ensure reliability.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="group">
                <div className="text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">
                  30%
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Avg Gas Savings
                </div>
              </div>
              <div className="group">
                <div className="text-3xl font-black text-white mb-1 group-hover:text-pink-400 transition-colors">
                  2.5s
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Avg Route Time
                </div>
              </div>
              <div className="group">
                <div className="text-3xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
                  98%
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Success Rate
                </div>
              </div>
            </div>
          </div>

          {/* Intent Form */}
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                  <TrendingUp className="text-purple-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Configure Your Transfer
                </h3>
              </div>
              <IntentForm onSubmit={handleIntentSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10">
                <LoadingSpinner />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="relative group animate-shake">
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
                  <AlertCircle className="text-red-400 shrink-0" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-red-300 font-bold mb-2 text-lg">
                    Connection Error
                  </p>
                  <p className="text-red-200/80 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-10 animate-slide-up">
              {/* Analytics */}
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                      <Zap className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Performance Analytics
                    </h3>
                  </div>
                  <Analytics
                    analytics={result.analytics}
                    routes={[
                      result.recommendedRoute,
                      ...result.alternativeRoutes,
                    ]}
                  />
                </div>
              </div>

              {/* Recommended Route */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-500/30">
                    <Sparkles className="text-yellow-400" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Optimal Route
                  </h3>
                </div>
                <RouteDisplay route={result.recommendedRoute} isRecommended />
              </div>

              {/* Alternative Routes */}
              {result.alternativeRoutes.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                      <ArrowRight className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Alternative Paths
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {result.alternativeRoutes.map((route: any) => (
                      <RouteDisplay key={route.routeId} route={route} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!result && !isLoading && !error && (
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-slate-500/5 to-slate-400/5 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl border-2 border-dashed border-white/10 p-16 text-center">
                <div className="max-w-lg mx-auto">
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl"></div>
                    <Network
                      className="relative mx-auto text-purple-400"
                      size={64}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Ready to Route
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Configure your transfer above and let KOROX find the most
                    efficient cross-chain path with optimal gas costs and
                    transaction times.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-slate-900/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-black text-2xl bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                KOROX
              </p>
              <p className="text-sm text-gray-400">
                Next-Gen Cross-Chain Intent Solver
              </p>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <div className="text-gray-400">
                <span className="text-white font-semibold">Powered by</span>
              </div>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 font-medium">
                  Polkadot.js
                </span>
                <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-300 font-medium">
                  XCM
                </span>
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 font-medium">
                  Hyperbridge
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-gray-500 text-sm">
            <p>© 2025 KOROX. Built for the Polkadot Ecosystem Grant Program.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
