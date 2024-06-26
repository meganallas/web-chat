"use client";

import { useUser } from "@clerk/nextjs";
import { Chat, LoadingIndicator } from "stream-chat-react";
import useInitializeChatClient from "../hooks/useInitializeChatClient";
import ChatSidebar from "./ChatSidebar";
import MainChatbox from "./MainChatbox";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import useWindowSize from "../hooks/useWindowSize";
import { mdBreakpoint } from "../utils/tailwind";
import { useTheme } from "../ThemeProvider";
import { registerServiceWorker } from "../utils/serviceWorker";
import {
  getCurrentPushSubscription,
  sendPushSubscriptionToServer,
} from "../notifications/pushService";

export default function ChatPage() {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();
  const { theme } = useTheme();

  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= mdBreakpoint;

  useEffect(() => {
    if (windowSize.width >= mdBreakpoint) setChatSidebarOpen(false);
  }, [windowSize.width]);

  useEffect(() => {
    async function setupServiceWorker() {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error(error);
      }
    }

    setupServiceWorker();
  }, []);

  useEffect(() => {
    async function syncPushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error(error);
      }
    }
    syncPushSubscription();
  }, []);

  const handleSidebarOnClose = useCallback(() => {
    setChatSidebarOpen(false);
  }, []);

  if (!chatClient || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-black">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="h-screen bg-gray-100 xl:px-20 xl:py-8 text-black dark:bg-black dark:text-white">
        <div className="max-w-[1600px] min-w-[350px] h-full shadow-sm m-auto flex flex-col">
          {/* TODO: Stream light/dark theme does not seem to be working specifically on the channel list hover/selected and chat bubble. */}
          <Chat
            client={chatClient}
            theme={
              theme === "dark"
                ? "str-chat__theme-dark"
                : "str-chat__theme-light"
            }
          >
            <div className="flex justify-center border-b border-b-[#f8f8f8] p-3 md:hidden">
              <button onClick={() => setChatSidebarOpen(!chatSidebarOpen)}>
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
            <div className="flex flex-row overflow-y-auto">
              <ChatSidebar
                user={user}
                show={isLargeScreen || chatSidebarOpen}
                onClose={handleSidebarOnClose}
              />
              <MainChatbox
                show={isLargeScreen || !chatSidebarOpen}
                hideChannelOnThread={!isLargeScreen}
              />
            </div>
          </Chat>
        </div>
      </div>
    </>
  );
}
