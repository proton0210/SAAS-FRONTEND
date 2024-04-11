"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Price } from "@/types";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Pricing({ clerkId }: { clerkId: string }) {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    fetchPricesAndCredits();
  }, []);

  const fetchPricesAndCredits = async () => {
    const { data } = await axios.get("/api/getproducts");
    setPrices(data);
    console.log(data);
  };

  const handleSubscription = async (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    console.log(id);
    const { data } = await axios.post(
      "/api/payment",
      {
        priceId: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Stripe checkout session URL
    window.location.assign(data);
  };
  return (
    <div className="bg-white py-24 sm:py-32  font-sans">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="absolute top-5 left-5">
          <Link href={`/product`} className="text-indigo-500">
            Back
          </Link>
        </div>
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the plan that works for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center">
          By selecting a plan, you can get access to the number credits the plan
          provides
        </p>
        <div className="mt-20 flow-root">
          <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 gap-x-14 divide-y divide-gray-100 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
            {prices.map((price: Price) => (
              <div
                key={price.id}
                className="pt-16 lg:px-8 lg:pt-0 xl:px-14 border-red-10"
              >
                <h3
                  id={price.id}
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  {price.product.name}
                </h3>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    INR {price.unit_amount / 100}
                  </span>
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {price.product.description}
                </p>
                <Button
                  aria-describedby={price.id}
                  className="primary-gradient w-[150px] font-semibold font-sans text-white rounded-md hover:shadow-md hover:shadow-indigo-500/50"
                  onClick={(e) => handleSubscription(e, price.id)}
                >
                  Buy plan
                </Button>

                <ul
                  role="list"
                  className="mt-6 space-y-3 text-sm leading-6 text-gray-600"
                ></ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
