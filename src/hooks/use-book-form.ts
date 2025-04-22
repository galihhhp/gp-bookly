import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookFormSchema, BookFormValues } from "@/schema";
import { createBookAction, updateBookAction } from "@/app/actions/book-actions";
import ROUTES from "@/lib/constants/routes";

export const useBookForm = (
  initialData: Partial<BookFormValues> = {},
  bookId?: string
) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(BookFormSchema),
    defaultValues: {
      title: initialData.title || "",
      author: initialData.author || "",
      totalPages: initialData.totalPages || 1,
      coverUrl: initialData.coverUrl || "",
      startDate: initialData.startDate || "",
      description: initialData.description || "",
      completed: initialData.completed ?? false,
    },
  });

  const handleSubmit = (formData: BookFormValues) => {
    setError(null);

    startTransition(async () => {
      try {
        if (bookId) {
          const result = await updateBookAction(bookId, formData);
          if (result.success) {
            router.push(ROUTES.BOOK.LIST);
            router.refresh();
          } else {
            setError(result.error || "Failed to update book");
          }
        } else {
          const result = await createBookAction(formData);
          if (result.success) {
            router.push(ROUTES.BOOK.LIST);
            router.refresh();
          } else {
            setError(result.error || "Failed to create book");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const defaultDescription = bookId
    ? "Update your book details below."
    : "Add a new book to your collection.";

  return {
    form,
    isPending,
    error,
    handleSubmit,
    defaultDescription,
  };
};
