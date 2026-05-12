import { db } from "@/db";
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
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
      <Link
        href="/"
        className="text-sm text-[#7e7e7e] hover:text-white transition-colors"
      >
        ← 返回首页
      </Link>
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{board.name}</h1>
        <p className="text-[#bbbbbb]">{board.description}</p>
      </div>
      <TopicList boardSlug={board.slug} />
    </div>
  );
}
