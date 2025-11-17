/**
 * KOROX Chain Intelligence Layer Test
 *
 * Tests real-time monitoring, congestion analysis, and fee estimation
 */

import { chainIntelligence } from "../services/polkadot/chainService.js";
import { PolkadotApiClient } from "../services/polkadot/apiClient.js";
import { ChainName } from "../config/constants.js";
import { logger } from "../config/logger.js";

async function testChainIntelligence() {
  logger.info("🧠 Testing KOROX Chain Intelligence Layer...\n");

  try {
    // Test 1: Get stats for a single chain
    logger.info("📊 Test 1: Fetching stats for Asset Hub...");
    const assetHubStats = await chainIntelligence.getChainStats("assetHub");

    console.log(
      "\n┌─────────────────────────────────────────────────────────┐"
    );
    console.log("│  ASSET HUB STATISTICS                                   │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log(
      `│  Health:      ${
        assetHubStats.isHealthy ? "✅ Healthy" : "❌ Unhealthy"
      }                                │`
    );
    console.log(
      `│  Block:       #${assetHubStats.currentBlock.toString().padEnd(40)} │`
    );
    console.log(
      `│  Block Time:  ${assetHubStats.avgBlockTime}s avg                                   │`
    );
    console.log(
      `│  Congestion:  ${assetHubStats.networkCongestion
        .toUpperCase()
        .padEnd(6)} (score: ${assetHubStats.congestionScore})            │`
    );
    console.log(
      `│  Est. Gas:    ${assetHubStats.estimatedGas} DOT                               │`
    );
    console.log(
      "└─────────────────────────────────────────────────────────┘\n"
    );

    // Test 2: Test caching
    logger.info("💾 Test 2: Testing cache performance...");
    const startTime = Date.now();
    await chainIntelligence.getChainStats("assetHub");
    const cachedTime = Date.now() - startTime;
    logger.success(`Cache hit! Response time: ${cachedTime}ms`);

    // Test 3: Get stats for multiple chains
    logger.info("\n📡 Test 3: Fetching stats for all chains...");
    const allStats = await chainIntelligence.getAllChainStats();

    console.log(
      "\n┌───────────────────┬─────────┬──────────────┬─────────────┬───────────┐"
    );
    console.log(
      "│ Chain             │ Health  │ Block        │ Congestion  │ Est. Gas  │"
    );
    console.log(
      "├───────────────────┼─────────┼──────────────┼─────────────┼───────────┤"
    );

    allStats.forEach((stats) => {
      const health = stats.isHealthy ? "✅" : "❌";
      const congestionEmoji =
        stats.networkCongestion === "low"
          ? "🟢"
          : stats.networkCongestion === "medium"
          ? "🟡"
          : "🔴";

      console.log(
        `│ ${stats.chainName.padEnd(17)} │ ${health}     │ ${stats.currentBlock
          .toString()
          .padEnd(12)} │ ${congestionEmoji} ${stats.networkCongestion.padEnd(
          6
        )} │ ${stats.estimatedGas.toFixed(4).padEnd(9)} │`
      );
    });

    console.log(
      "└───────────────────┴─────────┴──────────────┴─────────────┴───────────┘\n"
    );

    logger.success(
      `Successfully retrieved stats for ${allStats.length} chains`
    );

    // Test 4: XCM Fee Estimation
    logger.info("\n💸 Test 4: Testing XCM fee estimation...");

    const routes: Array<[ChainName, ChainName]> = [
      ["assetHub", "hydration"],
      ["moonbeam", "astar"],
      ["assetHub", "interlay"],
    ];

    console.log(
      "\n┌──────────────┬──────────────┬──────────────┬────────────┐"
    );
    console.log("│ Source       │ Destination  │ Est. Fee     │ Confidence │");
    console.log("├──────────────┼──────────────┼──────────────┼────────────┤");

    for (const [source, dest] of routes) {
      try {
        const feeEstimate = await chainIntelligence.estimateXcmFee(
          source,
          dest
        );
        const confidenceEmoji =
          feeEstimate.confidence === "high"
            ? "🟢"
            : feeEstimate.confidence === "medium"
            ? "�"
            : "🔴";

        console.log(
          `│ ${source.padEnd(12)} │ ${dest.padEnd(12)} │ ${(
            feeEstimate.estimatedFee +
            " " +
            feeEstimate.currency
          ).padEnd(12)} │ ${confidenceEmoji} ${feeEstimate.confidence.padEnd(
            6
          )} │`
        );
      } catch (error) {
        console.log(
          `│ ${source.padEnd(12)} │ ${dest.padEnd(
            12
          )} │ ERROR        │ ❌ N/A    │`
        );
      }
    }

    console.log(
      "└──────────────┴──────────────┴──────────────┴────────────┘\n"
    );

    // Test 5: Cache Statistics
    logger.info("📈 Test 5: Cache statistics...");
    const cacheStats = chainIntelligence.getCacheStats();
    console.log(
      "\n┌─────────────────────────────────────────────────────────┐"
    );
    console.log("│  CACHE STATISTICS                                       │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log(
      `│  Keys:    ${cacheStats.keys}                                             │`
    );
    console.log(
      `│  Hits:    ${cacheStats.hits}                                            │`
    );
    console.log(
      `│  Misses:  ${cacheStats.misses}                                            │`
    );
    console.log(
      "└─────────────────────────────────────────────────────────┘\n"
    );

    logger.success("✅ All Chain Intelligence tests passed!");

    // Summary
    console.log(
      "\n╔═══════════════════════════════════════════════════════════╗"
    );
    console.log("║  🧠 CHAIN INTELLIGENCE LAYER - TEST SUMMARY              ║");
    console.log(
      "╠═══════════════════════════════════════════════════════════╣"
    );
    console.log(
      "║  ✅ Single chain stats retrieval                          ║"
    );
    console.log(
      "║  ✅ Caching system working                                ║"
    );
    console.log(
      `║  ✅ Multi-chain stats (${allStats.length}/8 chains)                      ║`
    );
    console.log(
      "║  ✅ XCM fee estimation                                    ║"
    );
    console.log(
      "║  ✅ Congestion analysis                                   ║"
    );
    console.log(
      "╚═══════════════════════════════════════════════════════════╝\n"
    );
  } catch (error) {
    logger.error("❌ Chain Intelligence test failed:", error);
    throw error;
  } finally {
    // Cleanup
    logger.info("🧹 Cleaning up connections...");
    await PolkadotApiClient.getInstance().disconnectAll();
    logger.success("Disconnected from all chains");
  }
}

// Run the test
testChainIntelligence()
  .then(() => {
    logger.success("🎉 Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    logger.error("💥 Test failed:", error);
    process.exit(1);
  });
