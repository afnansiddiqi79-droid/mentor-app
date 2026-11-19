"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInValues } from "@/lib/validations";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInValues) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error("Sign in failed", {
        description: error.message || "Check your email and password and try again.",
      });
      return;
    }

    toast.success("Welcome back");
    const redirect =
      new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField label="Email address" htmlFor="email" required error={errors.email?.message}>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-10 pl-9"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </div>
      </FormField>

      <FormField label="Password" htmlFor="password" required error={errors.password?.message}>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-10 pl-9 pr-10"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </FormField>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to MentorLagbe?{" "}
        <Link href="/sign-up" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function AuthAside() {
  return (
    <div className="hidden rounded-2xl bg-brand-navy p-8 text-white lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="mb-8 flex size-11 items-center justify-center rounded-xl bg-white/10">
          <GraduationCap className="size-6" />
        </div>
        <h2 className="font-heading text-2xl font-semibold leading-snug">
          Learning works best when the match is right.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          MentorLagbe gives students and tutors a calm, transparent place to find
          each other and get to work.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <BookOpen className="mt-0.5 size-5 text-sky-300" />
          <div>
            <p className="text-sm font-semibold">Approved tuitions only</p>
            <p className="text-xs text-slate-300">Every public listing is reviewed by an admin.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <UserRound className="mt-0.5 size-5 text-sky-300" />
          <div>
            <p className="text-sm font-semibold">Role-aware by design</p>
            <p className="text-xs text-slate-300">Students, tutors and admins get the tools they need.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
