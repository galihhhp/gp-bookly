import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateNoteAction } from "@/app/actions/note-actions";
import { BookNote } from "@/schema";

const noteFormSchema = z.object({
  pageNumber: z.number().int().positive("Page number must be positive"),
  content: z.string().min(1, "Note content is required"),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;

export const useNoteCard = (note: BookNote) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      pageNumber: note.pageNumber,
      content: note.content,
    },
  });

  const onSubmit = async (values: NoteFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await updateNoteAction({
        id: note.id,
        bookId: note.bookId,
        pageNumber: values.pageNumber,
        content: values.content,
      });

      if (result.success) {
        setIsEditing(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isEditing,
    setIsEditing,
    isSubmitting,
    onSubmit,
  };
};
