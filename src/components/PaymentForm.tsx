"use client";
import React, { useState, useEffect } from "react";
import { sendAlgoTransaction } from "../lib/algorand";
import { PeraWalletConnect } from "@perawallet/connect";
import type { Product } from "./ProductGrid";

const peraWallet = new PeraWalletConnect();

type ReceiptProps = {
  txId: string;
  product: Product;
  amount: string;
  receiver: string;
  sender: string;
};

function Receipt({
  txId,
  product,
  amount,
  receiver,
  sender,
}: ReceiptProps) {
  return (
    <div className="bg-green-50 border border-green-300 rounded p-4 mt-4 shadow">
      <div className="font-bold text-green-700 mb-2">Payment Successful!</div>
      <div className="mb-2">
        <span className="font-semibold">Product:</span> {product.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Amount:</span> {amount} ALGO (${product.priceUSD.toFixed(2)})
      </div>
      <div className="mb-2">
        <span className="font-semibold">Receiver:</span>
        <span className="ml-2 font-mono text-xs break-all">{receiver}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Sender:</span>
        <span className="ml-2 font-mono text-xs break-all">{sender}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Transaction ID:</span>
        <a
          href={`https://testnet.algoexplorer.io/tx/${txId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 underline text-blue-700 font-mono break-all"
        >
          {txId}
        </a>
      </div>
      <div className="text-xs text-gray-500 mt-2">You can view this transaction on AlgoExplorer.</div>
    </div>
  );
}

export default function PaymentForm({
  selectedProduct,
  resetProduct,
}: {
  selectedProduct: Product | null;
  resetProduct: () => void;
}) {
  const [account, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedProduct) {
      setAmount(selectedProduct.priceAlgo.toString());
      setReceiver(selectedProduct.receiver);
      setTxId("");
      setError("");
    }
  }, [selectedProduct]);

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccount(accounts[0]);
      setError("");
    } catch (err: any) {
      setError("Failed to connect wallet");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Connect wallet first!");
      return;
    }
    setLoading(true);
    setTxId("");
    setError("");

    try {
      const id = await sendAlgoTransaction(account, receiver, Number(amount), peraWallet);
      setTxId(id);
      // Do NOT resetProduct here! Let user see receipt and close manually.
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProduct) return null;

  return (
    <form
      onSubmit={handleSend}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">
        Pay for <span className="text-blue-600">{selectedProduct.name}</span>
      </h2>
      {!account ? (
        <button
          type="button"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-gray-100 p-2 rounded text-xs break-all mb-2">
          <span className="font-semibold">Your Address:</span> {account}
        </div>
      )}
      <input
        className="w-full border p-2 rounded"
        type="number"
        value={amount}
        readOnly
        disabled
      />
      <button
        type="submit"
        disabled={loading || !account || !!txId}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Sending..." : `Pay ${selectedProduct.priceAlgo} ALGO`}
      </button>
      {txId && account && (
        <Receipt
          txId={txId}
          product={selectedProduct}
          amount={amount}
          receiver={receiver}
          sender={account}
        />
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <button
        type="button"
        onClick={resetProduct}
        className="text-gray-500 underline text-sm"
        disabled={loading}
      >
        {txId ? "Close" : "Cancel"}
      </button>
    </form>
  );
}