"use client";

import { useState } from "react";
import VoteButton from "@/components/VoteButton";
import CommentForm from "@/components/CommentForm";
import { formatDistanceToNow } from "@/lib/utils";

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

export default function CommentItem({
  comment,
  topicId,
  onCommentCreated,
  replies: repliesProp,
}: {
  comment: Comment;
  topicId: number;
  onCommentCreated: () => void;
  replies?: Comment[];
}) {
  const [showReply, setShowReply] = useState(false);

  const replies = repliesProp || [];

  return (
    <div className="border-b pb-3">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.authorNickname}</span>
            <span className="text-muted-foreground">
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) : ""}
            </span>
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <VoteButton
              upvotes={comment.upvotes}
              downvotes={comment.downvotes}
              onVote={(type) =>
                fetch(`/api/comments/${comment.id}/vote`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type }),
                })
              }
              size="sm"
            />
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              回复
            </button>
          </div>
          {showReply && (
            <div className="mt-2 ml-4">
              <CommentForm
                topicId={topicId}
                parentId={comment.id}
                onCommentCreated={() => {
                  setShowReply(false);
                  onCommentCreated();
                }}
              />
            </div>
          )}
          {replies.length > 0 && (
            <div className="ml-4 mt-2 space-y-2 border-l pl-4">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  topicId={topicId}
                  onCommentCreated={onCommentCreated}
                  replies={[]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
