import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Monitor,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationForm } from "@/components/tuitions/application-form";
import { UserAvatar } from "@/components/user-avatar";
import { ApiClientError, fetchPublic } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Tuition } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TuitionDetailsPage(
  props: PageProps<"/tuitions/[id]">
) {
  const { id } = await props.params;

  let tuition: Tuition;
  try {
    const response = await fetchPublic<Tuition>(`/api/tuitions/${id}`);
    tuition = response.data;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="container-page py-8 md:py-12">
      <Link
        href="/tuitions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to all tuitions
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{tuition.subject}</Badge>
              <Badge variant="secondary">{tuition.classLevel}</Badge>
              <Badge variant="outline" className="gap-1">
                {tuition.mode === "Online" ? (
                  <Monitor className="size-3" />
                ) : (
                  <MapPin className="size-3" />
                )}
                {tuition.mode}
              </Badge>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {tuition.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Posted {formatDate(tuition.createdAt)} · by {tuition.tutorName}
            </p>
          </div>

          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={tuition.bannerImage}
              alt={tuition.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Wallet,
                label: "Monthly fee",
                value: formatCurrency(tuition.monthlyFee),
              },
              {
                icon: CalendarDays,
                label: "Schedule",
                value: `${tuition.daysPerWeek} days / week`,
              },
              { icon: Monitor, label: "Mode", value: tuition.mode },
              { icon: MapPin, label: "Location", value: tuition.location },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border bg-card p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="size-3.5" />
                  {label}
                </div>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this tuition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {tuition.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meet your tutor</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <UserAvatar name={tuition.tutorName} className="size-14 text-base" />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-semibold">{tuition.tutorName}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span className="truncate">{tuition.tutorEmail}</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Teaches {tuition.subject} · {tuition.classLevel}
                </p>
              </div>
              <Badge variant="outline" className="w-fit gap-1 border-primary/30 text-primary">
                <GraduationCap className="size-3" />
                MentorLagbe tutor
              </Badge>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="overflow-visible">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span>Apply to this tuition</span>
                <span className="font-heading text-lg text-primary">
                  {formatCurrency(tuition.monthlyFee)}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ApplicationForm tuitionId={tuition.id} />
            </CardContent>
          </Card>

          <div className="mt-4 rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
            MentorLagbe never asks for advance payments outside the platform. If a
            tutor requests one, report it to support.
          </div>
        </aside>
      </div>
    </div>
  );
}
