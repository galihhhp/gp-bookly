import { notFound } from "next/navigation";
import Link from "next/link";
import { getBookServer } from "@/lib/server/books";
import { BookDetail } from "@/components/books/book-detail";
import { Button } from "@/components/ui/button";
import ROUTES from "@/lib/constants/routes";

export default async function BookPage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    const book = await getBookServer(id);

    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href={ROUTES.BOOK.LIST}>
            <Button variant="outline">← Back to Books</Button>
          </Link>
        </div>

        <BookDetail book={book} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
