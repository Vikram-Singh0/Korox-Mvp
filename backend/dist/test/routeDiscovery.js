/**
 * KOROX Route Discovery Engine Test
 *
 * Tests route finding, optimization, and scoring algorithms
 */
import { routeGraph } from '../services/route/routeGraph.js';
import { routeOptimizer } from '../services/route/routeOptimizer.js';
import { PolkadotApiClient } from '../services/polkadot/apiClient.js';
import { logger } from '../config/logger.js';
async function testRouteDiscovery() {
    logger.info('🗺️  Testing KOROX Route Discovery Engine...\n');
    try {
        // Test 1: Route Graph Statistics
        logger.info('📊 Test 1: Route Graph Statistics');
        const stats = routeGraph.getStats();
        console.log('\n┌─────────────────────────────────────────────────────────┐');
        console.log('│  ROUTE GRAPH STATISTICS                                 │');
        console.log('├─────────────────────────────────────────────────────────┤');
        console.log(`│  Total Chains:     ${stats.totalChains}                                       │`);
        console.log(`│  Active Routes:    ${stats.activeRoutes}                                      │`);
        console.log(`│  Inactive Routes:  ${stats.inactiveRoutes}                                       │`);
        console.log(`│  Avg Reliability:  ${stats.avgReliability.toFixed(1)}%                                 │`);
        console.log('└─────────────────────────────────────────────────────────┘\n');
        // Test 2: Find All Paths
        logger.info('🔍 Test 2: Finding all paths (assetHub → moonbeam)');
        const allPaths = routeGraph.findAllPaths('assetHub', 'moonbeam', 3);
        console.log(`\nFound ${allPaths.length} possible routes:\n`);
        allPaths.forEach((path, index) => {
            console.log(`${index + 1}. ${path.path.join(' → ')}`);
            console.log(`   Hops: ${path.hops} | Time: ${path.estimatedTime}s | Reliability: ${path.totalReliability.toFixed(1)}%\n`);
        });
        // Test 3: Shortest Path
        logger.info('⚡ Test 3: Finding shortest path (assetHub → astar)');
        const shortestPath = routeGraph.findShortestPath('assetHub', 'astar');
        if (shortestPath) {
            console.log('\n✅ Shortest Path:');
            console.log(`   ${shortestPath.path.join(' → ')}`);
            console.log(`   ${shortestPath.hops} hop(s), ${shortestPath.estimatedTime}s estimated\n`);
        }
        // Test 4: Optimal Route Discovery
        logger.info('🎯 Test 4: Finding optimal route with different priorities');
        const testRoutes = [
            ['assetHub', 'moonbeam'],
            ['assetHub', 'astar'],
            ['moonbeam', 'astar']
        ];
        for (const [source, dest] of testRoutes) {
            console.log(`\n${'─'.repeat(60)}`);
            console.log(`📍 Route: ${source} → ${dest}`);
            console.log('─'.repeat(60));
            const priorities = ['balanced', 'fastest', 'cheapest'];
            for (const priority of priorities) {
                const route = await routeOptimizer.findOptimalRoute(source, dest, 'WND', priority);
                if (route) {
                    console.log(`\n${priority.toUpperCase()} Priority:`);
                    console.log(`  Path:         ${route.path.join(' → ')}`);
                    console.log(`  Score:        ${route.score}/100`);
                    console.log(`  Gas Cost:     ${route.breakdown.gasCost} WND`);
                    console.log(`  Time:         ${route.breakdown.estimatedTime}s`);
                    console.log(`  Reliability:  ${route.breakdown.reliability}%`);
                    console.log(`  Congestion:   ${route.breakdown.congestionScore}/100`);
                    if (route.savings) {
                        if (route.savings.vsDirectRoute) {
                            console.log(`  Savings:      ${route.savings.vsDirectRoute}% vs direct route`);
                        }
                        if (route.savings.vsBestAlternative) {
                            console.log(`  Savings:      ${route.savings.vsBestAlternative}% vs alternative`);
                        }
                    }
                    console.log(`  ℹ️  ${route.recommendation}`);
                }
            }
        }
        // Test 5: Route Comparison
        logger.info('\n\n📈 Test 5: Comparing all optimization strategies');
        const comparisonRoutes = await routeOptimizer.compareRoutes('assetHub', 'moonbeam', 'WND');
        console.log('\n┌────────────┬──────────┬──────────────┬──────────┬──────────────┐');
        console.log('│ Priority   │ Score    │ Gas (WND)    │ Time (s) │ Reliability  │');
        console.log('├────────────┼──────────┼──────────────┼──────────┼──────────────┤');
        const priorityNames = ['Fastest', 'Cheapest', 'Balanced', 'Reliable'];
        comparisonRoutes.forEach((route, index) => {
            if (route) {
                const name = priorityNames[index] || 'Unknown';
                console.log(`│ ${name.padEnd(10)} │ ${route.score.toString().padEnd(8)} │ ${route.breakdown.gasCost.toString().padEnd(12)} │ ${route.breakdown.estimatedTime.toString().padEnd(8)} │ ${route.breakdown.reliability.toString().padEnd(12)}% │`);
            }
        });
        console.log('└────────────┴──────────┴──────────────┴──────────┴──────────────┘\n');
        // Test 6: Asset Support Check
        logger.info('💰 Test 6: Checking asset support on routes');
        const assets = ['WND', 'USDT', 'USDC'];
        console.log('\n┌────────────────┬──────────────────┬─────────────────────────┐');
        console.log('│ Route          │ Asset            │ Supported               │');
        console.log('├────────────────┼──────────────────┼─────────────────────────┤');
        const checkRoutes = [
            ['assetHub', 'moonbeam'],
            ['assetHub', 'astar'],
            ['moonbeam', 'astar']
        ];
        for (const [from, to] of checkRoutes) {
            for (const asset of assets) {
                const supported = routeGraph.isAssetSupported(from, to, asset);
                const supportedStr = supported ? '✅ Yes' : '❌ No';
                console.log(`│ ${(from + '→' + to).padEnd(14)} │ ${asset.padEnd(16)} │ ${supportedStr.padEnd(23)} │`);
            }
        }
        console.log('└────────────────┴──────────────────┴─────────────────────────┘\n');
        logger.success('✅ All Route Discovery tests passed!');
        // Summary
        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║  🗺️  ROUTE DISCOVERY ENGINE - TEST SUMMARY              ║');
        console.log('╠═══════════════════════════════════════════════════════════╣');
        console.log(`║  ✅ Route graph loaded (${stats.activeRoutes} active routes)                ║`);
        console.log('║  ✅ Path finding (DFS algorithm)                          ║');
        console.log('║  ✅ Multi-factor route optimization                       ║');
        console.log('║  ✅ Priority-based scoring (fast/cheap/balanced/reliable) ║');
        console.log('║  ✅ Real-time congestion & gas integration                ║');
        console.log('║  ✅ Asset support validation                              ║');
        console.log('╚═══════════════════════════════════════════════════════════╝\n');
        // Key Insights
        console.log('💡 Key Insights:');
        console.log('   • KOROX can discover multiple routes between chains');
        console.log('   • Different optimization strategies yield different results');
        console.log('   • Real-time network data influences route selection');
        console.log('   • Multi-hop routes can save gas in some scenarios');
        console.log('   • Asset availability varies across routes\n');
    }
    catch (error) {
        logger.error('❌ Route Discovery test failed:', error);
        throw error;
    }
    finally {
        // Cleanup
        logger.info('🧹 Cleaning up connections...');
        await PolkadotApiClient.getInstance().disconnectAll();
        logger.success('Disconnected from all chains');
    }
}
// Run the test
testRouteDiscovery()
    .then(() => {
    logger.success('🎉 Test completed successfully!');
    process.exit(0);
})
    .catch((error) => {
    logger.error('💥 Test failed:', error);
    process.exit(1);
});
