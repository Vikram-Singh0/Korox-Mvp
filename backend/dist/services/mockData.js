export const mockParachains = [
    {
        id: "Polkadot",
        name: "Polkadot Relay Chain",
        currentGasPrice: 0.01,
        congestionLevel: "low",
        avgBlockTime: 6,
        bridgeConnections: ["acala", "moonbeam", "astar"],
    },
    {
        id: "acala",
        name: "Acala",
        currentGasPrice: 0.008,
        congestionLevel: "low",
        avgBlockTime: 12,
        bridgeConnections: ["polkadot", "moonbeam", "karura"],
    },
    {
        id: "moonbeam",
        name: "Moonbeam",
        currentGasPrice: 0.015,
        congestionLevel: "medium",
        avgBlockTime: 12,
        bridgeConnections: ["polkadot", "acala", "astar"],
    },
    {
        id: "astar",
        name: "Astar",
        currentGasPrice: 0.012,
        congestionLevel: "low",
        avgBlockTime: 12,
        bridgeConnections: ["polkadot", "moonbeam"],
    },
    {
        id: "karura",
        name: "Karura",
        currentGasPrice: 0.009,
        congestionLevel: "low",
        avgBlockTime: 12,
        bridgeConnections: ["acala"],
    },
];
export const mockBridges = [
    {
        id: "hyperbridge-polkadot-acala",
        fromChain: "polkadot",
        toChain: "acala",
        baseFee: 0.05,
        avgTransferTime: 30,
        reliability: 98,
        active: true,
    },
    {
        id: "hyperbridge-polkadot-moonbeam",
        fromChain: "polkadot",
        toChain: "moonbeam",
        baseFee: 0.07,
        avgTransferTime: 45,
        reliability: 95,
        active: true,
    },
    {
        id: "hyperbridge-acala-moonbeam",
        fromChain: "acala",
        toChain: "moonbeam",
        baseFee: 0.06,
        avgTransferTime: 40,
        reliability: 97,
        active: true,
    },
    {
        id: "hyperbridge-moonbeam-astar",
        fromChain: "moonbeam",
        toChain: "astar",
        baseFee: 0.055,
        avgTransferTime: 35,
        reliability: 96,
        active: true,
    },
    {
        id: "hyperbridge-acala-karura",
        fromChain: "acala",
        toChain: "karura",
        baseFee: 0.04,
        avgTransferTime: 25,
        reliability: 99,
        active: true,
    },
];
const getParachainById = (id) => {
    return mockParachains.find((chain) => chain.id === id);
};
export const findBridgeBetween = (fromChain, toChain) => {
    return mockBridges.filter((bridge) => (bridge.fromChain === fromChain && bridge.toChain === toChain) ||
        (bridge.fromChain === toChain &&
            bridge.toChain === fromChain &&
            bridge.active));
};
