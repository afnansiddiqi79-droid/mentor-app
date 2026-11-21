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

/**
 * Returns a same-origin path for post-login navigation. Absolute URLs from
 * other origins are ignored to prevent open redirects.
 */
function safeRedirectPath(value: string | null): string {
  try {
    const target = new URL(value || "/dashboard", window.location.origin);
    if (target.origin !== window.location.origin) return "/dashboard";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/dashboard";
  }
}

/** Builds an absolute URL on the frontend origin, never the API origin. */
function frontendUrl(path: string): string {
  return new URL(path, window.location.origin).toString();
}

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
    const redirect = safeRedirectPath(
      new URLSearchParams(window.location.search).get("redirect")
    );
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      const path = safeRedirectPath(
        new URLSearchParams(window.location.search).get("redirect")
      );
      // Better Auth stores callbackURL verbatim and uses it for the final
      // redirect. A relative value resolves against the API origin (for example
      // https://<api>/dashboard), so every post-login destination must be an
      // absolute URL on the frontend origin. /dashboard is role-aware: it sends
      // students, tutors and admins to their own dashboard after sign-in.
      const callbackURL = frontendUrl(path);
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: frontendUrl("/sign-in"),
      });
    } catch {
      toast.error("Google sign-in failed", {
        description: "Could not connect to Google. Please try again.",
      });
      setIsGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        disabled={isGoogleLoading || isSubmitting}
        onClick={handleGoogleSignIn}
      >
        {isGoogleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

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

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isGoogleLoading}>
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
    <div className="hidden rounded-2xl bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
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
