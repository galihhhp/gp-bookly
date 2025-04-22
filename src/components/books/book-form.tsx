"use client";

import { BookFormValues } from "@/schema";
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
import { useBookForm } from "@/hooks/use-book-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const { form, isPending, error, handleSubmit, defaultDescription } =
    useBookForm(initialData, bookId);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mt-8">
      <div className="flex flex-col gap-4 w-full md:w-1/2">
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
        <CardContent className="pt-6">
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            aria-invalid={!!form.formState.errors.startDate}>
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      <div className="relative">
                        <Textarea
                          id="description"
                          placeholder="Enter a brief description of the book (optional)"
                          className="min-h-[100px]"
                          {...field}
                          aria-invalid={!!form.formState.errors.description}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                          {field.value?.length || 0}/2000
                        </div>
                      </div>
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
