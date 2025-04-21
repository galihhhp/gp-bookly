"use client";

import Image from "next/image";
import Link from "next/link";
import { Book } from "@/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  BookOpen,
  Clock,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { deleteBookAction } from "@/app/actions/book-actions";
import ROUTES from "@/lib/constants/routes";

type BookDetailProps = {
  book: Book;
};

export const BookDetail = ({ book }: BookDetailProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBookAction(book.id);
      router.push(ROUTES.BOOK.LIST);
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const progress = book.completed ? 100 : 0;

  const formattedStartDate = book.startDate
    ? new Date(book.startDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not started";

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/4">
        <div className="sticky top-8">
          <div className="relative aspect-[2/3] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-lg border-2 border-muted">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Reading Progress</h3>
            <div className="w-full bg-muted rounded-full h-4">
              <div
                className="bg-primary h-4 rounded-full"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {book.completed ? (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-green-500" /> Completed
                </span>
              ) : (
                `${progress}% complete`
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">{book.author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.BOOK.EDIT(book.id)} passHref>
              <Button variant="outline" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{book.title}" and all
                    associated reading progress. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <CalendarDays className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Started Reading</h3>
                <p className="text-sm text-muted-foreground">
                  {formattedStartDate}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Total Pages</h3>
                <p className="text-sm text-muted-foreground">
                  {book.totalPages}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Status</h3>
                <p className="text-sm text-muted-foreground">
                  {book.completed ? "Completed" : "Reading"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {book.description && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{book.description}</p>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          {!book.completed && <Button>Mark as Completed</Button>}
        </div>
      </div>
    </div>
  );
};
