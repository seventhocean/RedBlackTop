"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostForm({
  boardSlug,
  onPostCreated,
}: {
  boardSlug: string;
  onPostCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nickname.trim() || !title.trim() || !content.trim()) {
      setError("请填写所有字段");
      return;
    }
    setSubmitting(true);
    try {
      // Ensure session cookie exists
      await fetch("/api/session", { method: "POST" });
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardSlug,
          title: title.trim(),
          content: content.trim(),
          authorNickname: nickname.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "发布失败");
        return;
      }
      setNickname("");
      setTitle("");
      setContent("");
      setOpen(false);
      onPostCreated();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="default">
        发布新话题
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <Input
        placeholder="你的匿名昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={20}
        className="max-w-xs"
      />
      <Input
        placeholder="话题标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
      />
      <Textarea
        placeholder="写点什么..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "发布中..." : "发布"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
