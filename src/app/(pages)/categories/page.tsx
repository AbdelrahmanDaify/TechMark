"use client";

import LoadingSpinner from "@/components/layout/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/categories"
        );
        const result = await res.json();
        setCategories(result.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
<div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>        <p className="text-sm text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/productbycategory/${category._id}`}
            className="
              group
              relative
              h-80
              rounded-2xl
              overflow-hidden
              shadow-sm
              hover:shadow-xl
              transition
            "
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur rounded-xl px-4 py-2 text-center">
                <p className="font-semibold text-gray-900">{category.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
