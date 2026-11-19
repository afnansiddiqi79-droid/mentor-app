"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenCheck,
  ClipboardList,
  CreditCard,
  FilePlus2,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const navByRole: Record<
  Role,
  Array<{ href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }>
> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: ClipboardList },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserRound },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/tutor/post-tuition", label: "Post Tuition", icon: FilePlus2 },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: BookOpenCheck },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserRound },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/tuitions", label: "Tuitions", icon: ListChecks },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserRound },
  ],
};

export function DashboardNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  const links = navByRole[user.role] || navByRole.student;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-4">
        <Logo />
      </div>

      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {user.role === "admin" ? (
            <GraduationCap className="size-5" />
          ) : user.role === "tutor" ? (
            <BookOpenCheck className="size-5" />
          ) : (
            <UserRound className="size-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
            {user.role}
            <Badge
              variant="outline"
              className={cn(
                "h-4 px-1.5 text-[0.6rem] capitalize",
                user.plan === "pro" && "border-primary/30 text-primary"
              )}
            >
              {user.plan}
            </Badge>
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Dashboard navigation">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Wallet className="size-4 text-primary" />
          {user.plan === "pro" ? "Pro plan active" : "Free plan"}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {user.plan === "pro"
            ? "You have full access to every MentorLagbe feature."
            : user.role === "tutor"
              ? "Free tutors can post up to 2 tuitions. Upgrade for unlimited posts."
              : "Upgrade to Student Pro for priority applications and support."}
        </p>
        {user.plan !== "pro" ? (
          <Link
            href="/pricing"
            onClick={onNavigate}
            className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
          >
            Compare plans →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
