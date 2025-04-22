"use client";

import { BookNote } from "@/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNoteCard } from "@/hooks/use-note-card";

type NoteCardProps = {
  note: BookNote;
  onDelete: () => void;
};

export const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const { form, isEditing, setIsEditing, isSubmitting, onSubmit } =
    useNoteCard(note);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Page {note.pageNumber}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-1">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Note</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 py-4">
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

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{note.content}</p>
        {note.isHighlight && note.highlightText && (
          <div
            className="mt-2 p-3 rounded-md"
            style={{ backgroundColor: `${note.highlightColor}20` }}>
            <p className="italic">"{note.highlightText}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
