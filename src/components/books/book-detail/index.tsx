"use client";

import { Book, ReadingProgress, Rating, BookNote } from "@/schema";
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
import { BookNotes } from "./book-notes";
import { useBookDetail } from "@/hooks/use-book-detail";

type BookDetailProps = {
  book: Book;
  latestProgress?: ReadingProgress | null;
  bookRating?: Rating | null;
  notes?: BookNote[];
};

export const BookDetail = ({
  book,
  latestProgress,
  bookRating,
  notes = [],
}: BookDetailProps) => {
  const {
    isDeleting,
    isUpdating,
    error,
    progressPercentage,
    formattedStartDate,
    handleDelete,
    handleMarkCompleted,
  } = useBookDetail(book, latestProgress);

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

        <BookNotes
          bookId={book.id}
          notes={notes}
          latestPage={latestProgress?.lastPageRead}
        />

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
