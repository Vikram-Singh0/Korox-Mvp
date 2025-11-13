"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Loader2,
  ArrowDownUp,
  Coins,
  TrendingUp,
} from "lucide-react";

interface Chain {
  id: string;
  name: string;
  isConnected: boolean;
}

interface IntentFormProps {
  onSubmit: (intent: any) => void;
  isLoading: boolean;
}

export default function IntentForm({ onSubmit, isLoading }: IntentFormProps) {
  const [connectedChains, setConnectedChains] = useState<Chain[]>([]);
  const [isLoadingChains, setIsLoadingChains] = useState(true);
  
  const [formData, setFormData] = useState({
    fromChain: "",
    toChain: "",
    token: "WND",
    amount: "",
    priortize: "balanced",
  });

  // Fetch connected chains from backend
  useEffect(() => {
    const fetchChains = async () => {
      try {
        setIsLoadingChains(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/chains`);
        const data = await response.json();
        
        if (data.success && data.chains) {
          setConnectedChains(data.chains);
          // Set default chains if available
          if (data.chains.length > 0) {
            setFormData(prev => ({
              ...prev,
              fromChain: prev.fromChain || data.chains[0].id,
              toChain: prev.toChain || (data.chains.length > 1 ? data.chains[1].id : "")
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch chains:", error);
        // Fallback to hardcoded chains if API fails
        const fallbackChains = [
          { id: "assetHub", name: "Asset Hub (Westend)", isConnected: true },
          { id: "hydration", name: "Hydration", isConnected: true },
          { id: "moonbeam", name: "Moonbase Alpha", isConnected: true },
          { id: "astar", name: "Shibuya (Astar)", isConnected: true },
        ];
        setConnectedChains(fallbackChains);
        setFormData(prev => ({
          ...prev,
          fromChain: prev.fromChain || "assetHub",
          toChain: prev.toChain || "hydration"
        }));
      } finally {
        setIsLoadingChains(false);
      }
    };

    fetchChains();
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Chain Selection Card */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-3">
          {/* From Chain */}
          <div className="relative group">
            <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2">
              <div className="w-1 h-3 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
              Source Chain
            </label>
            <select
              value={formData.fromChain}
              onChange={(e) =>
                setFormData({ ...formData, fromChain: e.target.value })
              }
              disabled={isLoadingChains}
              className="w-full px-4 py-3 bg-black/50 border border-orange-500/30 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-500/50 appearance-none cursor-pointer font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="" className="bg-zinc-900">
                {isLoadingChains ? "Loading chains..." : "Select source chain..."}
              </option>
              {connectedChains.map((chain) => (
                <option key={chain.id} value={chain.id} className="bg-zinc-900">
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1.5 relative z-10">
            <button
              type="button"
              onClick={swapChains}
              className="p-2.5 bg-zinc-900 border border-orange-500/30 rounded-xl hover:bg-orange-500/10 transition-all hover:scale-110 hover:rotate-180 duration-300 group shadow-lg"
              title="Swap chains"
            >
              <ArrowDownUp
                className="text-orange-400 group-hover:text-orange-300 transition-colors"
                size={18}
              />
            </button>
          </div>

          {/* To Chain */}
          <div className="relative group">
            <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2">
              <div className="w-1 h-3 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
              Destination Chain
            </label>
            <select
              value={formData.toChain}
              onChange={(e) =>
                setFormData({ ...formData, toChain: e.target.value })
              }
              disabled={isLoadingChains}
              className="w-full px-4 py-3 bg-black/50 border border-orange-500/30 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-500/50 appearance-none cursor-pointer font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="" className="bg-zinc-900">
                {isLoadingChains ? "Loading chains..." : "Select destination chain..."}
              </option>
              {connectedChains.map((chain) => (
                <option key={chain.id} value={chain.id} className="bg-zinc-900">
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Amount & Token Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-orange-500/5 rounded-xl blur-lg"></div>
        <div className="relative bg-black/30 border border-orange-500/30 rounded-xl p-4">
          <label className="block text-xs font-bold text-gray-300 mb-3 flex items-center gap-2">
            <Coins className="text-orange-400" size={16} />
            Transfer Amount
          </label>

          <div className="flex gap-2">
            {/* Token Selector */}
            <div className="w-1/3">
              <select
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value })
                }
                className="w-full px-3 py-3 bg-zinc-900/50 border border-orange-500/30 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-500/50 appearance-none cursor-pointer font-bold text-base"
              >
                <option value="WND" className="bg-zinc-900">
                  WND
                </option>
                <option value="USDT" className="bg-zinc-900">
                  USDT
                </option>
                <option value="USDC" className="bg-zinc-900">
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
                className="w-full px-4 py-3 bg-zinc-900/50 border border-orange-500/30 rounded-lg text-white text-base font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-500/50 placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-2">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, amount: amount.toString() })
                }
                className="flex-1 px-2 py-1.5 bg-zinc-900/30 border border-orange-500/20 rounded-lg text-xs text-gray-400 hover:bg-orange-500/10 hover:text-orange-300 hover:border-orange-500/40 transition-all font-medium"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Selection */}
      <div className="relative">
        <label className="block text-xs font-bold text-gray-300 mb-3 flex items-center gap-2">
          <TrendingUp className="text-orange-400" size={16} />
          Optimization Strategy
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              value: "cost",
              label: "Lowest Cost",
              icon: "💰",
              color: "orange",
            },
            { value: "speed", label: "Fastest", icon: "⚡", color: "orange" },
            {
              value: "balanced",
              label: "Balanced",
              icon: "⚔️",
              color: "orange",
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
              <div className="p-3 bg-zinc-900/30 border border-orange-500/20 rounded-xl transition-all peer-checked:border-orange-500 peer-checked:bg-orange-500/10 hover:border-orange-500/40 hover:bg-zinc-900/50">
                <div className="text-xl mb-1 text-center">{priority.icon}</div>
                <div className="text-xs font-bold text-center text-gray-400 peer-checked:text-orange-300">
                  {priority.label}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative group pt-1">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-black text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Finding Path...</span>
            </>
          ) : (
            <>
              <span>⚔️ Strike with Precision</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
