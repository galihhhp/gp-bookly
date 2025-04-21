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
    const { error } = await supabase
      .from("books")
      .update(formData)
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
