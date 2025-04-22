"use client";

import { BookNote } from "@/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NoteCard } from "./note-card";
import { useBookNotes } from "@/hooks/use-book-notes";

type BookNotesProps = {
  bookId: string;
  notes: BookNote[];
  latestPage?: number;
};

export const BookNotes = ({
  bookId,
  notes,
  latestPage = 1,
}: BookNotesProps) => {
  const {
    form,
    isAddingNote,
    setIsAddingNote,
    isSubmitting,
    onSubmit,
    noteToDelete,
    handleDeleteNote,
    openDeleteDialog,
    closeDeleteDialog,
  } = useBookNotes(bookId, latestPage);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notes & Highlights</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingNote(true)}
          disabled={isAddingNote}>
          <Plus className="h-4 w-4 mr-2" /> Add Note
        </Button>
      </div>

      {isAddingNote && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Add Note</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsAddingNote(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="pageNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your thoughts about this page..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingNote(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => openDeleteDialog(note.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <Bookmark className="h-12 w-12 text-muted-foreground/70 mx-auto" />
          <p className="mt-2 text-muted-foreground">
            No notes yet. Add your first note!
          </p>
        </div>
      )}

      <AlertDialog
        open={noteToDelete !== null}
        onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => noteToDelete && handleDeleteNote(noteToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
