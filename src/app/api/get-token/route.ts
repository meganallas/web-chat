import { env } from "@/env";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET() {
  try {
    const user = await currentUser();

    console.log("Calling get-token for user: ", user?.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const streamClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_KEY,
      env.STREAM_SECRET
    );

    // Subtract a minute to remove the possibility of time discrepancy.
    // e.g. Stream and server time may not be exactly the same by a few seconds.
    const issueAt = Math.floor(Date.now() / 1000) - 60;

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    const token = streamClient.createToken(user.id, expirationTime, issueAt);
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
