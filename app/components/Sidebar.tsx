"use client";

import { usePathname, useRouter } from "next/navigation";
import Avatar from "../UI/Avatar";
import { UsersRound } from "lucide-react";
import { cn } from "../utils";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Patients",
      icon: UsersRound,
      path: "/patients",
    },
  ];

  return (
    <div className="w-full h-full bg-[#F8F8F7] flex flex-col p-4 border-r border-[#EBEBE8]">
      <div className="flex gap-2 items-center justify-start p-2">
        <Avatar
          src=""
          fallback="D"
          size="sm"
          onClick={() => router.push("/")}
          className="bg-stone-900/90 rounded-lg text-white"
          
        />
        <h1
          className="text-lg font-semibold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Decoda Health
        </h1>
      </div>
      <div className="flex flex-col gap-2 mt-20">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (pathname.includes(item.path) && item.path !== "/");
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex items-center justify-start gap-2 p-2 rounded-lg transition-all cursor-pointer",
                isActive ? "bg-[#F0F0EF] text-primary" : "hover:bg-[#F0F0EF]"
              )}
            >
              <item.icon
                className={cn("w-4 h-4", isActive && "text-primary")}
              />
              <span className="text-md font-semibold">{item.name}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 text-xs text-black/50 mt-auto p-4">
        Designed & developed by{" "}
        <span className="font-semibold text-black">Sam Sobhan © </span>
      </div>
    </div>
  );
};

export default Sidebar;
