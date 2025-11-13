import { ApiPromise, WsProvider } from "@polkadot/api";
import Keyring from "@polkadot/keyring";

async function main() {

  const api = await ApiPromise.create({
    provider: new WsProvider("wss://polkadot-asset-hub-rpc.polkadot.io")
  });

  const keyring = new Keyring({ type: "sr25519" });
  const sender = keyring.addFromUri("//Alice"); // replace later with mnemonic

  // USDC AssetHub asset metadata (mainnet)
  const assetId = 1984;               // USDC
  const amount = 1_000_000n;          // 1 USDC (6 decimals)
  const destPara = 2004;              // moonbeam

  const asset = {
    id: {
      Concrete: {
        parents: 1,
        interior: {
          X2: [
            { Parachain: destPara },
            { GeneralIndex: assetId }
          ]
        }
      }
    },
    fun: { Fungible: amount }
  };

  const message = {
    V3: [
      {
        TransferAsset: {
          assets: [asset],
          beneficiary: {
            parents: 1,
            interior: { X1: { Parachain: destPara } }
          }
        }
      }
    ]
  };

  const tx = api.tx.polkadotXcm.send(
    { V3: { parents: 1, interior: { X1: { Parachain: destPara } } } },
    message
  );

  const info = await tx.paymentInfo(sender);
  console.log("Estimated fee:", info.partialFee.toHuman());

  await api.disconnect();
}

main();
