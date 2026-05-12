import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "RedBlackTop - 剧本杀匿名论坛",
  description: "剧本杀玩家的匿名交流平台",
};

const navLinks = [
  { href: "/board/player-red", label: "玩家红榜" },
  { href: "/board/player-black", label: "玩家黑榜" },
  { href: "/board/dm-red", label: "DM 红榜" },
  { href: "/board/dm-black", label: "DM 黑榜" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-black text-white antialiased">
        {/* M Tricolor Stripe */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(to right, #0066b1, #1c69d4, #e22718)",
          }}
        />
        <header className="border-b border-[#3c3c3c] bg-black h-16">
          <div className="mx-auto px-4 max-w-5xl h-full flex items-center justify-between">
            <Link
              href="/"
              className="text-white font-bold text-lg tracking-widest uppercase"
            >
              RedBlackTop
            </Link>
            <nav className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#bbbbbb] hover:text-white transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto px-4 py-8 max-w-5xl">{children}</main>
      </body>
    </html>
  );
}
