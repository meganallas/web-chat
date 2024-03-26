import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

interface MainChatboxProps {
  show: boolean;
}

export default function MainChatbox({ show }: MainChatboxProps) {
  return (
    <div className={`h-full w-full ${show ? "block" : "hidden"}`}>
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}
