"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cartContext";

type AddToCartBtnProps = {
  productId: string;
};

export default function AddToCartBtn({
  productId,
}: AddToCartBtnProps) {
  const [IsAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  async function handleAddToCart() {
    setIsAddingToCart(true);
    const result = await addToCart(productId);
    setIsAddingToCart(false);

    if (result.success) {
      toast.success(result.message, {
        position: "top-right",
      });
    } else {
      toast.error(result.message, {
        position: "top-right",
      });
    }
  }

  return (
    <Button
      className="w-full cursor-pointer"
      size="sm"
      onClick={handleAddToCart}
      disabled={IsAddingToCart}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {IsAddingToCart ? "Adding to Cart..." : "Add to Cart"}
    </Button>
  );
}

