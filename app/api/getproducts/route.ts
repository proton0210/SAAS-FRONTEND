import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
  if (!STRIPE_SECRET_KEY) {
    throw new Error("Please add STRIPE_SECRET_KEY to .env");
  }
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10", // Specify the API version
  });

  const prices = await stripe.prices.list({
    limit: 4,
    expand: ["data.product"],
  });

  return NextResponse.json(prices.data.reverse());
}
