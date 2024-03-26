"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import useInitializeChatClient from "../hooks/useInitializeChatClient";

export default function ChatPage() {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();

  if (!chatClient || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div className="h-screen">
        <Chat client={chatClient}>
          <div className="flex flex-row">
            <ChannelList
              filters={{
                type: "messaging",
                members: { $in: [user.id] },
              }}
              sort={{ last_message_at: -1 }}
              options={{ state: true, presence: true, limit: 10 }}
            />
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
            </Channel>
          </div>
        </Chat>
      </div>
    </>
  );
}
