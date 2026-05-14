import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);
  const body = await request.json();
  const { type } = body as { type: "up" | "down" };
  const cookieStore = await cookies();

  const voteKey = `vote_comment_${commentId}`;
  const prevVote = cookieStore.get(voteKey)?.value;

  if (prevVote === type) {
    return NextResponse.json({ error: "Already voted same" }, { status: 400 });
  }

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });
  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated: Record<string, number> = {};
  if (prevVote === "up") {
    updated.upvotes = Math.max(0, comment.upvotes - 1);
  } else if (prevVote === "down") {
    updated.downvotes = Math.max(0, comment.downvotes - 1);
  }

  if (type === "up") {
    updated.upvotes = (updated.upvotes ?? comment.upvotes) + 1;
  } else {
    updated.downvotes = (updated.downvotes ?? comment.downvotes) + 1;
  }

  await db
    .update(comments)
    .set(updated)
    .where(eq(comments.id, commentId));

  const response = NextResponse.json({ success: true });
  response.cookies.set(voteKey, type, { maxAge: 30 * 24 * 60 * 60 });
  return response;
}
