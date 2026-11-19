"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Search,
  Sparkles,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { StatsSkeleton, TableSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { StudentStats } from "@/lib/types";

function StudentOverview() {
  const { data, loading, error, reload } = useApi<StudentStats>("/api/student/stats");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your learning overview"
        description="Track applications, acceptance and your current plan."
        action={
          <Button render={<Link href="/tuitions" />}>
            <Search className="size-4" /> Find a tuition
          </Button>
        }
      />

      {loading ? <StatsSkeleton /> : null}

      {error ? (
        <EmptyState
          icon={ClipboardList}
          title="Could not load your overview"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total applications" value={data.totalApplications} icon={ClipboardList} hint="All time" />
            <StatCard label="Accepted" value={data.accepted} icon={CheckCircle2} tone="emerald" hint="Tutor approved" />
            <StatCard label="Pending" value={data.pending} icon={Clock} tone="amber" hint="Awaiting review" />
            <StatCard
              label="Current plan"
              value={data.plan === "pro" ? "Pro" : "Free"}
              icon={Sparkles}
              tone="sky"
              hint={data.plan === "pro" ? "Unlimited access" : "Upgrade anytime"}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent applications</CardTitle>
                <Button
                  render={<Link href="/dashboard/student/my-applications" />}
                  variant="ghost"
                  size="sm"
                >
                  View all <ArrowRight className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {data.recentApplications.length ? (
                  <DataTable
                    rows={data.recentApplications}
                    rowKey={(row) => row.id}
                    columns={[
                      {
                        key: "tuition",
                        header: "Tuition",
                        cell: (row) => (
                          <div>
                            <p className="font-medium">{row.tuitionTitle}</p>
                            <p className="text-xs text-muted-foreground">{row.subject}</p>
                          </div>
                        ),
                      },
                      {
                        key: "fee",
                        header: "Fee",
                        cell: (row) => formatCurrency(row.monthlyFee),
                      },
                      {
                        key: "status",
                        header: "Status",
                        cell: (row) => <StatusBadge status={row.status} />,
                      },
                      {
                        key: "date",
                        header: "Applied",
                        cell: (row) => formatDate(row.appliedAt),
                      },
                    ]}
                  />
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    title="No applications yet"
                    description="Browse approved tuitions and send your first application."
                    action={<Button render={<Link href="/tuitions" />}>Browse tuitions</Button>}
                  />
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Next steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <Link
                    href="/tuitions"
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="size-4 text-primary" /> Browse tuitions
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/dashboard/student/my-applications"
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2">
                      <ClipboardList className="size-4 text-primary" /> Track applications
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" /> Compare plans
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>

              {data.plan !== "pro" ? (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="space-y-3 p-5">
                    <p className="font-heading text-sm font-semibold">Student Pro</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Unlock priority application support and a Pro badge for a
                      one-time payment of $10.
                    </p>
                    <Button render={<Link href="/pricing" />} size="sm" className="w-full">
                      Upgrade now
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {loading ? <TableSkeleton /> : null}
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <RoleGuard roles={["student"]}>
      <StudentOverview />
    </RoleGuard>
  );
}
