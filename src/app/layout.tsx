import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RedBlackTop - 剧本杀匿名论坛",
  description: "剧本杀玩家的匿名交流平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background antialiased">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">
              RedBlackTop
            </a>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <a href="/board/player-red" className="hover:text-foreground">玩家红榜</a>
              <a href="/board/player-black" className="hover:text-foreground">玩家黑榜</a>
              <a href="/board/dm-red" className="hover:text-foreground">DM 红榜</a>
              <a href="/board/dm-black" className="hover:text-foreground">DM 黑榜</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
