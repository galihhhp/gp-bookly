import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const BookSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1),
  author: z.string().min(1),
  totalPages: z.number().int().positive(),
  coverUrl: z.string().url().optional(),
  startDate: z.string().date().optional(),
  completed: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export type Book = z.infer<typeof BookSchema>;

export const ReadingProgressSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  lastPageRead: z.number().int().min(0),
  progressDate: z.string().date(),
  createdAt: z.string().datetime(),
});

export type ReadingProgress = z.infer<typeof ReadingProgressSchema>;

export const RatingSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  note: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type Rating = z.infer<typeof RatingSchema>;
