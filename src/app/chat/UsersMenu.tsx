import { useEffect, useState } from "react";
import {
  Avatar,
  useChatContext,
  LoadingChannels as LoadingUsers,
} from "stream-chat-react";
import { UserResource } from "@clerk/types";
import { Channel, UserResponse } from "stream-chat";
import { ArrowLeft } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import useDebounce from "../hooks/useDebounce";

interface UsersMenuProps {
  loggedInUser: UserResource;
  onClose: () => void;
  onChannelSelected: () => void;
}

export default function UsersMenu({
  loggedInUser,
  onClose,
  onChannelSelected,
}: UsersMenuProps) {
  // Referencing Stream chat initialization on the base chat page.
  // The initialization should only be happening once.
  const { client, setActiveChannel } = useChatContext();

  // User's profile image is not included in Stream's users response.
  const [users, setUsers] = useState<(UserResponse & { image?: string })[]>();

  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounced = useDebounce(searchInput);

  const [moreUsersLoading, setMoreUsersLoading] = useState(false);

  const [endOfPaginationReached, setEndOfPaginationReached] = useState<
    boolean | undefined
  >();

  const pageSize = 2;

  useEffect(() => {
    async function loadInitialUsers() {
      setUsers(undefined);
      setEndOfPaginationReached(undefined);
      
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await client.queryUsers(
          {
            id: { $ne: loggedInUser.id },
            ...(searchInputDebounced
              ? {
                  $or: [
                    { name: { $autocomplete: searchInputDebounced } },
                    { id: { $autocomplete: searchInputDebounced } },
                  ],
                }
              : {}),
          },
          {
            id: 1,
          },
          {
            limit: pageSize + 1,
          }
        );

        setUsers(response.users.slice(0, pageSize));
        setEndOfPaginationReached(response.users.length <= pageSize);
      } catch (error) {
        console.error(error);
        alert("Error loading users");
      }
    }
    loadInitialUsers();
  }, [client, loggedInUser.id, searchInputDebounced]);

  const loadMoreUsers = async () => {
    setMoreUsersLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const lastUserId = users?.[users.length - 1].id;
      if (!lastUserId) return;

      const response = await client.queryUsers(
        {
          $and: [
            { id: { $ne: loggedInUser.id } },
            { id: { $gt: lastUserId } },
            searchInputDebounced
              ? {
                  $or: [
                    { name: { $autocomplete: searchInputDebounced } },
                    { id: { $autocomplete: searchInputDebounced } },
                  ],
                }
              : {},
          ],
        },
        { id: 1 },
        { limit: pageSize + 1 }
      );

      setUsers([...users, ...response.users.slice(0, pageSize)]);
      setEndOfPaginationReached(response.users.length <= pageSize);
    } catch (error) {
      console.error(error);
      alert("Error loading users");
    } finally {
      setMoreUsersLoading(false);
    }
  };

  const handleChannelSelected = (channel: Channel) => {
    setActiveChannel(channel);
    onChannelSelected();
  };

  const startChatWithUser = async (userId: string) => {
    try {
      const channel = client.channel("messaging", {
        members: [userId, loggedInUser.id],
      });
      await channel.create();
      handleChannelSelected(channel);
    } catch (error) {
      console.error(error);
      alert("Error creating channel");
    }
  };

  return (
    <div className="absolute z-10 h-full w-full str-chat bg-white border-e border-e-[#DBDDE1]">
      <div className="flex flex-col p-3">
        <div className="flex items-center gap-3 text-lg font-bold mb-3">
          <ArrowLeft onClick={onClose} className="cursor-pointer" /> Users
        </div>
        <input
          type="search"
          placeholder="Search"
          className="rounded-full border border-gray-300 px-4 py-2"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>
      <div>
        {users?.map((user) => (
          <UserResult
            user={user}
            onUserClicked={() => {
              startChatWithUser;
            }}
            key={user.id}
          />
        ))}
        <div className="px-3">
          {!users && !searchInputDebounced && <LoadingUsers />}
          {!users && searchInputDebounced && "Searching..."}
          {users?.length === 0 && "No users found"}
        </div>
        {endOfPaginationReached === false && (
          <LoadingButton
            onClick={loadMoreUsers}
            loading={moreUsersLoading}
            className="m-auto mb-3 w-[80%]"
          >
            Load more users
          </LoadingButton>
        )}
      </div>
    </div>
  );
}

interface UserResultProps {
  user: UserResponse & { image?: string };
  onUserClicked: (userId: string) => void;
}

function UserResult({ user, onUserClicked }: UserResultProps) {
  return (
    <button
      className="mb-3 w-full flex items-center p-2 gap-2 hover:bg-[#e9eaed]"
      onClick={() => onUserClicked(user.id)}
    >
      <span>
        <Avatar image={user.image} name={user.name || user.id} size={40} />
      </span>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {user.name || user.id}
      </span>
      {user.online && <span className="text-sm text-green-500">Online</span>}
    </button>
  );
}