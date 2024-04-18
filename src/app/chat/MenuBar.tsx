import { UserButton } from "@clerk/nextjs";
import { BellOff, BellRing, Moon, Sun, Users } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "../notifications/pushService";
import { LoadingIndicator } from "stream-chat-react";
import DisappearingMessage from "@/components/DisappearingMessage";

interface MenuBarProps {
  onUserMenuClick: () => void;
}

export default function MenuBar({ onUserMenuClick }: MenuBarProps) {
  const { theme } = useTheme();

  return (
    <div className="p-3 flex items-center justify-between gap-3 bg-white border-e border-e-[#f5f5f5] dark:bg-[#17191c] dark:border-e-gray-800">
      <UserButton
        afterSignOutUrl="/"
        appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
      />
      <div className="flex gap-6">
        <PushSubscriptionToggleButton />
        <span title="Show users">
          <Users className="cursor-pointer" onClick={onUserMenuClick} />
        </span>
        <ThemeToggleButton />
      </div>
    </div>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  if (theme === "dark") {
    return (
      <span title="Enable light theme">
        <Sun className="cursor-pointer" onClick={() => setTheme("light")} />
      </span>
    );
  }

  return (
    <span title="Enable dark theme">
      <Moon className="cursor-pointer" onClick={() => setTheme("dark")} />
    </span>
  );
}

function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();

  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>();

  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    if (loading) return;
    setLoading(true);
    setConfirmMessage(undefined);

    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setConfirmMessage(
        "Push notifications " + (enabled ? "enabled" : "disabled")
      );
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (hasActivePushSubscription === undefined) return null;

  return (
    <div className="relative">
      {loading && (
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <LoadingIndicator />
        </span>
      )}
      {confirmMessage && (
        <DisappearingMessage className="absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-lg bg-white dark:bg-black px-2 py-1 shadow-md">
          {confirmMessage}
        </DisappearingMessage>
      )}
      {hasActivePushSubscription ? (
        <span title="Disable push notifications on this device">
          <BellOff
            onClick={() => setPushNotificationsEnabled(false)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""}`}
          />
        </span>
      ) : (
        <span title="Enable push notifications on this device">
          <BellRing
            onClick={() => setPushNotificationsEnabled(true)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""}`}
          />
        </span>
      )}
    </div>
  );
}
