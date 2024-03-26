"use client";

import { useUser } from "@clerk/nextjs";
import { Chat, LoadingIndicator } from "stream-chat-react";
import useInitializeChatClient from "../hooks/useInitializeChatClient";
import ChatSidebar from "./ChatSidebar";
import MainChatbox from "./MainChatbox";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import useWindowSize from "../hooks/useWindowSize";
import { mdBreakpoint } from "../utils/tailwind";

export default function ChatPage() {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();

  const [chatSidebarOpen, setChatbarOpen] = useState(false);

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= mdBreakpoint;

  useEffect(() => {
    if (windowSize.width >= mdBreakpoint) setChatbarOpen(false);
  }, [windowSize.width]);

  if (!chatClient || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="h-screen">
        <Chat client={chatClient}>
          <div className="flex justify-center border-b border-b-[#f8f8f8] p-3 md:hidden">
            <button onClick={() => setChatbarOpen(!chatSidebarOpen)}>
              {!chatSidebarOpen ? (
                <span className="flex items-center gap-1">
                  <Menu />
                  Menu
                </span>
              ) : (
                <X />
              )}
            </button>
          </div>
          <div className="flex flex-row">
            <ChatSidebar user={user} show={isLargeScreen || chatSidebarOpen} />
            <MainChatbox show={isLargeScreen || !chatSidebarOpen} />
          </div>
        </Chat>
      </div>
    </>
  );
}
