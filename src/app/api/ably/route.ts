import { ablyRest } from "~/server/ably";
import { auth } from "~/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  const tokenRequestData = await ablyRest.auth.createTokenRequest({
    clientId: session?.user?.id ?? "anonymous",
  });
  
  return NextResponse.json(tokenRequestData);
}
