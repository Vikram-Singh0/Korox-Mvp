/**
 * KOROX Configuration
 * Central configuration for all Polkadot parachain connections
 *
 * NETWORK: WESTEND TESTNET (Safe for development & testing)
 */
// RPC Endpoints for Westend Testnet Parachains
export const RPC_ENDPOINTS = {
    // Asset Hub (Central liquidity hub) - Westend Testnet
    assetHub: "wss://westend-asset-hub-rpc.polkadot.io",
    // DeFi Parachains - Westend Testnet
    hydration: "wss://rpc.hydradx.cloud", // Note: Using mainnet as testnet not always available
    acala: "wss://acala-testnet.aca-staging.network/rpc/ws",
    bifrost: "wss://bifrost-rpc.testnet.liebi.com/ws",
    // Smart Contract Parachains - Testnet equivalents
    moonbeam: "wss://wss.api.moonbase.moonbeam.network", // Moonbase Alpha (testnet)
    astar: "wss://rpc.shibuya.astar.network", // Shibuya (Astar testnet)
    // Additional parachains - Testnet
    parallel: "wss://parallel-rpc.testnet.parallel.fi", // Parallel testnet
    interlay: "wss://api-testnet.interlay.io/parachain", // Interlay testnet
};
export const CHAIN_METADATA = {
    assetHub: {
        name: 'assetHub',
        displayName: 'Asset Hub (Westend)',
        category: 'asset-hub',
        avgBlockTime: 12000,
        avgGasCost: 0.0005,
        features: ['XCM', 'Assets', 'Central Hub'],
    },
    hydration: {
        name: 'hydration',
        displayName: 'Hydration (Testnet)',
        category: 'defi',
        avgBlockTime: 12000,
        avgGasCost: 0.0008,
        features: ['Omnipool DEX', 'XCM', 'Swaps'],
    },
    acala: {
        name: 'acala',
        displayName: 'Acala (Testnet)',
        category: 'defi',
        avgBlockTime: 12000,
        avgGasCost: 0.0007,
        features: ['DeFi Hub', 'aUSD', 'XCM'],
    },
    bifrost: {
        name: 'bifrost',
        displayName: 'Bifrost (Testnet)',
        category: 'defi',
        avgBlockTime: 12000,
        avgGasCost: 0.0006,
        features: ['Liquid Staking', 'XCM'],
    },
    moonbeam: {
        name: 'moonbeam',
        displayName: 'Moonbase Alpha',
        category: 'smart-contract',
        avgBlockTime: 12000,
        avgGasCost: 0.001,
        features: ['EVM Compatible', 'XCM', 'Ethereum Bridge'],
    },
    astar: {
        name: 'astar',
        displayName: 'Shibuya (Astar Testnet)',
        category: 'smart-contract',
        avgBlockTime: 12000,
        avgGasCost: 0.0009,
        features: ['Smart Contracts', 'XCM', 'DApps'],
    },
    parallel: {
        name: 'parallel',
        displayName: 'Parallel (Testnet)',
        category: 'defi',
        avgBlockTime: 12000,
        avgGasCost: 0.0007,
        features: ['Lending', 'XCM'],
    },
    interlay: {
        name: 'interlay',
        displayName: 'Interlay (Testnet)',
        category: 'bridge',
        avgBlockTime: 12000,
        avgGasCost: 0.0008,
        features: ['Bitcoin Bridge', 'XCM', 'iBTC'],
    },
};
/**
 * Supported tokens across chains (Testnet versions)
 */
export const SUPPORTED_TOKENS = ['WND', 'USDT', 'USDC', 'aUSD', 'iBTC']; // WND = Westend test token
/**
 * KOROX Configuration
 */
export const KOROX_CONFIG = {
    MAX_ROUTE_HOPS: 3,
    ROUTE_TIMEOUT_MS: 5000,
    CACHE_TTL_SECONDS: 30,
    MIN_RELIABILITY_SCORE: 85,
    DEFAULT_PRIORITY: 'balanced',
};
