import Image from "next/image";
import { BookOpen } from "lucide-react";

type BookCoverProps = {
  coverUrl?: string;
  title: string;
};

export const BookCover = ({ coverUrl, title }: BookCoverProps) => (
  <div className="relative aspect-[2/3] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-lg border-2 border-muted">
    {coverUrl ? (
      <Image
        src={coverUrl}
        alt={`Cover of ${title}`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
        unoptimized
      />
    ) : (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <BookOpen className="h-24 w-24 text-muted-foreground/30" />
      </div>
    )}
  </div>
);
