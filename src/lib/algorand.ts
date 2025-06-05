import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

const ALGOD_SERVER = "https://testnet-api.algonode.cloud";
const ALGOD_PORT = "";
const ALGOD_TOKEN = "";

export const algodClient = new algosdk.Algodv2(
  ALGOD_TOKEN,
  ALGOD_SERVER,
  ALGOD_PORT
);

export async function sendAlgoTransaction(
  sender: string,
  receiver: string,
  amount: number,
  peraWallet: InstanceType<typeof PeraWalletConnect>
) {
  const microAlgos = algosdk.algosToMicroalgos(amount);
  const params = await algodClient.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender,
    receiver,
    amount: microAlgos,
    suggestedParams: params,
  });

  // Pera Wallet Sign
  const encodedTxn = algosdk.encodeUnsignedTransaction(txn);
  const signed = await peraWallet.signTransaction([[{ txn: txn, signers: [sender] }]]);

  const response = await algodClient.sendRawTransaction(signed).do();
  const txId = typeof response === "string" ? response : response.txid;

  await algosdk.waitForConfirmation(algodClient, txId, 4);

  return txId;
}