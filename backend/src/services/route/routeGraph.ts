/**
 * KOROX Route Graph
 * 
 * Knowledge base of all possible XCM routes in the Polkadot ecosystem.
 * Maps direct connections and multi-hop paths between parachains.
 */

import { ChainName } from '../../config/constants.js';
import { logger } from '../../config/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface RouteEdge {
  from: ChainName;
  to: ChainName;
  isActive: boolean;
  avgTransferTime: number; // seconds
  reliability: number; // 0-100
  supportedAssets: string[];
}

export interface RoutePath {
  path: ChainName[];
  hops: number;
  estimatedTime: number; // seconds
  totalReliability: number; // 0-100
}

// ============================================================================
// Route Graph - XCM Connection Map
// ============================================================================

/**
 * Known XCM routes in Polkadot ecosystem
 * This is our "knowledge base" of chain connectivity
 */
export const XCM_ROUTES: RouteEdge[] = [
  // Asset Hub as Central Hub - connects to most chains
  {
    from: 'assetHub',
    to: 'hydration',
    isActive: true,
    avgTransferTime: 24,
    reliability: 95,
    supportedAssets: ['WND', 'USDT', 'USDC']
  },
  {
    from: 'assetHub',
    to: 'moonbeam',
    isActive: true,
    avgTransferTime: 30,
    reliability: 92,
    supportedAssets: ['WND', 'USDT', 'USDC']
  },
  {
    from: 'assetHub',
    to: 'astar',
    isActive: true,
    avgTransferTime: 28,
    reliability: 93,
    supportedAssets: ['WND', 'USDT']
  },
  {
    from: 'assetHub',
    to: 'acala',
    isActive: false, // Testnet unavailable
    avgTransferTime: 26,
    reliability: 90,
    supportedAssets: ['WND', 'aUSD', 'USDT']
  },
  {
    from: 'assetHub',
    to: 'bifrost',
    isActive: false, // Testnet unavailable
    avgTransferTime: 25,
    reliability: 91,
    supportedAssets: ['WND']
  },
  {
    from: 'assetHub',
    to: 'interlay',
    isActive: false, // Testnet unavailable
    avgTransferTime: 32,
    reliability: 89,
    supportedAssets: ['WND', 'iBTC']
  },

  // Bidirectional routes (return paths)
  {
    from: 'hydration',
    to: 'assetHub',
    isActive: true,
    avgTransferTime: 24,
    reliability: 95,
    supportedAssets: ['WND', 'USDT', 'USDC']
  },
  {
    from: 'moonbeam',
    to: 'assetHub',
    isActive: true,
    avgTransferTime: 30,
    reliability: 92,
    supportedAssets: ['WND', 'USDT', 'USDC']
  },
  {
    from: 'astar',
    to: 'assetHub',
    isActive: true,
    avgTransferTime: 28,
    reliability: 93,
    supportedAssets: ['WND', 'USDT']
  },

  // DeFi to DeFi connections (via Asset Hub in practice, but can be direct)
  {
    from: 'hydration',
    to: 'acala',
    isActive: false,
    avgTransferTime: 48,
    reliability: 85,
    supportedAssets: ['aUSD', 'USDT']
  },

  // Smart Contract to Smart Contract
  {
    from: 'moonbeam',
    to: 'astar',
    isActive: true,
    avgTransferTime: 36,
    reliability: 88,
    supportedAssets: ['USDT']
  },
  {
    from: 'astar',
    to: 'moonbeam',
    isActive: true,
    avgTransferTime: 36,
    reliability: 88,
    supportedAssets: ['USDT']
  },

  // Additional cross-connections
  {
    from: 'hydration',
    to: 'moonbeam',
    isActive: true,
    avgTransferTime: 42,
    reliability: 87,
    supportedAssets: ['USDT']
  },
  {
    from: 'moonbeam',
    to: 'hydration',
    isActive: true,
    avgTransferTime: 42,
    reliability: 87,
    supportedAssets: ['USDT']
  },
];

// ============================================================================
// Route Graph Service
// ============================================================================

export class RouteGraph {
  private routes: Map<string, RouteEdge[]> = new Map();
  private adjacencyList: Map<ChainName, ChainName[]> = new Map();

  constructor() {
    this.buildGraph();
    logger.info('RouteGraph initialized with ' + XCM_ROUTES.length + ' routes');
  }

