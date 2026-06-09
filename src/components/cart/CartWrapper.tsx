"use client";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import CartItem from "./CartItem";
import { useCart } from "@/context/cartContext";

export default function CartWrapper() {
  const { cart, loading, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  async function handleClearCart() {
    setIsClearing(true);
    await clearCart();
    setIsClearing(false);
  }

  async function removeSpecificCartItem(cartItemId: string) {
    await removeFromCart(cartItemId);
  }

  async function updateCartItemCount(cartItemId: string, count: number) {
    await updateQuantity(cartItemId, count);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (
    !cart ||
    !cart.data ||
    !cart.data.products ||
    cart.data.products.length === 0
  ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {cart.numOfCartItems} item
          {cart.numOfCartItems !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.data.products.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                removeSpecificCartItem={removeSpecificCartItem}
                updateCartItemCount={updateCartItemCount}
              />
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-6">
            <Button disabled={isClearing} variant="outline" onClick={handleClearCart}>
              {isClearing ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>
                  Subtotal ({cart.data.products.length} items)
                </span>
                <span>
                  {formatPrice(cart.data.totalCartPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(cart.data.totalCartPrice)}</span>
            </div>

            <Button className="w-full" size="lg">
              <Link href={"/checkout/" + cart.cartId}>
                Proceed to Checkout
              </Link>
            </Button>

            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

