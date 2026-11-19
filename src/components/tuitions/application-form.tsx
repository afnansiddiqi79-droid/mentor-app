"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  LogIn,
  Send,
  ShieldCheck,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiClientError } from "@/lib/api";
import { applicationSchema, type ApplicationValues } from "@/lib/validations";
import { roleLabel } from "@/lib/format";
import type { AppUser, Application } from "@/lib/types";

function ApplicationFields({
  tuitionId,
  user,
  onSubmitted,
}: {
  tuitionId: string;
  user: AppUser;
  onSubmitted: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      phone: user.phone || "",
      preferredSchedule: "",
      studentNote: "",
    },
  });

  async function onSubmit(values: ApplicationValues) {
    try {
      await api.post<Application>("/api/student/applications", {
        tuitionId,
        ...values,
      });
      reset({ phone: user.phone || "", preferredSchedule: "", studentNote: "" });
      toast.success("Application sent", {
        description: "The tutor will review your request and respond soon.",
      });
      onSubmitted();
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Could not send your application. Please try again.";
      toast.error("Application failed", { description: message });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex items-center gap-2 rounded-md bg-primary/5 px-3 py-2 text-xs text-primary">
        <ShieldCheck className="size-4" />
        Applying as {user.name} ({user.email})
      </div>

      <FormField label="Phone number" htmlFor="phone" required error={errors.phone?.message}>
        <Input
          id="phone"
          placeholder="+880 17XX XXXXXX"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
      </FormField>

      <FormField
        label="Preferred schedule"
        htmlFor="preferredSchedule"
        required
        error={errors.preferredSchedule?.message}
        hint="Example: Sat–Mon, 7–9 PM"
      >
        <Input
          id="preferredSchedule"
          placeholder="Sat–Mon, 7–9 PM"
          aria-invalid={Boolean(errors.preferredSchedule)}
          {...register("preferredSchedule")}
        />
      </FormField>

      <FormField
        label="Learning note"
        htmlFor="studentNote"
        error={errors.studentNote?.message}
        hint="Optional — share your goals or the topics you need help with."
      >
        <Textarea
          id="studentNote"
          rows={4}
          placeholder="I want to improve my calculus before the HSC trial exam…"
          aria-invalid={Boolean(errors.studentNote)}
          {...register("studentNote")}
        />
      </FormField>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Send application
      </Button>
      <p className="text-center text-[0.7rem] text-muted-foreground">
        You can only apply once to each tuition.
      </p>
    </form>
  );
}

export function ApplicationForm({ tuitionId }: { tuitionId: string }) {
  const { user, isPending } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
          <LogIn className="mt-0.5 size-5 text-primary" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Sign in to apply</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Create a free student account to send an application and track its status.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href={`/sign-in?redirect=/tuitions/${tuitionId}`} />} className="flex-1">
            Sign in
          </Button>
          <Button
            render={<Link href="/sign-up" />}
            variant="outline"
            className="flex-1"
          >
            Sign up
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "student") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
        <UserRoundX className="mt-0.5 size-5 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">Students only</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            You are signed in as a {roleLabel(user.role)}. Only student accounts can
            apply to tuitions. You can still browse and save this listing for later.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-5" />
          Application sent successfully
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your application is pending. Track its status from your student dashboard.
        </p>
        <Button render={<Link href="/dashboard/student/my-applications" />} variant="outline" className="w-full">
          View my applications
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => setSubmitted(false)}>
          Apply to another tuition
        </Button>
      </div>
    );
  }

  return (
    <ApplicationFields
      tuitionId={tuitionId}
      user={user}
      onSubmitted={() => setSubmitted(true)}
    />
  );
}
