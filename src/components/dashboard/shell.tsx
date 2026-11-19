"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard>
      <div className="flex min-h-screen bg-muted/30">
        <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">
          <div className="sticky top-0 h-screen">
            <DashboardNav />
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
