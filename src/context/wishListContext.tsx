"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WishlistProduct } from "@/interfaces/WishlistResponse";

type WishlistContextType = {
  wishlist: WishlistProduct[];
  loading: boolean;
  fetchWishlist: (token?: string) => Promise<void>;
  addToWishlist: (product: WishlistProduct) => Promise<{ success: boolean; message: string }>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = (customToken?: string) => {
    const token = customToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    return {
      "Content-Type": "application/json",
      token: token || "",
    };
  };

  const fetchWishlist = async (customToken?: string) => {
    const token = customToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
        method: "GET",
        headers: getHeaders(token),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setWishlist(data.data || []);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: WishlistProduct) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return { success: false, message: "Please login first to add products to wishlist" };
    }
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Since RouteMisr doesn't return the full product in POST response, we append our local product object
        setWishlist(prev => {
          if (prev.some(item => item._id === product._id)) return prev;
          return [...prev, product];
        });
        return { success: true, message: data.message || "Product added successfully to your wishlist" };
      }
      return { success: false, message: data.message || "Failed to add product to wishlist" };
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return false;
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setWishlist(prev => prev.filter(item => item._id !== productId));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      return false;
    }
  };

  const clearWishlist = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return false;
    setLoading(true);
    try {
      // Delete all items one by one on the server
      await Promise.all(
        wishlist.map(item =>
          fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${item._id}`, {
            method: "DELETE",
            headers: getHeaders(token),
          })
        )
      );
      setWishlist([]);
      return true;
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};

