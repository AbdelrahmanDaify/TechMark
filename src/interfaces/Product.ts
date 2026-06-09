import { Brand } from "./Brand";
import { Category } from "./Category";
import { SubCategory } from "./SubCategory";

export interface Product {
    sold: number;
    images: string[];
    subcategory: SubCategory[];
    ratingsQuantity: number;
    _id: string;
    title: string;
    slug: string;
    description: string;
    quantity: number;
    price: number;
    availableColors: string[];
    imageCover: string;
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    createdAt: string;
    updatedAt: string;
    id: string;
}






