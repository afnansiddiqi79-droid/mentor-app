import Link from "next/link";
import { AlertCircle, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/components/search-filters";
import { TuitionCard } from "@/components/tuition-card";
import { EmptyState } from "@/components/empty-state";
import { PaginationControls } from "@/components/pagination-controls";
import { fetchPublic } from "@/lib/api";
import type { PaginationMeta, Tuition, TuitionFilterOptions } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse Tuitions",
  description:
    "Search approved tuitions by subject, class level and mode. Compare fees and schedules on MentorLagbe.",
};

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function TuitionsPage(props: PageProps<"/tuitions">) {
  const searchParams = await props.searchParams;

  const values = {
    search: readParam(searchParams.search),
    subject: readParam(searchParams.subject),
    classLevel: readParam(searchParams.classLevel),
    mode: readParam(searchParams.mode),
    page: readParam(searchParams.page) || "1",
  };

  const query = new URLSearchParams();
  if (values.search) query.set("search", values.search);
  if (values.subject) query.set("subject", values.subject);
  if (values.classLevel) query.set("classLevel", values.classLevel);
  if (values.mode) query.set("mode", values.mode);
  query.set("page", values.page);
  query.set("limit", "9");

  let tuitions: Tuition[] = [];
  let meta: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
  let options: TuitionFilterOptions = { subjects: [], classLevels: [] };
  let error = "";

  try {
    const [listResponse, filterResponse] = await Promise.all([
      fetchPublic<Tuition[]>(`/api/tuitions?${query.toString()}`),
      fetchPublic<TuitionFilterOptions>("/api/tuitions/filters"),
    ]);
    tuitions = listResponse.data;
    meta = listResponse.meta as unknown as PaginationMeta;
    options = filterResponse.data;
  } catch {
    error = "We could not load tuitions right now. Please try again in a moment.";
  }

  return (
    <div>
      <section className="border-b bg-muted/30">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">Browse tuitions</p>
            <h1 className="display-title">Find a tuition that fits your goals</h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every listing below is approved and active. Use the filters to narrow
              by subject, class level and learning mode.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-8 md:py-10">
        <SearchFilters options={options} initial={values} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>
            {error
              ? "Unable to load results"
              : `${meta.total} tuition${meta.total === 1 ? "" : "s"} found`}
          </p>
          {!error && meta.total > 0 ? (
            <p>
              Page {meta.page} of {meta.totalPages}
            </p>
          ) : null}
        </div>

        <div className="mt-6">
          {error ? (
            <EmptyState
              icon={AlertCircle}
              title="Something went wrong"
              description={error}
              action={
                <Button render={<Link href="/tuitions" />} variant="outline">
                  Reload tuitions
                </Button>
              }
            />
          ) : tuitions.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tuitions.map((tuition) => (
                  <TuitionCard key={tuition.id} tuition={tuition} />
                ))}
              </div>
              <PaginationControls
                meta={meta}
                basePath="/tuitions"
                params={{
                  search: values.search,
                  subject: values.subject,
                  classLevel: values.classLevel,
                  mode: values.mode,
                }}
              />
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No tuitions match those filters"
              description="Try a broader subject or clear the filters to see everything available."
              action={
                <Button render={<Link href="/tuitions" />} variant="outline">
                  Clear filters
                </Button>
              }
            />
          )}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-xl border bg-card p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold">Cannot find the right fit?</p>
              <p className="text-xs text-muted-foreground">
                Create an account and keep new matches coming.
              </p>
            </div>
          </div>
          <Button render={<Link href="/sign-up" />} variant="outline">
            Join MentorLagbe
          </Button>
        </div>
      </section>
    </div>
  );
}
