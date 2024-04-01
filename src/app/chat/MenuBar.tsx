import { UserButton } from "@clerk/nextjs";
import { Moon, Sun, Users } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { dark } from "@clerk/themes";

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
