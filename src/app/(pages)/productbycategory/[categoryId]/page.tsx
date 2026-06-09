// app/(pages)/productsbycategory/[categoryId]/page.tsx
import Image from "next/image";
import Link from "next/link";
type Props = {
  params: { categoryId: string };
};

export default async function ProductsByCategoryPage({ params }: Props) {
  const { categoryId } = await params;

  try {
    // Fetch category info
    const categoryRes = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`,
      {
        cache: "no-store",
      }
    );

    const categoryJson = await categoryRes.json();
    const category = categoryJson.data;

    // Fetch products for this category
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`,
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
          No products for category {category?.name}
        </div>
      );
    }

    return (
  <div className="container mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold mb-2">{category?.name} Products</h1>
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
          <h3 className="mt-3 text-sm truncate hover:text-primary transition-colors">
            <Link href={`/products/${p._id}`}>{p.title}</Link>
          </h3>
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
