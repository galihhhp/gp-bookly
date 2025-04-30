import { getBookServer } from "@/lib/server/books";
import { BookForm } from "@/components/books/book-form";
import { notFound } from "next/navigation";

type EditBookPageProps = {
  params: { id: string };
};

const EditBookPage = async ({ params }: EditBookPageProps) => {
  const { id } = params;

  if (!id || typeof id !== "string") return notFound();

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
};

export default EditBookPage;
