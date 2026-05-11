import { db } from "@/db";
import BoardCard from "@/components/BoardCard";

export default async function HomePage() {
  const boards = await db.query.boards.findMany({
    orderBy: (b) => b.id,
  });

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">RedBlackTop</h1>
        <p className="text-muted-foreground">
          剧本杀玩家匿名交流论坛 — 无需注册，畅所欲言
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            slug={board.slug}
            name={board.name}
            description={board.description}
          />
        ))}
      </div>
    </div>
  );
}
