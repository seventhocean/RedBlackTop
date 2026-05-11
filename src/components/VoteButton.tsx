"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

export default function VoteButton({
  upvotes,
  downvotes,
  onVote,
  size = "md",
}: {
  upvotes: number;
  downvotes: number;
  onVote: (type: "up" | "down") => void;
  size?: "sm" | "md";
}) {
  const [activeVote, setActiveVote] = useState<"up" | "down" | null>(null);
  const [localUp, setLocalUp] = useState(upvotes);
  const [localDown, setLocalDown] = useState(downvotes);

  const handleVote = (type: "up" | "down") => {
    if (activeVote === type) return;
    setActiveVote(type);
    if (type === "up") {
      setLocalUp((v) => v + (activeVote === "down" ? 1 : 0));
      if (activeVote === "down") setLocalDown((v) => Math.max(0, v - 1));
    } else {
      setLocalDown((v) => v + (activeVote === "up" ? 1 : 0));
      if (activeVote === "up") setLocalUp((v) => Math.max(0, v - 1));
    }
    onVote(type);
  };

  const iconSize = size === "sm" ? 16 : 20;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote("up")}
        className={cn(
          "flex items-center gap-0.5 rounded px-1.5 py-0.5 transition-colors",
          activeVote === "up"
            ? "text-green-600 bg-green-50"
            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
        )}
      >
        <ArrowBigUp size={iconSize} />
        <span className="text-xs font-medium">{localUp}</span>
      </button>
      <button
        onClick={() => handleVote("down")}
        className={cn(
          "flex items-center gap-0.5 rounded px-1.5 py-0.5 transition-colors",
          activeVote === "down"
            ? "text-red-600 bg-red-50"
            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
        )}
      >
        <ArrowBigDown size={iconSize} />
        <span className="text-xs font-medium">{localDown}</span>
      </button>
    </div>
  );
}
