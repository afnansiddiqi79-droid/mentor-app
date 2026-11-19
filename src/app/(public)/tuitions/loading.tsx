import { TuitionGridSkeleton } from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <div className="container-page space-y-8 py-12">
      <div className="space-y-3">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-28 w-full animate-pulse rounded-xl bg-muted" />
      <TuitionGridSkeleton count={6} />
    </div>
  );
}
