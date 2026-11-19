"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye, Loader2, Search, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { api, ApiClientError } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { PaginationMeta, Tuition } from "@/lib/types";

const statuses = ["all", "pending", "approved", "rejected"] as const;
type StatusFilter = (typeof statuses)[number];

function AdminTuitions() {
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const params = new URLSearchParams({ page: String(page), limit: "10" });
  if (status !== "all") params.set("status", status);
  if (search) params.set("search", search);

  const { data, meta, loading, error, reload } = useApi<Tuition[]>(
    `/api/admin/tuitions?${params.toString()}`
  );
  const pagination = meta as unknown as PaginationMeta | null;

  async function review(tuition: Tuition, approvalStatus: "approved" | "rejected") {
    setUpdatingId(tuition.id);
    try {
      await api.patch(`/api/admin/tuitions/${tuition.id}/approval`, { approvalStatus });
      toast.success(
        approvalStatus === "approved"
          ? "Tuition approved and published"
          : "Tuition rejected"
      );
      await reload();
    } catch (err) {
      toast.error("Could not update tuition", {
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tuition moderation"
        description="Approve or reject submitted tuitions. Only approved and active listings are public."
      />

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={status === item ? "default" : "outline"}
              className="capitalize"
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
            >
              {item}
            </Button>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title, tutor, subject…"
              className="h-9 w-full pl-9 sm:w-72"
              aria-label="Search tuitions"
            />
          </div>
          <Button type="submit" className="h-9">Search</Button>
          {search ? (
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setPage(1);
              }}
            >
              Clear
            </Button>
          ) : null}
        </form>
      </div>

      {error ? (
        <EmptyState
          icon={ShieldCheck}
          title="Could not load tuitions"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : (
        <DataTable
          rows={data || []}
          loading={loading}
          rowKey={(row) => row.id}
          emptyTitle={`No ${status === "all" ? "" : status} tuitions`}
          emptyDescription="Submissions matching this filter will appear here."
          columns={[
            {
              key: "tuition",
              header: "Tuition",
              cell: (row) => (
                <div className="min-w-52">
                  <p className="font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.subject} · {row.classLevel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {row.tutorName} · {row.tutorEmail}
                  </p>
                </div>
              ),
            },
            {
              key: "fee",
              header: "Fee",
              cell: (row) => formatCurrency(row.monthlyFee),
            },
            {
              key: "submitted",
              header: "Submitted",
              cell: (row) => formatDate(row.createdAt),
            },
            {
              key: "status",
              header: "Status",
              cell: (row) => (
                <div className="space-y-1">
                  <StatusBadge status={row.approvalStatus} />
                  <p className="text-[0.65rem] text-muted-foreground">
                    {row.isActive ? "Active" : "Closed"}
                  </p>
                </div>
              ),
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              cell: (row) => (
                <div className="flex justify-end gap-1">
                  {row.approvalStatus === "approved" ? (
                    <Button
                      render={<Link href={`/tuitions/${row.id}`} />}
                      variant="ghost"
                      size="icon-sm"
                      aria-label="View public listing"
                    >
                      <Eye className="size-4" />
                    </Button>
                  ) : null}
                  {row.approvalStatus !== "approved" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                      disabled={updatingId === row.id}
                      onClick={() => void review(row, "approved")}
                    >
                      {updatingId === row.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Approve
                    </Button>
                  ) : null}
                  {row.approvalStatus !== "rejected" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={updatingId === row.id}
                      onClick={() => void review(row, "rejected")}
                    >
                      <X className="size-4" /> Reject
                    </Button>
                  ) : null}
                </div>
              ),
            },
          ]}
        />
      )}

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} tuitions
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminTuitionsPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminTuitions />
    </RoleGuard>
  );
}
