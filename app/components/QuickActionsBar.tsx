import { cn } from "@/lib/utils";
import React from "react";

type QuickActionsBarProps = {
  patientId: string;
  actionsButton: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
  }[];
  onChooseActions: (action: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
  }) => void;
};

const QuickActionsBar = ({
  patientId,
  actionsButton,
  onChooseActions,
}: QuickActionsBarProps) => {
  return (
    <div className="flex flex-row gap-2 p-4 bg-white border-b-2 w-full ">
      {actionsButton.map((action) => (
        <div
          key={action.label}
          className={cn(
            "p-2 rounded-full cursor-pointer flex gap-1 items-center justify-center",
            action.isActive
              ? "bg-black/80 text-white"
              : "bg-[#F1F1F1] text-black"
          )}
          onClick={() => onChooseActions(action)}
        >
          {action.icon}
          <span className="text-sm font-medium ">{action.label}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickActionsBar;
