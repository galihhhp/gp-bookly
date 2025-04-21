"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Book } from "@/schema";
import { BookCard } from "@/components/books/book-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/lib/constants/routes";

type BooksListProps = {
  initialBooks: Book[];
};

export const BooksList = ({ initialBooks }: BooksListProps) => {
  const [filter, setFilter] = useState<"all" | "reading" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = initialBooks;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          onValueChange={(v) => {}}>
          <TabsList>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
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
      )}
    </>
  );
};
