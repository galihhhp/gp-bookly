"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Book, ReadingProgress, Rating } from "@/schema";
import {
  deleteBookAction,
  markBookCompletedAction,
} from "@/app/actions/book-actions";
import ROUTES from "@/lib/constants/routes";
import { BookCover } from "./book-cover";
import { ReadingProgressBar } from "./reading-progress-bar";
import { ReadingProgressForm } from "./reading-progress-form";
import { BookHeader } from "./book-header";
import { BookStats } from "./book-stats";
import { BookDescription } from "./book-description";
import { CompletionButton } from "./completion-button";
import { ErrorDisplay } from "../../ui/error-display";
import { BookActions } from "./book-actions";
import { BookRating } from "./book-rating";

type BookDetailProps = {
  book: Book;
  latestProgress?: ReadingProgress | null;
  bookRating?: Rating | null;
};

export const BookDetail = ({ book, latestProgress, bookRating }: BookDetailProps) => {
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

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/4">
        <div className="sticky top-8">
          <BookCover coverUrl={book.coverUrl} title={book.title} />

          <ReadingProgressBar
            progressPercentage={progressPercentage}
            completed={book.completed || false}
            latestProgress={latestProgress}
            totalPages={book.totalPages}
          />

          {!book.completed && (
            <div className="pt-4">
              <ReadingProgressForm
                book={book}
                currentProgress={latestProgress?.lastPageRead}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <BookHeader title={book.title} author={book.author} />

          <BookActions
            id={book.id}
            title={book.title}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>

        <BookStats
          startDate={formattedStartDate}
          totalPages={book.totalPages}
          completed={book.completed || false}
        />

        <BookDescription description={book.description} />

        {book.completed && (
          <BookRating bookId={book.id} existingRating={bookRating} />
        )}

        <ErrorDisplay error={error} />

        <CompletionButton
          completed={book.completed || false}
          onComplete={handleMarkCompleted}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
};
