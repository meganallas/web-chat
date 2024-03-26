import { env } from "@/env";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function useInitializeChatClient() {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  const getToken = useCallback(async () => {
    try {
      const response = await fetch("/api/get-token");
      if (!response.ok) {
        throw Error("Failed to get token");
      }
      const body = await response.json();
      return body.token;
    } catch (error) {
      console.error("Failed to connect user", error);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const client = StreamChat.getInstance(env.NEXT_PUBLIC_STREAM_KEY);
    setChatClient(client);

    client.connectUser(
      {
        id: user.id,
        name: user.fullName || user.id,
        image: user.imageUrl,
      },
      async () => await getToken()
    );

    return () => {
      setChatClient(null);
      client.disconnectUser();
    };
  }, [getToken, user]);

  return chatClient;
}
