import { db } from "@/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import TopicList from "@/components/TopicList";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = await db.query.boards.findFirst({
    where: eq(boards.slug, slug),
  });

  if (!board) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <a href="/" className="text-sm text-muted-foreground hover:underline">
          ← 返回首页
        </a>
        <h1 className="text-2xl font-bold mt-2">{board.name}</h1>
        <p className="text-muted-foreground">{board.description}</p>
      </div>
      <TopicList boardSlug={board.slug} />
    </div>
  );
}
