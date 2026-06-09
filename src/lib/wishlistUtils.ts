"use server";
export async function addProductToWishlist(productId: string) {

    const data = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
        method: "post",
        body: JSON.stringify({
            productId,
        }),
        headers: {
            token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjMzNjhhODRkOTUwYzkwMjJiYjdiNyIsIm5hbWUiOiJFbWFuIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjM5MTU0MDQsImV4cCI6MTc3MTY5MTQwNH0.w2nm3YpHf1s-JBkZnfxPunFfYyyNPPGT6VGZ0J42rDA",
            "content-type": "application/json",
        },
    }).then((res) => res.json());

    return data;
}