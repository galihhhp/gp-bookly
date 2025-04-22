import { Button } from "@/components/ui/button";

type CompletionButtonProps = {
  completed: boolean;
  onComplete: () => Promise<void>;
  isUpdating: boolean;
};

export const CompletionButton = ({
  completed,
  onComplete,
  isUpdating,
}: CompletionButtonProps) => {
  if (completed) return null;

  return (
    <div className="mt-12 flex flex-wrap gap-4">
      <Button onClick={onComplete} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Mark as Completed"}
      </Button>
    </div>
  );
};
