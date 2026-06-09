"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartResponse } from "@/interfaces/CartResponse";

type CartContextType = {
  cart: CartResponse | null;
  loading: boolean;
  fetchCart: (token?: string) => Promise<void>;
  addToCart: (productId: string) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, count: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const getHeaders = (customToken?: string) => {
    const token = customToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    return {
      "Content-Type": "application/json",
      token: token || "",
    };
  };

  const fetchCart = async (customToken?: string) => {
    const token = customToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "GET",
        headers: getHeaders(token),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return { success: false, message: "Please login first to add products to cart" };
    }
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCart(data);
        return { success: true, message: data.message || "Product added successfully to your cart" };
      }
      return { success: false, message: data.message || "Failed to add product to cart" };
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return false;
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCart(data);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error removing from cart:", err);
      return false;
    }
  };

  const updateQuantity = async (productId: string, count: number) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return false;
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCart(data);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating quantity:", err);
      return false;
    }
  };

  const clearCart = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return false;
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "DELETE",
        headers: getHeaders(token),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setCart(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error clearing cart:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

