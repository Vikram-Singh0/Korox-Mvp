"use client";

import { Network } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 w-24 h-24 -ml-2 -mt-2">
          <div className="w-full h-full border-4 border-purple-500/20 rounded-full animate-ping"></div>
        </div>

        {/* Main spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 border-b-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 border-r-blue-500 border-b-purple-500 rounded-full animate-spin-reverse"></div>
        </div>

        {/* Center icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse">
            <Network className="text-white" size={24} />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2 text-center">
        <p className="text-white font-bold text-xl">Analyzing Routes</p>
        <p className="text-gray-400 text-sm font-medium">
          Calculating optimal cross-chain paths...
        </p>
        <div className="flex items-center justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
