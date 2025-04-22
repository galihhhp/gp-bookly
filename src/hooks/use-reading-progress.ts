import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateReadingProgressAction } from "@/app/actions/book-actions";
import { Book } from "@/schema";

const formSchema = z.object({
  lastPageRead: z.coerce.number().int().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const useReadingProgress = (book: Book, currentProgress: number = 0) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastPageRead: currentProgress || 1,
    },
  });

  const handleSubmit = (values: FormValues) => {
    setError(null);

    if (values.lastPageRead > book.totalPages) {
      setError(`Cannot exceed the total pages (${book.totalPages})`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateReadingProgressAction(
          book.id,
          values.lastPageRead,
          book.totalPages
        );

        if (result.success) {
          router.refresh();
        } else {
          setError(result.error || "Failed to update progress");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
    });
  };

  return {
    form,
    isPending,
    error,
    handleSubmit,
  };
};
