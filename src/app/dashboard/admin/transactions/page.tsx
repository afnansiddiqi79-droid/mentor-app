"use client";

import { useState } from "react";
import { CreditCard, DollarSign, ReceiptText } from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { formatCurrency, formatDate, roleLabel } from "@/lib/format";
import type { PaginationMeta, Payment } from "@/lib/types";

function AdminTransactions() {
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, reload } = useApi<Payment[]>(
    `/api/admin/transactions?page=${page}&limit=10`
  );
  const pagination = meta as unknown as (PaginationMeta & { revenue?: number }) | null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Verified Stripe payments. Revenue is calculated from paid records only."
      />

      {error ? (
        <EmptyState
          icon={CreditCard}
          title="Could not load transactions"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Total revenue"
              value={formatCurrency(pagination?.revenue || 0)}
              icon={DollarSign}
              tone="emerald"
              hint="Paid transactions"
            />
            <StatCard
              label="Transactions"
              value={pagination?.total || 0}
              icon={ReceiptText}
              tone="sky"
              hint="All payment records"
            />
            <StatCard
              label="Average payment"
              value={formatCurrency(
                pagination?.total ? (pagination.revenue || 0) / pagination.total : 0
              )}
              icon={CreditCard}
              tone="primary"
              hint="Across paid records"
            />
          </div>

          <DataTable
            rows={data || []}
            loading={loading}
            rowKey={(row) => row.id}
            emptyTitle="No transactions yet"
            emptyDescription="Stripe payments will appear here after a successful upgrade."
            columns={[
              {
                key: "user",
                header: "User",
                cell: (row) => (
                  <div className="min-w-44">
                    <p className="font-medium">{row.userName}</p>
                    <p className="text-xs text-muted-foreground">{row.userEmail}</p>
                  </div>
                ),
              },
              {
                key: "role",
                header: "Role",
                cell: (row) => (
                  <span className="text-sm capitalize">{roleLabel(row.userRole)}</span>
                ),
              },
              {
                key: "plan",
                header: "Plan",
                cell: (row) => (
                  <span className="text-sm capitalize">{row.planName}</span>
                ),
              },
              {
                key: "amount",
                header: "Amount",
                cell: (row) => (
                  <span className="font-medium">
                    {formatCurrency(row.amount, row.currency)}
                  </span>
                ),
              },
              {
                key: "transaction",
                header: "Transaction ID",
                cell: (row) => (
                  <span
                    className="block max-w-40 truncate font-mono text-xs text-muted-foreground"
                    title={row.transactionId}
                  >
                    {row.transactionId}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                cell: (row) => <StatusBadge status={row.paymentStatus} />,
              },
              {
                key: "date",
                header: "Paid",
                cell: (row) => formatDate(row.paidAt),
              },
            ]}
          />

          {pagination && pagination.totalPages > 1 ? (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
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
        </>
      )}
    </div>
  );
}

export default function AdminTransactionsPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminTransactions />
    </RoleGuard>
  );
}
