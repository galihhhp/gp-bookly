import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Book, BookFormValues } from "@/schema";

const supabase = createServerSupabaseClient();

export const getBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Book[];
};

export const getBook = async (id: string): Promise<Book> => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Book;
};

export const createBook = async (book: BookFormValues): Promise<Book> => {
  const { data, error } = await supabase
    .from("books")
    .insert([book])
    .select()
    .single();

  if (error) throw error;
  return data as Book;
};

export const updateBook = async (
  id: string,
  book: BookFormValues
): Promise<Book> => {
  const { data, error } = await supabase
    .from("books")
    .update(book)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Book;
};

export const deleteBook = async (id: string): Promise<void> => {
  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) throw error;
};
