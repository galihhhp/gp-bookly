import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ReadingProgress } from "@/schema";

const transformProgressData = (progress: any): ReadingProgress => ({
  id: progress.id,
  bookId: progress.book_id,
  lastPageRead: progress.last_page_read,
  progressDate: progress.progress_date,
  createdAt: progress.created_at,
});

export const getLatestProgressForBook = async (
  bookId: string
): Promise<ReadingProgress | null> => {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return null;
    }

    if (!data) {
      return null;
    }

    return transformProgressData(data);
  } catch (error) {
    return null;
  }
};
