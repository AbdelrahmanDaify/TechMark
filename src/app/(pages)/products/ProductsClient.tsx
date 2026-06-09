"use client";

import { useState } from "react";
import { Product } from "@/interfaces/Product";
import { ProductCard } from "@/components";

export default function ProductsClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="my-10 container mx-auto px-4">
      <h1 className="text-3xl font-bold my-2.5">Products</h1>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-4 py-2 rounded-lg w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
