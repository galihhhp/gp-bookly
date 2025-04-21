import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ROUTES from "@/lib/constants/routes";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkUserAuthentication();
  const userName = "Galih";

  if (!isAuthenticated) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  return <DashboardLayout userName={userName}>{children}</DashboardLayout>;
}

const checkUserAuthentication = async (): Promise<boolean> => {
  return true;
};
