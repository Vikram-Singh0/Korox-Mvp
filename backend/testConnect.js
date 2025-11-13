import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
  const assetHub = await ApiPromise.create({ provider: new WsProvider("wss://polkadot-asset-hub-rpc.polkadot.io") });
  const moonbeam = await ApiPromise.create({ provider: new WsProvider("wss://wss.api.moonbeam.network") });

  console.log("AssetHub connected: ", (await assetHub.rpc.system.chain()).toString());
  console.log("Moonbeam connected: ", (await moonbeam.rpc.system.chain()).toString());

  await assetHub.disconnect();
  await moonbeam.disconnect();
}

main();
