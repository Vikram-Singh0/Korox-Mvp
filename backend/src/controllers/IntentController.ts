/**
 * KOROX Intent Controller
 * Handles user intents and returns optimal routes
 */

import { Request, Response } from 'express';
import { routeOptimizer, OptimizationPriority } from '../services/route/routeOptimizer.js';
import { chainIntelligence } from '../services/polkadot/chainService.js';
import { ChainName } from '../config/constants.js';
import { logger } from '../config/logger.js';

/**
 * Get list of supported chains (only those currently connected)
 */
export async function getSupportedChains(req: Request, res: Response) {
  try {
    // Get all chain stats to determine which are connected
    const allChains: ChainName[] = [
      'assetHub',
      'hydration',
      'acala',
      'bifrost',
      'moonbeam',
      'astar',
      'parallel',
      'interlay'
    ];

    // Check which chains are actually connected
    const chainStatuses = await Promise.all(
      allChains.map(async (chain) => {
        try {
          const stats = await chainIntelligence.getChainStats(chain);
          return {
            id: chain,
            name: getChainDisplayName(chain),
            isConnected: stats.currentBlock > 0
          };
        } catch (error) {
          return {
            id: chain,
            name: getChainDisplayName(chain),
            isConnected: false
          };
        }
      })
    );

    // Filter to only connected chains
    const connectedChains = chainStatuses.filter(c => c.isConnected);

    res.json({
      success: true,
      chains: connectedChains
    });
  } catch (error) {
    logger.error('Error fetching chains:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported chains'
    });
  }
}

/**
 * Get human-readable chain display names
 */
function getChainDisplayName(chain: ChainName): string {
  const displayNames: Record<ChainName, string> = {
    assetHub: 'Asset Hub',
    hydration: 'Hydration',
    acala: 'Acala',
    bifrost: 'Bifrost',
    moonbeam: 'Moonbeam',
    astar: 'Astar (Shibuya)',
    parallel: 'Parallel',
    interlay: 'Interlay'
  };
  return displayNames[chain] || chain;
}

/**
 * Solve user intent and return optimal routes
 */
export async function solveIntent(req: Request, res: Response) {
  try {
    const {
      fromChain,
      toChain,
      token,
      amount,
      toAddress,
      prefrences
    } = req.body;

    // Validation
    if (!fromChain || !toChain || !token || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fromChain, toChain, token, amount'
      });
    }

    logger.info(`Solving intent: ${fromChain} → ${toChain} (${amount} ${token})`);

    // Map priority
    const priorityMap: Record<string, OptimizationPriority> = {
      'cost': 'cheapest',
      'speed': 'fastest',
      'balanced': 'balanced',
      'reliability': 'reliable'
    };

    const priority = priorityMap[prefrences?.priortize || 'balanced'] || 'balanced';

    // Get ALL possible routes and score them
    const allRoutes = await routeOptimizer.compareRoutes(
      fromChain as ChainName,
      toChain as ChainName,
      token
    );

    if (!allRoutes || allRoutes.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No route found from ${fromChain} to ${toChain}`
      });
    }

    // Sort by score (highest first) and get best route
    allRoutes.sort((a, b) => b.score - a.score);
    const optimalRoute = allRoutes[0];

    // Get alternative routes (different paths only)
    const seenPaths = new Set<string>();
    seenPaths.add(optimalRoute.path.join('-'));
    
    const alternativeRoutes = allRoutes
      .filter(r => {
        const pathKey = r.path.join('-');
        if (seenPaths.has(pathKey)) return false;
        seenPaths.add(pathKey);
        return true;
      })
      .slice(0, 3); // Max 3 alternatives

    // Build response
    const recommendedRoute = buildRouteResponse(optimalRoute, fromChain, toChain, token, amount);
    const alternativeRoutesResponse = alternativeRoutes.map(r => buildRouteResponse(r, fromChain, toChain, token, amount));

    // Calculate analytics
    const totalGasAvg = allRoutes.reduce((sum, r) => sum + r.breakdown.gasCost, 0) / allRoutes.length;
    const savingsPercentage = ((totalGasAvg - optimalRoute.breakdown.gasCost) / totalGasAvg) * 100;
    
    const analytics = {
      totalRoutesAnalyzed: allRoutes.length,
      totalGas: optimalRoute.breakdown.gasCost,
      savingsPercentage: Math.max(0, savingsPercentage),
      avgGasSaving: optimalRoute.savings?.vsBestAlternative || 0,
      avgTimeEstimate: optimalRoute.breakdown.estimatedTime,
      networkHealth: optimalRoute.breakdown.congestionScore < 30 ? 'excellent' : 
                     optimalRoute.breakdown.congestionScore < 70 ? 'good' : 'degraded'
    };

    res.json({
      success: true,
      recommendedRoute,
      alternativeRoutes: alternativeRoutesResponse,
      analytics
    });

  } catch (error: any) {
    logger.error('Error solving intent:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to solve intent'
    });
  }
}

/**
 * Build route response for frontend
 */
function buildRouteResponse(
  route: any,
  fromChain: string,
  toChain: string,
  token: string,
  amount: number
) {
  // Build steps from path
  const steps = route.path.map((chain: string, index: number) => ({
    chain,
    bridge: index < route.path.length - 1 ? 'XCM' : undefined
  }));

  // Calculate gas saving
  const gasSaving = route.savings?.vsBestAlternative || route.savings?.vsDirectRoute || 0;

  return {
    routeId: `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromChain,
    toChain,
    token,
    amount,
    steps,
    totalGas: route.breakdown.gasCost,
    totalTime: route.breakdown.estimatedTime * 1000, // Convert to ms
    relaibility: route.breakdown.reliability,
    congestionLevel: route.breakdown.congestionScore < 30 ? 'low' :
                     route.breakdown.congestionScore < 70 ? 'medium' : 'high',
    gasSaving,
    score: route.score,
    recommendation: route.recommendation
  };
}
