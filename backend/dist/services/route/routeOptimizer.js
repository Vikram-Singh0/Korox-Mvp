/**
 * KOROX Route Optimizer
 *
 * Multi-factor optimization engine that scores and ranks routes based on:
 * - Gas costs (lower is better)
 * - Transfer time (faster is better)
 * - Reliability (higher is better)
 * - Network congestion (lower is better)
 */
import { logger } from '../../config/logger.js';
import { routeGraph } from './routeGraph.js';
import { chainIntelligence } from '../polkadot/chainService.js';
// ============================================================================
// Route Optimizer
// ============================================================================
export class RouteOptimizer {
    constructor() {
        logger.info('RouteOptimizer initialized');
    }
    /**
     * Find and optimize routes between two chains
     */
    async findOptimalRoute(source, destination, asset = 'WND', priority = 'balanced') {
        logger.info(`Finding optimal route: ${source} → ${destination} (${asset}, ${priority})`);
        // Step 1: Find all possible paths
        const allPaths = routeGraph.findAllPaths(source, destination, 3);
        if (allPaths.length === 0) {
            logger.warn(`No route found from ${source} to ${destination}`);
            return null;
        }
        logger.debug(`Analyzing ${allPaths.length} possible routes...`);
        // Step 2: Score each path
        const scoredRoutes = await Promise.all(allPaths.map(path => this.scoreRoute(path, asset, priority)));
        // Step 3: Sort by score (highest first)
        scoredRoutes.sort((a, b) => b.totalScore - a.totalScore);
        // Step 4: Build optimized route from best scored route
        const bestRoute = scoredRoutes[0];
        const optimizedRoute = await this.buildOptimizedRoute(bestRoute, allPaths.length > 1 ? scoredRoutes[1] : null);
        logger.success(`Best route found: ${bestRoute.route.path.join(' → ')} (score: ${bestRoute.totalScore.toFixed(1)})`);
        return optimizedRoute;
    }
    /**
     * Score a route based on multiple factors
     */
    async scoreRoute(route, asset, priority) {
        // Fetch real-time chain stats for all chains in the path
        const chainStats = await Promise.all(route.path.map(chain => chainIntelligence.getChainStats(chain)));
        // Calculate gas cost for the entire route
        const gasCost = await this.calculateRouteGasCost(route);
        // Calculate average congestion across the route
        const avgCongestion = chainStats.reduce((sum, stat) => sum + stat.congestionScore, 0) / chainStats.length;
        // Get weights based on priority
        const weights = this.getWeights(priority);
        // Normalize metrics to 0-100 scale (higher is better)
        const gasScore = this.normalizeGasScore(gasCost); // Cheaper = higher score
        const timeScore = this.normalizeTimeScore(route.estimatedTime); // Faster = higher score
        const reliabilityScore = route.totalReliability; // Already 0-100
        const congestionScore = 100 - avgCongestion; // Lower congestion = higher score
        // Calculate weighted total score
        const totalScore = (gasScore * weights.gas) +
            (timeScore * weights.time) +
            (reliabilityScore * weights.reliability) +
            (congestionScore * weights.congestion);
        return {
            route,
            gasCost,
            time: route.estimatedTime,
            reliability: route.totalReliability,
            congestion: avgCongestion,
            totalScore
        };
    }
    /**
     * Calculate total gas cost for a route
     */
    async calculateRouteGasCost(route) {
        let totalGas = 0;
        for (let i = 0; i < route.path.length - 1; i++) {
            const from = route.path[i];
            const to = route.path[i + 1];
            // Get XCM fee estimate
            const feeEstimate = await chainIntelligence.estimateXcmFee(from, to);
            totalGas += feeEstimate.estimatedFee;
        }
        return totalGas;
    }
    /**
     * Get optimization weights based on priority
     */
    getWeights(priority) {
        switch (priority) {
            case 'fastest':
                return { gas: 0.1, time: 0.5, reliability: 0.2, congestion: 0.2 };
            case 'cheapest':
                return { gas: 0.5, time: 0.1, reliability: 0.2, congestion: 0.2 };
            case 'reliable':
                return { gas: 0.15, time: 0.15, reliability: 0.5, congestion: 0.2 };
            case 'balanced':
            default:
                return { gas: 0.25, time: 0.25, reliability: 0.25, congestion: 0.25 };
        }
    }
    /**
     * Normalize gas cost to 0-100 score (lower cost = higher score)
     */
    normalizeGasScore(gasCost) {
        // Typical XCM fee range: 0.01 - 0.05 WND
        const minGas = 0.01;
        const maxGas = 0.05;
        const normalized = 100 - ((gasCost - minGas) / (maxGas - minGas)) * 100;
        return Math.max(0, Math.min(100, normalized));
    }
    /**
     * Normalize time to 0-100 score (lower time = higher score)
     */
    normalizeTimeScore(timeSeconds) {
        // Typical transfer times: 24s (1 hop) - 100s (3 hops)
        const minTime = 24;
        const maxTime = 100;
        const normalized = 100 - ((timeSeconds - minTime) / (maxTime - minTime)) * 100;
        return Math.max(0, Math.min(100, normalized));
    }
    /**
     * Build final optimized route with all details
     */
    async buildOptimizedRoute(bestRoute, alternativeRoute) {
        // Calculate savings if alternative exists
        let savings = undefined;
        if (alternativeRoute) {
            const savingsPercent = ((alternativeRoute.gasCost - bestRoute.gasCost) / alternativeRoute.gasCost) * 100;
            savings = {
                vsBestAlternative: Math.round(savingsPercent)
            };
        }
        // Check if there's a direct route for comparison
        const directRoute = routeGraph.getDirectRoute(bestRoute.route.path[0], bestRoute.route.path[bestRoute.route.path.length - 1]);
        if (directRoute && bestRoute.route.hops > 1) {
            const directGasCost = (await chainIntelligence.estimateXcmFee(bestRoute.route.path[0], bestRoute.route.path[bestRoute.route.path.length - 1])).estimatedFee;
            const directSavings = ((directGasCost - bestRoute.gasCost) / directGasCost) * 100;
            if (!savings)
                savings = {};
            savings.vsDirectRoute = Math.round(directSavings);
        }
        // Generate recommendation
        const recommendation = this.generateRecommendation(bestRoute, savings);
        return {
            path: bestRoute.route.path,
            hops: bestRoute.route.hops,
            score: Math.round(bestRoute.totalScore),
            breakdown: {
                gasCost: parseFloat(bestRoute.gasCost.toFixed(4)),
                estimatedTime: bestRoute.time,
                reliability: Math.round(bestRoute.reliability),
                congestionScore: Math.round(bestRoute.congestion)
            },
            recommendation,
            savings
        };
    }
    /**
     * Generate human-readable recommendation
     */
    generateRecommendation(route, savings) {
        const { route: routePath, gasCost, time, reliability, congestion } = route;
        if (routePath.hops === 1) {
            return `Direct route with ${reliability.toFixed(0)}% reliability. Estimated time: ${time}s.`;
        }
        let recommendation = `${routePath.hops}-hop route`;
        if (savings?.vsDirectRoute && savings.vsDirectRoute > 0) {
            recommendation += ` saves ${savings.vsDirectRoute}% vs direct route`;
        }
        else if (savings?.vsBestAlternative && savings.vsBestAlternative > 0) {
            recommendation += ` saves ${savings.vsBestAlternative}% vs alternative`;
        }
        if (congestion < 30) {
            recommendation += `. Low network congestion.`;
        }
        else if (congestion > 70) {
            recommendation += `. Warning: High network congestion.`;
        }
        if (reliability < 85) {
            recommendation += ` Note: Below-average reliability (${reliability.toFixed(0)}%).`;
        }
        return recommendation;
    }
    /**
     * Compare multiple routes side-by-side
     */
    async compareRoutes(source, destination, asset = 'WND') {
        const priorities = ['fastest', 'cheapest', 'balanced', 'reliable'];
        const routes = await Promise.all(priorities.map(priority => this.findOptimalRoute(source, destination, asset, priority)));
        return routes.filter((r) => r !== null);
    }
    /**
     * Get route recommendation for a specific intent
     */
    async getRecommendation(source, destination, asset = 'WND', amount) {
        // For MVP, use balanced priority
        // In production, we could factor in amount to optimize differently
        return this.findOptimalRoute(source, destination, asset, 'balanced');
    }
}
// Export singleton instance
export const routeOptimizer = new RouteOptimizer();
