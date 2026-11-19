import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
  href = "/",
  inverse = false,
}: {
  className?: string;
  compact?: boolean;
  href?: string;
  inverse?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="MentorLagbe home"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25 transition-transform group-hover:-rotate-3">
        <GraduationCap className="size-5" />
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-lg font-semibold tracking-tight",
              inverse && "text-white"
            )}
          >
            Mentor<span className="text-primary">Lagbe</span>
          </span>
          <span
            className={cn(
              "mt-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground",
              inverse && "text-slate-400"
            )}
          >
            Learn with the right mentor
          </span>
        </span>
      ) : null}
    </Link>
  );
}
