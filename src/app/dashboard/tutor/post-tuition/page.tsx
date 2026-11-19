"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info, Sparkles } from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { TuitionForm } from "@/components/tutor/tuition-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PostTuition() {
  const { user } = useAuth();
  const router = useRouter();

  function handleSuccess() {
    router.push("/dashboard/tutor/my-tuitions");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Post a new tuition"
        description="New listings are submitted for admin approval before they become public."
      />

      {user?.plan === "free" ? (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 text-amber-600" />
            <div>
              <p className="text-sm font-semibold">Free plan: up to 2 tuition posts</p>
              <p className="text-xs text-muted-foreground">
                Upgrade to Tutor Pro to post unlimited tuitions.
              </p>
            </div>
          </div>
          <Button render={<Link href="/pricing" />} variant="outline" size="sm">
            <Sparkles className="size-4" /> Upgrade
          </Button>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Tuition details</CardTitle>
        </CardHeader>
        <CardContent>
          <TuitionForm mode="create" onSuccess={handleSuccess} />
        </CardContent>
      </Card>

      <div className="rounded-xl border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        Your listing will be saved with <span className="font-medium text-foreground">pending</span>{" "}
        approval and <span className="font-medium text-foreground">active</span> status.
        An admin must approve it before students can find it. You can close the
        listing at any time from My Tuitions.
      </div>
    </div>
  );
}

export default function PostTuitionPage() {
  return (
    <RoleGuard roles={["tutor"]}>
      <PostTuition />
    </RoleGuard>
  );
}
