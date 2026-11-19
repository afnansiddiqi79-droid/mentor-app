import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/types";

interface PaginationControlsProps {
  meta: PaginationMeta;
  basePath: string;
  params: Record<string, string | undefined>;
}

function buildHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  if (page > 1) query.set("page", String(page));
  const suffix = query.toString();
  return suffix ? `${basePath}?${suffix}` : basePath;
}

export function PaginationControls({ meta, basePath, params }: PaginationControlsProps) {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, index) => index + 1).filter(
    (page) =>
      page === 1 ||
      page === meta.totalPages ||
      Math.abs(page - meta.page) <= 1
  );

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 pt-8" aria-label="Pagination">
      <Link
        href={buildHref(basePath, params, Math.max(1, meta.page - 1))}
        aria-disabled={!meta.hasPrevPage}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-medium",
          meta.hasPrevPage
            ? "bg-background hover:bg-muted"
            : "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="size-4" /> Prev
      </Link>

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const gap = previous && page - previous > 1;
        return (
          <span key={page} className="flex items-center gap-2">
            {gap ? <span className="text-muted-foreground">…</span> : null}
            <Link
              href={buildHref(basePath, params, page)}
              aria-current={page === meta.page ? "page" : undefined}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                page === meta.page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildHref(basePath, params, Math.min(meta.totalPages, meta.page + 1))}
        aria-disabled={!meta.hasNextPage}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-medium",
          meta.hasNextPage
            ? "bg-background hover:bg-muted"
            : "pointer-events-none opacity-40"
        )}
      >
        Next <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
