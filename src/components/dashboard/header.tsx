"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { DashboardNav } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { dashboardPathForRole, roleLabel } from "@/lib/format";

const titles: Array<[string, string]> = [
  ["/dashboard/student/my-applications", "My Applications"],
  ["/dashboard/student", "Student Overview"],
  ["/dashboard/tutor/post-tuition", "Post a Tuition"],
  ["/dashboard/tutor/my-tuitions", "My Tuitions"],
  ["/dashboard/tutor/applicants", "Applicants"],
  ["/dashboard/tutor", "Tutor Overview"],
  ["/dashboard/admin/users", "User Management"],
  ["/dashboard/admin/tuitions", "Tuition Moderation"],
  ["/dashboard/admin/transactions", "Transactions"],
  ["/dashboard/admin", "Admin Overview"],
  ["/dashboard/profile", "Update Profile"],
];

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const title =
    titles.find(([prefix]) => pathname.startsWith(prefix))?.[1] || "Dashboard";

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
              aria-label="Open dashboard menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] p-0 sm:max-w-xs">
              <SheetHeader className="sr-only">
                <SheetTitle>Dashboard navigation</SheetTitle>
              </SheetHeader>
              <DashboardNav onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div>
            <h1 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
              {title}
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            render={<Link href="/" />}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            View site
          </Button>
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                <UserAvatar name={user.name} image={user.image} className="size-8" />
                <span className="hidden text-left sm:block">
                  <span className="block max-w-28 truncate text-xs font-semibold">
                    {user.name}
                  </span>
                  <span className="block text-[0.65rem] capitalize text-muted-foreground">
                    {roleLabel(user.role)}
                  </span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1 py-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {user.email}
                  </span>
                  <Badge variant="secondary" className="w-fit text-[0.65rem] capitalize">
                    {user.role === "admin" ? "Administrator" : `${user.plan} plan`}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={dashboardPathForRole(user.role)} />}>
                  <LayoutDashboard className="size-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                  <UserRound className="size-4" /> Update Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => void handleSignOut()}>
                  <LogOut className="size-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
