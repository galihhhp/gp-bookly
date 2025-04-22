import { notFound } from "next/navigation";
import { getBookServer } from "@/lib/server/books";
import { BookForm } from "@/components/books/book-form";

export default async function EditBookPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = await params;
    const book = await getBookServer(id);

    return (
      <div className="py-8">
        <BookForm
          initialData={book}
          bookId={id}
          description="Update your book details below."
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
