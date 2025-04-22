import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Book, ReadingProgress } from "@/schema";
import {
  deleteBookAction,
  markBookCompletedAction,
} from "@/app/actions/book-actions";
import ROUTES from "@/lib/constants/routes";

export const useBookDetail = (
  book: Book,
  latestProgress?: ReadingProgress | null
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const progressPercentage = book.completed
    ? 100
    : latestProgress && book.totalPages > 0
      ? Math.min(
        100,
        Math.round((latestProgress.lastPageRead / book.totalPages) * 100)
      ) || 1
      : 0;

  const formattedStartDate = book.startDate
    ? new Date(book.startDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Not started";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBookAction(book.id);
      router.push(ROUTES.BOOK.LIST);
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const handleMarkCompleted = async () => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await markBookCompletedAction(book.id);

        if (!result.success) {
          setError(result.error || "Failed to mark as completed");
        } else {
          router.refresh();
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
    });
  };

  return {
    isDeleting,
    isUpdating,
    error,
    progressPercentage,
    formattedStartDate,
    handleDelete,
    handleMarkCompleted,
  };
};
