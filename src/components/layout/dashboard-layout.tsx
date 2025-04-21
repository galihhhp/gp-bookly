"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ROUTES from "@/lib/constants/routes";

type DashboardLayoutProps = {
  children: React.ReactNode;
  userName?: string;
};

export const DashboardLayout = ({
  children,
  userName = "User Name",
}: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background px-4">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <Link
            href={ROUTES.ROOT.DASHBOARD}
            className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-lg">
                B
              </div>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              Bookly
            </span>
          </Link>

          <button
            className="sm:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {userName}
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1 dark:bg-background text-destructive dark:text-destructive-foreground">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6 mx-auto px-4">{children}</main>

      <footer className="border-t py-6 bg-muted/40">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 Bookly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
