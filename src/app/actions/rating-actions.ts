"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import ROUTES from "@/lib/constants/routes";

type RatingData = {
  bookId: string;
  rating: number;
  note?: string;
};

export const rateBookAction = async ({ bookId, rating, note }: RatingData) => {
  const supabase = createServerSupabaseClient();

  try {
    const { data: existingRating } = await supabase
      .from("ratings")
      .select("id")
      .eq("book_id", bookId)
      .maybeSingle();

    if (existingRating) {
      const { error } = await supabase
        .from("ratings")
        .update({ rating, note, created_at: new Date().toISOString() })
        .eq("id", existingRating.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("ratings").insert([
        {
          id: crypto.randomUUID(),
          book_id: bookId,
          rating,
          note,
        },
      ]);

      if (error) throw error;
    }

    revalidatePath(ROUTES.BOOK.DETAIL(bookId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save rating" };
  }
};

export const getBookRatingAction = async (bookId: string) => {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("book_id", bookId)
      .maybeSingle();

    if (error) throw error;

    return {
      success: true,
      rating: data
        ? {
            id: data.id,
            bookId: data.book_id,
            rating: data.rating,
            note: data.note,
            createdAt: data.created_at,
          }
        : null,
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch rating" };
  }
};
