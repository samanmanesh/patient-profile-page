import React from "react";
import Avatar from "../UI/Avatar";
import { HomeIcon, UsersRound } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-full h-full bg-[#F8F8F7] flex flex-col p-4 border-r border-[#EBEBE8]">
      <div className="flex  gap-2 items-center justify-start p-2 ">
        <Avatar src="" fallback="D" size="sm" />
        <h1 className="text-lg font-semibold">Decoda Health</h1>
      </div>
      <div className="flex flex-col gap-2 mt-20">
        <button className="flex items-center justify-start gap-2 p-2 rounded-lg hover:bg-[#F0F0EF] transition-all cursor-pointer ">    
          <HomeIcon className="w-4 h-4" />
          <span className="text-md font-semibold">Home</span>
        </button>
        <button className="flex items-center justify-start gap-2 p-2 rounded-lg hover:bg-[#F0F0EF] transition-all cursor-pointer ">
          <UsersRound className="w-4 h-4" />
          <span className="text-md font-semibold">Patients</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
