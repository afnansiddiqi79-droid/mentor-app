import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSearch } from "@/components/home/hero-search";
import { SectionHeading } from "@/components/section-heading";
import { TuitionCard } from "@/components/tuition-card";
import { EmptyState } from "@/components/empty-state";
import { fetchPublic } from "@/lib/api";
import type { PublicStats, Tuition } from "@/lib/types";

export const dynamic = "force-dynamic";

const subjects = [
  {
    name: "Mathematics",
    icon: Target,
    blurb: "Algebra, calculus & olympiad",
    tone: "from-blue-500/15 to-sky-500/5 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Physics",
    icon: Sparkles,
    blurb: "HSC, admission & olympiad",
    tone: "from-indigo-500/15 to-violet-500/5 text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Programming",
    icon: BookOpen,
    blurb: "Python, C++ & web apps",
    tone: "from-cyan-500/15 to-teal-500/5 text-cyan-700 dark:text-cyan-400",
  },
  {
    name: "IELTS",
    icon: GraduationCap,
    blurb: "Band 7+ preparation",
    tone: "from-emerald-500/15 to-lime-500/5 text-emerald-700 dark:text-emerald-400",
  },
];

const steps = [
  {
    icon: Search,
    title: "Discover the right fit",
    text: "Filter by subject, class level and mode. Compare fees, schedules and tutor profiles in one place.",
  },
  {
    icon: ClipboardCheck,
    title: "Apply in minutes",
    text: "Send a focused application with your schedule and learning goals. No back-and-forth required.",
  },
  {
    icon: MessagesSquare,
    title: "Start learning",
    text: "Get accepted, connect with your tutor and begin a plan built around your exam or skill goal.",
  },
];

const testimonials = [
  {
    quote:
      "I found a physics mentor in two days. The application process was clear and the tutor actually understood where I was stuck.",
    name: "Rafiul Islam",
    detail: "HSC student · Dhaka",
    rating: 5,
  },
  {
    quote:
      "Posting my tuition took less than five minutes. The applicant list gives me everything I need to choose the right student.",
    name: "Ayesha Rahman",
    detail: "Mathematics tutor · BUET graduate",
    rating: 5,
  },
  {
    quote:
      "The IELTS filters saved me hours. I could compare schedules and fees before messaging anyone. Very refreshing.",
    name: "Mim Akter",
    detail: "IELTS candidate · Chattogram",
    rating: 5,
  },
];

