"use client";
import { AddressResponse } from "@/interfaces/AddressResponse";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type CheckoutWrapperProps = {
  response: AddressResponse;
  cartId: string;
};

export default function CheckoutWrapper({
  response,
  cartId,
}: CheckoutWrapperProps) {
  const [innerResponse, setInnerResponse] = useState(response);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  async function addAddress() {
    const address = {
      name,
      details,
      phone,
      city,
    };

    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/addresses",
      {
        headers: {
          token: localStorage.getItem("token") || "",
          "content-type": "application/json",
        },
        body: JSON.stringify(address),
        method: "post",
      }
    ).then((res) => res.json());

    setInnerResponse(response);
  }

  async function handleCheckout() {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`,
      {
        headers: {
          token: localStorage.getItem("token") || "",
          "content-type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
          shippingAddress: {
            details: innerResponse.data[selectedAddressIndex].details,
            phone: innerResponse.data[selectedAddressIndex].phone,
            city: innerResponse.data[selectedAddressIndex].city,
          },
        }),
      }
    ).then((res) => res.json());

    location.href = response.session.url;
  }

  if (innerResponse.data.length == 0) {
    return (
      <div className="mt-10">
        <h3>No Address added to this account</h3>
        <Button className="mt-5" variant={"outline"}>
          Add New Account
        </Button>

        <div className="grid gap-4 mt-10">
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
          />
          <Input
            onChange={(e) => setDetails(e.target.value)}
            value={details}
            type="text"
            placeholder="Details"
          />
          <Input
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            type="text"
            placeholder="Phone"
          />
          <Input
            onChange={(e) => setCity(e.target.value)}
            value={city}
            type="text"
            placeholder="City"
          />
          <Button onClick={addAddress} className="ms-auto">
            Add
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid mt-10 gap-4">
        {innerResponse.data.map((address, index) => {
          return (
            <div
              className={cn(
                "p-5 border-3 cursor-pointer max-w-md",
                index == selectedAddressIndex
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-500 text-gray-500"
              )}
              onClick={() => setSelectedAddressIndex(index)}
            >
              <h2>{address.name}</h2>
            </div>
          );
        })}
        <Button onClick={handleCheckout}>Checkout</Button>
      </div>
    </div>
  );
}