  /**
   * Build the route graph from known XCM routes
   */
  private buildGraph() {
    // Build adjacency list and route map
    for (const route of XCM_ROUTES) {
      if (!route.isActive) continue; // Skip inactive routes

      // Add to adjacency list
      if (!this.adjacencyList.has(route.from)) {
        this.adjacencyList.set(route.from, []);
      }
      this.adjacencyList.get(route.from)!.push(route.to);

      // Add to route map
      const key = `${route.from}->${route.to}`;
      if (!this.routes.has(key)) {
        this.routes.set(key, []);
      }
      this.routes.get(key)!.push(route);
    }

    logger.debug(`Graph built: ${this.adjacencyList.size} nodes, ${this.routes.size} edges`);
  }

  /**
   * Get direct route between two chains
   */
  getDirectRoute(from: ChainName, to: ChainName): RouteEdge | null {
    const key = `${from}->${to}`;
    const routes = this.routes.get(key);
    return routes && routes.length > 0 ? routes[0] : null;
  }

  /**
   * Get all neighbors (directly connected chains) of a given chain
   */
  getNeighbors(chain: ChainName): ChainName[] {
    return this.adjacencyList.get(chain) || [];
  }

  /**
   * Find all possible paths between two chains using DFS
   * @param maxHops Maximum number of hops allowed (default 3)
   */
  findAllPaths(
    source: ChainName,
    destination: ChainName,
    maxHops: number = 3
  ): RoutePath[] {
    const allPaths: RoutePath[] = [];
    const visited = new Set<ChainName>();

    const dfs = (current: ChainName, path: ChainName[], hops: number) => {
      // Base case: reached destination
      if (current === destination) {
        const routePath = this.buildRoutePath(path);
        if (routePath) {
          allPaths.push(routePath);
        }
        return;
      }

      // Base case: exceeded max hops
      if (hops >= maxHops) {
        return;
      }

      // Mark as visited
      visited.add(current);

      // Explore neighbors
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path, neighbor], hops + 1);
        }
      }

      // Backtrack
      visited.delete(current);
    };

    // Start DFS
    dfs(source, [source], 0);

    logger.debug(`Found ${allPaths.length} paths from ${source} to ${destination}`);
    return allPaths;
  }

  /**
   * Build a RoutePath object from a chain path
   */
  private buildRoutePath(path: ChainName[]): RoutePath | null {
    if (path.length < 2) return null;

    let totalTime = 0;
    let totalReliability = 100;

    // Calculate metrics for each hop
    for (let i = 0; i < path.length - 1; i++) {
      const route = this.getDirectRoute(path[i], path[i + 1]);
      if (!route) {
        return null; // Invalid path
      }

      totalTime += route.avgTransferTime;
      // Multiply reliabilities (compound probability)
      totalReliability *= (route.reliability / 100);
    }

    return {
      path,
      hops: path.length - 1,
      estimatedTime: totalTime,
      totalReliability: totalReliability * 100 // Convert back to percentage
    };
  }

  /**
   * Find the shortest path (by hops) between two chains
   */
  findShortestPath(source: ChainName, destination: ChainName): RoutePath | null {
    const queue: Array<{ chain: ChainName; path: ChainName[] }> = [
      { chain: source, path: [source] }
    ];
    const visited = new Set<ChainName>([source]);

    while (queue.length > 0) {
      const { chain, path } = queue.shift()!;

      if (chain === destination) {
        return this.buildRoutePath(path);
      }

      const neighbors = this.getNeighbors(chain);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ chain: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return null; // No path found
  }

  /**
   * Check if a direct route exists between two chains
   */
  hasDirectRoute(from: ChainName, to: ChainName): boolean {
    return this.getDirectRoute(from, to) !== null;
  }

  /**
   * Check if asset is supported on a route
   */
  isAssetSupported(from: ChainName, to: ChainName, asset: string): boolean {
    const route = this.getDirectRoute(from, to);
    return route ? route.supportedAssets.includes(asset) : false;
  }

  /**
   * Get all active routes in the graph
   */
  getAllRoutes(): RouteEdge[] {
    return Array.from(this.routes.values()).flat();
  }

  /**
   * Get graph statistics
   */
  getStats() {
    const activeRoutes = XCM_ROUTES.filter(r => r.isActive).length;
    const totalRoutes = XCM_ROUTES.length;
    
    return {
      totalChains: this.adjacencyList.size,
      activeRoutes,
      inactiveRoutes: totalRoutes - activeRoutes,
      totalRoutes,
      avgReliability: XCM_ROUTES
        .filter(r => r.isActive)
        .reduce((sum, r) => sum + r.reliability, 0) / activeRoutes
    };
  }
}

// Export singleton instance
export const routeGraph = new RouteGraph();
