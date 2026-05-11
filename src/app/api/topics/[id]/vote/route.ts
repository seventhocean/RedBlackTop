import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { topics } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const topicId = parseInt(id);
  const body = await request.json();
  const { type } = body as { type: "up" | "down" };
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const voteKey = `vote_topic_${topicId}`;
  const prevVote = cookieStore.get(voteKey)?.value;

  if (prevVote === type) {
    return NextResponse.json({ error: "Already voted same" }, { status: 400 });
  }

  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
  });
  if (!topic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (prevVote === "up") {
    await db
      .update(topics)
      .set({ upvotes: Math.max(0, topic.upvotes - 1) })
      .where(eq(topics.id, topicId));
  } else if (prevVote === "down") {
    await db
      .update(topics)
      .set({ downvotes: Math.max(0, topic.downvotes - 1) })
      .where(eq(topics.id, topicId));
  }

  if (type === "up") {
    await db
      .update(topics)
      .set({ upvotes: topic.upvotes + (prevVote ? 0 : 0) + 1 })
      .where(eq(topics.id, topicId));
  } else {
    await db
      .update(topics)
      .set({ downvotes: topic.downvotes + (prevVote ? 0 : 0) + 1 })
      .where(eq(topics.id, topicId));
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(voteKey, type, { maxAge: 30 * 24 * 60 * 60 });
  return response;
}
