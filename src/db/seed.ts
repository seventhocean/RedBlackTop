import { db } from "./index";
import { boards } from "./schema";
import { eq } from "drizzle-orm";

const seedBoards = [
  { slug: "player-red", name: "玩家红榜", description: "夸夸好玩家" },
  { slug: "player-black", name: "玩家黑榜", description: "避雷烂玩家" },
  { slug: "dm-red", name: "DM 红榜", description: "神仙 DM 推荐" },
  { slug: "dm-black", name: "DM 黑榜", description: "踩雷 DM 预警" },
];

async function seed() {
  console.log("Seeding boards...");
  for (const board of seedBoards) {
    const existing = await db.query.boards.findFirst({
      where: eq(boards.slug, board.slug),
    });
    if (!existing) {
      await db.insert(boards).values(board);
      console.log(`  Created: ${board.name}`);
    } else {
      console.log(`  Exists: ${board.name}`);
    }
  }
  console.log("Seed done.");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
