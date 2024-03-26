import { UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";

export default function MenuBar() {
  return (
    <div className="p-3 flex items-center justify-between gap-3 bg-white border-e border-e-[#f5f5f5]">
      <UserButton afterSignOutUrl="/" />
      <div className="flex gap-6">
        <span title="Show users">
          <Users className="cursor-pointer" />
        </span>
      </div>
    </div>
  );
}
