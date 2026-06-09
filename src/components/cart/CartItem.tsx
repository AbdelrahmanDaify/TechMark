import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartProduct } from "@/interfaces/CartResponse";

type CartItemProps = {
  item: CartProduct;
  removeSpecificCartItem: (cartItemId: string) => Promise<void>;
  updateCartItemCount: (cartItemId: string, count: number) => Promise<void>;
};

export default function CartItem({
  item,
  removeSpecificCartItem,
  updateCartItemCount,
}: CartItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);

  async function handleDeleteCartItem() {
    setIsDeleting(true);
    await removeSpecificCartItem(item.product._id);
    setIsDeleting(false);
  }

  async function handleUpdateCount(productCount: number) {
    if (productCount > item.count) {
      setIsIncreasing(true);
    } else {
      setIsDecreasing(true);
    }
    await updateCartItemCount(item.product._id, productCount);
    setIsIncreasing(false);
    setIsDecreasing(false);
  }

  return (
    <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
      <div className="relative w-20 h-20 shrink-0">
        <img
          src={item.product.imageCover}
          alt={item.product.title}
          className="object-cover w-20 h-20 rounded-md"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold line-clamp-2">
          <Link
            href={`/products/${item.product.id}`}
            className="hover:text-primary transition-colors"
          >
            {item.product.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {item.product.brand?.name}
        </p>
        <p className="font-semibold text-primary mt-2">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteCartItem()}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Trash2 className="h-4 w-4 text-red-500" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleUpdateCount(item.count - 1)}
            variant="outline"
            size="sm"
            disabled={item.count == 1 || isDecreasing}
            className="disabled:cursor-not-allowed disabled:pointer-events-auto hover:bg-background"
          >
            {isDecreasing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
          </Button>
          <span className="w-8 text-center">{item.count}</span>
          <Button
            onClick={() => handleUpdateCount(item.count + 1)}
            variant="outline"
            size="sm"
            disabled={isIncreasing}
            className="disabled:cursor-not-allowed disabled:pointer-events-auto hover:bg-background"
          >
            {isIncreasing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
