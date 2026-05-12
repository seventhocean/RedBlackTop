import Link from "next/link";

export default function BoardCard({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string;
}) {
  return (
    <Link
      href={`/board/${slug}`}
      className="block bg-[#1a1a1a] border border-[#3c3c3c] p-6 hover:border-white/30 transition-colors group"
    >
      <div
        className="h-0.5 w-12 mb-4"
        style={{
          background: slug.includes("red") ? "#e22718" : "#7e7e7e",
        }}
      />
      <h2 className="text-xl font-bold text-white mb-2">{name}</h2>
      <p className="text-[#bbbbbb] text-sm">{description}</p>
    </Link>
  );
}
