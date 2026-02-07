import Ably from "ably";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  const client = new Ably.Rest(env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: session?.user?.id ?? "anonymous",
  });
  
  return NextResponse.json(tokenRequestData);
}
