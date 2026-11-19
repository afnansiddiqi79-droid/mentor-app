"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  Eye,
  FilePlus2,
  Pencil,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TuitionGridSkeleton } from "@/components/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useApi } from "@/hooks/use-api";
import { api, ApiClientError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Tuition } from "@/lib/types";

function MyTuitions() {
  const { data, loading, error, reload } = useApi<Tuition[]>("/api/tutor/tuitions");
  const [selected, setSelected] = useState<Tuition | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function toggleActive(tuition: Tuition, isActive: boolean) {
    setTogglingId(tuition.id);
    try {
      await api.patch(`/api/tutor/tuitions/${tuition.id}/status`, { isActive });
      toast.success(isActive ? "Tuition reopened" : "Tuition closed");
      await reload();
    } catch (err) {
      toast.error("Could not update status", {
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function deleteTuition() {
    if (!selected) return;
    setDeleting(true);
    try {
      await api.delete(`/api/tutor/tuitions/${selected.id}`);
      toast.success("Tuition deleted");
      setSelected(null);
      await reload();
    } catch (err) {
      toast.error("Could not delete tuition", {
        description: err instanceof ApiClientError ? err.message : "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My tuitions"
        description="Edit, close or delete the tuitions you have posted."
        action={
          <Button render={<Link href="/dashboard/tutor/post-tuition" />}>
            <FilePlus2 className="size-4" /> Post a tuition
          </Button>
        }
      />

      {error ? (
        <EmptyState
          icon={BookOpen}
          title="Could not load your tuitions"
          description={error}
          action={<Button onClick={() => void reload()}>Try again</Button>}
        />
      ) : loading ? (
        <TuitionGridSkeleton count={4} />
      ) : !data?.length ? (
        <EmptyState
          icon={BookOpen}
          title="You have not posted a tuition yet"
          description="Create your first listing and start receiving student applications."
          action={
            <Button render={<Link href="/dashboard/tutor/post-tuition" />}>
              Post a tuition
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {data.map((tuition) => (
            <Card key={tuition.id} className="gap-0 py-0">
              <div className="relative aspect-[21/9] overflow-hidden bg-muted">
                <Image
                  src={tuition.bannerImage}
                  alt={tuition.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 flex gap-2">
                  <StatusBadge status={tuition.approvalStatus} className="bg-background/90 backdrop-blur" />
                  <Badge
                    variant="outline"
                    className="bg-background/90 capitalize backdrop-blur"
                  >
                    {tuition.isActive ? "Active" : "Closed"}
                  </Badge>
                </div>
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{tuition.subject}</Badge>
                    <Badge variant="outline">{tuition.classLevel}</Badge>
                  </div>
                  <h3 className="font-heading text-base font-semibold">{tuition.title}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Wallet className="size-3.5" /> {formatCurrency(tuition.monthlyFee)}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="size-3.5" /> {tuition.daysPerWeek} days
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="size-3.5" /> {tuition.applicantCount || 0}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <Switch
                      checked={tuition.isActive}
                      onCheckedChange={(checked) => void toggleActive(tuition, checked)}
                      disabled={togglingId === tuition.id}
                      aria-label={`Toggle ${tuition.title}`}
                    />
                    {tuition.isActive ? "Open" : "Closed"}
                  </label>

                  <div className="flex gap-1.5">
                    <Button
                      render={<Link href={`/tuitions/${tuition.id}`} />}
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="size-4" /> View
                    </Button>
                    <Button
                      render={<Link href={`/dashboard/tutor/my-tuitions/${tuition.id}/edit`} />}
                      variant="outline"
                      size="sm"
                    >
                      <Pencil className="size-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setSelected(tuition)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {tuition.approvalStatus === "pending" ? (
                  <p className="text-[0.7rem] text-amber-600 dark:text-amber-400">
                    Awaiting admin approval — not visible publicly yet.
                  </p>
                ) : null}
                {tuition.approvalStatus === "rejected" ? (
                  <p className="text-[0.7rem] text-rose-600 dark:text-rose-400">
                    This listing was rejected. Edit the details and contact support
                    for a re-review.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !deleting) setSelected(null);
        }}
        title="Delete this tuition?"
        description={
          selected
            ? `“${selected.title}” and all of its applications will be permanently deleted.`
            : ""
        }
        confirmLabel={deleting ? "Deleting…" : "Delete tuition"}
        loading={deleting}
        onConfirm={deleteTuition}
      />
    </div>
  );
}

export default function MyTuitionsPage() {
  return (
    <RoleGuard roles={["tutor"]}>
      <MyTuitions />
    </RoleGuard>
  );
}
