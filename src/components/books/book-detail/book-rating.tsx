"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarRating } from "./star-rating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { rateBookAction } from "@/app/actions/rating-actions";
import { useRouter } from "next/navigation";
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

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type BookRatingProps = {
  bookId: string;
  existingRating?: Rating | null;
};

export const BookRating = ({ bookId, existingRating }: BookRatingProps) => {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: existingRating?.rating || 0,
      note: existingRating?.note || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setFeedback(null);

    startTransition(async () => {
      const result = await rateBookAction({
        bookId,
        rating: values.rating,
        note: values.note?.trim() || undefined,
      });

      if (result.success) {
        setFeedback({
          type: "success",
          message: "Your rating has been saved successfully.",
        });
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          message: result.error || "Failed to save rating",
        });
      }
    });
  };

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
                    defaultRating={field.value}
                    size="lg"
                    onChange={(newRating) => {
                      field.onChange(newRating);
                      setFeedback(null);
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
                      setFeedback(null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || form.getValues("rating") === 0}>
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
