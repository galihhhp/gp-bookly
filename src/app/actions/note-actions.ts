"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import ROUTES from "@/lib/constants/routes";
import { z } from "zod";

const NoteFormSchema = z.object({
  bookId: z.string().uuid(),
  pageNumber: z.number().int().positive(),
  content: z.string().min(1),
  highlightText: z.string().optional(),
  highlightColor: z.string().optional(),
  isHighlight: z.boolean().default(false),
});

type NoteFormData = z.infer<typeof NoteFormSchema>;

export const addBookNoteAction = async (formData: NoteFormData) => {
  const supabase = createServerSupabaseClient();
  const mockUserId = "bb6a60d3-6ac2-49bf-a818-4b4ea7b84083";

  try {
    const { error } = await supabase.from("book_notes").insert([
      {
        user_id: mockUserId,
        book_id: formData.bookId,
        page_number: formData.pageNumber,
        content: formData.content,
        highlight_text: formData.highlightText || null,
        highlight_color: formData.highlightColor || null,
        is_highlight: formData.isHighlight,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    revalidatePath(ROUTES.BOOK.DETAIL(formData.bookId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add note" };
  }
};

export const deleteNoteAction = async (noteId: string, bookId: string) => {
  const supabase = createServerSupabaseClient();

  try {
    const { error } = await supabase
      .from("book_notes")
      .delete()
      .eq("id", noteId);

    if (error) throw error;

    revalidatePath(ROUTES.BOOK.DETAIL(bookId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete note" };
  }
};

export const updateNoteAction = async ({
  id,
  bookId,
  pageNumber,
  content,
}: {
  id: string;
  bookId: string;
  pageNumber: number;
  content: string;
}) => {
  const supabase = createServerSupabaseClient();

  try {
    const { error } = await supabase
      .from("book_notes")
      .update({
        page_number: pageNumber,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath(ROUTES.BOOK.DETAIL(bookId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update note" };
  }
};
