import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { boards, topics } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const boardSlug = url.searchParams.get("board");
  const sortBy = url.searchParams.get("sort") || "newest";

  const topicsQuery = db.query.topics.findMany({
    orderBy:
      sortBy === "hottest"
        ? (t) => desc(t.upvotes)
        : (t) => desc(t.createdAt),
    with: {
      board: true,
    },
  });

  if (boardSlug) {
    const board = await db.query.boards.findFirst({
      where: eq(boards.slug, boardSlug),
    });
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }
    const boardTopics = await db.query.topics.findMany({
      where: eq(topics.boardId, board.id),
      orderBy:
        sortBy === "hottest"
          ? (t) => desc(t.upvotes)
          : (t) => desc(t.createdAt),
      with: {
        board: true,
      },
    });
    return NextResponse.json({ topics: boardTopics });
  }

  const allTopics = await topicsQuery;
  return NextResponse.json({ topics: allTopics });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { boardSlug, title, content, authorNickname } = body;

  if (!boardSlug || !title?.trim() || !content?.trim() || !authorNickname?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || `anon_${Date.now()}`;

  // Rate limit: max 5 topics per session
  const recentCount = await db.query.topics.findMany({
    where: (t) => eq(t.authorNickname, authorNickname.trim()),
  });
  if (recentCount.length >= 100) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const board = await db.query.boards.findFirst({
    where: eq(boards.slug, boardSlug),
  });
  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const result = await db
    .insert(topics)
    .values({
      boardId: board.id,
      title: title.trim(),
      content: content.trim(),
      authorNickname: authorNickname.trim(),
    })
    .returning();

  return NextResponse.json({ topic: result[0] }, { status: 201 });
}
