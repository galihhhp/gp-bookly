import { getBookServer } from "@/lib/server/books";
import { BookForm } from "@/components/books/book-form";
import { notFound } from "next/navigation";

const EditBookPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const bookId = (await params).id;
  if (!bookId || typeof bookId !== "string") return notFound();
  const book = await getBookServer(bookId);

  return (
    <div className="py-8">
      <BookForm
        initialData={book}
        bookId={bookId}
        description="Update your book details below."
      />
    </div>
  );
};

export default EditBookPage;
