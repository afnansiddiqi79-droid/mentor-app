"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpenCheck,
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
import { signUpSchema, type SignUpValues } from "@/lib/validations";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SignUpRequest = (payload: {
  name: string;
  email: string;
  password: string;
  role: "student" | "tutor";
}) => Promise<{ error?: { message?: string } | null }>;

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const role = useWatch({ control, name: "role" });

  async function onSubmit(values: SignUpValues) {
    const signUp = authClient.signUp.email as unknown as SignUpRequest;
    const { error } = await signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });

    if (error) {
      toast.error("Could not create your account", {
        description: error.message || "Please try a different email address.",
      });
      return;
    }

    toast.success("Account created", {
      description: `Welcome to MentorLagbe as a ${values.role}.`,
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <p className="text-sm font-medium">I am joining as</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: "student" as const,
              label: "Student",
              description: "Find and apply to tuitions",
              icon: UserRound,
            },
            {
              value: "tutor" as const,
              label: "Tutor",
              description: "Post tuitions and review applicants",
              icon: BookOpenCheck,
            },
          ].map(({ value, label, description, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("role", value, { shouldValidate: true, shouldDirty: true })
              }
              aria-pressed={role === value}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                role === value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "hover:bg-muted"
              )}
            >
              <Icon className={cn("size-4", role === value ? "text-primary" : "text-muted-foreground")} />
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[0.7rem] text-muted-foreground">{description}</span>
              </span>
            </button>
          ))}
        </div>
        <input type="hidden" {...register("role")} />
        {errors.role ? (
          <p className="text-xs text-destructive">{errors.role.message}</p>
        ) : null}
      </div>

      <FormField label="Full name" htmlFor="name" required error={errors.name?.message}>
        <div className="relative">
          <GraduationCap className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your full name"
            className="h-10 pl-9"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </div>
      </FormField>

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

      <FormField
        label="Password"
        htmlFor="password"
        required
        error={errors.password?.message}
        hint="At least 8 characters."
      >
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
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

      <FormField
        label="Confirm password"
        htmlFor="confirmPassword"
        required
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Repeat your password"
          className="h-10"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Create {role} account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
      <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
        By creating an account you agree to use MentorLagbe responsibly. Admin
        accounts cannot be created from this page.
      </p>
    </form>
  );
}
