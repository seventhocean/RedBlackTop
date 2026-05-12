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
      setLocalUp((v) => v + 1 + (activeVote === "down" ? 1 : 0));
      if (activeVote === "down") setLocalDown((v) => Math.max(0, v - 1));
    } else {
      setLocalDown((v) => v + 1 + (activeVote === "up" ? 1 : 0));
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
          "flex items-center gap-0.5 px-1.5 py-0.5 transition-colors",
          activeVote === "up"
            ? "text-[#0fa336] bg-[#0fa336]/10"
            : "text-[#7e7e7e] hover:text-[#0fa336] hover:bg-[#0fa336]/10"
        )}
      >
        <ArrowBigUp size={iconSize} />
        <span className="text-xs font-bold">{localUp}</span>
      </button>
      <button
        onClick={() => handleVote("down")}
        className={cn(
          "flex items-center gap-0.5 px-1.5 py-0.5 transition-colors",
          activeVote === "down"
            ? "text-[#e22718] bg-[#e22718]/10"
            : "text-[#7e7e7e] hover:text-[#e22718] hover:bg-[#e22718]/10"
        )}
      >
        <ArrowBigDown size={iconSize} />
        <span className="text-xs font-bold">{localDown}</span>
      </button>
    </div>
  );
}
