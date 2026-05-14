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

  const updated: Record<string, number> = {};
  if (prevVote === "up") {
    updated.upvotes = Math.max(0, topic.upvotes - 1);
  } else if (prevVote === "down") {
    updated.downvotes = Math.max(0, topic.downvotes - 1);
  }

  if (type === "up") {
    updated.upvotes = (updated.upvotes ?? topic.upvotes) + 1;
  } else {
    updated.downvotes = (updated.downvotes ?? topic.downvotes) + 1;
  }

  await db
    .update(topics)
    .set(updated)
    .where(eq(topics.id, topicId));

  const response = NextResponse.json({ success: true });
  response.cookies.set(voteKey, type, { maxAge: 30 * 24 * 60 * 60 });
  return response;
}
