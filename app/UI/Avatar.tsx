import React from "react";
import Image from "next/image";
import { cn } from "../utils";

type Props = {
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  name?: string;
  type?: "rounded" | "square";
  onClick?: () => void;
  bgColor?: string;
};

const colors = [
  { textColor: "#73726E", backgroundColor: "#EBEBE8" },
  { textColor: "#73726E", backgroundColor: "#EBEBE8" },
];

const Avatar = ({
  src,
  fallback,
  size = "md",
  className,
  name,
  type = "square",
  onClick,
  bgColor,
}: Props) => {
  return (
    <div
      className={cn(
        " rounded-full  flex items-center justify-center overflow-hidden border border-gray-200 text-black",
        type === "rounded" && "rounded-full",
        type === "square" && "rounded",
        className,
        size === "sm" && "w-8 h-8",
        size === "md" && "w-10 h-10",
        size === "lg" && "w-12 h-12",
        size === "xl" && "w-14 h-14"
      )}
      style={{
        backgroundColor:
          bgColor ||
          colors[Math.floor(Math.random() * colors.length)].backgroundColor,
      }}
      onClick={onClick}
    >
      {src ? (
        <Image src={src} alt={name || "A"} fill className="object-cover" />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center h-full w-full ",
            type === "rounded" && "rounded-full",
            type === "square" && "rounded"
          )}
        >
          {fallback || name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
