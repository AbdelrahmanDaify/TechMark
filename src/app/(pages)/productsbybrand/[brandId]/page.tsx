import Image from "next/image";
import Link from "next/link";
type Props = {
  params: Promise<{
    brandId: string;
  }>;
};

export default async function ProductsByBrandPage({ params }: Props) {
  const { brandId } = await params;

  try {
    // Fetch brand info
    const brandRes = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${brandId}`,
      {
        cache: "no-store",
      }
    );

    const brandJson = await brandRes.json();
    const brand = brandJson.data;

    // Fetch products for this brand
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`,
      {
        cache: "no-store",
      }
    );

    const json = await res.json();
    const products = json.data?.data ?? json.data ?? [];

    if (!res.ok) {
      return (
        <div className="p-10 text-center text-red-500">
          Fetch failed with status {res.status}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="p-10 text-center text-gray-500">
          No products for brand {brand?.name}
        </div>
      );
    }

    return (
  <div className="container mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold mb-2">{brand?.name} Products</h1>
    <p className="text-gray-500 mb-8">{products.length} products found</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p: any) => (
        <div
          key={p._id}
          className="border rounded-xl p-4 hover:shadow-lg transition"
        >
          <Link href={`/products/${p._id}`}>
            <Image
              src={p.imageCover}
              alt={p.title}
              width={200}
              height={200}
              className="mx-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>
          
          <p className="font-bold mt-1">{p.price} EGP</p>
        </div>
      ))}
    </div>
  </div>
);

  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="p-10 text-center text-red-500">
        Error fetching products: {(error as Error).message}
      </div>
    );
  }
}
