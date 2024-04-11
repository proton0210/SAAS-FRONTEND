import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
  bodyParser: false,
};

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}
