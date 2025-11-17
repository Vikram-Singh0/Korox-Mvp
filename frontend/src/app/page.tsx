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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/intents/solve`, {
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
          "An error occurred. Please make sure the backend server is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background - Orange glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        {/* Katana slash effect */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5">
          <div className="absolute top-20 right-20 w-1/2 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent rotate-45 blur-sm"></div>
          <div className="absolute bottom-40 left-40 w-1/3 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent -rotate-45 blur-sm"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-orange-500/20 backdrop-blur-xl bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* KOROX Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-lg"></div>
                <img
                  src="/KOROX_main_logo.png"
                  alt="KOROX - Cutting Complex Paths"
                  className="relative h-15 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  <span className="text-white">KORO</span>
                  <span className="text-orange-500">X</span>
                </h1>
                <p className="text-xs text-orange-400 font-semibold tracking-widest uppercase">
                  Cutting Complex Paths
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
          {/* Hero Section - Left Side */}
          <div
            className={`flex flex-col justify-center transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6 w-fit">
              <Sparkles className="text-orange-400" size={16} />
              <span className="text-sm font-semibold text-orange-300">
                Beta Version
              </span>
            </div>

            <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              <span className="text-orange-500">Slash</span> Through
              <br />
              Complex Routes
            </h2>

            <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-xl">
              Like a{" "}
              <span className="text-orange-500 font-bold">
                katana cutting through complexity
              </span>
              , KOROX finds the sharpest path across Polkadot parachains.
              Precision. Speed. Efficiency.
            </p>

            {/* Katana Visual Metaphor */}
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-500/5 to-transparent border-l-4 border-orange-500 rounded-r-xl">
              <p className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">⚔️</span> The KOROX Way
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Multiple routes exist. Only one is optimal. Our intent solver
                analyzes gas costs, congestion, and reliability—then strikes
                with precision.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6">
              <div className="group text-center">
                <div className="text-4xl font-black bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  30%
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Avg Gas Savings
                </div>
              </div>
              <div className="group text-center">
                <div className="text-4xl font-black bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  2.5s
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Route Time
                </div>
              </div>
              <div className="group text-center">
                <div className="text-4xl font-black bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  98%
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Success Rate
                </div>
              </div>
            </div>
          </div>

          {/* Intent Form - Right Side */}
          <div className="flex flex-col justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl border border-orange-500/30">
                    <TrendingUp className="text-orange-400" size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Configure Your Transfer
                  </h3>
                </div>
                <IntentForm
                  onSubmit={handleIntentSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Results Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Loading State */}
        {isLoading && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-orange-500/20">
              <LoadingSpinner />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="relative group animate-shake">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-6 flex items-start gap-4">
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
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl border border-orange-500/30">
                    <Zap className="text-orange-400" size={24} />
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
                <div className="p-2 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-xl border border-orange-500/30">
                  <Sparkles className="text-orange-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Optimal Route <span className="text-orange-500">⚔️</span>
                </h3>
              </div>
              <RouteDisplay route={result.recommendedRoute} isRecommended />
            </div>

            {/* Alternative Routes */}
            {result.alternativeRoutes.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl border border-gray-500/30">
                    <ArrowRight className="text-gray-400" size={24} />
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
            <div className="absolute inset-0 bg-orange-500/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-zinc-900/50 backdrop-blur-xl rounded-3xl border-2 border-dashed border-orange-500/20 p-16 text-center">
              <div className="max-w-lg mx-auto">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl"></div>
                  <div className="text-6xl relative">⚔️</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Ready to Strike
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Configure your transfer above and let KOROX's katana precision
                  find the sharpest cross-chain path through the Polkadot
                  ecosystem.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-orange-500/20 backdrop-blur-xl bg-black/80 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-black text-2xl mb-2">
                <span className="text-orange-500">KOR</span>
                <span className="text-white">OX</span>
              </p>
              <p className="text-sm text-gray-400">
                Cutting Complex Paths in Polkadot
              </p>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <div className="text-gray-400">
                <span className="text-white font-semibold">Powered by</span>
              </div>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 font-medium">
                  Polkadot.js
                </span>
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 font-medium">
                  XCM
                </span>
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 font-medium">
                  Hyperbridge
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-orange-500/10 text-center text-gray-500 text-sm">
            <p>© 2025 KOROX. Built for the Polkadot Ecosystem .</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
