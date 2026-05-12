import { db } from "@/db";
import Link from "next/link";

const boardGradients: Record<string, string> = {
  "player-red": "#0066b1",
  "player-black": "#3c3c3c",
  "dm-red": "#1c69d4",
  "dm-black": "#3c3c3c",
};

export default async function HomePage() {
  const boards = await db.query.boards.findMany({
    orderBy: (b) => b.id,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
          REDBLACKTOP
        </h1>
        <p className="text-[#bbbbbb] text-lg mb-8">
          剧本杀玩家匿名交流论坛 — 无需注册，畅所欲言
        </p>
        {/* M Tricolor Divider */}
        <div
          className="h-1 w-16 mx-auto mb-12"
          style={{
            background:
              "linear-gradient(to right, #0066b1, #1c69d4, #e22718)",
          }}
        />
      </section>

      {/* Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.slug}`}
            className="block bg-[#1a1a1a] border border-[#3c3c3c] p-6 hover:border-white/30 transition-colors group"
          >
            {/* Accent line */}
            <div
              className="h-0.5 w-12 mb-4"
              style={{
                background: board.slug.includes("red")
                  ? "#e22718"
                  : "#7e7e7e",
              }}
            />
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-white">
              {board.name}
            </h2>
            <p className="text-[#bbbbbb] text-sm">{board.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
