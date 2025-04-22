type BookHeaderProps = {
  title: string;
  author: string;
};

export const BookHeader = ({ title, author }: BookHeaderProps) => (
  <div>
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-xl text-muted-foreground mt-1">{author}</p>
  </div>
);
