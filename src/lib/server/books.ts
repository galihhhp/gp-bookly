import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Book } from "@/schema";

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

export const getBooksServer = async (): Promise<Book[]> => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch books");
  }

  return data.map(transformBookData);
};

export const getBookServer = async (id: string): Promise<Book> => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Failed to fetch book");
  }

  return transformBookData(data);
};
