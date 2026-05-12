"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CommentForm({
  topicId,
  parentId,
  onCommentCreated,
}: {
  topicId: number;
  parentId?: number;
  onCommentCreated: () => void;
}) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nickname.trim() || !content.trim()) {
      setError("请填写昵称和内容");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/session", { method: "POST" });
      const res = await fetch(`/api/topics/${topicId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          authorNickname: nickname.trim(),
          ...(parentId !== undefined ? { parentId } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "评论失败");
        return;
      }
      setNickname("");
      setContent("");
      onCommentCreated();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="你的匿名昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={20}
        className="max-w-xs"
      />
      <Textarea
        placeholder={parentId ? "回复..." : "写下你的评论..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={parentId ? 2 : 3}
      />
      {error && <p className="text-sm text-[#e22718]">{error}</p>}
      <Button type="submit" disabled={submitting} size="sm">
        {submitting
          ? parentId
            ? "回复中..."
            : "评论中..."
          : parentId
            ? "回复"
            : "发表评论"}
      </Button>
    </form>
  );
}
