import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const isRed = slug.includes("red");
  const icon = isRed ? "👍" : "👎";

  return (
    <Link href={`/board/${slug}`} className="block h-full">
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span>{icon}</span>
            {name}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">点击查看话题 →</p>
        </CardContent>
      </Card>
    </Link>
  );
}
