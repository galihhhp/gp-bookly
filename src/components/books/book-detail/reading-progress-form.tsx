"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book } from "@/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useReadingProgress } from "@/hooks/use-reading-progress";

type ReadingProgressFormProps = {
  book: Book;
  currentProgress?: number;
};

export const ReadingProgressForm = ({
  book,
  currentProgress = 0,
}: ReadingProgressFormProps) => {
  const { form, isPending, error, handleSubmit } = useReadingProgress(
    book,
    currentProgress
  );

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
