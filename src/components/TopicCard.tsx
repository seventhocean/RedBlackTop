import Link from "next/link";
import VoteButton from "@/components/VoteButton";
import { formatDistanceToNow } from "@/lib/utils";

interface TopicCardProps {
  id: number;
  title: string;
  content: string;
  authorNickname: string;
  upvotes: number;
  downvotes: number;
  createdAt: string | null;
  board?: { name: string; slug: string };
}

export default function TopicCard({
  id,
  title,
  content,
  authorNickname,
  upvotes,
  downvotes,
  createdAt,
  board,
}: TopicCardProps) {
  const preview =
    content.length > 150 ? content.slice(0, 150) + "..." : content;

  return (
    <div className="border border-[#3c3c3c] bg-[#1a1a1a] p-4 hover:border-white/30 transition-colors">
      <div className="flex items-start gap-4">
        <VoteButton
          upvotes={upvotes}
          downvotes={downvotes}
          onVote={(type) =>
            fetch(`/api/topics/${id}/vote`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type }),
            })
          }
        />
        <div className="flex-1 min-w-0">
          <Link href={`/topic/${id}`} className="hover:underline">
            <h3 className="font-semibold text-lg truncate text-white">
              {title}
            </h3>
          </Link>
          {board && (
            <Link
              href={`/board/${board.slug}`}
              className="text-xs text-[#7e7e7e] hover:text-white transition-colors"
            >
              [{board.name}]
            </Link>
          )}
          <p className="text-sm text-[#bbbbbb] mt-1 line-clamp-2">
            {preview}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-[#7e7e7e]">
            <span>{authorNickname}</span>
            <span>·</span>
            <span>
              {createdAt ? formatDistanceToNow(new Date(createdAt)) : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
