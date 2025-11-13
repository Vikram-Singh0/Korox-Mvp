import { getApi, disconnectAll, healthCheck } from "../services/polkadot/apiClient";
import { RPC_ENDPOINTS } from "../config/constants";
import logger from "../config/logger";
/**
 * Test script to verify connections to all Polkadot parachains
 */
async function testChainConnection(chain) {
    try {
        logger.info(`\n📡 Testing ${chain}...`);
        const api = await getApi(chain);
        // Get chain info
        const [chainName, nodeName, version] = await Promise.all([
            api.rpc.system.chain(),
            api.rpc.system.name(),
            api.rpc.system.version(),
        ]);
        logger.success(`${chainName}: ${nodeName} v${version}`);
        // Get latest block
        const header = await api.rpc.chain.getHeader();
        logger.info(`Latest block: #${header.number}`);
    }
    catch (error) {
        logger.error(`Failed to connect to ${chain}:`, error);
    }
}
async function main() {
    logger.info("🧪 KOROX Chain Connection Test\n");
    logger.info("=".repeat(50));
    const chains = Object.keys(RPC_ENDPOINTS);
    // Test each chain sequentially
    for (const chain of chains) {
        await testChainConnection(chain);
    }
    // Health check summary
    logger.info("\n" + "=".repeat(50));
    logger.info("📊 Connection Health Summary:");
    const health = await healthCheck();
    Object.entries(health).forEach(([chain, isHealthy]) => {
        logger.info(`  ${chain}: ${isHealthy ? '✅ Connected' : '❌ Disconnected'}`);
    });
    await disconnectAll();
    logger.info("\n✅ Test complete!");
}
main().catch((error) => {
    logger.error("Test failed:", error);
    process.exit(1);
});
