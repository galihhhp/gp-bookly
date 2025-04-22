"use client";

import { Search } from "lucide-react";
import { Book } from "@/schema";
import { BookCard } from "@/components/books/book-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/lib/constants/routes";
import { useBooksList } from "@/hooks/use-books-list";
import { Skeleton } from "@/components/ui/skeleton";
import { BookPagination } from "@/components/books/book-pagination";
import { FormEvent, useState } from "react";

type BooksListProps = {
  initialBooks: Book[];
};

export const BooksList = ({ initialBooks }: BooksListProps) => {
  const {
    books,
    filter,
    searchQuery,
    currentPage,
    totalPages,
    inputQuery,
    setInputQuery,
    isPending,
    handleFilterChange,
    handleSearchSubmit,
    handlePageChange,
  } = useBooksList(initialBooks);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearchSubmit();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
        <Tabs
          value={filter}
          className="w-full sm:w-auto"
          onValueChange={(v) =>
            handleFilterChange(v as "all" | "reading" | "completed")
          }>
          <TabsList>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={onSubmit} className="relative w-full sm:w-64 flex">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="Search books..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" className="ml-2" disabled={isPending}>
            {isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, n) => (
            <Skeleton key={n} className="h-[36rem] rounded-lg" />
          ))}
        </div>
      )}

      {!isPending && books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <BookPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isPending={isPending}
            className="mt-8"
          />
        </>
      ) : !isPending ? (
        <div className="text-center py-12 bg-secondary/10 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try a different search term"
              : "Add your first book to get started"}
          </p>
          <Link href={ROUTES.BOOK.ADD}>
            <Button>Add Your First Book</Button>
          </Link>
        </div>
      ) : null}
    </>
  );
};
