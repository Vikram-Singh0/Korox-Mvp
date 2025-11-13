/**
 * KOROX Chain Intelligence Layer
 *
 * Monitors real-time chain statistics, congestion, and gas costs
 * across all Polkadot parachains to inform intelligent routing decisions.
 */
import NodeCache from "node-cache";
import { PolkadotApiClient } from "./apiClient.js";
import { CHAIN_METADATA, KOROX_CONFIG, } from "../../config/constants.js";
import { logger } from "../../config/logger.js";
// ============================================================================
// Chain Intelligence Service
// ============================================================================
export class ChainIntelligenceService {
    constructor() {
        this.monitoringInterval = null;
        this.apiClient = PolkadotApiClient.getInstance();
        // Cache with 30s TTL (configurable via KOROX_CONFIG)
        this.cache = new NodeCache({
            stdTTL: KOROX_CONFIG.CACHE_TTL_SECONDS,
            checkperiod: 10,
        });
        logger.info("ChainIntelligenceService initialized");
    }
    /**
     * Get comprehensive stats for a specific chain
     */
    async getChainStats(chainName) {
        const cacheKey = `stats:${chainName}`;
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached) {
            logger.debug(`Cache hit for ${chainName} stats`);
            return cached;
        }
        logger.debug(`Fetching fresh stats for ${chainName}`);
        try {
            const api = await this.apiClient.getApi(chainName);
            // Fetch current block
            const header = await api.rpc.chain.getHeader();
            const currentBlock = header.number.toNumber();
            // Analyze congestion
            const congestion = await this.analyzeCongestion(api, chainName);
            // Estimate gas cost
            const estimatedGas = await this.estimateGas(api, chainName);
            const stats = {
                chainName,
                isHealthy: true,
                currentBlock,
                avgBlockTime: CHAIN_METADATA[chainName]?.avgBlockTime || 12,
                networkCongestion: congestion.congestionLevel,
                congestionScore: congestion.congestionScore,
                estimatedGas,
                lastUpdated: Date.now(),
            };
            // Cache the results
            this.cache.set(cacheKey, stats);
            return stats;
        }
        catch (error) {
            logger.error(`Failed to get stats for ${chainName}:`, error);
            // Return degraded stats
            return {
                chainName,
                isHealthy: false,
                currentBlock: 0,
                avgBlockTime: CHAIN_METADATA[chainName]?.avgBlockTime || 12,
                networkCongestion: "high",
                congestionScore: 100,
                estimatedGas: 0,
                lastUpdated: Date.now(),
            };
        }
    }
    /**
     * Analyze network congestion based on block fullness and transaction queue
     */
    async analyzeCongestion(api, chainName) {
        try {
            // Get the latest block with extrinsics
            const blockHash = await api.rpc.chain.getBlockHash();
            const signedBlock = await api.rpc.chain.getBlock(blockHash);
            // Calculate block fullness
            const extrinsics = signedBlock.block.extrinsics;
            const blockLength = extrinsics.length;
            // Most parachains have a typical max of ~100 extrinsics per block
            const maxExtrinsics = 100;
            const blockFullness = Math.min((blockLength / maxExtrinsics) * 100, 100);
            // Get pending extrinsics from transaction pool
            const pendingExtrinsics = await api.rpc.author.pendingExtrinsics();
            const transactionQueueSize = pendingExtrinsics.length;
            // Calculate congestion score (0-100)
            // Factors: 60% block fullness + 40% queue size
            const queueScore = Math.min((transactionQueueSize / 50) * 100, 100);
            const congestionScore = Math.round(blockFullness * 0.6 + queueScore * 0.4);
            // Determine congestion level
            let congestionLevel;
            if (congestionScore < 30) {
                congestionLevel = "low";
            }
            else if (congestionScore < 70) {
                congestionLevel = "medium";
            }
            else {
                congestionLevel = "high";
            }
            logger.debug(`${chainName} congestion: ${congestionLevel} (score: ${congestionScore}, block: ${blockFullness.toFixed(1)}%, queue: ${transactionQueueSize})`);
            return {
                blockFullness,
                transactionQueueSize,
                congestionLevel,
                congestionScore,
            };
        }
        catch (error) {
            logger.warn(`Congestion analysis failed for ${chainName}, using defaults:`, error);
            // Return conservative defaults
            return {
                blockFullness: 50,
                transactionQueueSize: 0,
                congestionLevel: "medium",
                congestionScore: 50,
            };
        }
    }
    /**
     * Estimate gas cost for a typical transaction on the chain
     */
    async estimateGas(api, chainName) {
        try {
            // Use metadata for base gas estimation
            const baseGas = CHAIN_METADATA[chainName]?.avgGasCost ?? 0.01;
            // In production, we would:
            // 1. Query actual fee calculations from the chain
            // 2. Factor in current congestion
            // 3. Use historical data for more accuracy
            // For MVP, we'll use a simple multiplier based on congestion
            const congestion = await this.analyzeCongestion(api, chainName);
            let multiplier = 1.0;
            if (congestion.congestionLevel === "high") {
                multiplier = 1.5;
            }
            else if (congestion.congestionLevel === "medium") {
                multiplier = 1.2;
            }
            const estimatedGas = Number((Number(baseGas) * multiplier).toFixed(4));
            return estimatedGas;
        }
        catch (error) {
            logger.warn(`Gas estimation failed for ${chainName}:`, error);
            return CHAIN_METADATA[chainName]?.avgGasCost ?? 0.01;
        }
    }
    /**
     * Estimate XCM fees for cross-chain transfers
     */
    async estimateXcmFee(sourceChain, destChain, amount) {
        const cacheKey = `xcm:${sourceChain}:${destChain}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const sourceApi = await this.apiClient.getApi(sourceChain);
            // Get source chain stats for fee calculation
            const sourceStats = await this.getChainStats(sourceChain);
            const destStats = await this.getChainStats(destChain);
            // XCM fees are complex and chain-specific
            // For MVP, we'll use a simple formula:
            // Base XCM fee + source chain gas + destination chain execution cost
            const baseXcmFee = 0.01; // Base XCM protocol fee
            const sourceGas = sourceStats.estimatedGas;
            const destExecutionCost = destStats.estimatedGas * 0.5;
            // Apply congestion multipliers
            let congestionMultiplier = 1.0;
            if (sourceStats.congestionScore > 70 || destStats.congestionScore > 70) {
                congestionMultiplier = 1.3;
            }
            else if (sourceStats.congestionScore > 40 ||
                destStats.congestionScore > 40) {
                congestionMultiplier = 1.15;
            }
            const totalFee = (baseXcmFee + sourceGas + destExecutionCost) * congestionMultiplier;
            // Determine confidence based on chain health
            let confidence = "high";
            if (!sourceStats.isHealthy || !destStats.isHealthy) {
                confidence = "low";
            }
            else if (sourceStats.congestionScore > 50 ||
                destStats.congestionScore > 50) {
                confidence = "medium";
            }
            const estimate = {
                sourceChain,
                destChain,
                estimatedFee: Number(totalFee.toFixed(4)),
                currency: "WND", // Westend testnet token
                confidence,
            };
            this.cache.set(cacheKey, estimate);
            logger.debug(`XCM fee estimate: ${sourceChain} → ${destChain} = ${estimate.estimatedFee} ${estimate.currency} (${confidence} confidence)`);
            return estimate;
        }
        catch (error) {
            logger.error(`XCM fee estimation failed for ${sourceChain} → ${destChain}:`, error);
            return {
                sourceChain,
                destChain,
                estimatedFee: 0.05,
                currency: "WND",
                confidence: "low",
            };
        }
    }
    /**
     * Get stats for all healthy chains
     */
    async getAllChainStats() {
        const chains = [
            "assetHub",
            "hydration",
            "acala",
            "bifrost",
            "moonbeam",
            "astar",
            "parallel",
            "interlay",
        ];
        const statsPromises = chains.map((chain) => this.getChainStats(chain).catch((error) => {
            logger.error(`Failed to get stats for ${chain}:`, error);
            return null;
        }));
        const results = await Promise.allSettled(statsPromises);
        return results
            .filter((result) => result.status === "fulfilled" && result.value !== null)
            .map((result) => result.value);
    }
    /**
     * Start background monitoring of all chains
     * Updates cache periodically with fresh data
     */
    startMonitoring(intervalSeconds = 30) {
        if (this.monitoringInterval) {
            logger.warn("Monitoring already started");
            return;
        }
        logger.info(`Starting chain monitoring (interval: ${intervalSeconds}s)`);
        // Initial fetch
        this.getAllChainStats().catch((error) => {
            logger.error("Initial monitoring fetch failed:", error);
        });
        // Set up periodic updates
        this.monitoringInterval = setInterval(() => {
            this.getAllChainStats().catch((error) => {
                logger.error("Periodic monitoring fetch failed:", error);
            });
        }, intervalSeconds * 1000);
    }
    /**
     * Stop background monitoring
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            logger.info("Chain monitoring stopped");
        }
    }
    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.flushAll();
        logger.info("Cache cleared");
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            keys: this.cache.keys().length,
            hits: this.cache.getStats().hits,
            misses: this.cache.getStats().misses,
            ksize: this.cache.getStats().ksize,
            vsize: this.cache.getStats().vsize,
        };
    }
}
// Export singleton instance
export const chainIntelligence = new ChainIntelligenceService();
