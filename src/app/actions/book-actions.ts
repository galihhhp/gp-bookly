"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { BookFormValues, Book } from "@/schema";
import ROUTES from "@/lib/constants/routes";

const transformBookData = (book: any): Book => ({
  id: book.id,
  userId: book.user_id,
  title: book.title,
  author: book.author,
  totalPages: book.total_pages,
  coverUrl: book.cover_url,
  startDate: book.start_date,
  completed: book.completed,
  createdAt: book.created_at,
  description: book.description,
});

export const createBookAction = async (formData: BookFormValues) => {
  const supabase = createServerSupabaseClient();

  try {
    const mockUserId = "bb6a60d3-6ac2-49bf-a818-4b4ea7b84083";
    const { coverUrl, totalPages, startDate, ...rest } = formData;
    const bookData = {
      ...rest,
      cover_url: coverUrl,
      total_pages: totalPages,
      start_date: startDate,
      user_id: mockUserId,
    };

    const { error } = await supabase.from("books").insert([bookData]);

    if (error) throw error;

    revalidatePath(ROUTES.BOOK.LIST);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create book" };
  }
};

export const updateBookAction = async (
  id: string,
  formData: BookFormValues
) => {
  const supabase = createServerSupabaseClient();

  try {
    const { coverUrl, totalPages, startDate, ...rest } = formData;
    const bookData = {
      ...rest,
      cover_url: coverUrl,
      total_pages: totalPages,
      start_date: startDate,
    };

    const { error } = await supabase
      .from("books")
      .update(bookData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath(ROUTES.BOOK.DETAIL(id));
    revalidatePath(ROUTES.BOOK.LIST);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update book" };
  }
};

export const deleteBookAction = async (id: string) => {
  const supabase = createServerSupabaseClient();

  try {
    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) throw error;

    revalidatePath(ROUTES.BOOK.LIST);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete book" };
  }
};

export const markBookCompletedAction = async (id: string) => {
  const supabase = createServerSupabaseClient();

  try {
    const { error } = await supabase
      .from("books")
      .update({ completed: true })
      .eq("id", id);

    if (error) throw error;

    revalidatePath(ROUTES.BOOK.DETAIL(id));
    revalidatePath(ROUTES.BOOK.LIST);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to mark book as completed" };
  }
};

export const updateReadingProgressAction = async (
  bookId: string,
  lastPageRead: number,
  totalPages: number
) => {
  const supabase = createServerSupabaseClient();

  try {
    const { error: progressError } = await supabase
      .from("reading_progress")
      .insert([
        {
          id: crypto.randomUUID(),
          book_id: bookId,
          last_page_read: lastPageRead,
          progress_date: new Date().toISOString().split("T")[0],
        },
      ]);

    if (progressError) throw progressError;

    if (lastPageRead >= totalPages) {
      const { error: completeError } = await supabase
        .from("books")
        .update({ completed: true })
        .eq("id", bookId);

      if (completeError) throw completeError;
    }

    revalidatePath(ROUTES.BOOK.DETAIL(bookId));
    revalidatePath(ROUTES.BOOK.LIST);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update reading progress" };
  }
};

export const getFilteredBooksAction = async (
  filter: "all" | "reading" | "completed" = "all",
  searchQuery: string = "",
  page: number = 1,
  pageSize: number = 8
): Promise<{ books: Book[]; totalCount: number }> => {
  const supabase = createServerSupabaseClient();

  const safeQuery = searchQuery.replace(/['";\\%]/g, "");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("books").select("*", { count: "exact" });

  if (filter === "reading") {
    query = query.eq("completed", false);
  } else if (filter === "completed") {
    query = query.eq("completed", true);
  }

  if (safeQuery.trim()) {
    query = query.or(`title.ilike.${safeQuery}%,author.ilike.${safeQuery}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching filtered books:", error);
    return { books: [], totalCount: 0 };
  }

  return {
    books: data.map(transformBookData),
    totalCount: count || 0,
  };
};
