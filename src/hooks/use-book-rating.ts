import { rateBookAction } from "@/app/actions/rating-actions";
import { Rating } from "@/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const useBookRating = (
  bookId: string,
  existingRating?: Rating | null
) => {
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

  const clearFeedback = () => setFeedback(null);

  return {
    form,
    feedback,
    isPending,
    onSubmit,
    clearFeedback,
  };
};
