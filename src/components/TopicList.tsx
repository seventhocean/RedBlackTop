"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopicCard from "@/components/TopicCard";
import PostForm from "@/components/PostForm";
import { Loader2 } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  content: string;
  authorNickname: string;
  upvotes: number;
  downvotes: number;
  createdAt: string | null;
  board?: { name: string; slug: string };
}

export default function TopicList({ boardSlug }: { boardSlug: string }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "newest";

  const fetchTopics = async () => {
    setLoading(true);
    const res = await fetch(`/api/topics?board=${boardSlug}&sort=${sort}`);
    const data = await res.json();
    setTopics(data.topics || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics();
  }, [boardSlug, sort]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PostForm boardSlug={boardSlug} onPostCreated={fetchTopics} />
        <div className="flex gap-2 text-sm">
          <a
            href={`/board/${boardSlug}?sort=newest`}
            className={`px-3 py-1 rounded ${sort === "newest" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            最新
          </a>
          <a
            href={`/board/${boardSlug}?sort=hottest`}
            className={`px-3 py-1 rounded ${sort === "hottest" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            最热
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          还没有话题，来发布第一个吧！
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((t) => (
            <TopicCard key={t.id} {...t} />
          ))}
        </div>
      )}
    </div>
  );
}
