"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { WishlistProduct } from "@/interfaces/WishlistResponse";
import { useWishlist } from "@/context/wishListContext";

type AddToWishlistBtnProps = {
  product: WishlistProduct;
};

export default function AddToWishlistBtn({ product }: AddToWishlistBtnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isFavorited = wishlist.some((item) => item._id === product._id);

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      if (isFavorited) {
        const success = await removeFromWishlist(product._id);
        setIsAdding(false);
        if (success) {
          toast.success("Product removed from wishlist successfully!", { position: "top-right" });
        } else {
          toast.error("Failed to remove product from wishlist.");
        }
      } else {
        const result = await addToWishlist(product);
        setIsAdding(false);
        if (result.success) {
          toast.success(result.message, { position: "top-right" });
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      setIsAdding(false);
      toast.error("Something went wrong.");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleWishlist}
      disabled={isAdding}
      className={`absolute top-2 right-2 transition-opacity bg-white/80 hover:bg-white rounded-full p-2 h-9 w-9 flex items-center justify-center border shadow-sm ${
        isFavorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
    </Button>
  );
}

