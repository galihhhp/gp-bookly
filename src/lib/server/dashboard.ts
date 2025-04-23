import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ReadingProgress, Book, Rating } from "@/schema";

export const getBooksOverview = async (userId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: totalBooks } = await supabase
    .from("books")
    .select("id", { count: "exact" })
    .eq("user_id", userId);

  const { data: completedBooks } = await supabase
    .from("books")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("completed", true);

  const { data: readingBooks } = await supabase
    .from("books")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("completed", false);

  const { data: recentBooks } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalBooks: totalBooks?.length || 0,
    completedBooks: completedBooks?.length || 0,
    readingBooks: readingBooks?.length || 0,
    recentBooks: recentBooks || [],
  };
};

export const getReadingProgress = async (userId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: totalPagesRead } = await supabase
    .from("reading_progress")
    .select("last_page_read")
    .in(
      "book_id",
      (
        await supabase.from("books").select("id").eq("user_id", userId)
      ).data?.map((book) => book.id) || []
    );

  const { data: recentActivity } = await supabase
    .from("reading_progress")
    .select("id, created_at, book_id, last_page_read, progress_date")
    .in(
      "book_id",
      (
        await supabase.from("books").select("id").eq("user_id", userId)
      ).data?.map((book) => book.id) || []
    )
    .order("progress_date", { ascending: false })
    .limit(5);

  const totalPages = (totalPagesRead || []).reduce(
    (sum, { last_page_read }) => sum + (last_page_read || 0),
    0
  );

  return {
    totalPagesRead: totalPages,
    recentActivity: recentActivity || [],
  };
};

export const getRatingsSummary = async (userId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: bookIds } = await supabase
    .from("books")
    .select("id")
    .eq("user_id", userId);

  const { data: ratings } = await supabase
    .from("ratings")
    .select("*")
    .in("book_id", bookIds?.map((book) => book.id) || []);

  const averageRating =
    (ratings?.reduce((sum, { rating }: Rating) => sum + rating, 0) || 0) /
    (ratings?.length || 1);

  const recentRatings = (ratings || [])
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    averageRating,
    totalRatings: ratings?.length || 0,
    recentRatings,
  };
};

export const getNotesAndHighlights = async (userId: string) => {
  const supabase = createServerSupabaseClient();

  const { data: totalNotes } = await supabase
    .from("book_notes")
    .select("id", { count: "exact" })
    .eq("user_id", userId);

  const { data: recentNotes } = await supabase
    .from("book_notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: notesByBook } = await supabase.rpc("get_notes_by_book", {
    user_id: userId,
  });

  return {
    totalNotes: totalNotes?.length || 0,
    recentNotes: recentNotes || [],
    notesByBook: notesByBook || [],
  };
};
