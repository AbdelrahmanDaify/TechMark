"use client";

import LoadingSpinner from "@/components/layout/LoadingScreen";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
      setToken(localStorage.getItem("token"));
    }, []);

  useEffect(() => {
  async function getBrands() {
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/brands",
        {
          headers: {
            token: token || "",
            "content-type": "application/json",
          },
        }
      );

      const result = await res.json();

      const formattedBrands = result.data.map((b: Brand) => ({
        ...b,
        image: b.image.startsWith("http")
          ? b.image
          : `https://route-ecommerce.vercel.app${b.image}`,
      }));

      setBrands(formattedBrands);
    } catch (error) {
      console.error("Error fetching brands", error);
    } finally {
      setLoading(false);
    }
  }

  getBrands();
}, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
<div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>        <p className="text-gray-500 font-medium">Loading brands...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Brands</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/productsbybrand/${brand._id}`}
            className="group border rounded-2xl bg-white shadow-sm hover:shadow-lg transition p-6 flex flex-col items-center"
          >
            <div className="relative w-32 h-16 mb-4">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-contain grayscale group-hover:grayscale-0 transition"
              />
            </div>
            <p className="font-medium text-sm text-gray-800">{brand.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
