"use client";
import CheckoutWrapper from "@/components/orders/CheckoutWrapper";
import { AddressResponse } from "@/interfaces/AddressResponse";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

type ParamsType = Promise<{ cartId: string }>;

export default function CheckOut({ params }: { params: ParamsType }) {
  const resolvedParams = React.use(params);
  const cartId = resolvedParams.cartId;
  const [response, setResponse] = useState<AddressResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserAddresses() {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || ""
          : "";
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/addresses",
          {
            headers: {
              token,
              "content-type": "application/json",
            },
          }
        ).then((res) => res.json());
        setResponse(res);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoading(false);
      }
    }

    getUserAddresses();
  }, []);

  if (loading || !response) {
    return (
      <div className="flex justify-center items-center py-40">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">CheckOut Page</h1>
        <CheckoutWrapper response={response} cartId={cartId} />
      </div>
    </div>
  );
}

