import { Product } from "./Product";

export interface WishlistResponse {
  status: string;
  numOfWishlistItems: number;
  data: WishlistData;
}

export interface WishlistData {
  _id: string;
  user: string;
  products: WishlistProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WishlistProduct {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  brand?: {
    name: string;
  };
}


