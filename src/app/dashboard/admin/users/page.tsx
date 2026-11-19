"use client";

import { useState } from "react";
import { Loader2, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { api, ApiClientError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { AppUser, PaginationMeta, Role } from "@/lib/types";

const selectClass =
  "h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring dark:bg-input/30";

function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const params = new URLSearchParams({ page: String(page), limit: "10" });
  if (search) params.set("search", search);
  if (role) params.set("role", role);

  const { data, meta, loading, error, reload } = useApi<AppUser[]>(
    `/api/admin/users?${params.toString()}`
  );
  const pagination = meta as unknown as PaginationMeta | null;

  async function changeRole(target: AppUser, nextRole: Role) {
    setUpdatingId(target.id);
    try {
      await api.patch(`/api/admin/users/${target.id}/role`, { role: nextRole });
      toast.success(`Role updated to ${nextRole}`);
      await reload();
    } catch (err) {
      toast.error("Could not change role", {
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="View registered accounts and update roles. Role changes are audited by the backend."
      />

      <form
        className="flex flex-col gap-2 rounded-xl border bg-card p-4 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearch(searchInput.trim());
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or email…"
            className="h-9 pl-9"
            aria-label="Search users"
          />
        </div>
        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="admin">Admins</option>
        </select>
        <Button type="submit" className="h-9">Search</Button>
        {(search || role) ? (
          <Button
            type="button"
            variant="outline"
            className="h-9"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setRole("");
              setPage(1);
            }}
          >
            Reset
          </Button>
        ) : null}
      </form>

      {error ? (
        <EmptyState
          icon={Users}
          title="Could not load users"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : (
        <DataTable
          rows={data || []}
          loading={loading}
          rowKey={(row) => row.id}
          emptyTitle="No users found"
          emptyDescription="Try a different search term or role filter."
          columns={[
            {
              key: "user",
              header: "User",
              cell: (row) => (
                <div className="flex min-w-48 items-center gap-3">
                  <UserAvatar name={row.name} image={row.image} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{row.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{row.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "plan",
              header: "Plan",
              cell: (row) => (
                <Badge
                  variant="outline"
                  className={row.plan === "pro" ? "border-primary/30 capitalize text-primary" : "capitalize"}
                >
                  {row.plan}
                </Badge>
              ),
            },
            {
              key: "joined",
              header: "Joined",
              cell: (row) => formatDate(row.createdAt),
            },
            {
              key: "role",
              header: "Role",
              cell: (row) => {
                const isSelf = currentUser?.id === row.id;
                return (
                  <div className="flex items-center gap-2">
                    <select
                      value={row.role}
                      disabled={isSelf || updatingId === row.id}
                      onChange={(event) => void changeRole(row, event.target.value as Role)}
                      className={selectClass}
                      aria-label={`Role for ${row.name}`}
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                    {updatingId === row.id ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : null}
                  </div>
                );
              },
            },
          ]}
        />
      )}

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} users
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

export default function AdminUsersPage() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminUsers />
    </RoleGuard>
  );
}
