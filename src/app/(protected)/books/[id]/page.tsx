import { notFound } from "next/navigation";
import Link from "next/link";
import { getBookServer } from "@/lib/server/books";
import { getLatestProgressForBook } from "@/lib/server/progress";
import { getBookRating } from "@/lib/server/ratings";
import { getBookNotes } from "@/lib/server/notes";
import { BookDetail } from "@/components/books/book-detail";
import { Button } from "@/components/ui/button";
import ROUTES from "@/lib/constants/routes";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const bookId = (await params).id;

    const book = await getBookServer(bookId);
    const progress = await getLatestProgressForBook(bookId);
    const rating = await getBookRating(bookId);
    const notes = await getBookNotes(bookId);

    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href={ROUTES.BOOK.LIST}>
            <Button variant="outline">← Back to Books</Button>
          </Link>
        </div>

        <BookDetail
          book={book}
          latestProgress={progress}
          bookRating={rating}
          notes={notes}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
