"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { StatsSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { api, ApiClientError } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AdminStats } from "@/lib/types";

function AdminOverview() {
  const { data, loading, error, reload } = useApi<AdminStats>("/api/admin/stats");

  async function review(id: string, approvalStatus: "approved" | "rejected") {
    try {
      await api.patch(`/api/admin/tuitions/${id}/approval`, { approvalStatus });
      toast.success(`Tuition ${approvalStatus}`);
      await reload();
    } catch (err) {
      toast.error("Could not update tuition", {
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform overview"
        description="Moderation queue, users and revenue at a glance."
        action={
          <Button render={<Link href="/dashboard/admin/tuitions" />}>
            <BookOpen className="size-4" /> Moderate tuitions
          </Button>
        }
      />

      {loading ? <StatsSkeleton /> : null}

      {error ? (
        <EmptyState
          icon={Users}
          title="Could not load admin statistics"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total users" value={data.totalUsers} icon={Users} hint={`${data.totalStudents} students · ${data.totalTutors} tutors`} />
            <StatCard label="Pending tuitions" value={data.pendingTuitions} icon={Clock} tone="amber" hint={`${data.approvedTuitions} approved`} />
            <StatCard label="Applications" value={data.totalApplications} icon={CheckCircle2} tone="emerald" hint="Across all tuitions" />
            <StatCard label="Stripe revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSign} tone="sky" hint={`${data.totalTransactions} paid transactions`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pending approvals</CardTitle>
                <Button render={<Link href="/dashboard/admin/tuitions?status=pending" />} variant="ghost" size="sm">
                  View all <ArrowRight className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {data.recentPendingTuitions.length ? (
                  <div className="space-y-3">
                    {data.recentPendingTuitions.map((tuition) => (
                      <div
                        key={tuition.id}
                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{tuition.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {tuition.subject} · {tuition.tutorName} · {formatDate(tuition.createdAt)}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            onClick={() => void review(tuition.id, "approved")}
                          >
                            <Check className="size-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void review(tuition.id, "rejected")}
                          >
                            <X className="size-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={CheckCircle2}
                    title="Moderation queue is clear"
                    description="There are no tuitions waiting for approval right now."
                  />
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Manage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <Link href="/dashboard/admin/users" className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
                    <span className="flex items-center gap-2"><Users className="size-4 text-primary" /> Users & roles</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                  <Link href="/dashboard/admin/tuitions" className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
                    <span className="flex items-center gap-2"><BookOpen className="size-4 text-primary" /> Tuition moderation</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                  <Link href="/dashboard/admin/transactions" className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
                    <span className="flex items-center gap-2"><CreditCard className="size-4 text-primary" /> Transactions</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Moderation status
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Approved</span>
                    <StatusBadge status="approved" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pending</span>
                    <StatusBadge status="pending" />
                  </div>
                  <p className="pt-1 text-xs text-muted-foreground">
                    Only approved and active tuitions appear on the public site.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminOverview />
    </RoleGuard>
  );
}
