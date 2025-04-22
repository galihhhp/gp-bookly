import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Rating } from "@/schema";

const transformRatingData = (rating: any): Rating => ({
  id: rating.id,
  bookId: rating.book_id,
  rating: rating.rating,
  note: rating.note,
  createdAt: rating.created_at,
});

export const getBookRating = async (bookId: string): Promise<Rating | null> => {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("book_id", bookId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return transformRatingData(data);
  } catch (error) {
    return null;
  }
};
