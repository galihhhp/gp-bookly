"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type StarRatingProps = {
  defaultRating?: number;
  value?: number;
  totalStars?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
};

export const StarRating = ({
  defaultRating = 0,
  value,
  totalStars = 5,
  size = "md",
  disabled = false,
  onChange,
  className,
}: StarRatingProps) => {
  const [internalRating, setInternalRating] = useState(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);

  const rating = value !== undefined ? value : internalRating;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const starSize = sizeClasses[size];

  const handleClick = (selectedRating: number) => {
    if (disabled) return;

    setInternalRating(selectedRating);
    onChange?.(selectedRating);
  };

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="radiogroup"
      aria-label="Book rating">
      {[...Array(totalStars)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = hoverRating
          ? starValue <= hoverRating
          : starValue <= rating;

        return (
          <Button
            key={i}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "p-0 h-auto w-auto transition-all",
              isFilled ? "text-yellow-400" : "text-muted-foreground/30",
              !disabled && "hover:scale-110 hover:bg-transparent"
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !disabled && setHoverRating(starValue)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            disabled={disabled}
            aria-checked={rating === starValue}
            role="radio"
            tabIndex={disabled ? -1 : 0}
            aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}>
            <Star className={cn(starSize, "fill-current")} />
            <span className="sr-only">
              {starValue} star{starValue === 1 ? "" : "s"}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
