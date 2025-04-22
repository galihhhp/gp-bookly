import { getFilteredBooksAction } from "@/app/actions/book-actions";
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

export const getBooksServer = async (
  page: number = 1,
  pageSize: number = 8,
  filter: "all" | "reading" | "completed" = "all",
  search: string = ""
): Promise<{ books: Book[]; totalCount: number }> => {
  return getFilteredBooksAction(filter, search, page, pageSize);
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
