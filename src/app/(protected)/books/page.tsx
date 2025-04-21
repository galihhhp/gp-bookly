import { Suspense } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getBooksServer } from "@/lib/server/books";
import { Button } from "@/components/ui/button";
import { BooksList } from "@/components/books/books-list";
import ROUTES from "@/lib/constants/routes";

export default async function BooksPage() {
  const books = await getBooksServer();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Your Books</h1>
        <Link href={ROUTES.BOOK.ADD}>
          <Button className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-secondary/20 rounded-lg h-64 animate-pulse"
              />
            ))}
          </div>
        }>
        <BooksList initialBooks={books} />
      </Suspense>
    </div>
  );
}
