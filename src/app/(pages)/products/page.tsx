import ProductsClient from "./ProductsClient";

export default async function Products() {
  const data = await fetch(
    "https://ecommerce.routemisr.com/api/v1/products",
    { cache: "no-store" }
  ).then((res) => res.json());

  return <ProductsClient products={data.data} />;
}
