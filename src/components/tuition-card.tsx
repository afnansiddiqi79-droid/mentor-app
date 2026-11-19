import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Monitor,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { Tuition } from "@/lib/types";

export function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <Card className="card-lift group h-full gap-0 py-0">
      <Link href={`/tuitions/${tuition.id}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={tuition.bannerImage}
            alt={tuition.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="border-0 bg-white/90 text-[0.65rem] font-semibold text-slate-900 shadow-sm backdrop-blur hover:bg-white">
              {tuition.subject}
            </Badge>
            <Badge
              variant="outline"
              className="border-white/40 bg-black/25 text-[0.65rem] text-white backdrop-blur"
            >
              {tuition.mode === "Online" ? (
                <Monitor className="size-3" />
              ) : (
                <MapPin className="size-3" />
              )}
              {tuition.mode}
            </Badge>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 pt-5">
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug tracking-tight">
              {tuition.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              by {tuition.tutorName}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {tuition.daysPerWeek} days/week
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              <span className="line-clamp-1 max-w-[150px]">{tuition.location}</span>
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between border-t pt-3">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                Monthly fee
              </p>
              <p className="inline-flex items-center gap-1.5 font-heading text-lg font-semibold text-primary">
                <Wallet className="size-4" />
                {formatCurrency(tuition.monthlyFee)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
              Details
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
