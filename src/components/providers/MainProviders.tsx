"use client";

import React from "react";
import { CartProvider } from "@/context/cartContext";
import { WishlistProvider } from "@/context/wishListContext";

type MainProvidersProps = {
  children: React.ReactNode;
};

export default function MainProviders({ children }: MainProvidersProps) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}