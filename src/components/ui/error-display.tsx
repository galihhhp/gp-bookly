import { AlertCircle } from "lucide-react";

type ErrorDisplayProps = {
  error: string | null;
};

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      {error}
    </div>
  );
};
