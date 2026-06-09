
import AddToCartBtn from "@/components/products/AddToCartBtn";
import AddToWishlistBtn from "@/components/wishlist/AddToWishlistBtn";
import { Button } from "@/components/ui/button";
import { Product } from "@/interfaces/Product";
import { formatPrice, renderStars } from "@/lib/utils";
import { RotateCcw, Shield, Truck } from "lucide-react";
import Link from "next/link";

type ProductDetailsProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductDetails(props: ProductDetailsProps) {
  async function getProductDetails(productId: string): Promise<Product> {
    const data = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products/" + productId
    ).then((res) => res.json());
    return data.data;
  }

  const productId = await props.params.then((res) => {
    return res.productId;
  });

  const productDetails = await getProductDetails(productId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <img
              src={productDetails.imageCover}
              alt={productDetails.title}
              className="object-contain"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {productDetails.images.map((image, index) => (
              <button
                key={index}
                className={`relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 ${
                  0 === index ? "border-primary" : "border-gray-200"
                }`}
              >
                <img
                  src={image}
                  alt={`${productDetails.title} ${index + 1}`}
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            <Link
              href={`/brands/${productDetails.brand._id}`}
              className="hover:text-primary hover:underline transition-colors"
            >
              {productDetails.brand.name}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{productDetails.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(productDetails.ratingsAverage)}
              <span className="ml-2 text-sm text-muted-foreground">
                {productDetails.ratingsAverage} (
                {productDetails.ratingsQuantity} reviews)
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {productDetails.sold} sold
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {formatPrice(productDetails.price)}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {productDetails.description}
            </p>
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/categories/${productDetails.category._id}`}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              {productDetails.category.name}
            </Link>
            {productDetails.subcategory.map((sub) => (
              <span
                key={sub._id}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
              >
                {sub.name}
              </span>
            ))}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stock:</span>
            <span
              className={`text-sm ${
                productDetails.quantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {productDetails.quantity > 0
                ? `${productDetails.quantity} available`
                : "Out of stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <AddToCartBtn productId={productDetails._id} />
            </div>
            <div className="relative w-10 h-10 group shrink-0">
              <AddToWishlistBtn product={productDetails} />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over $50
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  100% secure checkout
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
