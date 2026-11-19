"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Mail, Phone, Users, X } from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { api, ApiClientError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application } from "@/lib/types";

const filters = ["all", "pending", "accepted", "rejected"] as const;
type Filter = (typeof filters)[number];

function Applicants() {
  const { data, loading, error, reload } = useApi<Application[]>("/api/tutor/applications");
  const [filter, setFilter] = useState<Filter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function review(application: Application, status: "accepted" | "rejected") {
    setUpdatingId(application.id);
    try {
      await api.patch(`/api/tutor/applications/${application.id}`, { status });
      toast.success(status === "accepted" ? "Application accepted" : "Application rejected", {
        description: `${application.studentName} has been notified by status update.`,
      });
      await reload();
    } catch (err) {
      toast.error("Could not update application", {
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  const rows = (data || []).filter((row) => filter === "all" || row.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applicants"
        description="Review students who applied to your tuitions. You can only manage your own listings."
        action={
          <Button render={<Link href="/dashboard/tutor/my-tuitions" />} variant="outline">
            My tuitions
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const count =
            item === "all"
              ? data?.length || 0
              : (data || []).filter((row) => row.status === item).length;
          return (
            <Button
              key={item}
              variant={filter === item ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(item)}
              className={cn("capitalize", filter === item && "pointer-events-auto")}
            >
              {item} <span className="ml-1 text-xs opacity-70">({count})</span>
            </Button>
          );
        })}
      </div>

      {error ? (
        <EmptyState
          icon={Users}
          title="Could not load applicants"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : (
        <DataTable
          rows={rows}
          loading={loading}
          rowKey={(row) => row.id}
          emptyTitle={filter === "all" ? "No applicants yet" : `No ${filter} applications`}
          emptyDescription="Applications to your tuitions will appear here with contact and schedule details."
          columns={[
            {
              key: "student",
              header: "Student",
              cell: (row) => (
                <div className="min-w-44 space-y-1">
                  <p className="font-medium">{row.studentName}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="size-3" /> {row.studentEmail}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="size-3" /> {row.studentPhone}
                  </p>
                </div>
              ),
            },
            {
              key: "tuition",
              header: "Tuition",
              cell: (row) => (
                <div className="min-w-40">
                  <Link
                    href={`/tuitions/${row.tuitionId}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {row.tuitionTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">{row.subject}</p>
                </div>
              ),
            },
            {
              key: "schedule",
              header: "Schedule & note",
              cell: (row) => (
                <div className="max-w-56 space-y-1">
                  <p className="text-xs font-medium">{row.preferredSchedule}</p>
                  {row.studentNote ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground" title={row.studentNote}>
                      {row.studentNote}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No note provided</p>
                  )}
                </div>
              ),
            },
            {
              key: "applied",
              header: "Applied",
              cell: (row) => formatDate(row.appliedAt),
            },
            {
              key: "status",
              header: "Status",
              cell: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              cell: (row) =>
                row.status === "pending" ? (
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                      disabled={updatingId === row.id}
                      onClick={() => void review(row, "accepted")}
                    >
                      {updatingId === row.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={updatingId === row.id}
                      onClick={() => void review(row, "rejected")}
                    >
                      <X className="size-4" /> Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Reviewed</span>
                ),
            },
          ]}
        />
      )}
    </div>
  );
}

export default function ApplicantsPage() {
  return (
    <RoleGuard roles={["tutor"]}>
      <Applicants />
    </RoleGuard>
  );
}
