"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { api, ApiClientError } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Application } from "@/lib/types";

function MyApplications() {
  const { data, loading, error, reload } = useApi<Application[]>("/api/student/applications");
  const [selected, setSelected] = useState<Application | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function cancelApplication() {
    if (!selected) return;
    setCancelling(true);
    try {
      await api.delete(`/api/student/applications/${selected.id}`);
      toast.success("Application cancelled");
      setSelected(null);
      await reload();
    } catch (err) {
      toast.error("Could not cancel application", {
        description:
          err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My applications"
        description="Every tuition you have applied to, with its latest status."
        action={
          <Button render={<Link href="/tuitions" />} variant="outline">
            <Search className="size-4" /> Find more tuitions
          </Button>
        }
      />

      {error ? (
        <EmptyState
          icon={ClipboardList}
          title="Could not load applications"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : (
        <DataTable
          rows={data || []}
          loading={loading}
          rowKey={(row) => row.id}
          emptyTitle="No applications yet"
          emptyDescription="Apply to a tuition and it will appear here with live status updates."
          columns={[
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
              key: "tutor",
              header: "Tutor",
              cell: (row) => (
                <div>
                  <p className="text-sm font-medium">{row.tutorName || "Tutor"}</p>
                  <p className="text-xs text-muted-foreground">{row.tutorEmail}</p>
                </div>
              ),
            },
            {
              key: "fee",
              header: "Fee",
              cell: (row) => formatCurrency(row.monthlyFee),
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setSelected(row)}
                  >
                    <Trash2 className="size-4" /> Cancel
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
          ]}
        />
      )}

      <div className="rounded-xl border bg-card p-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Tip:</span> only pending
        applications can be cancelled. Once a tutor accepts or rejects an
        application, its status is final.
      </div>

      <ConfirmDialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !cancelling) setSelected(null);
        }}
        title="Cancel this application?"
        description={
          selected
            ? `Your application to “${selected.tuitionTitle}” will be permanently removed.`
            : ""
        }
        confirmLabel={cancelling ? "Cancelling…" : "Cancel application"}
        loading={cancelling}
        onConfirm={cancelApplication}
      />
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <RoleGuard roles={["student"]}>
      <MyApplications />
    </RoleGuard>
  );
}
