"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishListContext";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email:"",
      password: "",
    },
  });

  const { fetchCart } = useCart();
  const { fetchWishlist } = useWishlist();

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        const token = data.token;
        localStorage.setItem("token", token);

        // Sync state immediately
        await Promise.all([
          fetchCart(token),
          fetchWishlist(token)
        ]);

        router.push("/products");
      } else {
        form.setError("email", {
          message: data.message || "Invalid email or password",
        });
      }
    } catch (error) {
      setIsLoading(false);
      form.setError("email", {
        message: "Something went wrong. Try again later.",
      });
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back !</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your-email@gmail.com"
                        className="bg-blue-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        className="bg-blue-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full text-lg py-6 bg-black hover:bg-black/90"
              >
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-center mt-6 text-sm">
          If you don't have account, please{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 font-medium hover:underline"
          >
            SignUp Now
          </Link>
        </p>
      </div>
    </div>
  );
}