export default async function HomePage() {
  let tuitions: Tuition[] = [];
  let stats: PublicStats = {
    totalStudents: 0,
    totalTutors: 0,
    totalTuitions: 0,
    totalApplications: 0,
    successRate: 0,
  };

  try {
    const [tuitionResponse, statsResponse] = await Promise.all([
      fetchPublic<Tuition[]>("/api/tuitions?limit=6"),
      fetchPublic<PublicStats>("/api/stats/public"),
    ]);
    tuitions = tuitionResponse.data;
    stats = statsResponse.data;
  } catch {
    // The landing page still renders if the API is temporarily unavailable.
  }

  const displayStats = [
    { label: "Tutors", value: stats.totalTutors, icon: BadgeCheck },
    { label: "Active tuitions", value: stats.totalTuitions, icon: BookOpen },
    { label: "Students", value: stats.totalStudents, icon: Users },
    { label: "Acceptance rate", value: `${stats.successRate}%`, icon: TrendingUp },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 size-[320px] rounded-full bg-sky-400/10 blur-3xl" />

        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up space-y-7">
            <Badge variant="outline" className="gap-2 border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary">
              <Sparkles className="size-3.5" />
              Bangladesh&apos;s mentorship marketplace
            </Badge>

            <div className="space-y-5">
              <h1 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
                Find the mentor who
                <span className="text-gradient"> changes everything.</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                MentorLagbe connects ambitious students with verified tutors for
                HSC, admission tests, programming and language goals. Compare,
                apply and start learning — without the guesswork.
              </p>
            </div>

            <HeroSearch />

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Tutor profiles with clear fees
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Transparent monthly fees
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Free to browse
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4">
              {displayStats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="size-3.5" />
                    {label}
                  </div>
                  <p className="font-heading text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up delay-200">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Students learning together with a mentor"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md">
                <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                  This week on MentorLagbe
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {stats.totalApplications} applications sent to tutors
                </p>
              </div>
            </div>

            <div className="animate-float-soft absolute -left-3 top-8 hidden rounded-xl border bg-card p-3 shadow-lg sm:block">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <BadgeCheck className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold">Reviewed listings</p>
                  <p className="text-[0.65rem] text-muted-foreground">Approved by admins</p>
                </div>
              </div>
            </div>

            <div className="animate-float-soft delay-200 absolute -right-2 bottom-16 hidden rounded-xl border bg-card p-3 shadow-lg sm:block">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarCheck className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold">Flexible schedules</p>
                  <p className="text-[0.65rem] text-muted-foreground">Online & offline</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular subjects */}
      <section className="section-pad">
        <div className="container-page space-y-8">
          <SectionHeading
            eyebrow="Popular subjects"
            title="Start with the subject that matters most"
            description="Focused mentorship across the subjects students ask for most."
            action={
              <Button render={<Link href="/tuitions" />} variant="outline">
                All tuitions <ArrowRight className="size-4" />
              </Button>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map(({ name, icon: Icon, blurb, tone }) => (
              <Link
                key={name}
                href={`/tuitions?subject=${encodeURIComponent(name)}`}
                className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`mb-4 flex size-11 items-center justify-center rounded-lg bg-gradient-to-br ${tone}`}>
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading text-base font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest tuitions */}
      <section className="border-y bg-muted/30 section-pad">
        <div className="container-page space-y-8">
          <SectionHeading
            eyebrow="Fresh opportunities"
            title="Latest approved tuitions"
            description="Every listing is reviewed before it goes live. Browse real openings from tutors across Bangladesh."
            action={
              <Button render={<Link href="/tuitions" />}>
                Browse all <ArrowRight className="size-4" />
              </Button>
            }
          />
          {tuitions.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tuitions.map((tuition) => (
                <TuitionCard key={tuition.id} tuition={tuition} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="New tuitions are on the way"
              description="Approved listings will appear here as soon as tutors publish them."
              action={<Button render={<Link href="/tuitions" />}>Browse tuitions</Button>}
            />
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad">
        <div className="container-page space-y-10">
          <SectionHeading
            align="center"
            eyebrow="How MentorLagbe works"
            title="From searching to learning in three steps"
            description="A simple, transparent workflow for students and tutors."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <Card key={title} className="relative h-full">
                <CardContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-heading text-3xl font-semibold text-border">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-semibold">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-primary p-6 text-primary-foreground sm:flex-row sm:p-8">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-heading text-xl font-semibold">Are you a tutor?</h3>
              <p className="text-sm text-primary-foreground/80">
                Publish your tuition, review applicants and grow your practice.
              </p>
            </div>
            <Button
              render={<Link href="/sign-up" />}
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Post a tuition <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-y bg-muted/30 section-pad">
        <div className="container-page space-y-8">
          <SectionHeading
            align="center"
            eyebrow="Simple pricing"
            title="Start free. Upgrade when you are ready."
            description="No hidden charges. Pro unlocks unlimited opportunities for students and tutors."
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Card className="h-full">
              <CardContent className="space-y-5 p-6">
                <div>
                  <p className="eyebrow">Free</p>
                  <p className="mt-2 font-heading text-3xl font-semibold">$0</p>
                  <p className="mt-1 text-sm text-muted-foreground">Everything you need to get started.</p>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {["Browse all approved tuitions", "Apply to tuitions as a student", "Post up to 2 tuitions as a tutor", "Manage applicants and applications"].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button render={<Link href="/sign-up" />} variant="outline" className="w-full">
                  Create free account
                </Button>
              </CardContent>
            </Card>

            <Card className="relative h-full border-primary/30 ring-primary/20">
              <Badge className="absolute right-4 top-4">Most popular</Badge>
              <CardContent className="space-y-5 p-6">
                <div>
                  <p className="eyebrow">Pro</p>
                  <p className="mt-2 font-heading text-3xl font-semibold">
                    $10<span className="text-base font-normal text-muted-foreground"> student</span>
                  </p>
                  <p className="text-sm text-muted-foreground">or $15 for tutors · one-time</p>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {["Unlimited tuition posts for tutors", "Priority application support", "Everything in the Free plan", "A Pro badge on your profile"].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button render={<Link href="/pricing" />} className="w-full">
                  See Pro plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad">
        <div className="container-page space-y-8">
          <SectionHeading
            align="center"
            eyebrow="Student & tutor stories"
            title="Built around real learning outcomes"
            description="A marketplace is only as good as the matches it creates."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="h-full">
                <CardContent className="space-y-4 p-6">
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <Star key={index} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    “{item.quote}”
                  </blockquote>
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-slate-950 py-16 text-white md:py-20">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <Badge variant="outline" className="border-white/20 text-white">
            Your next chapter starts here
          </Badge>
          <h2 className="max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            The right mentor is closer than you think.
          </h2>
          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            Join MentorLagbe today and turn a search into a real learning plan.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/tuitions" />} size="lg" className="bg-white text-slate-950 hover:bg-white/90">
              Browse tuitions <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/sign-up" />}
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Create an account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
