"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { BookFormValues } from "@/schema";
import ROUTES from "@/lib/constants/routes";

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
