import { ApiPromise, WsProvider } from "@polkadot/api";
import { RPC_ENDPOINTS } from "../../config/constants";
import logger from "../../config/logger";
/**
 * Polkadot API Client
 * Manages WebSocket connections to all parachains with connection pooling
 */
export class PolkadotApiClient {
    constructor() {
        this.connections = new Map();
        this.connectionAttempts = new Map();
        this.MAX_RETRY_ATTEMPTS = 3;
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!PolkadotApiClient.instance) {
            PolkadotApiClient.instance = new PolkadotApiClient();
        }
        return PolkadotApiClient.instance;
    }
    /**
     * Get or create API connection to a parachain
     * Implements automatic reconnection and connection pooling
     */
    async getApi(chain) {
        try {
            // Return existing connection if healthy
            if (this.connections.has(chain)) {
                const api = this.connections.get(chain);
                if (api.isConnected) {
                    return api;
                }
                else {
                    logger.warn(`Connection to ${chain} lost, reconnecting...`);
                    this.connections.delete(chain);
                }
            }
            // Check retry limit
            const attempts = this.connectionAttempts.get(chain) || 0;
            if (attempts >= this.MAX_RETRY_ATTEMPTS) {
                throw new Error(`Max retry attempts reached for ${chain}`);
            }
            const endpoint = RPC_ENDPOINTS[chain];
            if (!endpoint) {
                throw new Error(`Unknown chain: ${chain}`);
            }
            logger.info(`🌐 Connecting to ${chain}...`);
            const provider = new WsProvider(endpoint, 2000); // 2s timeout
            const api = await ApiPromise.create({
                provider,
                throwOnConnect: true,
            });
            logger.success(`Connected to ${chain} (${endpoint})`);
            this.connections.set(chain, api);
            this.connectionAttempts.set(chain, 0); // Reset counter on success
            return api;
        }
        catch (err) {
            const attempts = (this.connectionAttempts.get(chain) || 0) + 1;
            this.connectionAttempts.set(chain, attempts);
            logger.error(`❌ Failed to connect to ${chain} (attempt ${attempts}):`, err);
            throw err;
        }
    }
    /**
     * Check if connected to a chain
     */
    isConnected(chain) {
        const api = this.connections.get(chain);
        return api ? api.isConnected : false;
    }
    /**
     * Get all active connections
     */
    getActiveConnections() {
        return Array.from(this.connections.entries())
            .filter(([_, api]) => api.isConnected)
            .map(([chain, _]) => chain);
    }
    /**
     * Disconnect from a specific chain
     */
    async disconnect(chain) {
        const api = this.connections.get(chain);
        if (api) {
            try {
                await api.disconnect();
                this.connections.delete(chain);
                logger.info(`Disconnected from ${chain}`);
            }
            catch (err) {
                logger.error(`Error disconnecting from ${chain}:`, err);
            }
        }
    }
    /**
     * Disconnect all chain connections gracefully
     */
    async disconnectAll() {
        logger.info("Disconnecting all chains...");
        const disconnectPromises = Array.from(this.connections.entries()).map(async ([chain, api]) => {
            try {
                await api.disconnect();
                logger.info(`Disconnected from ${chain}`);
            }
            catch (err) {
                logger.error(`Error disconnecting from ${chain}:`, err);
            }
        });
        await Promise.all(disconnectPromises);
        this.connections.clear();
        this.connectionAttempts.clear();
        logger.success("All chains disconnected");
    }
    /**
     * Health check for all connections
     */
    async healthCheck() {
        const health = {};
        for (const chain of Object.keys(RPC_ENDPOINTS)) {
            const api = this.connections.get(chain);
            health[chain] = api ? api.isConnected : false;
        }
        return health;
    }
}
// Export singleton instance
export const apiClient = PolkadotApiClient.getInstance();
// Export convenience functions
export const getApi = (chain) => apiClient.getApi(chain);
export const disconnectAll = () => apiClient.disconnectAll();
export const healthCheck = () => apiClient.healthCheck();
