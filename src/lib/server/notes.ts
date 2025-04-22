import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BookNote } from "@/schema";

const transformNoteData = (note: any): BookNote => ({
  id: note.id,
  userId: note.user_id,
  bookId: note.book_id,
  pageNumber: note.page_number,
  content: note.content,
  highlightText: note.highlight_text,
  highlightColor: note.highlight_color,
  isHighlight: note.is_highlight,
  createdAt: note.created_at,
  updatedAt: note.updated_at,
});

export const getBookNotes = async (bookId: string): Promise<BookNote[]> => {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("book_notes")
      .select("*")
      .eq("book_id", bookId)
      .order("page_number", { ascending: true });

    if (error) {
      return [];
    }

    return data.map(transformNoteData);
  } catch (error) {
    return [];
  }
};
