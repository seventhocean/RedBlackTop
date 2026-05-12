import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { topics, boards, comments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const topicId = parseInt(id);

  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
    with: {
      board: true,
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const topicComments = await db.query.comments.findMany({
    where: eq(comments.topicId, topicId),
    orderBy: (c) => c.createdAt,
  });

  return NextResponse.json({
    topic: {
      id: topic.id,
      title: topic.title,
      content: topic.content,
      authorNickname: topic.authorNickname,
      upvotes: topic.upvotes,
      downvotes: topic.downvotes,
      createdAt: topic.createdAt,
      board: topic.board,
    },
    comments: topicComments.map((c) => ({
      id: c.id,
      topicId: c.topicId,
      parentId: c.parentId,
      content: c.content,
      authorNickname: c.authorNickname,
      upvotes: c.upvotes,
      downvotes: c.downvotes,
      createdAt: c.createdAt,
    })),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const topicId = parseInt(id);
  const body = await request.json();
  const { content, authorNickname, parentId } = body;

  if (!content?.trim() || !authorNickname?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
  });
  if (!topic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const values: Record<string, unknown> = {
    topicId,
    content: content.trim(),
    authorNickname: authorNickname.trim(),
  };
  if (parentId != null) {
    values.parentId = parentId;
  }

  const result = await db
    .insert(comments)
    .values(values as any)
    .returning();

  return NextResponse.json({ comment: result[0] }, { status: 201 });
}
