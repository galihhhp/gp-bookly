"use client";

import { StarRating } from "./star-rating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Rating } from "@/schema";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useBookRating } from "@/hooks/use-book-rating";

type BookRatingProps = {
  bookId: string;
  existingRating?: Rating | null;
};

export const BookRating = ({ bookId, existingRating }: BookRatingProps) => {
  const { form, feedback, isPending, onSubmit, clearFeedback } = useBookRating(
    bookId,
    existingRating
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Rate This Book</h2>

      {feedback && (
        <div
          className={`mb-4 p-3 rounded-md flex items-start gap-2 ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
          }`}>
          {feedback.type === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                  <StarRating
                    value={field.value}
                    size="lg"
                    onChange={(newRating) => {
                      field.onChange(newRating);
                      clearFeedback();
                    }}
                    className="py-2"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Review (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts about this book..."
                    className="min-h-[100px]"
                    disabled={isPending}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearFeedback();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || form.watch("rating") === 0}>
            {isPending
              ? "Saving..."
              : existingRating
              ? "Update Rating"
              : "Save Rating"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
