"use client";
import React, { useState } from "react";
import ProductGrid, { Product } from "../components/ProductGrid";
import PaymentForm from "../components/PaymentForm";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12">
      <ProductGrid onBuy={(product) => setSelectedProduct(product)} />
      <PaymentForm
        selectedProduct={selectedProduct}
        resetProduct={() => setSelectedProduct(null)}
      />
    </main>
  );
}