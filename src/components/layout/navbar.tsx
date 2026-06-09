"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  User,
  ShoppingCart,
  Menu,
  X,
  Heart,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishListContext";

export default function Navbar() {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/auth/login");
    window.location.reload();
  };

  const navItems = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/40 backdrop-blur-lg supports-[backdrop-filter]:bg-white/20 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
            T
          </div>
          TechMart
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded-lg transition ${
                pathname === item.href
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4 text-sm">

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="hover:text-black transition relative"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center hover:text-black transition outline-none">
                <User size={22} className="cursor-pointer" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-40 rounded-xl shadow-md"
            >
              {!isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/auth/login"
                      className="w-full cursor-pointer"
                    >
                      Login
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/auth/register"
                      className="w-full cursor-pointer"
                    >
                      Register
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/wishlist"
                      className="w-full cursor-pointer"
                    >
                      Wishlist
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/allorders"
                      className="w-full cursor-pointer"
                    >
                      Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={20} />
            {cart?.numOfCartItems && cart.numOfCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cart.numOfCartItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenu(!isMobileMenu)}
          >
            {isMobileMenu ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenu && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl shadow-lg rounded-b-lg border-t border-gray-200">
          <div className="flex flex-col space-y-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenu(false)}
                className={`block px-4 py-3 rounded-md transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-black text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenu(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Heart size={18} />
              Wishlist
              {wishlist.length > 0 && (
                <span className="ml-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}