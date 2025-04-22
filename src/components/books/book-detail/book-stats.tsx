import { CalendarDays, BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type BookStatsProps = {
  startDate: string;
  totalPages: number;
  completed: boolean;
};

export const BookStats = ({
  startDate,
  totalPages,
  completed,
}: BookStatsProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <CalendarDays className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Started Reading</h3>
          <p className="text-sm text-muted-foreground">{startDate}</p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <BookOpen className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Total Pages</h3>
          <p className="text-sm text-muted-foreground">{totalPages}</p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Clock className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Status</h3>
          <p className="text-sm text-muted-foreground">
            {completed ? "Completed" : "Reading"}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);
