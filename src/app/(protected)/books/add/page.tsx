import { BookForm } from "@/components/books/book-form";

export default function AddBookPage() {
  return (
    <div className="py-8">
      <BookForm description="Add your favorite book details and start tracking your reading progress." />
    </div>
  );
}
