"use client";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { WishlistProduct } from "@/interfaces/WishlistResponse";

type WishlistItemProps = {
  item: WishlistProduct;
  removeFromWishlist: (productId: string) => Promise<void>;
  addToCart?: (productId: string) => Promise<void>;
};

export default function WishlistItem({
  item,
  removeFromWishlist,
  addToCart,
}: WishlistItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await removeFromWishlist(item._id);
    setIsDeleting(false);
  }

  async function handleAddToCart() {
    if (!addToCart) return;
    setIsAddingToCart(true);
    await addToCart(item._id);
    setIsAddingToCart(false);
  }

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="relative w-20 h-20 shrink-0">
        <img
          src={item.imageCover}
          alt={item.title}
          className="object-cover w-20 h-20 rounded-md"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold line-clamp-1">
          <Link href={`/products/${item._id}`} className="hover:text-primary transition-colors">
            {item.title}
          </Link>
        </h3>
        {item.brand && <p className="text-sm text-muted-foreground">{item.brand.name}</p>}
        <p className="font-semibold text-primary mt-2">{formatPrice(item.price)}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4 text-red-500" />}
        </Button>

        {addToCart && (
          <Button size="sm" onClick={handleAddToCart} disabled={isAddingToCart} className="mt-2 flex items-center gap-1">
            {isAddingToCart ? <LoadingSpinner size="sm" /> : <ShoppingCart className="h-4 w-4" />}
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
