import Dashboard from "@/components/dashboard/dashboard";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const mockUserId = "bb6a60d3-6ac2-49bf-a818-4b4ea7b84083";

  if (!mockUserId) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Dashboard userId={mockUserId} />
    </div>
  );
}
