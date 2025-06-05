import React from "react";

export type Product = {
  id: number;
  name: string;
  description: string;
  priceAlgo: number;
  priceUSD: number;
  receiver: string;
};

type Props = {
  onBuy: (product: Product) => void;
};

const STORE_RECEIVER_ADDRESS = "EQGWBFCKIPK4B2LQ2HJGIIQWES5RZLGCABDVMO2VDJMW3GABKHTOQEO2JY"; // Ganti dengan address merchant

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Lemon Tea",
    description: "Segar dan manis, cocok untuk cuaca panas.",
    priceAlgo: 1,
    priceUSD: 0.18,
    receiver: STORE_RECEIVER_ADDRESS,
  },
  {
    id: 2,
    name: "Matcha Latte",
    description: "Rasa matcha premium dengan susu creamy.",
    priceAlgo: 2,
    priceUSD: 0.36,
    receiver: STORE_RECEIVER_ADDRESS,
  },
  {
    id: 3,
    name: "Coffee Latte",
    description: "Kopi robusta dengan campuran susu segar.",
    priceAlgo: 3,
    priceUSD: 0.54,
    receiver: STORE_RECEIVER_ADDRESS,
  },
];

export default function ProductGrid({ onBuy }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {PRODUCTS.map((product) => (
        <div key={product.id} className="bg-white p-4 rounded shadow flex flex-col">
          <h3 className="text-xl font-bold mb-2">{product.name}</h3>
          <p className="mb-2 text-gray-700">{product.description}</p>
          <div className="mb-2">
            <span className="font-semibold">{product.priceAlgo} ALGO</span>
            {" "}
            <span className="text-gray-500 text-sm">(${product.priceUSD.toFixed(2)})</span>
          </div>
          <button
            className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => onBuy(product)}
          >
            Buy with ALGO
          </button>
        </div>
      ))}
    </div>
  );
}