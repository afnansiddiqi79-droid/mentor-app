"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FilePlus2,
  Sparkles,
  Users,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { StatsSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { formatDate } from "@/lib/format";
import type { TutorStats } from "@/lib/types";

function TutorOverview() {
  const { data, loading, error, reload } = useApi<TutorStats>("/api/tutor/stats");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor overview"
        description="Your listings, applicants and plan at a glance."
        action={
          <Button render={<Link href="/dashboard/tutor/post-tuition" />}>
            <FilePlus2 className="size-4" /> Post a tuition
          </Button>
        }
      />

      {loading ? <StatsSkeleton /> : null}

      {error ? (
        <EmptyState
          icon={BookOpen}
          title="Could not load your overview"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Tuitions posted" value={data.totalTuitions} icon={BookOpen} hint="All time" />
            <StatCard label="Approved" value={data.approvedTuitions} icon={CheckCircle2} tone="emerald" hint={`${data.activeTuitions} active`} />
            <StatCard label="Total applicants" value={data.totalApplicants} icon={Users} tone="sky" hint={`${data.pendingApplicants} awaiting review`} />
            <StatCard label="Current plan" value={data.plan === "pro" ? "Pro" : "Free"} icon={Sparkles} tone="amber" hint={data.plan === "pro" ? "Unlimited posts" : "2 tuition limit"} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent applicants</CardTitle>
                <Button render={<Link href="/dashboard/tutor/applicants" />} variant="ghost" size="sm">
                  View all <ArrowRight className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {data.recentApplicants.length ? (
                  <DataTable
                    rows={data.recentApplicants}
                    rowKey={(row) => row.id}
                    columns={[
                      {
                        key: "student",
                        header: "Student",
                        cell: (row) => (
                          <div>
                            <p className="font-medium">{row.studentName}</p>
                            <p className="text-xs text-muted-foreground">{row.studentEmail}</p>
                          </div>
                        ),
                      },
                      {
                        key: "tuition",
                        header: "Tuition",
                        cell: (row) => (
                          <span className="line-clamp-1 max-w-48">{row.tuitionTitle}</span>
                        ),
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
                    icon={Users}
                    title="No applicants yet"
                    description="Once your tuition is approved, student applications will show up here."
                    action={
                      <Button render={<Link href="/dashboard/tutor/post-tuition" />}>
                        Post a tuition
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <Link href="/dashboard/tutor/post-tuition" className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
                    <span className="flex items-center gap-2"><FilePlus2 className="size-4 text-primary" /> Post a tuition</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                  <Link href="/dashboard/tutor/my-tuitions" className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
                    <span className="flex items-center gap-2"><BookOpen className="size-4 text-primary" /> Manage listings</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                  <Link href="/dashboard/tutor/applicants" className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
                    <span className="flex items-center gap-2"><Users className="size-4 text-primary" /> Review applicants</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>

              {data.pendingApproval > 0 ? (
                <Card className="border-amber-500/30 bg-amber-500/5">
                  <CardContent className="flex items-start gap-3 p-5">
                    <Clock className="mt-0.5 size-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold">
                        {data.pendingApproval} listing{data.pendingApproval === 1 ? "" : "s"} awaiting approval
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        An admin will review your submission before it appears publicly.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {data.plan !== "pro" ? (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="space-y-3 p-5">
                    <p className="font-heading text-sm font-semibold">Tutor Pro</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Post unlimited tuitions and get priority placement for a
                      one-time payment of $15.
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
    </div>
  );
}

export default function TutorDashboardPage() {
  return (
    <RoleGuard roles={["tutor"]}>
      <TutorOverview />
    </RoleGuard>
  );
}
