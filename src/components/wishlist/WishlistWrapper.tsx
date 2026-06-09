"use client";
import React, { useState } from "react";
import WishlistItem from "./WishlistItem";
import { Button } from "../ui/button";
import { Trash2, Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/context/wishListContext";
import { useCart } from "@/context/cartContext";
import { LoadingSpinner } from "../shared/LoadingSpinner";

export default function WishlistWrapper() {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleRemoveFromWishlist = async (productId: string) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      toast.success("Product removed from wishlist!");
    } else {
      toast.error("Failed to remove product from wishlist.");
    }
  };

  const handleAddToCart = async (productId: string) => {
    const result = await addToCart(productId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleClearWishlist = async () => {
    setIsClearing(true);
    const success = await clearWishlist();
    setIsClearing(false);
    if (success) {
      toast.success("Wishlist cleared!");
    } else {
      toast.error("Failed to clear wishlist.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0)
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
        <Button asChild>
          <a href="/products">Start Adding Products</a>
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <Button variant="outline" onClick={handleClearWishlist} disabled={isClearing}>
          {isClearing ? "Clearing..." : <Trash2 className="h-4 w-4 mr-2" />}
          Clear Wishlist
        </Button>
      </div>

      <div className="space-y-4">
        {wishlist.map(item => (
          <WishlistItem
            key={item._id}
            item={item}
            removeFromWishlist={handleRemoveFromWishlist}
            addToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

