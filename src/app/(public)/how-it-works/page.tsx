import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  ClipboardCheck,
  FilePlus2,
  MessagesSquare,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";

export const metadata = {
  title: "How It Works",
  description:
    "Learn how MentorLagbe connects students and tutors through a transparent application workflow.",
};

const studentSteps = [
  {
    icon: Search,
    title: "Browse approved tuitions",
    text: "Filter by subject, class level and mode. Every listing is reviewed by an admin before it appears publicly.",
  },
  {
    icon: ClipboardCheck,
    title: "Send a focused application",
    text: "Share your phone number, preferred schedule and learning goals. One application per tuition keeps things fair.",
  },
  {
    icon: MessagesSquare,
    title: "Get accepted and start",
    text: "Your tutor reviews the request and accepts or rejects it. Track every status change from your dashboard.",
  },
];

const tutorSteps = [
  {
    icon: FilePlus2,
    title: "Create your listing",
    text: "Add the subject, schedule, fee, location and a banner image. Free tutors can post up to two tuitions.",
  },
  {
    icon: ShieldCheck,
    title: "Get admin approval",
    text: "An admin reviews your submission. Only approved and active tuitions are visible to students.",
  },
  {
    icon: Users,
    title: "Choose your students",
    text: "Review applicant details and accept or reject requests. You always stay in control of your schedule.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="border-b bg-muted/30">
        <div className="container-page py-14 text-center md:py-20">
          <Badge variant="outline" className="mb-4 gap-1.5 border-primary/20 bg-primary/5 text-primary">
            <Sparkles className="size-3.5" /> A transparent marketplace
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            How MentorLagbe works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A clear workflow for students and tutors, with admin moderation to keep
            the marketplace trustworthy.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page space-y-8">
          <SectionHeading
            eyebrow="For students"
            title="From discovery to your first class"
            description="No endless messaging. Just a clear application and a tutor who can actually help."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {studentSteps.map(({ icon: Icon, title, text }, index) => (
              <Card key={title} className="h-full">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-heading text-3xl font-semibold text-border">0{index + 1}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 section-pad">
        <div className="container-page space-y-8">
          <SectionHeading
            eyebrow="For tutors"
            title="Publish, review and teach"
            description="A lightweight workflow that keeps your listing quality high and your applicant list manageable."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {tutorSteps.map(({ icon: Icon, title, text }, index) => (
              <Card key={title} className="h-full">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-heading text-3xl font-semibold text-border">0{index + 1}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="eyebrow">Why MentorLagbe</p>
            <h2 className="display-title text-2xl sm:text-3xl md:text-4xl">
              Trust is designed into every step
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tuition posts are moderated, applications are tied to real accounts,
              and payments are verified server-side. The result is a marketplace that
              feels calm, clear and credible.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: BadgeCheck, title: "Approved listings", text: "Admins review every tuition before it goes live." },
                { icon: UserRound, title: "Role-aware accounts", text: "Students, tutors and admins each get the right tools." },
                { icon: CalendarCheck, title: "Schedule clarity", text: "Applicants share availability before acceptance." },
                { icon: ShieldCheck, title: "Verified payments", text: "Stripe sessions and webhooks are verified server-side." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-lg border bg-card p-4">
                  <Icon className="mb-2 size-5 text-primary" />
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 md:p-8">
            <h3 className="font-heading text-xl font-semibold">Ready to begin?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick the path that fits you. You can switch between browsing and posting
              as your role requires.
            </p>
            <div className="mt-6 space-y-3">
              <Button render={<Link href="/tuitions" />} className="w-full justify-between" size="lg">
                Find a tuition <ArrowRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                variant="outline"
                className="w-full justify-between"
                size="lg"
              >
                Become a tutor <ArrowRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/pricing" />}
                variant="ghost"
                className="w-full justify-between"
                size="lg"
              >
                Compare plans <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              <BookOpen className="size-4 shrink-0 text-primary" />
              Every public tuition is approved and active.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
