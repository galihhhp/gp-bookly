"use client";

import { useState, useTransition, useEffect } from "react";
import { Book } from "@/schema";
import { getFilteredBooksAction } from "@/app/actions/book-actions";
import { useRouter, useSearchParams } from "next/navigation";

export const useBooksList = (initialBooks: Book[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilter = (searchParams.get("filter") || "all") as
    | "all"
    | "reading"
    | "completed";
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [filter, setFilter] = useState<"all" | "reading" | "completed">(
    initialFilter
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inputQuery, setInputQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isPending, startTransition] = useTransition();

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize));

  const updateFilters = (
    newFilter?: "all" | "reading" | "completed",
    newSearch?: string,
    newPage: number = 1
  ) => {
    const filterToUse = newFilter !== undefined ? newFilter : filter;
    const searchToUse = newSearch !== undefined ? newSearch : searchQuery;

    const params = new URLSearchParams();

    if (filterToUse !== "all") params.set("filter", filterToUse);
    if (searchToUse && searchToUse.trim() !== "") {
      params.set("search", searchToUse);
    }
    if (newPage > 1) params.set("page", newPage.toString());

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    router.push(`${window.location.pathname}${url}`, { scroll: false });

    startTransition(async () => {
      const result = await getFilteredBooksAction(
        filterToUse,
        searchToUse,
        newPage,
        pageSize
      );

      setBooks(result.books);

      setTotalBooks(result.totalCount);
    });
  };

  const handleFilterChange = (newFilter: "all" | "reading" | "completed") => {
    setFilter(newFilter);
    setCurrentPage(1);
    updateFilters(newFilter, undefined, 1);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(inputQuery);
    setCurrentPage(1);
    updateFilters(undefined, inputQuery, 1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateFilters(undefined, undefined, newPage);
  };

  useEffect(() => {
    if (totalBooks === 0) {
      setTotalBooks(initialBooks.length);
    }

    if (initialFilter !== "all" || initialSearch || initialPage > 1) {
      updateFilters(initialFilter, initialSearch, initialPage);
    }
  }, []);

  return {
    books,
    filter,
    searchQuery,
    inputQuery,
    currentPage,
    totalPages,
    isPending,
    handleFilterChange,
    handleSearchSubmit,
    handlePageChange,
    setInputQuery,
  };
};
