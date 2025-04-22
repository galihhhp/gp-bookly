"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/schema";
import { updateReadingProgressAction } from "@/app/actions/book-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  lastPageRead: z.coerce.number().int().min(1),
});

type FormValues = z.infer<typeof formSchema>;

type ReadingProgressFormProps = {
  book: Book;
  currentProgress?: number;
};

export const ReadingProgressForm = ({
  book,
  currentProgress = 0,
}: ReadingProgressFormProps) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold">Update Progress</h3>
        </div>

        <div className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="lastPageRead"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      max={book.totalPages}
                      className="w-24"
                    />
                  </FormControl>
                  <span className="text-muted-foreground">
                    of {book.totalPages} pages
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Updating..." : "Update"}
        </Button>

        {error && <div className="text-sm text-destructive">{error}</div>}
      </form>
    </Form>
  );
};
