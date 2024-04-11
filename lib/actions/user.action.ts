"use server";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const createUser = async ({
  clerkId,
  name,
  username,
  email,
  picture,
}: {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}) => {
  const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
  const params = {
    TableName: "Users",
    Item: marshall({
      ClerkID: clerkId,
      Name: name,
      Username: username,
      Email: email,
      Picture: picture,
      Credits: 2,
    }),
  };

  try {
    await ddbClient.send(new PutItemCommand(params));
  } catch (err) {
    throw err;
  }
};

export const getUserCredits = async (clerkId: string) => {
  const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
  const params = {
    TableName: "Users",
    Key: marshall({ ClerkID: clerkId }),
  };

  try {
    const { Item } = await ddbClient.send(new GetItemCommand(params));
    if (!Item) {
      return null;
    }
    const result = unmarshall(Item);
    console.log(result);
    return result.Credits as number;
  } catch (err) {
    throw err;
  }
};
