export interface ParachainInfo {
  id: string;
  name: string;
  congestionLevel: "low" | "medium" | "heigh";
  currentGasPrice: number;
  avgBlockTime: number;
  bridgeConnections: string[];
}

export interface BridgeInfo {
  id: string;
  fromChain: string;
  toChain: string;
  baseFee: number;
  avgTransferTime: number;
  reliability: number;
  active: boolean;
}
