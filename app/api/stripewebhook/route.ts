import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  if (req === null)
    throw new Error(`Missing userId or request`, { cause: { req } });

  const stripeSignature = req.headers.get("stripe-signature");

  if (stripeSignature === null) throw new Error("stripeSignature is null");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      stripeSignature,
      webhookSecret
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
  }

  if (event === undefined) throw new Error(`event is undefined`);
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(`Payment successful for session ID: ${session.id}`);
      clerkClient.users.updateUserMetadata(
        event.data.object.metadata?.userId as string,
        {
          publicMetadata: {
            stripe: {
              status: session.status,
              payment: session.payment_status,
            },
          },
        }
      );
      const customerId = session.metadata!.userId as string;
      const amount = session.amount_total || 0;

      await updateUserCredits(customerId, amount);

      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ status: 200, message: "success" });
}

async function updateUserCredits(
  customerId: string,
  amount: number
): Promise<void> {
  let modifiedAmount = amount / 100;
  console.log("Amount: ", modifiedAmount);
  const amountMapping: { [key: string]: number } = {
    "5": 5,
    "25": 40,
    "49": 99,
  };
  const credits = amountMapping[modifiedAmount.toString()] || 0; // Ensure credits fallbacks to 0 if not found
  console.log(credits);
  const params: UpdateItemCommandInput = {
    TableName: "Users",
    Key: {
      ClerkID: { S: customerId },
    },
    UpdateExpression: "SET Credits = Credits + :val",
    ExpressionAttributeValues: {
      ":val": { N: credits.toString() },
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const command = new UpdateItemCommand(params);
    const result = await dynamodb.send(command);
    console.log("Credits updated successfully:", result);
  } catch (error) {
    console.error("Error updating credits:", error);
  }
}
