"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { PageHeader } from "@/components/dashboard/page-header";
import { TuitionForm } from "@/components/tutor/tuition-form";
import { EmptyState } from "@/components/empty-state";
import { DetailSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import type { Tuition } from "@/lib/types";

function EditTuition() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error } = useApi<Tuition>(
    params?.id ? `/api/tutor/tuitions/${params.id}` : null
  );

  if (loading) return <DetailSkeleton />;

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Tuition not found"
          description={error || "This tuition does not exist or does not belong to you."}
          action={
            <Button render={<Link href="/dashboard/tutor/my-tuitions" />} variant="outline">
              Back to my tuitions
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/dashboard/tutor/my-tuitions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to my tuitions
      </Link>

      <PageHeader
        title="Edit tuition"
        description="Changes are saved immediately. Approval status is managed by admins."
      />

      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <TuitionForm
            mode="edit"
            initial={data}
            onSuccess={() => router.push("/dashboard/tutor/my-tuitions")}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditTuitionPage() {
  return (
    <RoleGuard roles={["tutor"]}>
      <EditTuition />
    </RoleGuard>
  );
}
