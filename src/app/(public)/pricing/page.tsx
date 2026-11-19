"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Check,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, ApiClientError } from "@/lib/api";
import { cn } from "@/lib/utils";

const plans = [
  {
    role: "student" as const,
    name: "Student Pro",
    price: 10,
    icon: UserRound,
    tagline: "For ambitious learners",
    features: [
      "Unlimited applications",
      "Priority application support",
      "Pro badge on your profile",
      "Early access to new tuitions",
      "Everything in the Free plan",
    ],
  },
  {
    role: "tutor" as const,
    name: "Tutor Pro",
    price: 15,
    icon: GraduationCap,
    tagline: "For growing mentors",
    features: [
      "Unlimited tuition posts",
      "Priority placement in browse",
      "Pro badge on your profile",
      "Full applicant management",
      "Everything in the Free plan",
    ],
  },
];

const faqs = [
  {
    question: "Is the Pro plan a subscription?",
    answer:
      "No. MentorLagbe Pro is a one-time payment that upgrades your account. You are not enrolled in a recurring subscription.",
  },
  {
    question: "How does Stripe checkout work?",
    answer:
      "You are redirected to Stripe's secure checkout. MentorLagbe never receives or stores your card details. Your plan is upgraded only after Stripe confirms the payment.",
  },
  {
    question: "Can I upgrade if I am on the Free plan?",
    answer:
      "Yes. Students and tutors on the Free plan can upgrade at any time. Admin accounts do not need a paid plan.",
  },
  {
    question: "What happens after a successful payment?",
    answer:
      "You are returned to a verification page. The backend verifies the Stripe session (and the webhook does the same) before updating your plan to Pro.",
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  async function upgrade(role: "student" | "tutor") {
    if (!user) {
      router.push(`/sign-in?redirect=/pricing`);
      return;
    }
    if (user.role !== role) {
      toast.error("This plan is for a different account type", {
        description:
          role === "student"
            ? "Student Pro can only be purchased by student accounts."
            : "Tutor Pro can only be purchased by tutor accounts.",
      });
      return;
    }

    setLoadingRole(role);
    try {
      const response = await api.post<{ url: string }>("/api/payments/checkout", {
        planName: "pro",
      });
      if (response.url) {
        window.location.assign(response.url);
      } else {
        throw new Error("Stripe did not return a checkout URL");
      }
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Could not start checkout. Please try again.";
      toast.error("Checkout unavailable", { description: message });
      setLoadingRole(null);
    }
  }

  return (
    <div>
      <section className="border-b bg-muted/30">
        <div className="container-page py-14 text-center md:py-20">
          <Badge variant="outline" className="mb-4 gap-1.5 border-primary/20 bg-primary/5 text-primary">
            <Sparkles className="size-3.5" />
            Simple, transparent pricing
          </Badge>
          <h1 className="mx-auto max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Choose the plan that matches your ambition
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Start free. Upgrade once when you need unlimited opportunities. No
            recurring subscription, no hidden fees.
          </p>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="h-full">
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <BadgeCheck className="size-5" />
              </div>
              <CardTitle className="text-lg">Free</CardTitle>
              <p className="text-sm text-muted-foreground">For getting started</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="font-heading text-3xl font-semibold">
                $0
                <span className="text-sm font-normal text-muted-foreground"> forever</span>
              </p>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Browse every approved tuition",
                  "Apply to tuitions as a student",
                  "Post up to 2 tuitions as a tutor",
                  "Manage applications and applicants",
                  "Profile and account management",
                ].map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                render={<Link href={user ? "/dashboard" : "/sign-up"} />}
                variant="outline"
                className="w-full"
              >
                {user ? "Go to dashboard" : "Create free account"}
              </Button>
            </CardContent>
          </Card>

          {plans.map((plan) => {
            const isCurrent = user?.role === plan.role && user?.plan === "pro";
            const isWrongRole = Boolean(user && user.role !== plan.role);
            return (
              <Card
                key={plan.role}
                className={cn(
                  "relative h-full",
                  plan.role === "tutor" && "border-primary/30 ring-primary/20"
                )}
              >
                {plan.role === "tutor" ? (
                  <Badge className="absolute right-4 top-4">For tutors</Badge>
                ) : null}
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <plan.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="font-heading text-3xl font-semibold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground"> one-time</span>
                  </p>
                  <ul className="space-y-2.5 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button variant="secondary" className="w-full" disabled>
                      <BadgeCheck className="size-4" /> Current plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={loadingRole !== null || user?.role === "admin" || isWrongRole}
                      onClick={() => void upgrade(plan.role)}
                    >
                      {loadingRole === plan.role ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Zap className="size-4" />
                      )}
                      {user?.role === "admin"
                        ? "Admins do not need Pro"
                        : isWrongRole
                          ? `For ${plan.role} accounts`
                          : user
                            ? `Upgrade for $${plan.price}`
                            : "Sign in to upgrade"}
                    </Button>
                  )}
                  {!user ? (
                    <p className="text-center text-xs text-muted-foreground">
                      You will be asked to sign in first.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-xl border bg-card p-5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold">Secure payments with Stripe</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Payments are processed by Stripe Checkout. Your plan is upgraded only
              after the backend verifies the payment signature or session. Card
              details never touch MentorLagbe servers.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 section-pad">
        <div className="container-page">
          <h2 className="mb-8 text-center font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold">
                  {faq.question}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
