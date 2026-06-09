// "use client";
import Link from "next/link";
import { formatPrice, renderStars } from "@/lib/utils";
import { Product } from "@/interfaces";
import AddToCartBtn from "./AddToCartBtn";
import AddToWishlistBtn from "@/components/wishlist/AddToWishlistBtn";

type ProductCardProps = {
  product: Product;
};

type ProductsGridProps = {
  products: Product[];
};

export function ProductsGrid({ products }: ProductsGridProps) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.imageCover}
            alt={product.title}
            className="object-contain group-hover:scale-105 transition-transform duration-300 w-full h-full"
          />
        </Link>
        <div className="absolute top-2 right-2">
          <AddToWishlistBtn product={product} />
        </div>

        {product.sold > 1000 && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Popular
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          <Link
            href={`/brands/${product.brand._id}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {product.brand.name}
          </Link>
        </p>
        <h3 className="font-semibold text-sm mb-2 truncate hover:text-primary transition-colors">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{renderStars(product.ratingsAverage)}</div>
          <span className="text-xs text-muted-foreground">
            ({product.ratingsQuantity})
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          <Link
            href={`/categories/${product.category._id}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {product.category.name}
          </Link>
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.sold > 1000 ? "1000+" : product.sold} sold
          </span>
        </div>
        <AddToCartBtn productId={product._id} />
      </div>
    </div>
  );
}

