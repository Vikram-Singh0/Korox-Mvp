export interface UserIntent {
  fromChain: string;
  toChain: string;
  token: string;
  amount: number;
  toAddress: string;
  prefrences?: {
    priortize?: "speed" | "cost" | "balanced";
  };
}

export interface RouteStep {
  chain: string;
  bridge?: string;
  action: string;
  estimatedGas: number;
  estimatedTime: number;
}

export interface OptimizedRoute {
  routeId: string;
  steps: RouteStep[];
  totalGas: number;
  totalTime: number;
  congestionLevel: "low" | "medium" | "heigh";
  gasSaving: number;
  relaibility: number; //onto scale of 1 to 100
}
export interface RouteResponse {
  intent: UserIntent;
  recommendedRoute: OptimizedRoute;
  alternativeRoutes: OptimizedRoute[];
  analytics: {
    averageGas: number;
    savingsAmount: number;
    savingsPercentage: number;
  };
}
