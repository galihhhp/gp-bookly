import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  addBookNoteAction,
  deleteNoteAction,
} from "@/app/actions/note-actions";

const noteFormSchema = z.object({
  pageNumber: z.number().int().positive("Page number must be positive"),
  content: z.string().min(1, "Note content is required"),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

export const useBookNotes = (bookId: string, latestPage: number = 1) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      pageNumber: latestPage,
      content: "",
    },
  });

  const onSubmit = async (values: NoteFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await addBookNoteAction({
        bookId,
        pageNumber: values.pageNumber,
        content: values.content,
        isHighlight: false,
      });

      if (result.success) {
        form.reset();
        setIsAddingNote(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNoteAction(noteId, bookId);
    router.refresh();
    setNoteToDelete(null);
  };

  const openDeleteDialog = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const closeDeleteDialog = () => {
    setNoteToDelete(null);
  };

  return {
    form,
    isAddingNote,
    setIsAddingNote,
    isSubmitting,
    onSubmit,
    noteToDelete,
    handleDeleteNote,
    openDeleteDialog,
    closeDeleteDialog,
  };
};
