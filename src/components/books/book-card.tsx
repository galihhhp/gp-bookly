import Link from "next/link";
import Image from "next/image";
import { Book } from "@/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BookOpen } from "lucide-react";
import ROUTES from "@/lib/constants/routes";

type BookCardProps = {
  book: Book;
};

export const BookCard = ({ book }: BookCardProps) => {
  const progress = book.completed ? 100 : 0;

  return (
    <Link href={ROUTES.BOOK.DETAIL(book.id)} className="block h-full">
      <Card className="h-full pt-0 overflow-hidden transition-all hover:shadow-md flex flex-col">
        <div className="aspect-[3/4] relative">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`${book.title} cover`}
              fill
              className="object-cover rounded-t-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"
            aria-label={`${progress}% complete`}>
            <div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 p-3">
          <h3 className="font-semibold line-clamp-1 text-sm">{book.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.author}
          </p>
          <div className="flex justify-between items-center mt-auto pt-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              {book.startDate
                ? new Date(book.startDate).toLocaleDateString()
                : "Not started"}
            </div>
            {book.completed && <Badge variant="secondary">Completed</Badge>}
          </div>
        </div>
      </Card>
    </Link>
  );
};
