"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import VoteButton from "@/components/VoteButton";
import CommentItem from "@/components/CommentItem";
import CommentForm from "@/components/CommentForm";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

interface Topic {
  id: number;
  title: string;
  content: string;
  authorNickname: string;
  upvotes: number;
  downvotes: number;
  createdAt: string | null;
  board: { name: string; slug: string };
}

interface Comment {
  id: number;
  topicId: number;
  parentId: number | null;
  content: string;
  authorNickname: string;
  upvotes: number;
  downvotes: number;
  createdAt: string | null;
}

export default function TopicPage() {
  const params = useParams();
  const id = params?.id as string;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopic = async () => {
    setLoading(true);
    const res = await fetch(`/api/topics/${id}`);
    if (res.ok) {
      const data = await res.json();
      setTopic(data.topic);
      setComments(data.comments || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const repliesByParentId = comments.reduce<Record<number, Comment[]>>(
    (acc, c) => {
      if (c.parentId !== null) {
        if (!acc[c.parentId]) acc[c.parentId] = [];
        acc[c.parentId].push(c);
      }
      return acc;
    },
    {}
  );

  const rootComments = comments.filter((c) => c.parentId === null);

  return (
    <div>
      <Link
        href="/"
        className="text-sm text-[#7e7e7e] hover:text-white transition-colors"
      >
        ← 返回首页
      </Link>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6 text-[#7e7e7e]" />
        </div>
      ) : topic ? (
        <>
          <article className="my-6 border border-[#3c3c3c] bg-[#1a1a1a] p-6">
            <div className="flex items-start gap-4">
              <VoteButton
                upvotes={topic.upvotes}
                downvotes={topic.downvotes}
                onVote={(type) =>
                  fetch(`/api/topics/${topic.id}/vote`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type }),
                  }).then(fetchTopic)
                }
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">
                  {topic.title}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-[#bbbbbb]">
                  <Link
                    href={`/board/${topic.board.slug}`}
                    className="text-[#7e7e7e] hover:text-white transition-colors"
                  >
                    [{topic.board.name}]
                  </Link>
                  <span>{topic.authorNickname}</span>
                  <span>·</span>
                  <span>
                    {topic.createdAt
                      ? formatDistanceToNow(new Date(topic.createdAt))
                      : ""}
                  </span>
                </div>
                <div className="mt-4 text-base whitespace-pre-wrap text-[#bbbbbb]">
                  {topic.content}
                </div>
              </div>
            </div>
          </article>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              评论 ({comments.length})
            </h2>
            <CommentForm topicId={topic.id} onCommentCreated={fetchTopic} />
            <div className="mt-4 space-y-2">
              {rootComments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  topicId={topic.id}
                  onCommentCreated={fetchTopic}
                  replies={repliesByParentId[c.id] || []}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className="text-center py-8 text-[#7e7e7e]">话题不存在</p>
      )}
    </div>
  );
}
