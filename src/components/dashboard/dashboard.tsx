import {
  getBooksOverview,
  getReadingProgress,
  getRatingsSummary,
  getNotesAndHighlights,
} from "@/lib/server/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = async ({ userId }: { userId: string }) => {
  const booksOverview = await getBooksOverview(userId);
  const readingProgress = await getReadingProgress(userId);
  const ratingsSummary = await getRatingsSummary(userId);
  const notesAndHighlights = await getNotesAndHighlights(userId);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Books Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-semibold">Total Books</p>
              <p className="text-3xl font-bold">{booksOverview.totalBooks}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Completed Books</p>
              <p className="text-3xl font-bold">
                {booksOverview.completedBooks}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Currently Reading</p>
              <p className="text-3xl font-bold">{booksOverview.readingBooks}</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-6">Recently Added Books</h3>
          <ul className="list-disc list-inside mt-2">
            {booksOverview.recentBooks.map((book) => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reading Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">Total Pages Read</p>
          <p className="text-3xl font-bold mb-4">
            {readingProgress.totalPagesRead}
          </p>
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <ul className="list-disc list-inside mt-2">
            {readingProgress.recentActivity.map((activity) => (
              <li key={activity.id}>
                {activity.progress_date} - Page {activity.last_page_read}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ratings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold">Average Rating</p>
              <p className="text-3xl font-bold">
                {ratingsSummary.averageRating.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Total Ratings</p>
              <p className="text-3xl font-bold">
                {ratingsSummary.totalRatings}
              </p>
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-6">Recent Ratings</h3>
          <ul className="list-disc list-inside mt-2">
            {ratingsSummary.recentRatings.map((rating) => (
              <li key={rating.id}>{rating.rating} Stars</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes and Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">Total Notes</p>
          <p className="text-3xl font-bold mb-4">
            {notesAndHighlights.totalNotes}
          </p>
          <h3 className="text-xl font-semibold">Recent Notes</h3>
          <ul className="list-disc list-inside mt-2">
            {notesAndHighlights.recentNotes.map((note) => (
              <li key={note.id}>{note.content}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
