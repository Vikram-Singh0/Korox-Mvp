"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Loader2,
  ArrowDownUp,
  Coins,
  TrendingUp,
} from "lucide-react";

interface IntentFormProps {
  onSubmit: (intent: any) => void;
  isLoading: boolean;
}

export default function IntentForm({ onSubmit, isLoading }: IntentFormProps) {
  const [chains, setChains] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fromChain: "",
    toChain: "",
    token: "DOT",
    amount: "",
    priortize: "balanced",
  });

  useEffect(() => {
    // Fetch supported chains
    fetch("http://localhost:4000/api/intents/chains")
      .then((res) => res.json())
      .then((data) => setChains(data.chains || []))
      .catch(console.error);
  }, []);

  const swapChains = () => {
    setFormData({
      ...formData,
      fromChain: formData.toChain,
      toChain: formData.fromChain,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      toAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Demo address
      prefrences: {
        priortize: formData.priortize,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Chain Selection Card */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-4">
          {/* From Chain */}
          <div className="relative group">
            <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
              Source Chain
            </label>
            <select
              value={formData.fromChain}
              onChange={(e) =>
                setFormData({ ...formData, fromChain: e.target.value })
              }
              className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-slate-600/50 appearance-none cursor-pointer font-medium"
              required
            >
              <option value="" className="bg-slate-800">
                Select source chain...
              </option>
              {chains.map((chain) => (
                <option key={chain} value={chain} className="bg-slate-800">
                  {chain.charAt(0).toUpperCase() + chain.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={swapChains}
              className="p-3 bg-slate-800 border-2 border-slate-700 rounded-xl hover:bg-slate-700 transition-all hover:scale-110 hover:rotate-180 duration-300 group shadow-lg"
              title="Swap chains"
            >
              <ArrowDownUp
                className="text-purple-400 group-hover:text-pink-400 transition-colors"
                size={20}
              />
            </button>
          </div>

          {/* To Chain */}
          <div className="relative group">
            <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full"></div>
              Destination Chain
            </label>
            <select
              value={formData.toChain}
              onChange={(e) =>
                setFormData({ ...formData, toChain: e.target.value })
              }
              className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all hover:border-slate-600/50 appearance-none cursor-pointer font-medium"
              required
            >
              <option value="" className="bg-slate-800">
                Select destination chain...
              </option>
              {chains.map((chain) => (
                <option key={chain} value={chain} className="bg-slate-800">
                  {chain.charAt(0).toUpperCase() + chain.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Amount & Token Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <label className="block text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
            <Coins className="text-blue-400" size={18} />
            Transfer Amount
          </label>

          <div className="flex gap-3">
            {/* Token Selector */}
            <div className="w-1/3">
              <select
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value })
                }
                className="w-full px-4 py-4 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-slate-500/50 appearance-none cursor-pointer font-bold text-lg"
              >
                <option value="DOT" className="bg-slate-800">
                  DOT
                </option>
                <option value="USDT" className="bg-slate-800">
                  USDT
                </option>
                <option value="USDC" className="bg-slate-800">
                  USDC
                </option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                className="w-full px-5 py-4 bg-slate-700/50 border-2 border-slate-600/50 rounded-xl text-white text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-slate-500/50 placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-3">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, amount: amount.toString() })
                }
                className="flex-1 px-3 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg text-sm text-gray-400 hover:bg-slate-600/30 hover:text-white hover:border-slate-500/50 transition-all font-medium"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Selection */}
      <div className="relative">
        <label className="block text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
          <TrendingUp className="text-emerald-400" size={18} />
          Optimization Strategy
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              value: "cost",
              label: "Lowest Cost",
              icon: "💰",
              color: "emerald",
            },
            { value: "speed", label: "Fastest", icon: "⚡", color: "blue" },
            {
              value: "balanced",
              label: "Balanced",
              icon: "⚖️",
              color: "purple",
            },
          ].map((priority) => (
            <label
              key={priority.value}
              className="relative cursor-pointer group"
            >
              <input
                type="radio"
                name="priority"
                value={priority.value}
                checked={formData.priortize === priority.value}
                onChange={(e) =>
                  setFormData({ ...formData, priortize: e.target.value })
                }
                className="peer sr-only"
              />
              <div
                className={`p-4 bg-slate-800/30 border-2 border-slate-700/50 rounded-xl transition-all peer-checked:border-${priority.color}-500 peer-checked:bg-${priority.color}-500/10 hover:border-slate-600/50 hover:bg-slate-700/30`}
              >
                <div className="text-2xl mb-2 text-center">{priority.icon}</div>
                <div className="text-sm font-bold text-center text-gray-300 peer-checked:text-white">
                  {priority.label}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative group pt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white py-5 px-6 rounded-2xl font-black text-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span>Analyzing Routes...</span>
            </>
          ) : (
            <>
              <span>Find Optimal Route</span>
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
