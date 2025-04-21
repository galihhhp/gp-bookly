"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookFormSchema, BookFormValues } from "@/schema";
import { createBookAction, updateBookAction } from "@/app/actions/book-actions";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ROUTES from "@/lib/constants/routes";
import Link from "next/link";

type BookFormProps = {
  initialData?: Partial<BookFormValues>;
  bookId?: string;
  description?: string;
};

export const BookForm = ({
  initialData = {},
  bookId,
  description,
}: BookFormProps) => {
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

  const defaultDescription = bookId
    ? "Update your book details below."
    : "Add a new book to your collection.";

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

  return (
    <div className="flex gap-4 max-w-4xl mx-auto mt-8">
      <div className="flex flex-col gap-4 w-1/2">
        <Link href={bookId ? ROUTES.BOOK.DETAIL(bookId) : ROUTES.BOOK.LIST}>
          <Button variant="outline">
            ← {bookId ? "Back to Book" : "Back to Books"}
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold">
          {bookId ? "Edit Book" : "Add New Book"}
        </h1>
        <p>{description || defaultDescription}</p>
      </div>
      <Card className="flex-1">
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
              aria-label="Book Form">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="author">Author</FormLabel>
                    <FormControl>
                      <Input
                        id="author"
                        {...field}
                        aria-invalid={!!form.formState.errors.author}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="totalPages">Total Pages</FormLabel>
                    <FormControl>
                      <Input
                        id="totalPages"
                        type="number"
                        min={1}
                        {...field}
                        aria-invalid={!!form.formState.errors.totalPages}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="coverUrl">Cover Image URL</FormLabel>
                    <FormControl>
                      <Input
                        id="coverUrl"
                        {...field}
                        aria-invalid={!!form.formState.errors.coverUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>
                    <FormControl>
                      <Input
                        id="startDate"
                        type="date"
                        {...field}
                        aria-invalid={!!form.formState.errors.startDate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Enter a brief description of the book (optional)"
                        className="min-h-[100px]"
                        {...field}
                        aria-invalid={!!form.formState.errors.description}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        id="completed"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="completed" className="font-semibold">
                      Mark as Completed
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Saving..." : "Save Book"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
