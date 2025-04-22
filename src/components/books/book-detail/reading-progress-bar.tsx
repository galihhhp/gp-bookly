import { Check } from "lucide-react";
import { ReadingProgress } from "@/schema";

type ReadingProgressBarProps = {
  progressPercentage: number;
  completed: boolean;
  latestProgress?: ReadingProgress | null;
  totalPages: number;
};

export const ReadingProgressBar = ({
  progressPercentage,
  completed,
  latestProgress,
  totalPages,
}: ReadingProgressBarProps) => (
  <div className="mt-6 space-y-4">
    <h3 className="font-semibold">Reading Progress</h3>
    <div className="w-full bg-muted rounded-full h-4">
      <div
        className="bg-primary h-4 rounded-full transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
    <p className="text-sm text-muted-foreground">
      {completed ? (
        <span className="flex items-center">
          <Check className="h-4 w-4 mr-1 text-green-500" /> Completed
        </span>
      ) : (
        <>
          <span className="font-medium">{progressPercentage}%</span> complete
          {latestProgress && (
            <span className="block mt-1">
              Page {latestProgress.lastPageRead} of {totalPages}
            </span>
          )}
        </>
      )}
    </p>
  </div>
);
