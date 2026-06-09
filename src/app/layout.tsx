import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components";
import Navbar from "@/components/layout/navbar";
import MainProviders from "@/components/providers/MainProviders";
import { CartProvider } from "@/context/cartContext";
import { WishlistProvider } from "@/context/wishListContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <WishlistProvider>
            <MainProviders>
              <Navbar />
              {children}
              <Footer />
            </MainProviders>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
