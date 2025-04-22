type BookDescriptionProps = {
  description?: string;
};

export const BookDescription = ({ description }: BookDescriptionProps) => {
  if (!description) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Description</h2>
      <div className="prose dark:prose-invert max-w-none">
        <p>{description}</p>
      </div>
    </div>
  );
};
